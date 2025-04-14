import Divider from '@/shared/components/divider/Divider';
import Loader from '@/shared/components/Loader/Loader';
import { StockData } from '@/store/useStockStore';
import React from 'react';

export type SummaryDeatilsType = 'head' | 'vol';

interface SummaryDeatilsProps {
  data: StockData;
  isLoading?: boolean;
  type: SummaryDeatilsType;
}

const SummaryDeatils: React.FC<SummaryDeatilsProps> = ({ data, isLoading = false, type }) => {
  return (
    <>
      {!isLoading ? (
        type === 'head' ? (
          <>
            <h2 className={data?.change && data?.change >= 0 ? 'positive' : 'negative'}>{data?.changePercent ?? 'N/A'}</h2>
            <Divider />
            <h3>{data?.name ?? 'N/A'}</h3>
          </>
        ) : (
          <>
            <p>Vol: {data?.volume?.toLocaleString() ?? 'N/A'}</p>
            <p className="muted">Latest: {data?.latestTradingDay ?? 'N/A'}</p>
          </>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default SummaryDeatils;
