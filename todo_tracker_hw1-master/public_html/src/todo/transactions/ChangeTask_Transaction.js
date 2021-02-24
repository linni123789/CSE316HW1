'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeTask_Transaction extends jsTPS_Transaction {
    constructor(initModel,id, newText, oldText) {
        super();
        this.id = id;
        this.newText = newText;
        this.oldText = oldText;
        this.model = initModel;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        this.model.changeTask(this.id,this.newText);
    }

    undoTransaction() {
        this.model.changeTask(this.id,this.oldText);
}
}