import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { io } from 'socket.io-client';

const socket = io.connect(window.location.origin);

if (window.location.host === 'game--night.herokuapp.com') {
  if (
    window.location.protocol === 'http' ||
    window.location.protocol === 'http:'
  ) {
    window.location.protocol = 'https';
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
