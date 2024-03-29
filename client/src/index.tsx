import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';
import Navbar from './Navbar';
import Footer from './Footer';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Navbar/>
      <Router />
      <Footer/>
  </React.StrictMode>
);

