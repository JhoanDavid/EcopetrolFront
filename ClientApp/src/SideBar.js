import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import logo from './images/logo.png';
import './css/light-bootstrap-dashboard.css';
import config from 'react-global-configuration';
import ReactDOM from 'react-dom';
import Login from './login';
import $ from 'jquery';
import jsonLang from "./Translate";
import Register from './Register';
import Consult from './Consult';
import FormGNTF17 from './FormGNTF17.js';
import Authentication from './services/Authentication.service';

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = { Language: config.get('Language'), spanish:'Espa\u00F1ol'};
    }

    componentDidMount = () => {
        this.loadFormLanguage();
    }

    loadFormLanguage = () => {
        var arrayItems = jsonLang[config.get('Language')]["SideBar"];
        for (var i = 0; i < arrayItems.length; i++) {
            switch (arrayItems[i].Type) {
                case 'placeholder':
                    $("#" + arrayItems[i].Id + "").attr(arrayItems[i].Type, arrayItems[i].Text);
                    break;
                case 'html':
                    $("#" + arrayItems[i].Id + "").html(arrayItems[i].Text);
                    break;
            }
        }
    }

    saveFormLanguage = (data) => {
        this.setState({ Language: data.target.value });
        config.set({ Language: data.target.value });
        this.loadFormLanguage();
        document.getElementById('btnTrigger').click();
    }

    redirect(text) {
        switch (text) {
            case 'Home':
                ReactDOM.render(<Login />, document.getElementById('Content'));
                break;
            case 'Register':
                ReactDOM.render(<Register />, document.getElementById('Content'));
                break;
            case 'FormGNTF17':
                if (Authentication.currentUserValue.data.proposalState.includes("Pendiente")) {
                    ReactDOM.render(<FormGNTF17 />, document.getElementById('Content'));
                } else {
                    config.get('Language') == "ES" ? alert('No tienes acceso') : alert("You don't have access");
                }
                 

        }
    }

    logout = () => {
        Authentication.logout();
        this.redirect('Home')
    }

    render() {
        return (
            <div className="sidebar">
                <div className="sidebar-wrapper">
                    <div className="logo">
                        <a href="https://www.ecopetrol.com.co/wps/portal/es" className="simple-text">
                            <img src={logo} height='80px'></img>
                        </a>
                    </div>
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={()=>this.redirect('Home')}>
                                <i className="nc-icon nc-chart-pie-35"></i>
                                <p id="pHome">Inicio</p>
                            </a>
                        </li>
                        <li id="btnRegister">
                            <a className="nav-link" onClick={()=>this.redirect('Register')}>
                                <i className="nc-icon nc-notes"></i>
                                <p id="pRegister">Registro</p>
                            </a>
                        </li>
                        <li>
                            <a id="btnFormGNTF17" className="nav-link" onClick={()=>this.redirect('FormGNTF17')}>
                                <i className="nc-icon nc-notes"></i>
                                <p id="pFormGNTF17">Formulario GNT-F-17</p>
                            </a>
                        </li>
                        <li id="btnLogout" onClick={Authentication.logout}>
                            <a className="nav-link">
                                <i className="nc-icon nc-button-power"></i>
                                <p id="pLogout">Cerrar Sesion</p>
                            </a>
                        </li>
                        <li className="nav-item active-pro">
                            <a className="nav-link">
                                <p id="pLanguage">Language: </p>
                                <Form.Control id="selectLanguage" as="select"
                                    onChange={(data) => this.saveFormLanguage(data)}
                                    value={this.state.Language} variant="warning" text="white" className="primary" size="sm">
                                    <option value="EN">English</option>
                                    <option value="ES">{this.state.spanish}</option>
                                </Form.Control>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default SideBar;