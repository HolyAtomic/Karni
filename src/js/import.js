import { showExistsClients, validateClientData, setClientsList } from "./clients.js";

export function importCarni() {
  let importBtn = document.getElementById("importer");
  let fileInput = document.getElementById("import-fichier");

  // trigger click when the button is clicked
  importBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // handle file input change when the file is selected
  fileInput.addEventListener("change", () => {
    let file = fileInput?.files[0];
    if (!file) return;

    let r = new FileReader();
    r.readAsText(file);

    // after the file is read, parse the JSON and handle the data to the application
    r.onload = (e) => {
      try {
        let d = JSON.parse(e.target.result);
        if (!isValidData(d)) {
            console.log("is not valid data");
        } 
        else {
            localStorage.setItem("karni", JSON.stringify(d));
            setClientsList(d.clients);
            showExistsClients(d.clients);
        }
      } finally {
        fileInput.value = "";
      }
    };
  });
}


function isValidData(data) { 
    return data
        && Array.isArray(data.clients)
        && data.clients.every(client => {
            let { nomvalid, telvalid, plafondvalid } = validateClientData(client);

            return (
                typeof client.id === "string" &&
                nomvalid &&
                telvalid &&
                plafondvalid &&
                typeof client.creeLe === "string"
            );
    });
}