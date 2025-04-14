import Select from '@/shared/components/select/Select';
import { IDictType } from '@/shared/components/select/Select.model';
import React from 'react';

interface SelectOption {
  key: string;
  dictData: IDictType[];
  defaultValue: number;
  size?: 'xs' | 'sm' | 'lg';
  filter?: boolean;
}

interface SelectFiltersProps {
  options: SelectOption[];
  selectedValues: Record<string, number>;
  onChange: (selectedValues: Record<string, number>) => void;
}

const SelectFilters: React.FC<SelectFiltersProps> = ({ options = [], selectedValues, onChange }) => {
  const handleChange = (key: string, value: number) => {
    const newValues = { ...selectedValues, [key]: value };
    onChange(newValues);
  };

  return (
    <>
      {options?.map(({ key, dictData, defaultValue, size, filter }) => (
        <Select
          key={key}
          onChange={(value) => handleChange(key, value as number)}
          value={selectedValues[key] ?? defaultValue}
          config={{ dictData, defaultValue, size: size || 'xs' }}
          filter={filter ?? false}
        />
      ))}
    </>
  );
};

export default SelectFilters;
