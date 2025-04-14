import Loader from '@/shared/components/Loader/Loader';
import { StockData } from '@/store/useStockStore';
import React from 'react';

interface HighLowDeatilsProps {
  data: StockData;
  isLoading?: boolean;
}

const HighLowDeatils: React.FC<HighLowDeatilsProps> = ({ data, isLoading = false }) => {
  return (
    <>
      {!isLoading ? (
        <>
          <p>Open: {data?.open ?? 'N/A'}</p>
          <p>High: {data?.high ?? 'N/A'}</p>
          <p>Low: {data?.low ?? 'N/A'}</p>
          <h2>{data?.price ?? 'N/A'}</h2>
          <p className="muted">Prev Close: {data?.previousClose ?? 'N/A'}</p>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default HighLowDeatils;
