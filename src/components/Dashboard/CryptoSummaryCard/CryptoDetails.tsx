import Divider from '@/shared/components/divider/Divider';
import LazyImage from '@/shared/components/LazyImage/LazyImage';
import Loader from '@/shared/components/Loader/Loader';
import { ICryptoData } from '@/types/cryptoTypes';
import React from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface CryptoDetailsProps {
  data: ICryptoData;
  currencyName: string;
}

const CryptoDetails: React.FC<CryptoDetailsProps> = ({ data, currencyName }) => {
  return (
    <>
      {data?.name ? (
        <div className="crypto-info-container">
          <div className="crypto-data">
            <p className="crypto-price">
              {data?.marketData?.currentPrice?.[currencyName]?.toFixed(2) ?? 'N/A'}
              {currencyName.toUpperCase()}
            </p>
            <Divider />
            <p>Change 24h: {data?.marketData?.priceChangePercentage_24h?.toFixed(2) ?? 'N/A'}%</p>
            <p>ATH: {data?.marketData?.ath?.[currencyName]?.toFixed(2) ?? 'N/A'}</p>
            <p>ATL: {data?.marketData?.atl?.[currencyName]?.toFixed(2) ?? 'N/A'}</p>
            <p>Market Cap: {data?.marketData?.marketCap?.[currencyName]?.toLocaleString() ?? 'N/A'}</p>
            <p>Volume 24h: {data?.marketData?.totalVolume?.[currencyName]?.toLocaleString() ?? 'N/A'}</p>
            <p>Circulating Supply: {data?.marketData?.circulatingSupply?.toLocaleString() ?? 'N/A'}</p>
            <p>
              Sentiment: <FaArrowUp /> {data?.sentimentVotesUpPercentage ?? 'N/A'}% <FaArrowDown />
              {data?.sentimentVotesDownPercentage ?? 'N/A'}%
            </p>
          </div>
          <div className="crypto-image">
            <LazyImage src={data?.image?.large} alt={data?.name} className="crypto-icon" />
            <h2>{data?.name ?? 'N/A'}</h2>
            <p>Ranking: #{data?.marketCapRank ?? 'N/A'}</p>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CryptoDetails;
