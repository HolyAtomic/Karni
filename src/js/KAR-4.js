import { creerDemo } from "./demo.js";
import { showExistsClients } from "./clients.js";
const inputRecherche = document.getElementById("recherche");
const donneesDemo = creerDemo();
const clients = donneesDemo.clients;

export function rechercherClients(clients, recherche) {
  const rechercheMinuscule = recherche
    .trim()
    .toLowerCase()  
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return clients.filter((client) =>
    client.nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(rechercheMinuscule),
  );
}

inputRecherche.addEventListener("input", () => {
  const recherche = inputRecherche.value;
  const clientsFiltres = rechercherClients(clients, recherche);
  showExistsClients(clientsFiltres);
});
