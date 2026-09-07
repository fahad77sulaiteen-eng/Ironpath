import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n/I18nContext';
import { ThemeProvider } from './theme/ThemeContext';
import { registerServiceWorker } from './registerServiceWorker';
import './styles/nocturne.css';
import './styles/theme-light.css';
import './styles/theme-dark.css';
import './styles/ironpath.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

registerServiceWorker();
