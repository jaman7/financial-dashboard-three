import { colors } from '@/data/data';
import { BufferGeometry, Color, Line, LineBasicMaterial } from 'three';

export const generateCountryBorders = (data: any[], color = new Color(colors?.lightGreen), linewidth = 2): React.JSX.Element[] | null => {
  if (!data) return null;

  return data?.map((border: any, polygonIndex: number) => {
    const geometry = new BufferGeometry().setFromPoints(border);
    const material = new LineBasicMaterial({ color, linewidth, linecap: 'round', linejoin: 'round' });

    return <primitive key={`${polygonIndex}`} object={new Line(geometry, material)} />;
  });
};
