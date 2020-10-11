import * as Sortable from "sortablejs"

let shiftContainer = document.getElementById("shiftContainer");
if (shiftContainer) {
    (Sortable as any).create(shiftContainer, {
        handle: ".fa-bars"
    });
}
