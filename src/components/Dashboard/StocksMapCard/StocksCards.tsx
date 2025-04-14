import LazyImage from '@/shared/components/LazyImage/LazyImage';
import { IStocksTickersAlpaca } from '@/types/stockTypes';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FaArrowDown, FaArrowUp, FaChartBar, FaDollarSign } from 'react-icons/fa';

interface StocksCardsProps {
  data?: IStocksTickersAlpaca[];
  ticker?: string;
  setSelectedTicker?: (ticker: string) => void;
}

const StocksCards: React.FC<StocksCardsProps> = ({ data = [], ticker = '', setSelectedTicker }) => {
  return (
    <>
      {data?.map((stock) => (
        <motion.div
          key={stock?.ticker}
          whileHover={{ scale: 1.05 }}
          className={classNames('stock-item', { active: ticker === stock.ticker })}
          onClick={() => setSelectedTicker?.(stock?.ticker as string)}
        >
          <div className="stock-detail">
            <div className="stock-detail-item">
              <FaDollarSign className="stock-detail-item-price" />
              <span className="stock-detail-item-price">{stock?.price ?? 'N/A'}</span>
            </div>
            <div className="stock-detail-item">
              <FaChartBar className="stock-detail-item-volume" />
              <span className="stock-detail-item-volume">{stock?.volume ?? 'N/A'}</span>
            </div>
          </div>
          <div className="stock-detail">
            <div className="stock-detail-item">
              <FaArrowUp className="stock-detail-item-high" /> <span className="stock-detail-item-high">{stock?.high ?? 'N/A'}</span>
            </div>
            <div className="stock-detail-item">
              <FaArrowDown className="stock-detail-item-low" /> <span className="stock-detail-item-low">{stock?.low ?? 'N/A'}</span>
            </div>
          </div>
          <div className="stock-info">
            <LazyImage src={stock?.logo as string} alt={stock?.ticker} className="stock-info-img" />

            <p>{stock.ticker}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default StocksCards;
