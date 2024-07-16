import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReduxToastr from 'react-redux-toastr';
import { Provider } from 'react-redux';
import store from './store/store';
import { HashRouter } from "react-router-dom";
import { createBrowserHistory } from 'history';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

const history = createBrowserHistory();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>      
      <React.StrictMode>        
        <App />
        <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="top-right"
            getState={(state) => state.toastr} 
            transitionIn="fadeIn"
            transitionOut="fadeOut"
            progressBar
            closeOnToastrClick
        />
      </React.StrictMode>
      
  </Provider>
);
reportWebVitals();
