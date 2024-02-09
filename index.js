//Modules imported from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//Firebase settings where everything is stored
const appSettings = {
    databaseURL: "https://realtime-database-c1c32-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const shoppingListInDB = ref(database, "shoppingList")

// DOM Elements
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

//'Add' button event listener that gets the value from the input field, adds it to the shopping list and clears the input field
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

//Listens to changes done on the 'shopping list' and transfer everything to the database.
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    //Message displayed when there are no items in the 'shopping list'
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

//Function that clears the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//Function that clears the input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

//Function that adds an item to the shopping list, shows it's value and removes the item when clicked.
function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}