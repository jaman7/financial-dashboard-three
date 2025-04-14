import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { TextureLoader, PerspectiveCamera, Color, Mesh, Material, WebGLRenderer } from 'three';
import { JSX, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Markers from './Markers';
import GlobeControls, { GlobeCameraActionType } from './GlobeControls';
import GlobeCameraControls from './GlobeCameraControls';
import MarkerConnectionLine from './MarkerConnectionLine';
import GlobeControlsMeter from './GlobeControlsMeter';
import { FeatureCollection, Geometry } from 'geojson';
import { generateCountryBorders } from '@/shared/utils/generateCountryBorders';
import { colors } from '@/data/data';
import Loader from '@/shared/components/Loader/Loader';
import { IMarker } from './GlobeMap3D.model';

interface GlobeProps {
  markers?: IMarker[];
  geoJson?: FeatureCollection<Geometry> | null;
  textures: {
    map: string;
    bumpMap: string;
    specularMap: string;
  };
  markerColor?: string;
  containerSize: { width: number; height: number };
}

const Globe: React.FC<GlobeProps> = ({ markers = [], geoJson = null, textures, markerColor = '#00d1b2', containerSize }) => {
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [cameraAction, setCameraAction] = useState<GlobeCameraActionType | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [countryBorders, setCountryBorders] = useState<JSX.Element[] | null>(null);

  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const sphereRef = useRef<Mesh>(null);
  const glRef = useRef<WebGLRenderer | null>(null);

  const colorMap = useLoader(TextureLoader, textures.map);
  const bumpMap = useLoader(TextureLoader, textures.bumpMap);
  const specularMap = useLoader(TextureLoader, textures.specularMap);

  useEffect(() => {
    if (!geoJson) {
      setCountryBorders(null);
      return;
    }

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    }

    const worker = workerRef.current;
    worker.postMessage({ geoJson });

    worker.onmessage = (event) => {
      const borderData = event.data;
      if (!borderData) return;

      const borders = generateCountryBorders(borderData, new Color(colors.white), 1000);

      setCountryBorders(borders);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [geoJson]);

  useEffect(() => {
    return () => {
      countryBorders?.forEach((border) => {
        if ('geometry' in border && 'material' in border) {
          (border as unknown as Mesh)?.geometry?.dispose?.();
          ((border as unknown as Mesh)?.material as Material)?.dispose?.();
        }
      });

      const mesh = sphereRef.current;
      mesh?.geometry?.dispose?.();
      (mesh?.material as Material)?.dispose?.();
      glRef.current?.dispose?.();
    };
  }, []);

  const baseSize = useMemo(() => {
    return containerSize;
  }, [containerSize.height, containerSize.width]);

  return (
    <>
      <GlobeControls
        setIsAutoRotate={setIsAutoRotate}
        isAutoRotate={isAutoRotate}
        setCameraAction={setCameraAction}
        setRotationSpeed={setRotationSpeed}
      />
      <GlobeControlsMeter key="GlobeControlsMeter" cameraRef={cameraRef} rotationSpeed={rotationSpeed} />
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          onCreated={({ camera, gl }) => {
            if (camera) cameraRef.current = camera as PerspectiveCamera;
            glRef.current = gl;
          }}
          gl={{ preserveDrawingBuffer: false }}
          style={{
            display: 'flex',
            width: `${baseSize?.width}px`,
            height: `${baseSize?.height - 30}px`,
            minHeight: '300px',
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.9} />
          <group>
            <mesh ref={sphereRef}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshPhongMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.04} specularMap={specularMap} shininess={10} />
            </mesh>
            {countryBorders}
            <Markers markers={markers ?? []} pointColor={markerColor} setIsAutoRotate={setIsAutoRotate} />
            <MarkerConnectionLine markers={markers ?? []} globeRadius={1.01} lineColor="#00ff00" />
          </group>

          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
          <OrbitControls enableZoom autoRotate={isAutoRotate} autoRotateSpeed={rotationSpeed} />

          {cameraRef.current && (
            <GlobeCameraControls key={cameraAction} cameraRef={cameraRef} cameraAction={cameraAction} setCameraAction={setCameraAction} />
          )}
        </Canvas>
      </Suspense>
    </>
  );
};

export default Globe;
