import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import './Header.scss';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <h1>{t('header')}</h1>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;
