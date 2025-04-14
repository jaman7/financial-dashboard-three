import { IFormElementsConfig, IFormElementsEnum } from '@/shared/components/formElements/FormElements.model';
import { ITableColumns } from '@/shared/components/table/table.model';
import { IFormPanelValues } from './PanelControlsBase.model';

const { SELECT, NUMBER, TEXT_VALUE } = IFormElementsEnum;

export const formConfig: IFormElementsConfig = {
  currencyFromId: { config: { formCellType: SELECT, dictName: 'currencyDict', size: 'xs', styleClass: 'w-100' } },
  baseValue: { config: { formCellType: NUMBER, size: 'xs', styleClass: 'w-100' } },
  currencyToId1: {
    config: { formCellType: SELECT, dictName: 'currencyDict', size: 'xs', isNoHeader: true, styleClass: 'w-100' },
  },
  value1: { config: { formCellType: TEXT_VALUE, size: 'xs', valueStyleClass: 'form-value' } },
  currencyToId2: {
    config: { formCellType: SELECT, dictName: 'currencyDict', size: 'xs', isNoHeader: true, styleClass: 'w-100' },
  },
  value2: { config: { formCellType: TEXT_VALUE, size: 'xs', valueStyleClass: 'form-value' } },
  currencyToId3: {
    config: { formCellType: SELECT, dictName: 'currencyDict', size: 'xs', isNoHeader: true, styleClass: 'w-100' },
  },
  value3: { config: { formCellType: TEXT_VALUE, size: 'xs', valueStyleClass: 'form-value' } },
};

export const columnConfig: { [name: string]: ITableColumns } = {
  date: { type: 'DateTime' },
};

export const formDefault: IFormPanelValues = {
  currencyFromId: 1,
  baseValue: 1,
  currencyToId1: 3,
  value1: null,
  currencyToId2: 2,
  value2: null,
  currencyToId3: 18,
  value3: null,
  dateRange: 30,
};

export const keys = ['currencyFromId', 'currencyToId1', 'currencyToId2', 'currencyToId3'];
