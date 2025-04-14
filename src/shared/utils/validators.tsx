export const required = (value: string) => value.trim() !== '';
export const minLength = (min: number) => (value: string) => value.length >= min;
export const maxLength = (max: number) => (value: string) => value.length <= max;
export const emailFormat = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
