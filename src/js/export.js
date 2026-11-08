import { today } from "./calculs.js";
export function initExport(data) {
    const btn = document.querySelector("#exporter");
    btn.addEventListener("click", () => {
        const dataExport = {
            app: "karni",
            version: 1,
            exporteLe: new Date().toISOString(),
            clients: data.clients,
            operations: data.operations || []
        };
        const json = JSON.stringify(dataExport, null, 2);
        const blob = new Blob([json], {
            type: "application/json"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "karni-" + today() + ".json";
        link.click();
        URL.revokeObjectURL(url);
    });
}