'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, id, newStatus, oldStatus) {
        super();
        this.model = initModel;
        this.id = id;
        this.newStatus = newStatus;
        this.oldStatus = oldStatus;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.changeStatus(this.id, this.newStatus);
    }

    undoTransaction() {
        this.model.changeStatus(this.id, this.oldStatus);
    }
}