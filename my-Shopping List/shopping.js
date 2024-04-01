
const shoppingForm = document.querySelector(".shopping");
const inputElement = document.querySelector("#item");
const formButton = document.querySelector("button");
const listElement = document.querySelector(".list");

let itemsArray = [];
function eventHandler(event) {
  event.preventDefault();
  const name = event.currentTarget.item.value;
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    checked: false,
  };
  itemsArray.push(item);
  event.target.reset();
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}
function displayInput() {
  const html = itemsArray
    .map((item) => {
      return `<li class="list-item" id="${item.id}">
    <input class="checkbox" type="checkbox" value="${item.id}" ${
        item.checked && "checked"
      }></input>
    <span class="item-text">${item.name}</span>
    <button class="list-button" value="${
      item.id
    }"><i class="fa-solid fa-trash"></i></button>
    </li>
    `;
    })
    .join("");
  listElement.innerHTML = html;
}
function updateLocalStorage() {
  let jsonArray = JSON.stringify(itemsArray);
  localStorage.setItem("items", jsonArray);
}
function getLocalStorage() {
  let storage = localStorage.getItem("items");
  if (localStorage.getItem("items") != undefined) {
    storage = JSON.parse(localStorage.getItem("items"));
    itemsArray.push(...storage);
  }
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function deleteItem(id) {
  saveOneItemBeforeDelete(id)
  itemsArray = itemsArray.filter((item) => {
    return item.id !== id;
  });
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function checkmark(id) {
  /*   
  these two map functions don't work but with the find functions it works fine
  itemsArray =  itemsArray.map((item) => {
    if (item.id === id) {
      return {...item , checked: !item.checked};
      console.log(item.checked)
    }
    return item
  }); */
  /*   itemsArray = itemsArray.map((item) => {
    item.checked = (item.id === id ? !item.checked : item.checked) ;
  }); */
  let ref = itemsArray.find((item) => item.id === id);
  ref.checked = !ref.checked;
  const listItem = document.getElementById(id);
  console.log(listItem)
/*   if (listItem) {
    if (ref.checked) {
      listItem.style.backgroundColor = "grey"
    } 
  } */
  
  if (listItem) {
    listItem.classList.toggle('checked', ref.checked);
  }
  
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}
listElement.addEventListener("click", handleListClick);
shoppingForm.addEventListener("submit", eventHandler);
listElement.addEventListener("itemsUpdated", displayInput);
listElement.addEventListener("itemsUpdated", updateLocalStorage);
function handleListClick(e) {
  let id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(id);
  } else if (e.target.matches(".list-button i")) {
    id = parseInt(e.target.parentElement.value);
    deleteItem(id);
  } else if (e.target.matches('input[type="checkbox"]')) {
    checkmark(id);
  }
}
function askUser() {
  let answer = confirm("Would you like to clear all items?");
  if (answer) {
    saveListBeforeClear();
    itemsArray = [];
    listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
  }
}
const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", askUser);

function saveListBeforeClear() {
  let jsonArray = JSON.stringify(itemsArray);
  localStorage.setItem("history", jsonArray);
}
function saveOneItemBeforeDelete(id) {
  let ref = itemsArray.find((item) => item.id === id);
  let jsonArray = JSON.stringify(ref);
  localStorage.setItem("history", jsonArray);
}
function restoreHistory() {
  let storage = localStorage.getItem("history");
  if (localStorage.getItem("history") != null) {
    let jsonStorage = JSON.parse(storage)
    if(jsonStorage.length > 1) {
      itemsArray.push(...jsonStorage);
    }
    else {
      itemsArray.push(jsonStorage);
    }
    localStorage.setItem("history", "")
  }
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}
const restoreButton = document.querySelector(".restore");
restoreButton.addEventListener("click", restoreHistory);


function handleCheckboxChange(event) {
  const checkbox = event.target;
  console.log(checkbox)
  const listItem = checkbox.closest('.list-item');
  if (listItem) {
    if (checkbox.checked) {
      listItem.classList.add('checked');
    } else {
      listItem.classList.remove('checked');
    }
  }
}

listElement.addEventListener('change', handleCheckboxChange);


getLocalStorage();
