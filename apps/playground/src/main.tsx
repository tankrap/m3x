import * as React from 'react';
import { createRoot } from 'react-dom/client';
import '@tankmrap/m3x/styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
