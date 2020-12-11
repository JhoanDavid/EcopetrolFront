import React, { Component } from "react";
import { Card, Container, Col, Form, Button, ButtonGroup, Tooltip, OverlayTrigger, Modal, Row } from 'react-bootstrap';
import Login from './login';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import jsonLang from "./Translate";
import config from 'react-global-configuration';
import Authentication from './services/Authentication.service';
import InsertForm from "./services/InsertForm.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    display: 'flex',
};

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            Id: Authentication.currentUserValue.data.id,
            BusinessName: Authentication.currentUserValue.data.businessName,
            ContactName: Authentication.currentUserValue.data.contactName,
            Email: Authentication.currentUserValue.data.email,
            PhoneNumber: Authentication.currentUserValue.data.phoneNumber,
            TechnologyName: Authentication.currentUserValue.data.technologyName,
            SpecificApplicationArea: Authentication.currentUserValue.data.specificApplicationArea,
            ProposalState: Authentication.currentUserValue.data.proposalState,
            AreaList: [],
            FormPhoneFax: '',
            EvaluationRequestDate: '',
            FormPosition: '',
            FormAddress: '',
            FormNombreTec: '',
            FormCompatibilidadPros: 'False',
            FormSolProblComun: 'False',
            FormCompatibilidadSI: 'False',
            FormHomologa: 'False',
            FormRespNecesidad: 'False',
            FormVentajasDesventajas: '',
            FormEmpresasRecUso: '',
            FormUsuariosPotenciales: '',
            FormOtrosProcesos: '',
            FormDificultades: '',
            FormAspectos: '',
            FormDentroProcesos: '',
            FormParaNegocio: '',
            FormRiesgos: '',
            FormDisponibilidad: '',
            FormVisitas: '',
            FormDisponibilidadEstudios: 'False',
            FormEvidencia: 'False',
            FormIndicadores: '',
            FormResultadosAplicables: 'False',
            FormFactoresModificar: '',
            FormMejorarICPPruebasWebFront: '',
            FormCambioProductivo: 'False',
            FormAdicionarPersonal: '',
            FormNecesidadMantenimiento: '',
            FormInventarioSuficiente: '',
            FormProcedimientoInterno: '',
            FormCambioOperacion: '',
            FormImplicaciones: '',
            FormAfectaMedioAmbiente: '',
            FormConsecuenciaMABaja: '',
            FormPropiedadIntelectual: '',
            FormEstadosTramites: '',
            FormAspectosProtegibles: '',
            FormNegociacionPropiedad: '',
            Reason: '',
            ItemCode: Authentication.currentUserValue.data.itemCode,
            Formvalidated: false,
            files: [],
            Language: config.get('Language'),
            Show: false
        };
    }

    componentDidMount = async () => {
        this.GetAreas();
        this.GetFiles();
        this.loadFormLanguage();
        var varDate = new Date();
        //var strDate = varDate.toUTCString();
        var strDate = varDate.getDate() + "-" + parseInt(varDate.getMonth() + 1) + "-" + varDate.getFullYear() + " " + varDate.getHours()+":"+varDate.getMinutes();
        this.setState({ EvaluationRequestDate: strDate });
        var json = await InsertForm.GetDetailForm(this.state.Id);
        if (json.type == "Success") {
            var jsonDetailForm = json.data
            console.log(jsonDetailForm)
            this.setState({
                FormPosition: jsonDetailForm.fPosition,
                FormAddress: jsonDetailForm.fAddress,
                FormNombreTec: jsonDetailForm.fTechnologyNameCaract,
                FormCompatibilidadPros: jsonDetailForm.fProsCompatibility,
                FormSolProblComun: jsonDetailForm.fSolComunProblem,
                FormCompatibilidadSI: jsonDetailForm.fisCompatibility,
                FormHomologa: jsonDetailForm.fHomologation,
                FormRespNecesidad: jsonDetailForm.fAnswerNeed,
                FormVentajasDesventajas: jsonDetailForm.fAdvantageDisadventage,
                FormEmpresasRecUso: jsonDetailForm.fCompanyRecommendUse,
                FormUsuariosPotenciales: jsonDetailForm.fPotencialUsers,
                FormOtrosProcesos: jsonDetailForm.fOtherProcess,
                FormDificultades: jsonDetailForm.fDifficulties,
                FormAspectos: jsonDetailForm.fAspects,
                FormDentroProcesos: jsonDetailForm.fIntoProcess,
                FormParaNegocio: jsonDetailForm.fForBusiness,
                FormRiesgos: jsonDetailForm.fRisk,
                FormDisponibilidad: jsonDetailForm.fAvailability,
                FormVisitas: jsonDetailForm.fVisits,
                FormDisponibilidadEstudios: jsonDetailForm.fStudyAvailability,
                FormEvidencia: jsonDetailForm.fEvidence,
                FormIndicadores: jsonDetailForm.fIndicators,
                FormResultadosAplicables: jsonDetailForm.fAdequateResults,
                FormFactoresModificar: jsonDetailForm.fFactorsToModify,
                FormMejorarICPPruebasWebFront: jsonDetailForm.fImproveProductivity,
                FormCambioProductivo: jsonDetailForm.fProductiveChange,
                FormAdicionarPersonal: jsonDetailForm.fAddStaff,
                FormNecesidadMantenimiento: jsonDetailForm.fMaintenanceNeed,
                FormInventarioSuficiente: jsonDetailForm.fSufficientInventory,
                FormProcedimientoInterno: jsonDetailForm.fInternalProcedure,
                FormCambioOperacion: jsonDetailForm.fOperationChange,
                FormImplicaciones: jsonDetailForm.fImplications,
                FormAfectaMedioAmbiente: jsonDetailForm.fAffectsEnvironment,
                FormConsecuenciaMABaja: jsonDetailForm.faStopConsecuences,
                FormPropiedadIntelectual: jsonDetailForm.fIntellectualProperty,
                FormEstadosTramites: jsonDetailForm.fStatesProcedures,
                FormAspectosProtegibles: jsonDetailForm.fProtectableAspects,
                FormNegociacionPropiedad: jsonDetailForm.fPropertyNegotiation,
                FormPhoneFax: jsonDetailForm.fPhoneFax
            });
        }
    }

    GetAreas = async () => {
        var list = await InsertForm.GetList("tbl_SpecificApplicationArea");
        this.setState({ AreaList: list });
    }

    componentDidUpdate = () => {
        this.loadFormLanguage();
    }

    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
    };

    prevStep = () => {
        const { step } = this.state;
        this.setState({ step: step - 1 });
    };

    loadFormLanguage = () => {
        var arrayItems = jsonLang[config.get('Language')]["FormGNTF17"];
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

        if (config.get('Language') == 'ES') {
            for (var i = 2; i <= 9; i++) {
                $('#' + 'opcYes' + i + "").html("Si");
            }
        } else {
            for (var i = 2; i <= 9; i++) {
                $('#' + 'opcYes' + i + "").html("Yes");
            }
        }

    }

    handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (form.checkValidity() === true) {
            InsertForm.UpdateFormDetail(this.state.Id,
                this.state.FormPosition,
                this.state.FormAddress,
                this.state.FormNombreTec,
                this.state.FormCompatibilidadPros,
                this.state.FormSolProblComun,
                this.state.FormCompatibilidadSI,
                this.state.FormHomologa,
                this.state.FormRespNecesidad,
                this.state.FormVentajasDesventajas,
                this.state.FormEmpresasRecUso,
                this.state.FormUsuariosPotenciales,
                this.state.FormOtrosProcesos,
                this.state.FormDificultades,
                this.state.FormAspectos,
                this.state.FormDentroProcesos,
                this.state.FormParaNegocio,
                this.state.FormRiesgos,
                this.state.FormDisponibilidad,
                this.state.FormVisitas,
                this.state.FormDisponibilidadEstudios,
                this.state.FormEvidencia,
                this.state.FormIndicadores,
                this.state.FormResultadosAplicables,
                this.state.FormFactoresModificar,
                this.state.FormMejorarICPPruebasWebFront,
                this.state.FormCambioProductivo,
                this.state.FormAdicionarPersonal,
                this.state.FormNecesidadMantenimiento,
                this.state.FormInventarioSuficiente,
                this.state.FormProcedimientoInterno,
                this.state.FormCambioOperacion,
                this.state.FormImplicaciones,
                this.state.FormAfectaMedioAmbiente,
                this.state.FormConsecuenciaMABaja,
                this.state.FormPropiedadIntelectual,
                this.state.FormEstadosTramites,
                this.state.FormAspectosProtegibles,
                this.state.FormNegociacionPropiedad,
                this.state.FormPhoneFax,
                this.state.ProposalState);
            this.nextStep();
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({ validated: true });
    }

    SendForm = async event => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            var response = await InsertForm.UpdateFormDetail(this.state.Id,
                this.state.FormPosition,
                this.state.FormAddress,
                this.state.FormNombreTec,
                this.state.FormCompatibilidadPros,
                this.state.FormSolProblComun,
                this.state.FormCompatibilidadSI,
                this.state.FormHomologa,
                this.state.FormRespNecesidad,
                this.state.FormVentajasDesventajas,
                this.state.FormEmpresasRecUso,
                this.state.FormUsuariosPotenciales,
                this.state.FormOtrosProcesos,
                this.state.FormDificultades,
                this.state.FormAspectos,
                this.state.FormDentroProcesos,
                this.state.FormParaNegocio,
                this.state.FormRiesgos,
                this.state.FormDisponibilidad,
                this.state.FormVisitas,
                this.state.FormDisponibilidadEstudios,
                this.state.FormEvidencia,
                this.state.FormIndicadores,
                this.state.FormResultadosAplicables,
                this.state.FormFactoresModificar,
                this.state.FormMejorarICPPruebasWebFront,
                this.state.FormCambioProductivo,
                this.state.FormAdicionarPersonal,
                this.state.FormNecesidadMantenimiento,
                this.state.FormInventarioSuficiente,
                this.state.FormProcedimientoInterno,
                this.state.FormCambioOperacion,
                this.state.FormImplicaciones,
                this.state.FormAfectaMedioAmbiente,
                this.state.FormConsecuenciaMABaja,
                this.state.FormPropiedadIntelectual,
                this.state.FormEstadosTramites,
                this.state.FormAspectosProtegibles,
                this.state.FormNegociacionPropiedad,
                this.state.FormPhoneFax,
                "Análisis Detallado");
            console.log(response);
            if (response.status == 200) {
                this.Redirect();
            }
        }
        this.setState({ validated: true });
    }

    WithdrawForm = async (Id, RejectionObs) => {
        const requestOptions = {
            method: 'POST',
            headers: Authentication.authHeader(),
            body: JSON.stringify({ Id, RejectionObs })
        }
        try {
            const json = await fetch(Authentication.ApiLink + '/users/desist', requestOptions).then(response => response.json())
            if (json.type == "Success") {
                var objUser = Authentication.currentUserValue;
                objUser.data.proposalState = 'Cerrado';
                Authentication.updateLocalStorage(objUser);
                config.get('Language') == "ES" ? alert("Operación realizada con éxito") : alert("task completed successfully");
                this.Redirect();
            }
        } catch (error) {
            console.log(error);
        }
        this.setState({ Show: false })
    }

    DesistModal() {
        return (<Modal show={this.state.Show} onHide={() => this.setState({ Show: false })}>
            <Modal.Header closeButton>
                <Modal.Title><h3 id="lblDesist"></h3></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label id="lblReason"></Form.Label>
                        <Form.Control as='textarea' value={this.state.Reason} onChange={(data) => { this.setState({ Reason: data.target.value }) }} required></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                
                <Col className="col-md-3">
                        <Button className="buttonStyleYellow" variant="warning" size="sm" onClick={() => this.setState({ Show: false })} block>Cancel</Button>
                    </Col>
                <Col className="col-md-3">
                        <Button id="btnDesist2" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.WithdrawForm(this.state.Id, this.state.Reason)} block>Desist</Button>
                    </Col>
                
            </Modal.Footer>
        </Modal>)
    }

    //funciones de manejo de archivos
    onChangeFile = async (e) => {
        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        await this.setState({ files: [...this.state.files, ...filesArr] });
        InsertForm.InsertFile(this.state.files, this.state.ItemCode);
    }

    removeFile(f) {
        InsertForm.DeleteFile(this.state.ItemCode, f.FileName);
        this.setState({ files: this.state.files.filter(x => x !== f) });
    }


    GetFiles = async () => {
        var arrayfiles = await InsertForm.GetFile(this.state.ItemCode);
        await this.setState({ files: arrayfiles })
    }

    //fin de funciones de manejo de archivos

    Redirect = () => {
        ReactDOM.render(<Login />, document.getElementById('Content'));
    }


    render() {
        switch (this.state.step) {
            case 1:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblCompletionInstructions" className="font-weight-normal primary"></h3>

                                    <Form.Group>
                                        <Form.Label id="lblInstructions" className="font-weight-normal" style={{ textAlign: "justify" }}></Form.Label>
                                    </Form.Group>
                                    <Row>
                                        <Col className="mb-7">
                                            <Form.Group>
                                                <Form.Label id="lblProponent"></Form.Label>
                                                <Form.Control type='text' value={this.state.BusinessName} onChange={(data) => { this.setState({ BusinessName: data.target.value }) }} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblPresentedBy"></Form.Label>
                                                <Form.Control type='text' value={this.state.ContactName} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblEmail">Email</Form.Label>
                                                <Form.Control type='text' value={this.state.Email} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblPosition">Cargo:</Form.Label>
                                                <Form.Control type='text' value={this.state.FormPosition} onChange={(data) => { this.setState({ FormPosition: data.target.value }) }} required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="idCelphoneNumber">Celular:</Form.Label>
                                                <Form.Control type='text' value={this.state.PhoneNumber} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblAddress">Dirección:</Form.Label>
                                                <Form.Control type='text' value={this.state.FormAddress} onChange={(data) => { this.setState({ FormAddress: data.target.value }) }} required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblPhoneFax">Teléfono/Fax:</Form.Label>
                                                <Form.Control type='text' value={this.state.FormPhoneFax} onChange={(data) => { this.setState({ FormPhoneFax: data.target.value }) }} required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <h4 id="lblRequest" className="font-weight-normal primary">Solicitud de Evaluación de Tecnología</h4>

                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblTechnologyName">Nombre de la tecnología:</Form.Label>
                                                <Form.Control type='text' value={this.state.TechnologyName} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblArea">Área:</Form.Label>
                                                <Form.Control as='select' value={this.state.SpecificApplicationArea} onChange={(data) => { this.setState({ SpecificApplicationArea: data.target.value }) }} disabled>
                                                    <option id="opcSelect" value="" selected></option>
                                                    {this.state.AreaList.map((area) => {
                                                            return (<option value={area.cod} selected>{area.areaName}</option>);
                                                    }
                                                    )}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label id="lblRequestDate">Fecha de Solicitud de Evaluación:</Form.Label>
                                                <Form.Control type='text' value={this.state.EvaluationRequestDate} disabled></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>{this.DesistModal()}
                    </div>
                );
            case 2:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblDescripcion" className="font-weight-normal primary">I. Descripción de la tecnología ofrecida </h3>
                                    <Form.Group>
                                        <Form.Label id="FormNombreTec"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormNombreTec} onChange={(data) => { this.setState({ FormNombreTec: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblCompatibilidad"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormCompatibilidadPros"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormCompatibilidadPros} onChange={(data) => { this.setState({ FormCompatibilidadPros: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormCompatibilidadSI"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormCompatibilidadSI} onChange={(data) => { this.setState({ FormCompatibilidadSI: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes2" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblAplicabilidad"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormSolProblComun"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormSolProblComun} onChange={(data) => { this.setState({ FormSolProblComun: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes3" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormRespNecesidad"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormRespNecesidad} onChange={(data) => { this.setState({ FormRespNecesidad: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes4" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormHomologa"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormHomologa} onChange={(data) => { this.setState({ FormHomologa: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes5" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormVentajasDesventajas"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormVentajasDesventajas} onChange={(data) => { this.setState({ FormVentajasDesventajas: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormEmpresasRecUso"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormEmpresasRecUso} onChange={(data) => { this.setState({ FormEmpresasRecUso: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                        {this.DesistModal()}
                    </div>
                );
            case 3:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblCaracteristicas" className="font-weight-normal primary">II. Características Técnicas</h3>
                                    <Form.Group>
                                        <Form.Label id="FormUsuariosPotenciales"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormUsuariosPotenciales} onChange={(data) => { this.setState({ FormUsuariosPotenciales: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormOtrosProcesos"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormOtrosProcesos} onChange={(data) => { this.setState({ FormOtrosProcesos: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblIndicaciones"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormDificultades"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormDificultades} onChange={(data) => { this.setState({ FormDificultades: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormAspectos"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormAspectos} onChange={(data) => { this.setState({ FormAspectos: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblBeneficios"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormDentroProcesos"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormDentroProcesos} onChange={(data) => { this.setState({ FormDentroProcesos: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormParaNegocio"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormParaNegocio} onChange={(data) => { this.setState({ FormParaNegocio: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormRiesgos"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormRiesgos} onChange={(data) => { this.setState({ FormRiesgos: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormDisponibilidad"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormDisponibilidad} onChange={(data) => { this.setState({ FormDisponibilidad: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormVisitas"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormVisitas} onChange={(data) => { this.setState({ FormVisitas: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                        {this.DesistModal()}
                    </div>
                );
            case 4:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblEvidencia" className="font-weight-normal primary">III. Evidencia sobre eficacia, efectividad Y seguridad.</h3>
                                    <Form.Group>
                                        <Form.Label id="FormDisponibilidadEstudios"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormDisponibilidadEstudios} onChange={(data) => { this.setState({ FormDisponibilidadEstudios: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes6" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormEvidencia"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormEvidencia} onChange={(data) => { this.setState({ FormEvidencia: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes7" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormIndicadores"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormIndicadores} onChange={(data) => { this.setState({ FormIndicadores: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormResultadosAplicables"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormResultadosAplicables} onChange={(data) => { this.setState({ FormResultadosAplicables: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes8" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormFactoresModificar"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormFactoresModificar} onChange={(data) => { this.setState({ FormFactoresModificar: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                        {this.DesistModal()}
                    </div>
                );
            case 5:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.handleSubmit}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblEfectos" className="font-weight-normal primary">IV. Efectos en el negocio - empresa</h3>
                                    <Form.Group>
                                        <Form.Label id="FormMejorarICPPruebasWebFront"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormMejorarICPPruebasWebFront} onChange={(data) => { this.setState({ FormMejorarICPPruebasWebFront: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblModificaciones"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormCambioProductivo"></Form.Label>
                                        <Form.Control as='select' value={this.state.FormCambioProductivo} onChange={(data) => { this.setState({ FormCambioProductivo: data.target.value }) }} required>
                                            <option id="opcSelect" value="" selected></option>
                                            <option value="False">No</option>
                                            <option id="opcYes9" value="True">Yes</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormAdicionarPersonal"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormAdicionarPersonal} onChange={(data) => { this.setState({ FormAdicionarPersonal: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormNecesidadMantenimiento"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormNecesidadMantenimiento} onChange={(data) => { this.setState({ FormNecesidadMantenimiento: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormInventarioSuficiente"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormInventarioSuficiente} onChange={(data) => { this.setState({ FormInventarioSuficiente: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormProcedimientoInterno"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormProcedimientoInterno} onChange={(data) => { this.setState({ FormProcedimientoInterno: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormCambioOperacion"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormCambioOperacion} onChange={(data) => { this.setState({ FormCambioOperacion: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormImplicaciones"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormImplicaciones} onChange={(data) => { this.setState({ FormImplicaciones: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblImplicacionLegal"></Form.Label>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormAfectaMedioAmbiente"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormAfectaMedioAmbiente} onChange={(data) => { this.setState({ FormAfectaMedioAmbiente: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormConsecuenciaMABaja"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormConsecuenciaMABaja} onChange={(data) => { this.setState({ FormConsecuenciaMABaja: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnNext" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                        {this.DesistModal()}
                    </div>
                );
            case 6:
                return (
                    <div className="App"><button id="btnTrigger" onClick={() => this.setState({ Translate: !this.state.Translate })}></button>
                        <Card className="text-center ecp-card ecp-login shadow rounded">
                            <Row>
                                <Col sm={11}></Col>
                                <Col sm={1}> <FontAwesomeIcon icon={faTimes} onClick={this.Redirect} style={{ marginTop: '10px' }} /></Col>
                            </Row>
                            <Container className="col-md-9">
                                <Form noValidate validated={this.state.validated} className="mt-4 frm-register" onSubmit={this.SendForm}>
                                    <h3 id="lblForm"><strong className="font-weight-bold darkGreen">Formulario GNT-F-17 Detallado</strong></h3>
                                    <h3 id="lblEstado" className="font-weight-normal primary">V. Estado de la propiedad intelectual de la tecnologia ofrecida</h3>
                                    <Form.Group>
                                        <Form.Label id="FormPropiedadIntelectual"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormPropiedadIntelectual} onChange={(data) => { this.setState({ FormPropiedadIntelectual: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormEstadosTramites"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormEstadosTramites} onChange={(data) => { this.setState({ FormEstadosTramites: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormAspectosProtegibles"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormAspectosProtegibles} onChange={(data) => { this.setState({ FormAspectosProtegibles: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="FormNegociacionPropiedad"></Form.Label>
                                        <Form.Control as='textarea' value={this.state.FormNegociacionPropiedad} onChange={(data) => { this.setState({ FormNegociacionPropiedad: data.target.value }) }} required></Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label id="lblAttachInformation"></Form.Label>
                                        <div style={styles}>
                                            <Col xs={5}>
                                                <label className="custom-file-upload">
                                                    <input type="file" onChange={this.onChangeFile} />
                                                    <FontAwesomeIcon icon={faPaperclip} /> Attach
                                                        </label>
                                            </Col>
                                            <Col xs={10}>
                                                {this.state.files.map(x => {
                                                    if (x.name == null) {
                                                        return (<div className="file-preview">{x.FileName} <FontAwesomeIcon icon={faTrash} onClick={this.removeFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>)
                                                    } else {
                                                        return (<div className="file-preview">{x.name} <FontAwesomeIcon icon={faTrash} onClick={this.removeFile.bind(this, x)} style={{ color: '#BABF15' }} /></div>)
                                                    }
                                                })}
                                            </Col>
                                        </div>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label id="lblNote"></Form.Label>
                                    </Form.Group>
                                    <Row style={{ marginTop: 50, justifyContent: 'center', paddingBottom: 25 }}>
                                        <Col className="col-md-3">
                                            <Button id="btnPrevious" className="buttonStyleYellow" variant="warning" size="sm" onClick={this.prevStep} block></Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnDesist" className="buttonStyleDarkGreen" variant="warning" size="sm" onClick={() => this.setState({ Show: true })} block>Desist</Button>
                                        </Col>
                                        <Col className="col-md-3">
                                            <Button id="btnSend" className="buttonStyleGreen" variant="success" size="sm" type="submit" block></Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                        </Card>
                        {this.DesistModal()}
                    </div>
                );
        }
    }
}
export default Register;