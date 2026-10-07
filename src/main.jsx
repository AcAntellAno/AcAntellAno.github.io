import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/lilita-one';
import '@fontsource/nunito';
import '@fontsource/courier-prime';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
