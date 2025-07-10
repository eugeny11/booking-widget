import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

/* window.mountApp = function(targetId = "app") {
  const container = document.getElementById(targetId);
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  } 
}; */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <App />
  
);       
