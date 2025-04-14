import React from 'react';
import StockSummaryCard from '@/components/Dashboard/StockSummaryCard/StockSummaryCard';
import CryptoSummaryCard from '@/components/Dashboard/CryptoSummaryCard/CryptoSummaryCard';
import ExchangeSummaryCard from '@/components/Dashboard/ExchangeSummaryCard/ExchangeSummaryCard';
import StocksMapCard from '@/components/Dashboard/StocksMapCard/StocksMapCard';
import ExchangeRatesCard from '@/components/Dashboard/ExchangeRatesCard/ExchangeRatesCard';
import GlobeMapCard from '@/components/Dashboard/GlobeMapCard/GlobeMapCard';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-grid">
      <GlobeMapCard />
      <StockSummaryCard />
      <CryptoSummaryCard />
      <ExchangeSummaryCard />
      <StocksMapCard />
      <ExchangeRatesCard />
    </div>
  );
};

export default Dashboard;
