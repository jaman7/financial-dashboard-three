import { formDefault } from '@/components/Shared/PanelControlsBase/PanelControlsBase.config';
import { IFormPanelValues } from '@/components/Shared/PanelControlsBase/PanelControlsBase.model';
import { create } from 'zustand';

type ExchangeRatesState = {
  formValues: IFormPanelValues;
  currencyIds: string[];
  updateCurrencyIds: (data: string[]) => void;
  updateFormValues: (data: Partial<IFormPanelValues>) => void;
};

export const useExchangeRatesStore = create<ExchangeRatesState>((set) => ({
  formValues: formDefault,
  currencyIds: ['USD', 'PLN', 'EUR', 'JPY'],
  updateCurrencyIds: (data) => set({ currencyIds: data }),
  updateFormValues: (data) =>
    set((state) => {
      if (JSON.stringify(state.formValues) === JSON.stringify({ ...state.formValues, ...data })) {
        return state;
      }
      return { formValues: { ...state.formValues, ...data } };
    }),
}));
