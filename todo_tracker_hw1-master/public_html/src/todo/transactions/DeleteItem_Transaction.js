'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, id, deletedItem, index) {
        super();
        this.model = initModel;
        this.id = id;
        this.item = deletedItem;
        this.index = index;
    }

    doTransaction() {
        this.model.removeOneItem(this.id);
    }

    undoTransaction() {
        this.model.insertItem(this.item, this.index);
    }
}