'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, id, newDate, oldDate) {
        super();
        this.model = initModel;
        this.id = id;
        this.newDate = newDate;
        this.oldDate = oldDate;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.changeDate(this.id, this.newDate);
    }

    undoTransaction() {
        this.model.changeDate(this.id, this.oldDate);
    }
}