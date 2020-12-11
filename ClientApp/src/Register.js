import { faPaperclip, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from 'jquery';
import React, { Component } from "react";
import { Button, ButtonGroup, Card, Col, Container, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import config from 'react-global-configuration';
import Login from './login';
import Authentication from './services/Authentication.service';
import InsertForm from './services/InsertForm.service';
import jsonLang from "./Translate";


const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    display: 'flex',
};

class Register extends Component {
    constructor(props) {
        super(props);
        if (Authentication.currentUserValue) {
            this.state = {
                step: 1,
                ContactName: Authentication.currentUserValue.data.contactName,
                PhoneNumber: Authentication.currentUserValue.data.phoneNumber,
                Email: Authentication.currentUserValue.data.email,
                ProponentType: Authentication.currentUserValue.data.proponentType,
                NIT: Authentication.currentUserValue.data.nit,
                BusinessName: Authentication.currentUserValue.data.businessName,
                WebSite: Authentication.currentUserValue.data.webSite,
                SIPROEOption: Authentication.currentUserValue.data.siproeOption,
                SIPROEFile: [],
                IDSIPROE: Authentication.currentUserValue.data.siproeid,
                TechnologyName: Authentication.currentUserValue.data.technologyName,
                TechnologyObject: Authentication.currentUserValue.data.technologyObject,
                Functionality: Authentication.currentUserValue.data.functionality,
                ValuePromise: Authentication.currentUserValue.data.valuePromise,
                ApplicationSegment: Authentication.currentUserValue.data.applicationSegment,
                SpecificApplicationArea: Authentication.currentUserValue.data.specificApplicationArea,
                ProposalIdCode: Authentication.currentUserValue.data.proposalIdCode,
                ItemCode: Authentication.currentUserValue.data.itemCode,
                ProposalState: Authentication.currentUserValue.data.proposalState,
                Reactivated: Authentication.currentUserValue.data.reactivated,
                files: [],
                MaturityLevel: Authentication.currentUserValue.data.maturityLevel,
                validated: false,
                Language: config.get('Language'),
                ActivatedScript: false,
                SegmentList: null,
                AreaList: null,
                Attach: null,
                MaturityText: ''
            };
        } else {

            this.state = {
                step: 1,
                ContactName: '',
                PhoneNumber: '',
                Email: '',
                ProponentType: '0',
                NIT: '',
                BusinessName: '',
                WebSite: 'https://',
                SIPROEOption: '',
                SIPROECode: [],
                IDSIPROE:'',
                TechnologyName: '',
                TechnologyObject: '',
                Functionality: '',
                ValuePromise: '',
                ApplicationSegment: "0",
                SpecificApplicationArea: "0",
                files: [],
                SIPROEFile: [],
                MaturityLevel: '0',
                validated: false,
                Language: config.get('Language'),
                ActivatedScript: false,
                SegmentList: null,
                AreaList: null,
                Attach: null,
                MaturityText: '',
            };
        }
    }

    Redirect = () => {
        ReactDOM.render(<Login />, document.getElementById('Content'));
    }

    componentDidMount = () => {
        this.LoadFormLanguage();
        if (Authentication.currentUserValue) {
            $("#txtEmail").prop("disabled", true);
            this.GetSIPROEFile();
            InsertForm.SesionValidate();
        } else {
            $("#txtEmail").prop("disabled", false);
        }
        this.GetAreas();
        this.GetSegments();

        if (this.state.WebSite==null || this.state.WebSite=='') {
            this.setState({ WebSite:'https://'});
        }
    }

    componentDidUpdate = () => {
        this.LoadFormLanguage();
        if (Authentication.currentUserValue) {
            $("#txtEmail").prop("disabled", true);
        } else {
            $("#txtEmail").prop("disabled", false);
        }
        this.Prueba();
    }

    GetAreas = async () => {
        var list = await InsertForm.GetList("tbl_SpecificApplicationArea");
        this.setState({ AreaList: list });
    }

    GetSegments = async () => {
        var list = await InsertForm.GetList("tbl_ApplicationSegment");
        this.setState({ SegmentList: list });
    }

    nextStep = async () => {
       /* if ((this.state.step==2) && (this.state.SIPROEFile.length==0)) {
            config.get('Language') == "ES" ? alert('Por favor anexar los archivos correspondientes.') : alert('Please attach the corresponding files');
        } else {*/
            var response = await InsertForm.UpdateProposal(this.state.ContactName, this.state.PhoneNumber,
                this.state.Email, this.state.ProponentType, this.state.BusinessName,
                this.state.NIT, this.state.WebSite, this.state.TechnologyName,
                this.state.TechnologyObject, this.state.Functionality, this.state.ValuePromise,
                this.state.ApplicationSegment, this.state.SpecificApplicationArea, this.state.MaturityLevel, this.state.ProposalState, this.state.ProposalIdCode, this.state.ItemCode,this.state.Reactivated,this.state.IDSIPROE,this.state.SIPROEOption);
            console.log(response);
            if (response) {
                var intStep = this.state.step + 1;
                this.setState({ step: intStep });
            }
        //}
    };

    prevStep = () => {
        var intStep = this.state.step - 1;
        console.log(intStep);
        this.setState({ step: intStep });
    };

    handleSubmit = event => {
        if (Authentication.currentUserValue) {
            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                event.preventDefault();
                event.stopPropagation();
                this.nextStep();
            }
            this.setState({ validated: true });
        } else {
            this.SendForm(event);
        }
    }

    ConfirmSIPROE = (data) => {
        this.setState({ SIPROEOption: data.target.value });
        if (data.target.value == 'False') {
            this.setState({ IDSIPROE:''})
            $('#txtIDSIPROE').prop("disabled", true);
            //alert("Debe realizar primero este paso antes de realizar la propuesta");
            //$('.siproe').prop("disabled", true);
        } else if (data.target.value == 'True') {
            config.get('Language') == "ES" ? alert('Por favor digite su “ID SIPROE”') : alert('Please enter your “ID SIPROE”');

            
            $('#txtIDSIPROE').prop("disabled", false);
            //$('.siproe').prop("disabled", false);
        } else {
            
            $('#txtIDSIPROE').prop("disabled", true);
        }
    }

    SendForm = async event => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            var response = await InsertForm.insertProponent(this.state.ContactName, this.state.PhoneNumber,
                this.state.Email, this.state.BusinessName,
                this.state.NIT);
            if (response) {
                this.Redirect();
            }
        }
        this.setState({ validated: true });
    }

    UpdateForm = async event => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (this.state.MaturityLevel == 0) {
            config.get('Language') == "ES" ? alert('Por favor seleccione un nivel de madurez') : alert('Please select a maturity level');
        }
        else if (form.checkValidity() === true) {
            //enviar datos
            var response = await InsertForm.SendProposal(this.state.ContactName, this.state.PhoneNumber,
                this.state.Email, this.state.ProponentType, this.state.BusinessName,
                this.state.NIT, this.state.WebSite, this.state.TechnologyName,
                this.state.TechnologyObject, this.state.Functionality, this.state.ValuePromise,
                this.state.ApplicationSegment, this.state.SpecificApplicationArea, this.state.MaturityLevel, 'En Recepción', this.state.ProposalIdCode, this.state.ItemCode, this.state.files, this.state.Reactivated, this.state.IDSIPROE, this.state.SIPROEOption);
            if (response) {
                config.get('Language') == "ES" ? alert('Registro realizado satisfactoriamente') : alert('Registration completed successfully');
                this.Redirect();
            }
        } else {
            config.get('Language') == "ES" ? alert('Por favor anexar los archivos correspondientes.') : alert('Please attach the corresponding files');
        }
        this.setState({ validated: true });
    }

    LoadFormLanguage = () => {
        var arrayItems = jsonLang[config.get('Language')]["Register"];
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
    //funciones de manejo de archivos
    onChange = (e) => {
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    removeFile(f) {
        this.setState({ files: this.state.files.filter(x => x !== f) });
    }

    removeSIPROEFile(f) {
        InsertForm.DeleteFile(this.state.ItemCode, f.FileName);
        this.setState({ SIPROEFile: this.state.SIPROEFile.filter(x => x !== f) });
    }

    onChangeSIPROEFile = async (e) => {
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        await this.setState({ SIPROEFile: [...this.state.SIPROEFile, ...filesArr] });
        InsertForm.InsertFile(this.state.SIPROEFile, this.state.ItemCode);
    }

    GetSIPROEFile = async () => {
        var files = await InsertForm.GetFile(this.state.ItemCode);
        await this.setState({ SIPROEFile: files })
    }

    //fin de funciones de manejo de archivos

    ValidateCharacter = (data) => {
        var out = '';
        var filtro = '1234567890+- ';//Caracteres validos

        //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
        for (var i = 0; i < data.target.value.length; i++)
            if (filtro.indexOf(data.target.value.charAt(i)) != -1)
                out += data.target.value.charAt(i); //Se añaden a la salida los caracteres validos
        //Agrega el valor filtrado
        this.setState({ PhoneNumber: out });
    }

    ViewMaturityList = () => {
        $('.listaselect').toggle();
    }

    SelectMaturity = (e) => {
        var Text = $('#' + e.target.getAttribute('id')).text();
        var level = '' + e.target.value
        this.setState({
            MaturityLevel: level,
            MaturityText: Text
        });
    }

    Prueba = () => {
        if (this.state.SIPROEOption == 'True') {
            $('.siproe').prop("disabled", false);
            $('#txtIDSIPROE').prop("disabled", false);
        } else {
            $('.siproe').prop("disabled", true);
            $('#txtIDSIPROE').prop("disabled", true);
        }
    }

    TooltipSegment() {
        if (config.get('Language') == "ES") {
            return (<Tooltip id={`tooltip`}>Mencione el segmento (Exploración - Producción - Transporte - Refinación - Comercialización)</Tooltip>)
        } else {
            return(<Tooltip id={`tooltip`}>Mention the segment (Exploration - Production - Transport - Refinement - Commercialization)</Tooltip>)
        }
    }

    TooltipArea() {
        if (config.get('Language') == "ES") {
            return (<Tooltip id={`tooltip`}>Proceso productivo específico para la cual está concebida la tecnología propuesta</Tooltip>)
        } else {
            return (<Tooltip id={`tooltip`}>Specific production process for which the proposed technology is conceived</Tooltip>)
        }
    }

    render() {
        switch (this.state.step) {
            case 1:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })} ></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-7">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblRegistrationForm"><strong className="font-weight-bold darkGreen">Formulario de Registro</strong></h3>
                                    <h3 id="lblPersonalinformation" className="font-weight-normal primary"></h3>
                                    <Form.Group>
                                        <Form.Label id="lblBusinessName"></Form.Label>
                                        <Form.Control type='text' value={this.state.BusinessName} onChange={(data) => { this.setState({ BusinessName: data.target.value }) }} maxLength="100" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblNIT"></Form.Label>
                                        <Form.Control type='text' value={this.state.NIT} onChange={(data) => { this.setState({ NIT: data.target.value }) }} maxLength="50" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblContactName"></Form.Label>
                                        <Form.Control type='text' value={this.state.ContactName} onChange={(data) => { this.setState({ ContactName: data.target.value }) }} maxLength="100" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblPhoneNumber"></Form.Label>
                                        <Form.Control type='text' value={this.state.PhoneNumber} onChange={this.ValidateCharacter} maxLength="30" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblEmail"></Form.Label>
                                        <Form.Control id="txtEmail" type='email' value={this.state.Email} onkeyup="this.value=Numeros(this.value)" onChange={(data) => { this.setState({ Email: data.target.value }) }} maxLength="50" required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 25, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-4">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                    </div>
                );
                break;
            case 2:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-6">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblRegistrationForm"><strong className="font-weight-bold darkGreen"></strong></h3>
                                    <h3 id="lblBusinessInformation" className="font-weight-normal primary"></h3>
                                    <Form.Group>
                                        <Form.Label id="lblProponentType"></Form.Label>
                                        <Form.Control as='select' value={this.state.ProponentType} onChange={(data) => { this.setState({ ProponentType: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option id="opcMaker" value='1'>Maker</option>
                                            <option id="opcDistributor" value='2'>Distributor</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger overlay={<Tooltip id={`tooltip`}>https://www.example.com.co</Tooltip>}>
                                            <Form.Label id="lblWebSite"></Form.Label>
                                        </OverlayTrigger>
                                        <Form.Control type='url' value={this.state.WebSite} onChange={(data) => { this.setState({ WebSite: data.target.value }) }} maxLength="100" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="d-flex">
                                        <Col className="mb-6">
                                            <OverlayTrigger overlay={<Tooltip id={`tooltip`}>SIPROE: Sistema de proveedores de Ecopetrol </Tooltip>}>
                                                <Form.Label id="lblSIPROEOption"></Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control as="select" value={this.state.SIPROEOption} onChange={e => this.ConfirmSIPROE(e)} required>
                                                <option id="opcSelect" value="" selected></option>
                                                <option value="False">No</option>
                                                <option id="opcYes" value="True">Yes</option>
                                            </Form.Control>
                                        </Col>
                                        <Col id="colIDSIPROE">
                                            <Form.Group>
                                                <Form.Label id="lblIDSIPROE">ID SIPROE</Form.Label>
                                                <Form.Control id="txtIDSIPROE" type='text' maxLength="100" value={this.state.IDSIPROE} onChange={(data) => { this.setState({ IDSIPROE: data.target.value }) }} required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Form.Group>
                                        <Form.Group>
                                            <Form.Label>SIPROE File</Form.Label>
                                            <div style={styles}>
                                                <Col xs={5}>
                                                    <label className="custom-file-upload">
                                                        <input type="file" onChange={this.onChangeSIPROEFile} />
                                                        <FontAwesomeIcon icon={faPaperclip} /> Attach
                                                        </label>
                                                </Col>
                                                <Col xs={10}>
                                                    {this.state.SIPROEFile.map(x => {
                                                        if (x.name == null) {
                                                            return (<div className="file-preview">{x.FileName} <FontAwesomeIcon icon={faTrash} onClick={this.removeSIPROEFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>)
                                                        } else {
                                                            return (<div className="file-preview">{x.name} <FontAwesomeIcon icon={faTrash} onClick={this.removeSIPROEFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>)
                                                        }
                                                    })}
                                                </Col>
                                            </div>
                                        </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center' }}>
                                        <Col className="col-md-4">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-4">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                    </div>
                );
                break;
            case 3:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-6 mb-5">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblRegistrationForm"><strong className="font-weight-bold darkGreen"></strong></h3>
                                    <h3 id="lblTechnologyInformation" className="font-weight-normal primary"></h3>
                                    <Form.Group>
                                        <Form.Label id="lblTechnologyName"></Form.Label>
                                        <Form.Control id="txtTechnologyName" as="textarea" value={this.state.TechnologyName} onChange={(data) => { this.setState({ TechnologyName: data.target.value }) }} maxLength="300" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblTechnologyObject"></Form.Label>
                                        <Form.Control id="txtTechnologyObject" as="textarea" rows="2" value={this.state.TechnologyObject} onChange={(data) => { this.setState({ TechnologyObject: data.target.value }) }} maxLength="1000" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblFunctionality"></Form.Label>
                                        <Form.Control id="txtFunctionality" as="textarea" rows="2" value={this.state.Functionality} onChange={(data) => { this.setState({ Functionality: data.target.value }) }} maxLength="1000" required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblValuePromise"></Form.Label>
                                        <Form.Control id="txtValuePromise" as="textarea" rows="2" value={this.state.ValuePromise} onChange={(data) => { this.setState({ ValuePromise: data.target.value }) }} maxLength="1000" required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 25, justifyContent: 'center' }}>
                                        <Col className="col-md-4">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-4">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                    </div>
                );
                break;
            case 4:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-6">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.UpdateForm}>
                                    <h3 id="lblRegistrationForm"><strong className="font-weight-bold darkGreen"></strong></h3>
                                    <h3 id="lblTechnologyInformation" className="font-weight-normal primary"></h3>

                                    <Form.Group>
                                        <OverlayTrigger overlay={this.TooltipSegment()}>
                                            <Form.Label id="lblApplicationSegment"></Form.Label>
                                        </OverlayTrigger>
                                        <Form.Control as='select' value={this.state.ApplicationSegment} onChange={(data) => { this.setState({ ApplicationSegment: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            {this.state.SegmentList.map((segmento) => {
                                                return (<option value={segmento.cod} selected>{segmento.segmentName}</option>);
                                            }
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <OverlayTrigger overlay={this.TooltipArea()}>
                                            <Form.Label id="lblSpecificApplicationArea"></Form.Label>
                                        </OverlayTrigger>
                                        <Form.Control as='select' value={this.state.SpecificApplicationArea} onChange={(data) => { this.setState({ SpecificApplicationArea: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            {this.state.AreaList.map((area) => {
                                                if (area.applicationSegment == this.state.ApplicationSegment) {
                                                    return (<option value={area.cod} selected>{area.areaName}</option>);
                                                }
                                            }
                                            )}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblMaturityLevel"></Form.Label>
                                        <Form.Label style={{ textAlign: "justify", fontSize: "small"}} id="pMadurez"></Form.Label>
                                        <div class="cajaselect" onClick={this.ViewMaturityList}>
                                            <span class="seleccionado"><label>{this.state.MaturityText}</label></span>
                                            <ul class="listaselect">
                                                <li value="1" id="opcMaturityLvl1" onClick={(e) => this.SelectMaturity(e)}>1</li>
                                                <li value="2" id="opcMaturityLvl2" onClick={(e) => this.SelectMaturity(e)}>2</li>
                                                <li value="3" id="opcMaturityLvl3" onClick={(e) => this.SelectMaturity(e)}>3</li>
                                                <li value="4" id="opcMaturityLvl4" onClick={(e) => this.SelectMaturity(e)}>4</li>
                                                <li value="5" id="opcMaturityLvl5" onClick={(e) => this.SelectMaturity(e)}>5</li>
                                                <li value="6" id="opcMaturityLvl6" onClick={(e) => this.SelectMaturity(e)}>6</li>
                                                <li value="7" id="opcMaturityLvl7" onClick={(e) => this.SelectMaturity(e)}>7</li>
                                                <li value="8" id="opcMaturityLvl8" onClick={(e) => this.SelectMaturity(e)}>8</li>
                                                <li value="9" id="opcMaturityLvl9" onClick={(e) => this.SelectMaturity(e)}>9</li>
                                            </ul>
                                            <span class="trianguloinf"></span>
                                        </div>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblAttachInformation"></Form.Label>
                                        <Form.Label style={{ textAlign: "justify", fontSize: "small" }} id="pAttach"></Form.Label>
                                        <div style={styles}>
                                            <Col xs={5}>
                                                <label className="custom-file-upload">
                                                    <input type="file" multiple onChange={this.onChange} accept="application/pdf" />
                                                    <FontAwesomeIcon icon={faPaperclip} /> Attach
                                            </label>
                                            </Col>
                                            <Col xs={10}>
                                                {this.state.files.map(x =>
                                                    <div className="file-preview">{x.name} <FontAwesomeIcon icon={faTrash} onClick={this.removeFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>
                                                )}
                                            </Col>
                                        </div>
                                    </Form.Group>
                                    <Row style={{ marginTop: 25, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-4">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-4">
                                            <Button id="btnSend" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                    </div>
                );
        }
    }
}
export default Register;