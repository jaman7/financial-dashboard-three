import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import classNames from 'classnames';
import FormElements from '@/shared/components/formElements/FormElements';
import FiltersChartButtons from '@/components/Shared/FiltersChartButtons/FiltersChartButtons';
import LazyImage from '@/shared/components/LazyImage/LazyImage';
import { IFormElements } from '@/shared/components/formElements/FormElements.model';
import { createConfigForm } from '@/shared/utils/form-config';
import { findNameFromDict } from '@/shared/utils/helpers';
import { IDictionary } from '@/shared/components/select/Select.model';
import { getCurrencyInfoMap } from '@/components/Helpers/CurrencyInfoMap';
import { convertCurrency } from '@/components/Helpers/convertCurrency';
import { IDictionaries } from '@/types/dictionaryTypes';
import { ICurrencyTableRow } from '@/components/Models/currency';
import Card from '@/shared/components/Card/Card';
import { IFormPanelValues } from './PanelControlsBase.model';
import { formConfig, formDefault, keys } from './PanelControlsBase.config';
import './PanelControlsBase.scss';

interface PanelControlsBaseProps {
  data?: ICurrencyTableRow;
  formValues: IFormPanelValues;
  currencyIds: string[];
  dictionary: IDictionaries;
  showFiltersChartButtons?: boolean;
  formPrefix?: string;
  cardWrapper?: boolean;
  scssModifier?: string;
  updateFormValues: (values: Partial<IFormPanelValues>) => void;
  updateCurrencyIds: (currencyIds: string[]) => void;
  children?: React.ReactNode | null;
}

const PanelControlsBase: FC<PanelControlsBaseProps> = ({
  data,
  formValues,
  currencyIds,
  dictionary,
  showFiltersChartButtons = false,
  formPrefix = 'currencyPanel',
  cardWrapper = false,
  scssModifier = '',
  updateFormValues,
  updateCurrencyIds,
  children = null,
}) => {
  const [formConfig$, setFormConfig$] = useState<IFormElements[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);

  const { currencyDict = [] } = dictionary || {};

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: formDefault,
  });

  const currencyFromId = formMethods.watch('currencyFromId');

  const currencyInfoMap = useMemo(() => {
    return getCurrencyInfoMap(currencyDict ?? [], currencyIds);
  }, [currencyDict, currencyIds]);

  const itemsConfig = useCallback(
    (data: any, name: string) => {
      const dict = dictionary as IDictionary;
      return {
        ...data,
        dictData:
          name === 'currencyFromId' ? dict?.[data?.dictName] : (dict?.[data?.dictName]?.filter((el) => el.id !== currencyFromId) ?? []),
      };
    },
    [currencyFromId, currencyDict.length]
  );

  useEffect(() => {
    setFormConfig$(createConfigForm(formConfig, { dictionaries: dictionary as IDictionary, prefix: formPrefix }));
  }, [currencyDict.length]);

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      updateFormValues(values);
    });
    return () => subscription.unsubscribe();
  }, [formMethods, data]);

  useEffect(() => {
    if (!data?.id) return;

    const currencyAllIds = keys?.map((key) => findNameFromDict(formValues[key as keyof IFormPanelValues], currencyDict ?? []));
    const ids = [...currencyAllIds.slice(1)];
    updateCurrencyIds(currencyAllIds);
    const rates = convertCurrency(data, ids, formValues.baseValue as number);

    const newFormValues = ids.reduce((acc: Partial<IFormPanelValues>, currency, index) => {
      (acc as any)[`value${index + 1}`] = rates?.[currency.toLowerCase()] ?? null;
      return acc;
    }, {});

    formMethods.setValue('value1', newFormValues.value1 ?? null);
    formMethods.setValue('value2', newFormValues.value2 ?? null);
    formMethods.setValue('value3', newFormValues.value3 ?? null);
    updateFormValues(newFormValues as IFormPanelValues);
  }, [
    data?.id,
    formValues.currencyFromId,
    formValues.baseValue,
    formValues.currencyToId1,
    formValues.currencyToId2,
    formValues.currencyToId3,
    currencyDict.length,
  ]);

  const handleDateRangeChange = useCallback((value: number) => {
    setSelectedDateRange(value);
    updateFormValues({ dateRange: value });
  }, []);

  const classBase = `panel-controls${scssModifier ? `${scssModifier}` : ''}`;

  const content = (
    <div className={classBase}>
      <div className={`${classBase}__header`}>
        <span className={`${classBase}__header--value`}>{formValues.baseValue}</span>
        <span className={`${classBase}__header--symbol`}>
          {`${currencyInfoMap?.['baseValue']?.displayName ?? ''} (${currencyInfoMap?.['baseValue']?.symbol ?? ''})`}
        </span>
        <LazyImage src={currencyInfoMap?.['baseValue']?.flags ?? null} alt="flag" className="flag" />
      </div>

      <FormProvider {...formMethods}>
        <form className={`${classBase}__form`}>
          {formConfig$?.map((item, i) => (
            <div
              className={classNames(`${classBase}__form--item`, { light: item.formControlName?.includes('value') })}
              key={item.formControlName}
            >
              <FormElements
                formControlName={item.formControlName as string}
                config={itemsConfig(item.config, item.formControlName as string)}
              />
              {i !== 1 && i % 2 !== 0 && item?.formControlName && currencyInfoMap?.[item.formControlName] && (
                <div className="panel-controls__symbols">
                  <span className="panel-controls__symbols--symbol">
                    {`${currencyInfoMap?.[item?.formControlName]?.displayName} (${currencyInfoMap?.[item.formControlName]?.symbol})`}
                  </span>
                  <LazyImage src={currencyInfoMap?.[item?.formControlName]?.flags ?? null} alt={item?.formControlName} className="flag" />
                </div>
              )}
            </div>
          ))}
        </form>
      </FormProvider>

      {showFiltersChartButtons && (
        <div className={`${classBase}__buttons`}>
          <FiltersChartButtons
            selectedDateRange={selectedDateRange}
            onDateRangeChange={handleDateRangeChange}
            isTimeframe={false}
            allowedDateRanges={[7, 30, 90, 180, 365]}
          />
        </div>
      )}

      {children}
    </div>
  );

  return cardWrapper ? <Card>{content}</Card> : content;
};

export default PanelControlsBase;
