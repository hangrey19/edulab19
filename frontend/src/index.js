import React from 'react';
import { createRoot } from 'react-dom/client'; // <-- dùng createRoot thay vì ReactDOM.render
import './index.scss';
import './style/style.scss';
import App from './App';
import store from "./redux";
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import "bootstrap/dist/js/bootstrap.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "font-awesome/css/font-awesome.min.css";

// 👉 Đây là phần bạn cần sửa
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
