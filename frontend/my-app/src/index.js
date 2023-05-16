import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Desktopp from './Desktopp'
import FirstProfil from './FirstProfil';


import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <FirstProfil/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();