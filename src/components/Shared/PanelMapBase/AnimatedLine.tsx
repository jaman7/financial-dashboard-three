import { memo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Vector3, Color, QuadraticBezierCurve3, Mesh, MeshStandardMaterial } from 'three';
import { colors } from '@/data/data';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { Sphere } from '@react-three/drei';

extend({ MeshLineGeometry, MeshLineMaterial });

interface AnimatedLineProps {
  start: Vector3;
  end: Vector3;
  color?: string;
  speedFactor?: number;
  globalTimeRef: React.RefObject<number>;
}

const TRAIL_LENGTH = 5;
const TRAIL_OPACITY = 0.5;

const AnimatedLine: React.FC<AnimatedLineProps> = ({ start, end, color = colors.blue, speedFactor = 1, globalTimeRef }) => {
  const ballRef = useRef<Mesh | null>(null);
  const trailRefs = useRef<Mesh[]>([]);

  if (!start || !end || start.equals(end) || isNaN(start.x) || isNaN(end.x)) {
    return null;
  }

  const midPoint = new Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + Math.abs(start.x - end.x) * 0.2, 1);
  const bezierCurve = new QuadraticBezierCurve3(start, midPoint, end);
  const curvePoints = bezierCurve.getPoints(40).flatMap((p) => [p.x, p.y, p.z]);
  const curveLength = bezierCurve.getLength();

  useFrame(({ clock }) => {
    globalTimeRef.current += clock.getDelta() * (speedFactor * curveLength) * 10;

    const progress = globalTimeRef.current % 1;
    const ballPosition = bezierCurve.getPoint(progress);
    if (ballRef.current) {
      ballRef.current.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
    }

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const trailProgress = (progress - (i + 1) * 0.05 + 1) % 1;
      const trailPosition = bezierCurve.getPoint(trailProgress);
      if (trailRefs.current[i]) {
        trailRefs.current[i].position.set(trailPosition.x, trailPosition.y, trailPosition.z);
        const material = trailRefs.current[i].material as MeshStandardMaterial;
        material.opacity = Math.max(0, TRAIL_OPACITY - i / TRAIL_LENGTH);
      }
    }
  });

  return (
    <>
      <mesh raycast={raycast}>
        <meshLineGeometry points={curvePoints} />
        <meshLineMaterial
          lineWidth={0.4}
          color={new Color(color)}
          depthTest={false}
          transparent
          opacity={0.9}
          dashArray={0}
          dashRatio={0}
        />
      </mesh>

      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <Sphere
          key={`trail-${i}`}
          ref={(el: Mesh | null) => {
            if (el) trailRefs.current[i] = el;
          }}
          args={[0.3, 16, 16]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
            transparent
            opacity={TRAIL_OPACITY - i * (TRAIL_OPACITY / TRAIL_LENGTH)}
          />
        </Sphere>
      ))}
    </>
  );
};

export default memo(AnimatedLine);
