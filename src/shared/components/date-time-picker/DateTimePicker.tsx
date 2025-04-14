import { forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from 'primereact/utils';
import Validator from '../validator/Validator';
import { Calendar } from 'primereact/calendar';
import { FormEvent } from 'primereact/ts-helpers';
import { DateTimePickerConfigDefault, IDateTimePicker } from './DateTimePicker.models';

interface IProps {
  name?: string;
  config?: Partial<IDateTimePicker>;
  value?: any | Date | (Date | any)[];
  onChange?: (value: string | Date | (Date | any)[]) => void;
  error?: string | null | undefined;
  touched?: boolean;
}

const DateTimePicker = forwardRef<HTMLInputElement, IProps>(({ name, value, onChange, error, config }, ref) => {
  const { t } = useTranslation();

  const dateTimeConfig: IDateTimePicker = useMemo(() => ({ ...DateTimePickerConfigDefault(), ...config }), [config]);

  const { disabled, readonly, placeholder, dateFormat, view, inline, selectionMode } = dateTimeConfig || {};

  const handleChange = (e: FormEvent) => {
    if (Array.isArray(e.value)) {
      onChange?.(e.value as [Date, Date]);
    } else {
      onChange?.(e.value);
    }
  };

  const parsedValue = useMemo(() => {
    if (value && typeof value === 'string') {
      return new Date(value);
    }
    if (value && Array.isArray(value)) {
      return [new Date(value[0]) ?? null, new Date(value[1]) ?? null];
    }
    return value;
  }, [value]);

  const dateClasses = classNames('datepicker-component__date', { invalid: error && !disabled, 'cursor-not-allowed bg-disabled': disabled });

  return (
    <div className="datepicker-component">
      <div className="datepicker-component__container" ref={ref}>
        <Calendar
          className={dateClasses}
          panelClassName="datepicker-panel"
          id={name}
          name={name}
          value={parsedValue}
          onChange={handleChange}
          showButtonBar={true}
          disabled={disabled}
          dateFormat={dateFormat}
          view={view}
          inline={inline}
          selectionMode={selectionMode}
          placeholder={placeholder ? t(placeholder) : ''}
          viewDate={parsedValue}
          showIcon={true}
          variant="filled"
        />
      </div>

      {error && <Validator error={t(error)} />}
    </div>
  );
});

export default DateTimePicker;
