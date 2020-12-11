import React from 'react';
import { BehaviorSubject } from 'rxjs';
import ReactDOM from 'react-dom';
import Consult from '../Consult';
import Login from '../login';
import $ from 'jquery';
import config from 'react-global-configuration';


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const ApiLink = "http://localhost:62439";
const OcpSubscriptionKey = "12d775a6fc604fe791251ea9be5ca824";

const Authentication ={
    login, logout, authHeader, ApiLink, updateLocalStorage, OcpSubscriptionKey,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
}

function login(username, password){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': OcpSubscriptionKey },
        body: JSON.stringify({username, password})
    };
    
    fetch(ApiLink+'/users/authenticate', requestOptions)
    .then(response => response.json())
        .then(user => {
            console.log(user)
            if (user.token != null) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                currentUserSubject.next(user);
            } else {
                config.get('Language') == "ES" ? alert("Usuario o Contrase\u00F1a Invalido") : alert("User or Password Invalid");
            }
        if (Authentication.currentUserValue) { 
            ReactDOM.render(<Consult />, document.getElementById('Content'));
            $('#btnLogout').show();
            $('#btnFormGNTF17').show();
            $('#btnFormGNTF17').attr('disabled', 'disabled');
            $('#btnRegister').hide();
        }
    })
    .catch(e=>alert(e))
}

function update(){
    document.getElementById('btnTrigger').click();
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
    ReactDOM.render(<Login />, document.getElementById('Content'));
    $('#btnLogout').hide()
    $('#btnRegister').show();
    $('#btnFormGNTF17').hide();
}

function updateLocalStorage(user){
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUserSubject.next(user);
}

function authHeader() {
    // return authorization header with jwt token
    const currentUser = Authentication.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}`, 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': OcpSubscriptionKey };
    } else {
        return {};
    }
}

export default Authentication;
