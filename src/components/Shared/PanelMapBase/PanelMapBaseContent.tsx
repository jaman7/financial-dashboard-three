import { Sphere } from '@react-three/drei';
import { TextureLoader, Vector3, Color } from 'three';
import { chartStyle, colors } from '@/data/data';
import AnimatedLine from './AnimatedLine';
import { latLonToPosition } from './PanelMapBase.helper';
import { JSX, memo, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { generateCountryBorders } from '@/shared/utils/generateCountryBorders';
import { IDictType } from '@/shared/model';

const mapTextureURL = 'images/earth_texture.png';

interface PanelMapBaseContentProps {
  geoJson: FeatureCollection<Geometry, GeoJsonProperties> | null;
  dict: IDictType[];
  ids: string[];
  mapWidth: number;
}

const PanelMapBaseContent: React.FC<PanelMapBaseContentProps> = ({ geoJson = null, dict, ids, mapWidth }) => {
  const [countryBorders, setCountryBorders] = useState<JSX.Element[] | null>(null);
  const globalTimeRef = useRef(0);
  const isLoadedTexture = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  const TEXTURE_WIDTH = 3600;
  const TEXTURE_HEIGHT = 1800;
  const MAP_WIDTH = mapWidth;
  const MAP_HEIGHT = MAP_WIDTH * (TEXTURE_HEIGHT / TEXTURE_WIDTH);

  const currencyData = useMemo(() => {
    return (ids?.map((id) => dict?.find((c) => c?.displayName === id))?.filter(Boolean) ?? []) as IDictType[];
  }, [ids, dict]);

  const texture = useMemo(() => new TextureLoader().load(mapTextureURL), []);

  const baseCurrency = currencyData[0] ?? {};

  useEffect(() => {
    if (!geoJson || countryBorders || isLoadedTexture.current || workerRef.current) return;

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('./countryWorker.ts', import.meta.url), { type: 'module' });
    }

    const worker = workerRef.current;
    worker.postMessage({ geoJson, width: MAP_WIDTH, height: MAP_HEIGHT });

    worker.onmessage = (event) => {
      const borderData = event.data;
      if (!borderData) return;

      const borders = generateCountryBorders(borderData, new Color(colors.lightGreen), 1000);
      setCountryBorders(borders);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      isLoadedTexture.current = true;
    };
  }, [geoJson?.type, texture]);

  const basePosition = useMemo(() => {
    return baseCurrency?.latlng
      ? latLonToPosition(baseCurrency.latlng[0], baseCurrency.latlng[1], MAP_WIDTH, MAP_HEIGHT)
      : new Vector3(0, 0, 0.3);
  }, [JSON.stringify(baseCurrency)]);

  const basePoints = useMemo(() => {
    return (
      currencyData?.map((currency, index) => {
        if (!currency) return null;

        const position = currency?.latlng
          ? latLonToPosition(currency.latlng[0] ?? 0, currency.latlng[1] ?? 0, MAP_WIDTH, MAP_HEIGHT)
          : new Vector3(0, 0, 0.3);

        return (
          <group key={`basePoints${index}_${currency?.id}`}>
            <Sphere key={currency.id} args={[0.3, 12, 12]} position={position}>
              <meshStandardMaterial
                color={index === 0 ? new Color(colors.red) : new Color(colors.white)}
                emissive={new Color(colors.white)}
                emissiveIntensity={2}
              />
            </Sphere>
          </group>
        );
      }) ?? null
    );
  }, [JSON.stringify(ids)]);

  const currencyAnimatedLine = useMemo(() => {
    return (
      currencyData?.slice(1).map((currency, i) => {
        const targetPosition = currency?.latlng
          ? latLonToPosition(currency.latlng[0] ?? 0, currency.latlng[1] ?? 0, MAP_WIDTH, MAP_HEIGHT)
          : new Vector3(0, 0, 0.3);

        return (
          <AnimatedLine
            key={`currencyAnimatedLine_${i}_${currency?.id}`}
            start={basePosition}
            end={targetPosition}
            color={chartStyle.colors[i]}
            speedFactor={5}
            globalTimeRef={globalTimeRef}
          />
        );
      }) ?? null
    );
  }, [JSON.stringify(ids), basePosition]);

  const baseTexture = useMemo(() => {
    return (
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[MAP_WIDTH, MAP_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    );
  }, [texture]);

  return (
    <>
      {baseTexture}

      {countryBorders}

      {basePoints}

      {currencyAnimatedLine}
    </>
  );
};

export default memo(PanelMapBaseContent);
