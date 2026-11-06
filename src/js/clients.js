import {creerDemo} from "./demo.js";
import { data } from "./main.js";
import { soldclient, moneydispo, moneyformat } from "./calculs.js";
import { afficherHistorique } from "./operation.js";
let templateClient = document.querySelector("#modele-client");
let list = document.getElementById("liste-clients");
let emptyShamp = document.getElementById("etat-vide");
let addclientBtn = document.getElementById("nouveau-client");
let dialogClient = document.getElementById("dialog-client");
let dialogCloseBtn = document.getElementById("client-annuler");
let formClient = document.getElementById("form-client");
let nbClients = document.getElementById("nb-clients");
let confirmationDialog = document.getElementById("dialog-confirmation");
let confirmationValidateBtn = document.getElementById("confirmation-valider");
let confirmationCancelBtn = document.getElementById("confirmation-annuler");

// add client form fields
let clientNom = document.getElementById("client-nom");
let clientTelephone = document.getElementById("client-telephone");
let clientPlafond = document.getElementById("client-plafond");

// add client form error messages
let nomErreur = document.getElementById("client-nom-erreur");
let telErreur = document.getElementById("client-telephone-erreur");
let plafondErreur = document.getElementById("client-plafond-erreur");

let ficheClient = document.querySelector("#fiche-client");
let ficheNom = document.querySelector("#fiche-nom");
let ficheTelephone = document.querySelector("#fiche-telephone");
let ficheFermer = document.querySelector("#fiche-fermer");
let ficheSolde = document.querySelector("#fiche-solde");
let fichePlafond = document.querySelector("#fiche-plafond");
let ficheDisponible = document.querySelector("#fiche-disponible");

export function setClientsList(clients) {
    if (Array.isArray(clients)) {
        data.clients = clients;
    }
    localStorage.setItem("karni", JSON.stringify(data));
}

// this is the main function that will be called from main.js to initialize the clients module
export function intiClients() { 
    showExistsClients();
    
    // show the dialog when the user clicks on the "nouveau client" button
    addclientBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dialogClient.dataset.mode = "add";
        dialogClient.showModal();
    });

    // close the dialog when the user clicks on the "annuler" button
    dialogCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formClient.reset();
        dialogClient.close();
    });

    // add new client on form submit
    formClient.addEventListener("submit", (e) => {
        e.preventDefault();

        let clientData = takeClientData();
        let {nomvalid, telvalid, plafondvalid} = validateClientData(clientData);

        if (!nomvalid || !telvalid || !plafondvalid) {
            showInvalidFieldsAddClient({nomvalid, telvalid, plafondvalid});
            return;
        }

        addClient(clientData);
        formClient.reset();
        dialogClient.close();
    });

    // handle update and delete buttons in the client list
    list.addEventListener("click", (e) => {
        e.preventDefault();
    
        let btnUpdate = e.target.closest('[data-action="modifier-client"]');
        let btnDelete = e.target.closest('[data-action="supprimer-client"]');
        let btnOpen = e.target.closest('[data-action="ouvrir-fiche"]');
        if (btnOpen) {
    let el = btnOpen.closest("[data-client-id]");
    if (!el) return;

    let clientId = el.dataset.clientId;

    clientSelectionne = data.clients.find(
        (clt) => clt.id === clientId
    );
    if (!clientSelectionne)return;
    afficherHistorique();
    const solde = soldclient(
    clientSelectionne.id,
    data.operations
);
ficheSolde.textContent = moneyformat(solde);
    ficheNom.textContent = clientSelectionne.nom;
    ficheTelephone.textContent = clientSelectionne.telephone || "Non renseigné";
    ficheClient.showModal();
        } else if (btnUpdate) {
            let el = btnUpdate.closest("[data-client-id]");
            if (!el) return;
        
            let clientId = el.dataset.clientId;
        
            if (data.clients.find((clt) => clt.id === clientId)) {
                dialogClient.dataset.mode = "update";
                dialogClient.dataset.clientId = clientId;
                bringDataToDialog(clientId);
            }
        
        } else if (btnDelete) {

            let el = btnDelete.closest("[data-client-id]");
            if (!el) return;

            confirmationDialog.showModal();
            confirmationValidateBtn.dataset.clientId = el.dataset.clientId;
        }
    });

    // handle the confirmation dialog buttons
confirmationValidateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const operationId = confirmationValidateBtn.dataset.operationId;
    const clientId = confirmationValidateBtn.dataset.clientId;

    if (operationId) {
        data.operations = data.operations.filter(
            op => op.id !== operationId
        );
        localStorage.setItem("karni", JSON.stringify(data));
        delete confirmationValidateBtn.dataset.operationId;
        afficherHistorique();
    } else if (clientId) {
        deleteClient(clientId);
        delete confirmationValidateBtn.dataset.clientId;
    }
    confirmationDialog.close();
});
confirmationCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    delete confirmationValidateBtn.dataset.operationId;
    delete confirmationValidateBtn.dataset.clientId;
    confirmationDialog.close();
});
// show the existing clients in the list
export function showExistsClients(clientsToDisplay = data.clients) {
    clientsToDisplay = clientsToDisplay || [];

    if (clientsToDisplay.length === 0) {
        emptyShamp.classList.remove("hidden");
    } else {
        emptyShamp.classList.add("hidden");
    }

    list.innerHTML = "";

    
    clientsToDisplay.forEach((clt) => {
        let clone = templateClient.content.cloneNode(true);
    
        clone.querySelector(".client-nom").textContent = clt.nom;
        clone.querySelector(".client-telephone").textContent = clt.telephone || "Non renseigné";
        clone.querySelector(".client-solde").textContent = clt.plafond && clt.plafond !== "Non renseigné" ? clt.plafond + " DH" : "Non renseigné";
        clone.querySelector("[data-client-id]").dataset.clientId = clt.id;
        list.appendChild(clone);
    });

    nbClients.textContent = clientsToDisplay.length;
}

// take the client data from the form and return it as an object
function takeClientData() {
    return {
        id: "c-" + Math.random() + Date.now(),
        nom: clientNom.value.trim(),
        telephone: clientTelephone.value.trim(),
        plafond: clientPlafond.value.trim(),
        creeLe: Date.now(),
    };
}

// add new client to the list or update it
function addClient(client) {

    if (dialogClient.dataset.mode === "update") {
        data.clients = data.clients.filter((clt) => clt.id !== dialogClient.dataset.clientId);
    }
    
    data.clients.push(client);
    setClientsList(data.clients);
    showExistsClients();
}

// validate the client data before adding it to the list
export function validateClientData(client) {
    if (!client?.telephone || (typeof client.telephone === "string" && client.telephone.trim() === "")) {
        client.telephone = "Non renseigné";
    }
    if (!client?.plafond || (typeof client?.plafond === "string" && client.plafond.trim() === "")) {
        client.plafond = "Non renseigné";
    }

    let nomvalid = Boolean(client?.nom && typeof client?.nom === "string" && client.nom.trim().length > 0); 
    let telvalid = client?.telephone === "Non renseigné" || (typeof client?.telephone === "string" && client.telephone.length >= 2 && /^\d+$/.test(client.telephone));
    let plafondvalid = typeof client?.plafond === "number" || client?.plafond === "Non renseigné" || (typeof client.plafond === "string" && /^\d+$/.test(client.plafond));
    
    return {nomvalid, telvalid, plafondvalid};
}

// show the invalid fields in the form
function showInvalidFieldsAddClient({nomvalid, telvalid, plafondvalid}) {

    if (!nomvalid) {
        clientNom.classList.add("champ-invalide");
        nomErreur.textContent = "Nom invalide.";
        nomErreur.classList.remove("hidden");
    } else {
        clientNom.classList.remove("champ-invalide");
        nomErreur.textContent = "";
        nomErreur.classList.add("hidden");
    }

    if (!telvalid) {
        clientTelephone.classList.add("champ-invalide");
        telErreur.textContent = "Téléphone invalide.";
        telErreur.classList.remove("hidden");
    } else {
        clientTelephone.classList.remove("champ-invalide");
        telErreur.textContent = "";
        telErreur.classList.add("hidden");
    }

    if (!plafondvalid) {
        clientPlafond.classList.add("champ-invalide");
        plafondErreur.textContent = "Plafond invalide.";
        plafondErreur.classList.remove("hidden");
    } else {
        clientPlafond.classList.remove("champ-invalide");
        plafondErreur.textContent = "";
        plafondErreur.classList.add("hidden");
    }
}

function bringDataToDialog(clientId) {
    let client = data.clients.find((clt) => clt.id === clientId);
    if (client) {
        clientNom.value = client.nom;
        clientTelephone.value = client.telephone && client.telephone !== "Non renseigné" ? client.telephone : "";
        clientPlafond.value = client.plafond && client.plafond !== "Non renseigné" ? client.plafond : "";
        dialogClient.showModal();
    }
}


function deleteClient(clientId) {
    data.clients = data.clients.filter((clt) => clt.id !== clientId);
    list.innerHTML = "";
    setClientsList(data.clients);
    showExistsClients();
}

// get the karni data from localStorage or create demo data if not present
export function localStorageCarni() {
    let karni = localStorage.getItem("karni");

    // if undefind return demo data
    if (!karni) {
        let d = creerDemo();
        localStorage.setItem("karni", JSON.stringify(d));
        return d;
    }
    try {
        let data = JSON.parse(karni);
        // if it is valid return the clients array
        if (data && Array.isArray(data.clients) && data.clients.length > 0) {
            return data;
        }
    } catch {}
    return { clients : [] };
}
export let clientSelectionne = null;