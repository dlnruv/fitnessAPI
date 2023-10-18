import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import FitnessCalc from './FitnessCalc';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FitnessCalc />
  </React.StrictMode>
);
reportWebVitals();
