import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return <h1>Bienvenue sur la plateforme d'echecs</h1>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
