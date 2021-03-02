'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        if (this.id){
            this.itemAdded = this.model.addNewItem(this.id);
        }
        else{
            this.itemAdded = this.model.addNewItem(undefined);
        }
    }

    undoTransaction() {
        this.model.removeItem(this.itemAdded.id);
        this.id = this.itemAdded.id;
    }
}