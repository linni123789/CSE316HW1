'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("input");
        listElement.setAttribute("type", "none");
        listElement.setAttribute("value",newList.name)
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todolist");

        listsElement.appendChild(listElement);
        let thisController = this.controller;
        listElement.onclick = event =>{
            if (event.detail === 1) {
                listElement.removeAttribute("class");
                listElement.setAttribute("class" , "todo_button_highlighted");
                thisController.handleLoadList(newList.id);
            } else if (event.detail === 2) {
                listElement.setAttribute("type", "text");
                listElement.setAttribute("style", "cursor:edit");
                }
            }
        listElement.onblur = function(){
            thisController.handleListChange(newList, document.getElementById(newListId).value);
        }

    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let itemStatus;
            if (listItem.status == "incomplete") {   
                itemStatus = "<option value = 'incomplete' selected> incomplete</option>"+"<option value='complete'>complete</option>"}
            else{
                itemStatus = "<option value = 'incomplete'> incomplete</option>"+"<option value='complete' selected>complete</option>"
            }
            let listItemElement = "<div id='" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col' contenteditable>" + listItem.description + "</div>"
                                + "<input class='due-date-col' type = 'date' value = "+listItem.dueDate+">"
                                + "<select class='status-col' >" 
                                + itemStatus
                                + "</select>"
                                + "<div class='list-controls-col'>"
                                + " <div class='list-item-control material-icons uparrow'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons downarrow'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons deleteitembutton'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }
        let controller = this.controller;
        let listItem = document.getElementsByClassName("list-item-card");
        for (let i = 0; i < listItem.length; i++) {
            var description = listItem[i].getElementsByClassName('task-col')[0];
            description.onblur = function(des){
                controller.handleTaskChange(des.target.parentNode.id, des.target.innerHTML);
            }
            var date = listItem[i].getElementsByClassName('due-date-col')[0];
            date.onblur = function(da){
                controller.handleDateChange(da.target.parentNode.id, da.target.value);
            }
            var status = listItem[i].getElementsByClassName('status-col')[0];
            status.onblur = function(stat){
                controller.handleStatusChange(stat.target.parentNode.id, stat.target.value);
            }
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}