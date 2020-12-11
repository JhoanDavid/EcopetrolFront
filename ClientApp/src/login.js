import React from 'react';
import { Card, Container, Row, Col, Form, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ReactDOM from 'react-dom';
import Consult from './Consult';
import $ from 'jquery';
import jsonLang from "./Translate";
import config from 'react-global-configuration';
import Authentication from './services/Authentication.service.js';
import AppStyle from './css/App.css'    
import InsertForm from './services/InsertForm.service';


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: true, user: '',
            password: '',
            Translate: false,
            Language: config.get('Language'),
            Show: false,
            NIT: '',
            Email:'',
        };
        this.toggleShow = this.toggleShow.bind(this);
        if (Authentication.currentUserValue) { 
            this.redirect();
            $('#btnLogout').show();
            $('#btnRegister').hide()
            $('#btnFormGNTF17').show()
            Authentication.currentUserValue.data.proposalState == "Información Pendiente" ? $('#btnFormGNTF17').prop("disabled", false) : $('#btnFormGNTF17').prop("disabled", true);
        }else{
            $('#btnLogout').hide()
            $('#btnRegister').show()
            $('#btnFormGNTF17').hide();
        }
    }

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    componentDidMount() {
        if (this.props.password) {
            this.setState({ password: this.props.password });
        }
        this.loadFormLanguage();
    }

    componentDidUpdate = () => {
        this.loadFormLanguage();
    }
    

    handleHidden = () => { this.setState({ hidden: true }) };

    redirect = () => {
        ReactDOM.render(<Consult />, document.getElementById('Content'));
    }
    
    loadFormLanguage = () => {
        var arrayItems = jsonLang[config.get('Language')]["Login"];
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

    login=()=>{
        Authentication.login(this.state.user,this.state.password);
    }

    RememberPasswordModal() {
        return (<Modal show={this.state.Show} onHide={() => this.setState({ Show: false })}><center>
            <Modal.Header closeButton>
                <Modal.Title><h3 className="font-weight-normal primary" id="lblRememberPassword">Recordar Contraseña</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label id="lblRememberText"></Form.Label>
                    <Form.Group>
                        <Form.Label id="lblNIT">NIT</Form.Label>
                        <Form.Control type="text" value={this.state.NIT} onChange={(data) => { this.setState({ NIT: data.target.value }) }} maxLength="50"  required></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label id="lblEmail">Correo Electrónico</Form.Label>
                        <Form.Control type="text" value={this.state.Email} onChange={(data) => { this.setState({ Email: data.target.value }) }} maxLength="50" required></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttonStyleYellow" variant="warning" size="sm" onClick={() => this.setState({ Show: false })}>Cancel</Button>
                <Button id="" className="buttonStyleGreen" variant="success" size="sm" onClick={this.RememberPassword}>Recuperar</Button>
            </Modal.Footer></center>
        </Modal>)
    }

    RememberPassword = async () => {
        var response= await InsertForm.RememberPassword(this.state.NIT, this.state.Email)
        console.log(response);
        if (response.status == "200") {
            alert("Solicitud realizada con \u00C9xito, en el correo recibir\u00E1 un mensaje con los datos solicitados");
            this.setState({ Show: false })
        } else {
            alert("No existe usuario registrado con estos datos");
        }
    }

    render() { 
        return (
        <div className="App"><button id="btnTrigger" onClick={()=>this.setState({Translate:!this.state.Translate})}></button>
            <Card className="text-center ecp-card ecp-login shadow rounded">
                <Container fluid>
                    <Row>
                        <Col className="bg-login d-flex justify-content-center align-content-center" id="imgLogin">
                            <Row className="d-flex justify-content-center">
                                <article className="login-title">
                                    <h3 id="lblWelcome" className="font-weight-normal">Welcome to <strong className="font-weight-bold">ECOPETROL</strong></h3>
                                </article>
                            </Row>
                        </Col>
                        <Col className="login-form">
                            <Container>
                                <Row className="d-flex justify-content-center">
                                    <Form className="mt-4 frm-login" id="FormLogin">
                                        <Form.Group controlId="formGroupEmail">
                                            <Form.Control value={this.state.user} id="txtUser" onChange={(data) => { this.setState({ user: data.target.value }) }} type="email" placeholder="User, NIT or Email" />
                                        </Form.Group>
                                        <Form.Group controlId="formGroupPassword">
                                            <InputGroup className="mb-3">
                                                <FormControl
                                                    type={this.state.hidden ? 'password' : 'text'}
                                                    value={this.state.password}
                                                    onChange={(data)=>this.setState({ password: data.target.value })}
                                                    onKeyPress={this.handleHidden}
                                                    placeholder="Password"
                                                    aria-label="Password"
                                                    aria-describedby="Password"
                                                    id="txtPass"
                                                />
                                                <InputGroup.Append>
                                                    <Button variant="outline-secondary" onClick={this.toggleShow}>
                                                        <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                                    </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                                    <a href="#" onClick={() => this.setState({ Show: true })}>
                                                        <p id="lblRememberPassword2" ></p>
                                                    </a>
                                                </Col>
                                            </Row>
                                        <Row className="mt-2">
                                            <Col className="mr-5 ml-5">
                                                <Button id="btnLogin" onClick={this.login} variant="warning" text="white" className="primary" size="sm" block>Log In</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                </Card>
                {this.RememberPasswordModal()}
        </div>
        );
    }
}

export default Login;