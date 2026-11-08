// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.
import "./KAR-4.js";
import  { intiClients, localStorageCarni } from "./clients.js"
import { importCarni } from "./import.js";
import { initExport } from "./export.js";
export let data = localStorageCarni()

intiClients()
importCarni()
initExport(data)