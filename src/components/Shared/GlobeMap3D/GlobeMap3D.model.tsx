export interface IConnections {
  name?: string | string[];
  coordinates?: [number, number, number];
}

export interface IMarker {
  id: number;
  name: string | string[] | null;
  coordinates?: [number, number, number];
  connections?: IConnections[];
  color?: string;
  pointColor?: string | null;
  lineColor?: string | null;
  flag?: string | null;
  [name: string]: any;
}
