import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import './assests/scss/main.scss';

const container = document?.getElementById('root');
const root = createRoot(container!);

root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);

reportWebVitals();
