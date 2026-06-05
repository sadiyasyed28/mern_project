import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{
        background: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(78, 205, 196, 0.2)',
        borderRadius: '12px',
        color: '#e2e8f0'
      }}
    />
  </React.StrictMode>
);
