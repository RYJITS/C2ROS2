import React from 'react';
import ReactDOM from 'react-dom/client';
import ChessBoard from './ChessBoard';

const App = () => {
  return <ChessBoard />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
