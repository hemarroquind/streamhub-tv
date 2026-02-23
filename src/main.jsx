import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Hide loading screen once React mounts
const hideLoading = () => {
  const el = document.getElementById('loading-screen');
  if (el) {
    el.classList.add('hidden');
    setTimeout(() => el.remove(), 500);
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App onReady={hideLoading} />
  </React.StrictMode>
);
