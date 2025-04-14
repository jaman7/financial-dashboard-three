import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { BufferGeometry, CatmullRomCurve3, Material, Mesh, MeshBasicMaterial, TubeGeometry, Vector3 } from 'three';
import { IMarker } from './GlobeMap3D.model';

interface MarkerConnectionLineProps {
  markers: IMarker[];
  globeRadius?: number;
  lineColor?: string;
}

const toCartesian = (lat: number, lon: number, radius: number): Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
};

const createArc = (start: Vector3, end: Vector3, globeRadius: number, arcHeightFactor = 0.15, segments = 64): Vector3[] => {
  const arcPoints: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    const point = new Vector3().copy(start).lerp(end, t).normalize();

    const arcHeight = 1 + arcHeightFactor * Math.sin(Math.PI * t);

    point.multiplyScalar(globeRadius * arcHeight);
    arcPoints.push(point);
  }
  return arcPoints;
};

const MarkerConnectionLine: React.FC<MarkerConnectionLineProps> = ({ markers, globeRadius = 1.01, lineColor = '#00ff00' }) => {
  const { scene } = useThree();

  useEffect(() => {
    if (!markers.length) return;

    const lines: Mesh[] = [];

    markers?.forEach((marker) => {
      if (!marker?.coordinates || !marker?.connections) return;

      const start = toCartesian(marker?.coordinates[1], marker?.coordinates[0], globeRadius);

      marker?.connections?.forEach((connection, iCon) => {
        if (iCon <= 1) {
          if (!connection?.coordinates) return;

          const targetMarker = markers?.find(
            (ex) =>
              ex?.coordinates &&
              ex?.coordinates[0] === connection?.coordinates?.[0] &&
              ex?.coordinates?.[1] === connection?.coordinates?.[1]
          );

          if (!targetMarker) return;

          const end = toCartesian(connection?.coordinates?.[1], connection?.coordinates?.[0], globeRadius);
          if (start.distanceTo(end) === 0) return;

          const arcPoints = createArc(start, end, globeRadius, 0.2, 80);

          const curve = new CatmullRomCurve3(arcPoints);
          const tubeGeometry = new TubeGeometry(curve, 100, 0.003, 8, false);
          const tubeMaterial = new MeshBasicMaterial({
            color: marker?.lineColor ?? lineColor,
            opacity: 0.85,
            transparent: true,
          });

          const line = new Mesh(tubeGeometry, tubeMaterial);
          scene.add(line);
          lines.push(line);
        }
      });
    });

    return () => {
      lines?.forEach((line) => {
        scene.remove(line);
        (line.geometry as BufferGeometry).dispose();
        (line.material as Material).dispose();
      });
    };
  }, [markers, globeRadius, lineColor, scene]);

  return null;
};

export default MarkerConnectionLine;
