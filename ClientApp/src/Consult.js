import React, { Component } from "react";
import { Button, Row, Container, Table, Form, Col,Modal } from 'react-bootstrap';
import './css/App.css';
import $ from 'jquery';
import jsonLang from "./Translate";
import config from 'react-global-configuration';
import Register from './Register';
import ReactDOM from 'react-dom';
import Authentication from './services/Authentication.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faPaperclip, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import InsertForm from './services/InsertForm.service';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    display: 'flex',
};
class Consult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Id: Authentication.currentUserValue.data.id,
            ContactName: Authentication.currentUserValue.data.contactName,
            PhoneNumber: Authentication.currentUserValue.data.phoneNumber,
            Email: Authentication.currentUserValue.data.email,
            ProponentType: Authentication.currentUserValue.data.proponentType,
            NIT: Authentication.currentUserValue.data.nit,
            BusinessName: Authentication.currentUserValue.data.businessName,
            WebSite: Authentication.currentUserValue.data.webSite,
            TechnologyName: Authentication.currentUserValue.data.technologyName,
            TechnologyObject: Authentication.currentUserValue.data.technologyObject,
            Functionality: Authentication.currentUserValue.data.functionality,
            ValuePromise: Authentication.currentUserValue.data.valuePromise,
            ApplicationSegment: Authentication.currentUserValue.data.applicationSegment,
            SpecificApplicationArea: Authentication.currentUserValue.data.specificApplicationArea,
            MaturityLevel: Authentication.currentUserValue.data.maturityLevel,
            ProposalState: Authentication.currentUserValue.data.proposalState,
            ProposalIdCode: Authentication.currentUserValue.data.proposalIdCode,
            ItemCode: Authentication.currentUserValue.data.itemCode,
            Reactivated: Authentication.currentUserValue.data.reactivated,
            IDSIPROE: Authentication.currentUserValue.data.siproeid,
            SIPROEOption: Authentication.currentUserValue.data.siproeOption,
            Date: null,
            display: 'none', Translate: false, Justification: '', Show: false,
            files: [],
            SegmentList: [],
            AreaList: [],
            ShowFileModal:false,
        };
    }

    componentDidMount = () => {
        this.loadFormLanguage();
        $("#FormData").find("input[type='text']").prop("disabled", true);
        $("#FormData").find("select").prop("disabled", true);
        $("#FormData").find("textarea").prop("disabled", true);
        $("#FormData").find("input[type='file']").prop("disabled", true);
        if (this.state.ProposalState == "En Registro") {
            $("#colBtnRegister").show();
        } else {
            $("#colBtnRegister").hide();
        }
        InsertForm.SesionValidate();

        var strDate = null;
        console.log(Authentication.currentUserValue.data.creationDate)
        if (Authentication.currentUserValue.data.creationDate != null) {
            strDate = Authentication.currentUserValue.data.creationDate.split(" ");
            this.setState({ Date: strDate[0] });
        }

        if (this.state.ProposalState.includes("En Recepci")) {
            this.setState({ ProposalState: "En Recepción" });
        }

        if ((this.state.ProposalState == "Rechazado") && (this.state.Reactivated!='True')) {
            $("#btnReactivate").prop("disabled", false);
        } else {
            $("#btnReactivate").prop("disabled", true);
        }
        this.GetAreas();
        this.GetSegments();
        setTimeout(() => {
            this.alertDetailForm()
        }, 2000);
        //this.alertDetailForm();
    }

    alertDetailForm = () => {
        if (this.state.ProposalState.includes("Pendiente")) {
            config.get('Language') == "ES" ? alert("Para continuar con el registro, hacer click en Formulario T&I-F-002 en el menú de la izquierda") : alert("To continue with the registration, click on T&I-F-002 Form in the menu on the left");
        }
    }

    componentDidUpdate = () => {
        this.loadFormLanguage();
    }

    GetAreas = async () => {
        var list = await InsertForm.GetList("tbl_SpecificApplicationArea");
        this.setState({ AreaList: list });
    }

    GetSegments = async () => {
        var list = await InsertForm.GetList("tbl_ApplicationSegment");
        this.setState({ SegmentList: list });
    }

    loadFormLanguage = () => {
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

    ShowData=()=>{
        this.setState({display:'Block'})
    }

    Reactivate = async (Id, RejectionObs) => {
        const requestOptions = {
            method: 'POST',
            headers: Authentication.authHeader(),
            body: JSON.stringify({ Id, RejectionObs })
        }
        try {
            const json = await fetch(Authentication.ApiLink + '/users/Reactivate', requestOptions).then(response=>response.json())
            if (json.type == "Success") {
                var objUser = Authentication.currentUserValue;
                objUser.data.proposalState = 'En Registro';
                objUser.data.reactivated = 'True';
                Authentication.updateLocalStorage(objUser);
                config.get('Language') == "ES" ? alert("Operación realizada con éxito") : alert("task completed successfully");
                this.setState({ Reactivated: 'True' });
                this.setState({ ProposalState: 'En Registro' });
                this.componentDidMount();
            }
        } catch (error) {
            console.log(error);
        }
        this.setState({ Show: false })
    }


    
    ReactivationModal(){
            return (<Modal show={this.state.Show} onHide={() => this.setState({ Show: false })}>
                <Modal.Header closeButton  style={{backgroundColor:'#F2F2F2'}}>
                    <Modal.Title><h3 className="font-weight-normal primary" id="lblReactivation"></h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label id="lblJustification"></Form.Label>
                            <Form.Control as='textarea' value={this.state.Justification} onChange={(data) => { this.setState({ Justification: data.target.value }) }} required></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Col className="col-md-3">
                        <Button className="buttonStyleYellow" variant="warning" size="sm" onClick={() => this.setState({ Show: false })} block>Cancel</Button>
                    </Col>
                    <Col className="col-md-3">
                        <Button id="btnReactivate2" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.Reactivate(this.state.Id, this.state.Justification)} block></Button>
                    </Col>
                </Modal.Footer>
            </Modal>)
    }

    InputFileModal() {
        return (<Modal show={this.state.ShowFileModal} onHide={() => this.setState({ ShowFileModal: false })}>
            <Modal.Header closeButton style={{ backgroundColor: '#F2F2F2' }}>
                <Modal.Title><h3 className="font-weight-normal primary" id="">Insertar Archivo</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={styles}>
                    <Col xs={5}>
                        <label className="custom-file-upload">
                            <input type="file" multiple onChange={this.onChange} accept="application/pdf" />
                            <FontAwesomeIcon icon={faPaperclip} /> Attach
                        </label>
                    </Col>
                    <Col>
                        {this.state.files.map(x =>
                            <div className="file-preview">{x.name} <FontAwesomeIcon icon={faTrash} onClick={this.removeFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>
                        )}
                    </Col>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Col className="col-md-3">
                    <Button className="buttonStyleYellow" variant="warning" size="sm" onClick={() => this.setState({ ShowFileModal: false })} block>Cancel</Button>
                </Col>
                <Col className="col-md-3">
                    <Button id="btnSend" className="buttonStyleDarkGreen" variant="warning" size="sm"onClick={this.SendFiles} block></Button>
                </Col>
            </Modal.Footer>
        </Modal>)
    }

    Redirect = () => {
        if (this.state.Reactivated == 'True') {
            this.setState({ ShowFileModal: true });
        } else {
            ReactDOM.render(<Register />, document.getElementById('Content'));
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

    SendFiles = async () => {
        var response = await InsertForm.SendProposal(this.state.ContactName, this.state.PhoneNumber,
            this.state.Email, this.state.ProponentType, this.state.BusinessName,
            this.state.NIT, this.state.WebSite, this.state.TechnologyName,
            this.state.TechnologyObject, this.state.Functionality, this.state.ValuePromise,
            this.state.ApplicationSegment, this.state.SpecificApplicationArea, this.state.MaturityLevel, 'En Recepción', this.state.ProposalIdCode, this.state.ItemCode, this.state.files, this.state.Reactivated, this.state.IDSIPROE, this.state.SIPROEOption);
        console.log(response);
        if (response) {
            config.get('Language') == "ES" ? alert("Operación realizada con éxito") : alert("task completed successfully");
            this.setState({ ShowFileModal: false });
            this.setState({ ProposalState: 'En Recepción' });
            this.componentDidMount();
        }
    }
    //Fin de Manejo de Archivos

    render() {
        return (
            <Container className="col-md-11 mb-5"><button id="btnTrigger" onClick={()=>this.setState({Translate:!this.state.Translate})}></button>
                <Row className="mt-5">
                    <h3 className="font-weight-normal primary" id="lblProp"> </h3>
                </Row>
                <Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th id="lvlCompany"></th>
                                <th id="lblTec"></th>
                                <th id="lblDate"></th>
                                <th id="lblSegment"></th>
                                <th id="lblArea"></th>
                                <th id="lblState">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.ProposalIdCode}</td>
                                <td>{this.state.BusinessName}</td>
                                <td>{this.state.TechnologyName}</td>
                                <td>{this.state.Date}</td>
                                <td> {this.state.SegmentList.map((segmento) => {
                                    if (segmento.cod == this.state.ApplicationSegment) {
                                        return segmento.segmentName
                                    }
                                })}</td>
                                <td>{this.state.AreaList.map((area) => {
                                    if (area.cod == this.state.SpecificApplicationArea) {
                                        return area.areaName
                                    }
                                }
                                )}</td>
                                <td id="Estado" value={this.state.ProposalState}>{this.state.ProposalState}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
                <Row style={{justifyContent:'center'}}>
                    <Col className="col-md-2" id="colBtnRegister">
                        <Button id="btnRegisterForm" className="buttonStyleGreen" variant="success" text="white" size="sm" onClick={this.Redirect} block> <FontAwesomeIcon icon={faEdit} style={{ margin: '5px' }} /> <p id="pRegisterForm">Continuar</p></Button>
                    </Col>
                    <Col className="col-md-2">
                        <Button id="btnVer" className="buttonStyleYellow" variant="warning" text="white" size="sm" onClick={this.ShowData} block><FontAwesomeIcon icon={faEye} style={{ margin: '5px' }}/><p id="pVer">Ver</p></Button>      
                    </Col>
                    <Col className="col-md-2">
                        <Button id="btnReactivate" className="buttonStyleDarkGreen" variant="warning" text="white" size="sm" onClick={() => this.setState({ Show: true })} block>Reactivate</Button>
                    </Col>
                </Row>
                <Row className="mt-3" id="Data" style={{display:this.state.display}}>
                    <Form id="FormData">
                        <center><h3 id="lblPersonalinformation" className="font-weight-normal primary"></h3></center>
                        <Row>
                            <Col className="mb-7">
                                <Form.Group>
                                    <Form.Label id="lblBusinessName"></Form.Label>
                                    <Form.Control type='text' value={this.state.BusinessName} onChange={(data) => { this.setState({ BusinessName: data.target.value }) }} disabled></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblNIT"></Form.Label>
                                    <Form.Control type='text' value={this.state.NIT} onChange={(data) => { this.setState({ NIT: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblWebSite"></Form.Label>
                                    <Form.Control type='text' value={this.state.WebSite} onChange={(data) => { this.setState({ WebSite: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-7">
                                <Form.Group>
                                    <Form.Label id="lblContactName"></Form.Label>
                                    <Form.Control type='text' value={this.state.ContactName} onChange={(data) => { this.setState({ BusinessName: data.target.value }) }} disabled></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblPhoneNumber"></Form.Label>
                                    <Form.Control type='text' value={this.state.PhoneNumber} onChange={(data) => { this.setState({ NIT: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblProponentType"></Form.Label>
                                    <Form.Control as='select' value={this.state.ProponentType} onChange={(data) => { this.setState({ WebSite: data.target.value }) }} required>
                                        <option id="opcSelect" value="" selected></option>
                                        <option id="opcMaker" value='1'>Maker</option>
                                        <option id="opcDistributor" value='2'>Distributor</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label id="lblSIPROEOption"></Form.Label>
                                <Form.Control as="select" value={this.state.SIPROEOption} onChange={e => this.ConfirmSIPROE(e)} required>
                                    <option id="opcSelect" value="" selected></option>
                                    <option value="False">No</option>
                                    <option id="opcYes" value="True">Yes</option>
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblIDSIPROE">ID SIPROE</Form.Label>
                                    <Form.Control id="txtIDSIPROE" type='text' maxLength="100" value={this.state.IDSIPROE} onChange={(data) => { this.setState({ IDSIPROE: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>

                        <center><h3 className="font-weight-normal primary" id="lblProposal">Información de la Propuesta: </h3></center>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblTechnologyName"></Form.Label>
                                    <Form.Control type='text' value={this.state.TechnologyName} onChange={(data) => { this.setState({ TechnologyName: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblState2"></Form.Label>
                                    <Form.Control type='text' value={ this.state.ProposalState } required></Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblFechaPresentacion">Fecha de Presentación</Form.Label>
                                    <Form.Control type='text' value={this.state.Date} onChange={(data) => { this.setState({ Date: data.target.value }) }} required></Form.Control>
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblTechnologyObject"></Form.Label>
                                    <Form.Control as="textarea" rows="2" value={this.state.TechnologyObject} onChange={(data) => { this.setState({ TechnologyObject: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                            
                        </Row>
                        <Row>
                        <Col>
                                <Form.Group>
                                    <Form.Label id="lblFunctionality"></Form.Label>
                                    <Form.Control as="textarea" rows="2" value={this.state.Functionality} onChange={(data) => { this.setState({ Functionality: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Col>
                                <Form.Group>
                                    <Form.Label id="lblValuePromise"></Form.Label>
                                    <Form.Control as="textarea" rows="2" value={this.state.ValuePromise} onChange={(data) => { this.setState({ ValuePromise: data.target.value }) }} required></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Col>

                                <Form.Group>
                                    <Form.Label id="lblApplicationSegment"></Form.Label>
                                    <Form.Control as='select' value={this.state.ApplicationSegment} onChange={(data) => { this.setState({ ApplicationSegment: data.target.value }) }} required>
                                        <option id="opcSelect" value="" selected></option>
                                        {this.state.SegmentList.map((segmento) => {
                                            return (<option value={segmento.cod} selected>{segmento.segmentName}</option>);
                                        }
                                        )}
                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblSpecificApplicationArea"></Form.Label>
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
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label id="lblMaturityLevel"></Form.Label>
                                    <Form.Control as='select' value={this.state.MaturityLevel} onChange={(data) => { this.setState({ MaturityLevel: data.target.value }) }} required>
                                        <option id="opcSelect" value="" selected></option>
                                        <option value="1" id="opcMaturityLvl1">1</option>
                                        <option value="2" id="opcMaturityLvl2">2</option>
                                        <option value="3" id="opcMaturityLvl3">3</option>
                                        <option value="4" id="opcMaturityLvl4">4</option>
                                        <option value="5" id="opcMaturityLvl5">5</option>
                                        <option value="6" id="opcMaturityLvl6">6</option>
                                        <option value="7" id="opcMaturityLvl7">7</option>
                                        <option value="8" id="opcMaturityLvl8">8</option>
                                        <option value="9" id="opcMaturityLvl9">9</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Row>{this.ReactivationModal()}
                {this.InputFileModal()}
            </Container>
        );
    }
}
export default Consult;