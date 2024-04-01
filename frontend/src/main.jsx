import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { OpenProvider } from './OpenContext';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <OpenProvider>
      <App />
    </OpenProvider>
  </React.StrictMode>
);
