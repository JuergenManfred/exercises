const shoppingForm = document.querySelector(".shopping");
const inputElement = document.querySelector("#item");
const formButton = document.querySelector("button");
const listElement = document.querySelector(".list-container");

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
      return `<li id="${item.id}">
    <input type="checkbox" value="${item.id}" ${
        item.checked && "checked"
      }></input>
    <span>${item.name}</span>
    <button value="${item.id}"></button>
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
  if (localStorage.getItem("items") != null) {
    storage = JSON.parse(localStorage.getItem("items"));
    itemsArray.push(...storage);
  }
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}

function deleteItem(id) {
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
  listElement.dispatchEvent(new CustomEvent("itemsUpdated"));
}
listElement.addEventListener("click", handleListClick);
shoppingForm.addEventListener("submit", eventHandler);
listElement.addEventListener("itemsUpdated", displayInput);
listElement.addEventListener("itemsUpdated", updateLocalStorage);
function handleListClick(e) {
  const id = parseInt(e.target.value);
  if (e.target.matches("button")) {
    deleteItem(id);
  } else if (e.target.matches('input[type="checkbox"]')) {
    checkmark(id);
  }
}
getLocalStorage();
