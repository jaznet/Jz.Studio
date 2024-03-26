import { DockNode } from "./DockNode.js";
import { Dialog } from "./Dialog.js";

export class DockModel {
    rootNode: DockNode|null|undefined;
    documentManagerNode: DockNode|undefined;
    dialogs!: Dialog[]

    constructor() {
        this.rootNode = this.documentManagerNode = undefined;
    }
}
