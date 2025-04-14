import { useMemo, useState } from 'react';
import Card from '@/shared/components/Card/Card';
import { useMarketStore } from '@/store/useMarketStore';
import { useGeoJsonStore } from '@/store/useGeoJsonStore';
import GlobeMap3D from '@/components/Shared/GlobeMap3D/GlobeMap3D';

const GlobeMapCard: React.FC = () => {
  const [containerSize, setContainerSize] = useState({ width: 500, height: 500 });

  const markers = useMarketStore((state) => state.exchanges);
  const geoJson = useGeoJsonStore((state) => state.geoJson);

  const markersData = useMemo(() => {
    return [...markers];
  }, [markers]);

  return (
    <Card header="Crypto Globe Map" onResize={(width, height) => setContainerSize({ width, height })}>
      <div className="globe-container">
        <GlobeMap3D geoJson={geoJson} markers={markersData ?? []} containerSize={containerSize} />
      </div>
    </Card>
  );
};

export default GlobeMapCard;
