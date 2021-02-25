'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import MoveDown_Transaction from './transactions/MoveDown_Transaction.js'
import MoveUp_Transaction from './transactions/MoveUp_Transaction.js'
import ChangeTask_Transaction from './transactions/ChangeTask_Transaction.js'
import ChangeDueDate_Transaction from './transactions/ChangeDueDate_Transaction.js'
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'
/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    addMoveDown_Transaction(id){
        let transaction = new MoveDown_Transaction(this, id);
        this.tps.addTransaction(transaction);
    }

    addMoveUp_Transaction(id){
        let transaction = new MoveUp_Transaction(this, id);
        this.tps.addTransaction(transaction);
    }

    addChangeTask_Transaction(id, newText){
        let oldText;
        for (var i = 0 ; i < this.currentList.items.length ; i++){
            if (this.currentList.items[i].id ==  id){
                oldText = this.currentList.items[i].description;
            }
        }
        let transaction = new ChangeTask_Transaction(this, id, newText, oldText);
        this.tps.addTransaction(transaction);
    }

    addDeleteItem_Transaction(id, ){

    }
    addChangeDueDate_Transaction(id, newDate){
        let oldDate;
        for (var i = 0 ; i < this.currentList.items.length ; i++){
            if (this.currentList.items[i].id ==  id){
                oldDate = this.currentList.items[i].dueDate;
            }
        }
        let transaction = new ChangeDueDate_Transaction(this, id, newDate, oldDate);
        this.tps.addTransaction(transaction);
    }
    addChangeStatus_Transaction(id, newStatus){
        let oldStatus;
        for (var i = 0 ; i < this.currentList.items.length ; i++){
            if (this.currentList.items[i].id ==  id){
                oldStatus = this.currentList.items[i].status;
            }
        }
        let transaction = new ChangeStatus_Transaction(this, id, newStatus, oldStatus);
        this.tps.addTransaction(transaction);
    }
    
    addDeleteItem_Transaction(id){
        console.log(id);
        let index;
        for (var i = 0 ; i < this.currentList.items.length ; i++){
            if (this.currentList.items[i].id == id){
                index = i;
            }
        }
        console.log(this.currentList.getItemAtIndex(index));
        let transaction = new DeleteItem_Transaction(this,id, this.currentList.getItemAtIndex(index) ,index);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }
    insertItem(item, index){
        this.currentList.items.splice(index, 0, item);
        this.view.viewList(this.currentList);
        this.enableIcons();
    }
    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        this.movetoFront(listId);
        this.view.refreshLists(this.toDoLists);
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }

        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
            this.enableDelete(listId);
            this.enableUp();
            this.enableDown();
        }
        let controls = document.getElementsByClassName("3icons");
        for (var i = 0; i < controls.length; i++){
            controls[i].style.color = 'white';
            controls[i].style.pointerEvents = "auto";
        }
        document.getElementById("add-list-button").style.color = 'black';
        document.getElementById("add-list-button").style.pointerEvents = "none";
    }
    
    movetoFront(listId){
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }         
        var temp = this.toDoLists[listIndex];
        for (var i = listIndex ; i > 0 ; i--){
            this.toDoLists[i] = this.toDoLists[i-1];
        }
        this.toDoLists[0] = temp;
    }
    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
        this.enableDelete();
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
        let controls = document.getElementsByClassName("list-item-control");
        for (var i = 0; i < controls.length; i++){
            controls[i].style.color = 'black';
            controls[i].style.pointerEvents = "none";
        }
        document.getElementById("add-list-button").style.color = 'white';
        document.getElementById("add-list-button").style.pointerEvents = "auto";
        this.tps.clearAllTransactions();
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 

    closeList(){
        this.view.clearItemsList();
        let controls = document.getElementsByClassName("3icons");
        for (var i = 0; i < controls.length; i++){
            controls[i].style.color = 'black';
            controls[i].style.pointerEvents = "none";
        }
        document.getElementById("add-list-button").style.color = 'white';
        document.getElementById("add-list-button").style.pointerEvents = "auto";
        
    }

    enableUp(){
        var upbutton = document.getElementsByClassName("uparrow");
        let con = this;
        if (upbutton[0] != null){
            upbutton[0].style.color = 'black';
        }
        for (let i = 1; i < this.currentList.items.length; i++) {
            upbutton[i].onmousedown = function(del){
                con.addMoveUp_Transaction(del.target.parentNode.parentNode.id);
            }
        }
    }

    enableDown(){
        var downbutton = document.getElementsByClassName("downarrow");
        let con = this;
        if (downbutton[downbutton.length-1]){
            downbutton[downbutton.length-1].style.color = 'black';
        }
        for (let i = 0; i < this.currentList.items.length - 1; i++) {
            downbutton[i].onmousedown = function(del){
                con.addMoveDown_Transaction(del.target.parentNode.parentNode.id);
            }
        }
    }

    moveup(itemId){
        let list = this.currentList.items;
        for (var i = 0 ; i < list.length ; i++){
            if (list[i].id == itemId){
                let temp = list[i-1];
                list[i-1] = list[i];
                list[i] = temp;
                break;
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }

    movedown(itemId){
        let list = this.currentList.items;
        for (var i = 0 ; i < list.length ; i++){
            if (list[i].id == itemId){
                let temp = list[i+1];
                list[i+1] = list[i];
                list[i] = temp;
                break;
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }

    enableDelete(listId){
        var deletebutton = document.getElementsByClassName("deleteitembutton");
        let con = this;
        for (let i = 0; i < this.currentList.items.length; i++) {
            deletebutton[i].onmousedown = function(del){
                con.addDeleteItem_Transaction(del.target.parentNode.parentNode.id);
            }
        }
    }
    removeOneItem(id){
        let list = this.currentList.items;
        for (var i = 0 ; i< list.length ;i++){
            if(list[i].id == id){
                list = list.splice(i,1);
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }

    changeTask(id, newdescription){
        let list = this.currentList.items;
        for (var i = 0 ; i < list.length ; i++){
            if (list[i].id == id){
                list[i].setDescription(newdescription);
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }
    changeDate(id, newdate){
        let list = this.currentList.items;
        for (var i = 0 ; i < list.length ; i++){
            if (list[i].id == id){
                list[i].setDueDate(newdate);
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }
    changeStatus(id,status){
        let list = this.currentList.items;
        for (var i = 0 ; i < list.length ; i++){
            if (list[i].id == id){
                list[i].setStatus(status);
            }
        }
        this.view.viewList(this.currentList);
        this.enableIcons();
    }
    enableIcons(){
        this.enableUp();
        this.enableDown();
        this.enableDelete();
    }
    changeListName(newlist, name){
        for (var i = 0 ; i < this.toDoLists.length ; i++){
            if (this.toDoLists[i].id == newlist.id){
                this.toDoLists[i].setName(name);
            }
        }
    }
}