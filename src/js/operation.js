import {soldclient , parsing ,today,clienthistory , moneyformat} from "./calculs.js";
import { clientSelectionne } from "./clients.js";
import { data } from "./main.js";

const montanInput = document.querySelector("#operation-montant")
const dateInput = document.querySelector("#operation-date")
const libelleInput = document.querySelector("#operation-libelle")
const montantErreur = document.querySelector("#operation-montant-erreur");
const dateErreur = document.querySelector("#operation-date-erreur")
const libelleErreur = document.querySelector("#operation-libelle-erreur")
const formOperation = document.querySelector("#form-operation");
const historique = document.querySelector("#historique");
const historiqueVide = document.querySelector("#historique-vide");
const modeleOperation = document.querySelector("#modele-operation");
const dialogConfirmation = document.querySelector("#dialog-confirmation");
const confirmationTitre = document.querySelector("#confirmation-titre");
const confirmationMessage = document.querySelector("#confirmation-message");
const confirmationDetails = document.querySelector("#confirmation-details");
const confirmationValider = document.querySelector("#confirmation-valider");
const ficheSolde = document.querySelector("#fiche-solde");
dateInput.value = today();

function ajouterOperation(){
    const montant = montanInput.value;
    const date = dateInput.value;
    const libelle = libelleInput.value.trim();
    const type = document.querySelector( 'input[name="operation-type"]:checked').value;
    const montantCentimes = parsing(montant)

    if ( montantCentimes === null || montantCentimes < 1 || montantCentimes > 1000000 ){
        montantErreur.textContent = "MOntant invalide;";
        montantErreur.hidden = false;
        return;
    }
    montantErreur.hidden = true;
    if(!date || date > today()){
        dateErreur.textContent = "date invalide."
        dateErreur.hidden = false ;
    return;
    }
    dateErreur.hidden = true;
    if(libelle.length > 60 || (type === "achat" && libelle.length < 2)){
        libelleErreur.textContent = "libellé invalide."
        libelleErreur.hidden = false;
        return;
    }
    libelleErreur.hidden = true;
    if (!clientSelectionne)return
        if (!Array.isArray(data.operations)){
        data.operations=[]
    }
    const soldeActuel = soldclient(clientSelectionne.id,data.operations);
    const plafondCentimes = typeof clientSelectionne.plafond === "number"
    ? clientSelectionne.plafond
    : parsing(String(clientSelectionne.plafond));
    if (type === "achat" && plafondCentimes === null) {
    montantErreur.textContent = "Plafond client invalide.";
    montantErreur.hidden = false;
    return;
    }if (type === "achat" && soldeActuel + montantCentimes > plafondCentimes) {
    montantErreur.textContent = "Plafond dépassé.";
    montantErreur.hidden = false;
    return;
}
montantErreur.hidden = true;
    const operation = {
    id : crypto.randomUUID(),
    clientId : clientSelectionne.id,
    type : type,
    montant : montantCentimes,
    libelle: libelle,
    date: date
    }
    data.operations.push(operation)
    localStorage.setItem("karni", JSON.stringify(data));
    const nouveauSolde = soldclient(clientSelectionne.id,data.operations);
ficheSolde.textContent = moneyformat(nouveauSolde);

afficherHistorique();
afficherHistorique();
}
formOperation.addEventListener("submit", (e) => {
    e.preventDefault();
    ajouterOperation();
});
export function afficherHistorique() {
    const operationsClient = clienthistory(
    clientSelectionne.id,
    data.operations || []
);
    historique.innerHTML = "";
    if (operationsClient.length === 0) {
        historiqueVide.classList.remove("hidden");
        return;
    }
    historiqueVide.classList.add("hidden");
    operationsClient.forEach((operation) => {
        const clone = modeleOperation.content.cloneNode(true);
        clone.querySelector("[data-operation-id]").dataset.operationId = operation.id;
        clone.querySelector(".operation-libelle").textContent = operation.libelle;
        clone.querySelector(".operation-date").textContent = operation.date;
        clone.querySelector(".operation-montant").textContent = moneyformat(operation.montant);
        historique.appendChild(clone);
    });
}historique.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-action="supprimer-operation"]');
    if (!btn) return;
    const element = btn.closest("[data-operation-id]");
    if (!element) return;
    const operationId = element.dataset.operationId;
    const operation = data.operations.find(
        (op) => op.id === operationId
    );
    if (!operation) return;
    confirmationTitre.textContent = "Supprimer cette opération ?";
    confirmationMessage.textContent = "Voulez-vous vraiment supprimer cette opération ?";
    confirmationDetails.textContent = operation.libelle;
    confirmationValider.dataset.operationId = operationId;
    delete confirmationValider.dataset.clientId;
dialogConfirmation.showModal();
});