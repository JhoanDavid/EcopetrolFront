import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import Login from './login';
import * as serviceWorker from './serviceWorker';
import config from 'react-global-configuration';
import SideBar from './SideBar'

config.set({ Language: 'EN' }, {freeze:false});
ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<SideBar />, document.getElementById('SideBar'));
ReactDOM.render(<Login />, document.getElementById('Content'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
