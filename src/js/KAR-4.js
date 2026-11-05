import { creerDemo } from "./demo.js";
import { showExistsClients } from "./clients.js";
const inputRecherche = document.getElementById("recherche");
const tri = document.getElementById("tri");
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
export function trierClients(clients, tri) {
  const copy = [...clients];
  if (tri === "nom") {
    copy.sort((a, b) => a.nom.localeCompare(b.nom));
  }
  return copy;
}

inputRecherche.addEventListener("input", () => {
  const recherche = inputRecherche.value;
  const clientsFiltres = rechercherClients(clients, recherche);
  const clientsTries = trierClients(clientsFiltres, tri.value);
  showExistsClients(clientsTries);
});

tri.addEventListener("change", () => {
  const recherche = inputRecherche.value;
  const clientsFiltres = rechercherClients(clients, recherche);
  const clientsTries = trierClients(clientsFiltres, tri.value);
  showExistsClients(clientsTries);
});
