import Authentication from './Authentication.service';
import config from 'react-global-configuration';


const InsertForm = {
    insertProponent, UpdateProposal, SendProposal, InsertFile, DeleteFile, UpdateFormDetail, GetDetailForm, SesionValidate, GetList, GetFile, RememberPassword
}


async function insertProponent(contactName, phoneNumber, email, BusinessName, NIT) {
    var proposalState='En Registro'
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
        body: JSON.stringify({ contactName, phoneNumber, email, BusinessName, NIT, proposalState})
    };

    try {
        var response = await fetch(Authentication.ApiLink + '/users/createProponent', requestOptions).then(response => response.json()).then(response => {
            if (response.resp == true) {
                config.get('Language') == "ES" ? alert('Registro realizado satisfactoriamente, se le enviar\u00E1 una notificaci\u00F3n al correo electr\u00F3nico con una contrase\u00F1a generada para el inicio de sesi\u00F3n, esto puede tardar varios minutos.') : alert('Registration completed successfully, a notification will be sent to the email with a password generated for the login');
            return true;
        } else {
            config.get('Language') == "ES" ? alert('Error al completar el Registro') : alert('Failed to complete registration');
            return false;
            }
        })
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function UpdateProposal(contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, proposalIdCode, itemCode, Reactivated,siproeid,siproeOption) {
    const id = Authentication.currentUserValue.data.id;
    const requestOptions = {
        method: 'POST',
        headers: Authentication.authHeader(),
        body: JSON.stringify({ id, contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, siproeid, siproeOption })
    };
    console.log(requestOptions);
    try {
        var response = await fetch(Authentication.ApiLink + '/users/updateProposal', requestOptions);
            if (response.status == 401) {
                config.get('Language') == "ES" ? alert("Sesion Terminada, por favor volver a Iniciar Sesion") : alert('Session ended, please log back in');
                Authentication.logout();
            }
            response=await response.json();
            if (response.type == "Success") {
                response= true;
            } else {
                response= false;
            }
        var objUser = Authentication.currentUserValue;
        objUser.data = { id, contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, proposalIdCode, itemCode, Reactivated, siproeid, siproeOption};
        Authentication.updateLocalStorage(objUser);
        return response;
    } catch (error) {
        console.log(error);
    }
}


async function SendProposal(contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, proposalIdCode, itemCode, objFile, Reactivated, siproeid, siproeOption) {
    const id = Authentication.currentUserValue.data.id;
    const requestOptions = {
        method: 'POST',
        headers: Authentication.authHeader(),
        body: JSON.stringify({ id, contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, siproeid, siproeOption })
    };
    try {
        var response = await fetch(Authentication.ApiLink + '/users/updateProposal', requestOptions);
        if (response.status == 401) {
            config.get('Language') == "ES" ? alert("Sesion Terminada, por favor volver a Iniciar Sesion") : alert('Session ended, please log back in');
            Authentication.logout();
        }
        response = await response.json();
        if (response.type == "Success") {
            response = true;
        } else {
            response = false;
        }
        if (objFile.length != 0) {
            InsertFile(objFile, itemCode);
        }
        var objUser = Authentication.currentUserValue;
        objUser.data = { id, contactName, phoneNumber, email, proponentType, businessName, nit, webSite, technologyName, technologyObject, functionality, valuePromise, applicationSegment, specificApplicationArea, maturityLevel, proposalState, proposalIdCode, itemCode, Reactivated, siproeid, siproeOption };
        Authentication.updateLocalStorage(objUser);
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function InsertFile(objFile, ElementId) {
    var formData = new FormData();

    for (const file of objFile) {
        formData.append('files', file);
    }

    formData.append("ElementId", ElementId);
    const requestOptions = {
        method: 'POST',
        body: formData,
        headers: { 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
    };

    var response = await fetch(Authentication.ApiLink + '/users/uploadFile', requestOptions).then(response => response.json())
    return response;
};

async function UpdateFormDetail(Id, FPosition, FAddress, FTechnologyNameCaract, FProsCompatibility, FSolComunProblem, FISCompatibility, FHomologation, FAnswerNeed, FAdvantageDisadventage, FCompanyRecommendUse, FPotencialUsers, FOtherProcess,
    FDifficulties, FAspects, FIntoProcess, FForBusiness, FRisk, FAvailability, FVisits, FStudyAvailability, FEvidence, FIndicators, FAdequateResults, FFactorsToModify, FImproveProductivity, FProductiveChange, FAddStaff, FMaintenanceNeed,
    FSufficientInventory, FInternalProcedure, FOperationChange, FImplications, FAffectsEnvironment, FAStopConsecuences, FIntellectualProperty,
    FStatesProcedures, FProtectableAspects, FPropertyNegotiation, FPhoneFax, ProposalState) {

    const id = Authentication.currentUserValue.data.id;
    const requestOptions = {
        method: 'POST',
        headers: Authentication.authHeader(),
        body: JSON.stringify({
            Id, FPosition, FAddress, FTechnologyNameCaract, FProsCompatibility, FSolComunProblem, FISCompatibility, FHomologation, FAnswerNeed, FAdvantageDisadventage, FCompanyRecommendUse, FPotencialUsers, FOtherProcess,
            FDifficulties, FAspects, FIntoProcess, FForBusiness, FRisk, FAvailability, FVisits, FStudyAvailability, FEvidence, FIndicators, FAdequateResults, FFactorsToModify, FImproveProductivity, FProductiveChange, FAddStaff, FMaintenanceNeed,
            FSufficientInventory, FInternalProcedure, FOperationChange, FImplications, FAffectsEnvironment, FAStopConsecuences, FIntellectualProperty,
            FStatesProcedures, FProtectableAspects, FPropertyNegotiation, FPhoneFax, ProposalState
        })
    };

    var response = null;
    try {
        response = await fetch(Authentication.ApiLink + '/users/updateFormGMT17', requestOptions).then(response => {
            console.log(response);
            if (response.status == 401) {
                config.get('Language') == "ES" ? alert("Sesion Terminada, por favor volver a Iniciar Sesion") : alert('Session ended, please log back in');
                Authentication.logout();
            }
            else {
                response.json();
                console.log("bien");
                var objUser = Authentication.currentUserValue;
                objUser.data.proposalState = ProposalState;
                Authentication.updateLocalStorage(objUser);
            }
            return response;}
        );
    } catch (error) {
        console.log(error);
        //alert(error);
    }
    return response;
}

async function GetDetailForm(id) {
    const requestOptions = {
        method: 'POST',
        headers: Authentication.authHeader(),
        body: JSON.stringify({ id })
    }
    var json = await fetch(Authentication.ApiLink + '/users/getDetailForm', requestOptions).then(response => response.json())
    return json;
}

function SesionValidate() {
    const requestOptions = {
        method: 'POST',
        headers: Authentication.authHeader(),
    }
    var response = fetch(Authentication.ApiLink + '/users/sesionValidate', requestOptions).then(response => {
        if (response.status == 401) {
            config.get('Language') == "ES" ? alert("Sesion Terminada, por favor volver a Iniciar Sesion") : alert('Session ended, please log back in');
            Authentication.logout();
        }
    })
 }

async function GetList(Table) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
        body: JSON.stringify({ Table })
    };

    try {
        var response = await fetch(Authentication.ApiLink + '/users/GetAll', requestOptions).then(response => response.json())
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function GetFile(ElementId) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
        body: JSON.stringify({ ElementId })
    };

    try {
        var response = await fetch(Authentication.ApiLink + '/users/GetFile', requestOptions).then(response => response.json())
        return response.value;
    } catch (error) {
        console.log(error);
    }
}

async function DeleteFile(ElementId, FileTitle) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
        body: JSON.stringify({ ElementId, FileTitle })
    };

    try {
        var response = await fetch(Authentication.ApiLink + '/users/DeleteFile', requestOptions)
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function RememberPassword(NIT, Email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': Authentication.OcpSubscriptionKey },
        body: JSON.stringify({ NIT, Email })
    };

    try {
        var response = await fetch(Authentication.ApiLink + '/users/RememberPassword', requestOptions)
        return response;
    } catch (error) {
        console.log(error);
    }
}


export default InsertForm;
