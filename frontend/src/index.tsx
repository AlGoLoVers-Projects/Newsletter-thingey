import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import RootRouter from "./router/routes";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RootRouter/>
  </React.StrictMode>
);

