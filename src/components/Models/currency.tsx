export interface ICurrencyVolumeData {
  [currency: string]: number;
}

export interface ICurrencyTableRow {
  id: number;
  date: string;
  [key: string]: string | number;
}
