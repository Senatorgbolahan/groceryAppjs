// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********

form.addEventListener('submit', addItem) //submit form
clearBtn.addEventListener('click', clearItems) // clear items
window.addEventListener('DOMContentLoaded', setupItems) //load items



function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString()

    if (value && editFlag === false) {
        createListItem(id, value)
        displayAlert('Item added to the list', "success")
        container.classList.add('show-container')
        addToLocalStorage(id, value)
        setBackToDefault()

    } else if (value && editFlag) {
        editElement.innerHTML = value
        displayAlert('Value changed', "success")
            // edit local storage
        editLocalStorage(editID, value)
        setBackToDefault()
    } else {
        displayAlert("Please enter value", "danger")
    }
}

// display alert function
function displayAlert(text, action) {
    alert.textContent = "empty value";
    alert.classList.add(`alert-${action}`)

    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 2000);
}

function clearItems() {
    const items = document.querySelectorAll('.grocery-item')
    if (items.length > 0) {
        items.forEach(function(item) {
            list.removeChild(item)
        })
    }
    container.classList.remove('show-container');
    displayAlert("Empty List", "danger")
    setBackToDefault()
    localStorage.removeItem()
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element)
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('Item removed', "danger")
    setBackToDefault()
        // remove from local storage
    removeFromLocalStorage(id)


}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML
    editFlag = true;
    editID = element.dataset.id
    submitBtn.textContent = "edit"
    console.log(element);
}

function setBackToDefault() {
    grocery.value = ""
    editFlag = false;
    editID = ""
    submitBtn.textContent = "submit"
}

// ****** FUNCTIONS **********

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = { id: id, value: value }
    const items = getLocalStorage();
    console.log(items);

    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function(item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function(item) {
        if (item.id === id) {
            item.value = value
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

// ****** SETUP ITEMS **********

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item) {
            const { id, value } = item // ES 6
            createListItem(id, value)
        })
        container.classList.add('show-container')
    }

}

function createListItem(id, value) {
    let element = document.createElement('article')
    element.classList.add('grocery-item')
    let attr = document.createAttribute('data-id')
    attr.value = id;
    element.setAttributeNode(attr)
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
            <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>`

    // accessing the delete-btn class
    const deleteBtn = element.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', deleteItem)

    // accessing the edit-btn class 
    const editBtn = element.querySelector('.edit-btn')
    editBtn.addEventListener('click', editItem)

    list.appendChild(element)
}