import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import shoppingListItemReducer from './reducers/shoppingListItemReducer';
import App from './App';
import './index.css';

// update with code snippets from lesson

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);
