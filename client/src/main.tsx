import React from 'react';
import ReactDOM from 'react-dom/client';
import { Board } from './components/Board';

const App = () => {
  return (
    <div>
      <h1>Plateforme d’échecs</h1>
      <Board />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
