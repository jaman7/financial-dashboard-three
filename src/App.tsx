import { useInitializeData } from './hooks/useInitializeData';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import './i18n';

function App() {
  useInitializeData();

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}

export default App;
