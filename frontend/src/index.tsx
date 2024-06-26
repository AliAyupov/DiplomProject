import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/redux-store';
import { Provider } from 'react-redux';
import Header from './components/Layout/HeaderContainer';
import Footer from './components/Layout/Footer';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Header/>
      <App />
      <Footer/>
    </BrowserRouter>
  </Provider>
);