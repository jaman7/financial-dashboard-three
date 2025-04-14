import { FC, useMemo, JSX } from 'react';
import { useExchangeRatesStore } from '../store/useStore';
import { calculateCurrencyIndicators } from './PanelExchangeRates.helper';
import { FaArrowUp, FaArrowDown, FaChartLine, FaTachometerAlt, FaPercentage } from 'react-icons/fa';
import { Tooltip } from 'primereact/tooltip';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ICurrencyTableRow } from '@/components/Models/currency';
import './PanelExchangeRates.scss';

interface PanelExchangeRatesProps {
  data?: ICurrencyTableRow[];
}

type IndicatorKeys = 'min' | 'max' | 'avg' | 'lastChange' | 'avgDailyChange';

const PanelExchangeRates: FC<PanelExchangeRatesProps> = ({ data }) => {
  const { t } = useTranslation();
  const currencyIds = useExchangeRatesStore((state) => state.currencyIds);

  const indicatorsData = useMemo(() => {
    return calculateCurrencyIndicators(data ?? [], [...currencyIds.slice(1)]);
  }, [data, currencyIds]);

  const indicatorIcons: Record<IndicatorKeys, { icon: JSX.Element; tooltip: string }> = {
    min: { icon: <FaArrowDown />, tooltip: 'exchangeRatesCard.panelIndicators.min' },
    max: { icon: <FaArrowUp />, tooltip: 'exchangeRatesCard.panelIndicators.max' },
    avg: { icon: <FaChartLine />, tooltip: 'exchangeRatesCard.panelIndicators.avg' },
    lastChange: { icon: <FaPercentage />, tooltip: 'exchangeRatesCard.panelIndicators.lastChange' },
    avgDailyChange: { icon: <FaTachometerAlt />, tooltip: 'exchangeRatesCard.panelIndicators.avgDailyChange' },
  };

  return (
    <>
      <div className="indicators-table">
        <div className="table-row table-header">
          <div className="table-cell icon-cell"></div>
          {currencyIds?.slice(1)?.map((currency, i) => (
            <div key={`table-header-${currency}-${i}`} className="table-cell currency-name">
              {currency}
            </div>
          ))}
        </div>

        {Object.entries(indicatorIcons)?.map(([key, { icon, tooltip }]) => (
          <div key={`indicatorIcons-${key}`} className="table-row">
            <div className={classNames('table-cell', 'icon-cell')}>
              <span
                className={`target-tooltip-${key}`}
                data-pr-tooltip={t(tooltip)}
                data-pr-classname="shadow-none"
                data-pr-position="left"
              >
                {icon}
              </span>
              <Tooltip target={`.target-tooltip-${key}`} autoHide={false} />
            </div>

            {currencyIds?.slice(1)?.map((currency, i) => (
              <div key={`currencyIds-${currency}-${key}-${i}`} className="table-cell">
                {indicatorsData?.[currency.toLowerCase()]?.[key as IndicatorKeys] ?? '-'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default PanelExchangeRates;
