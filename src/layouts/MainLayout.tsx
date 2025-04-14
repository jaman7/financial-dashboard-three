import { FC } from 'react';
import Header from '@/components/Header/Header';
import './MainLayout.scss';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <div className="layout">
    <div className="layout-content">
      <Header />
      <main className="main-content">{children}</main>
    </div>
  </div>
);

export default MainLayout;
