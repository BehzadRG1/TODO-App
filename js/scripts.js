const body = document.querySelector("body")
const themeSwitcher = document.getElementById("theme-switcher")
const addtodo = document.getElementById("add-btn")
const inputTodo = document.getElementById("addt")
const ul = document.querySelector(".todos")
const filter = document.querySelector(".filter")
const clearCompletedBtn = document.querySelector("#clear-completed")


function main() {

    // theme switcher

    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle("light")
        const themeBtn = themeSwitcher.children[0]
        themeBtn.setAttribute("src",
            themeBtn.getAttribute("src") === "./assets/images/icon-sun.svg"
                ? "./assets/images/icon-moon.svg"
                : "./assets/images/icon-sun.svg"
        )
    })

    // show Todo list on screen

    showTodos(JSON.parse(localStorage.getItem("todos")))

    // drag and change position of each Todos

    ul.addEventListener('dragover', (e) => {

        e.preventDefault()

        if (e.target.classList.contains("card") &&
            !e.target.classList.contains("dragging")) {

            const draggingCard = document.querySelector(".dragging")
            const cards = [...ul.querySelectorAll(".card")]
            const currentIndex = cards.indexOf(draggingCard)
            const newIndex = cards.indexOf(e.target)

            if (currentIndex > newIndex) {
                ul.insertBefore(draggingCard, e.target)
            } else {
                ul.insertBefore(draggingCard, e.target.nextSibling)
            }

            const todos = JSON.parse(localStorage.getItem("todos"))
            const removedIndex = todos.splice(currentIndex, 1)
            todos.splice(newIndex, 0, removedIndex[0])
            localStorage.setItem("todos", JSON.stringify(todos))

        }

    })

    // add input to localStorage with click or press enter

    addtodo.addEventListener('click', () => {
        const item = inputTodo.value.trim()
        if (item) {
            inputTodo.value = ""
            const todos = !localStorage.getItem("todos")
                ? []
                : JSON.parse(localStorage.getItem("todos"))

            // any input should be an object

            const currentTodo = {
                item: item,
                isCompleted: false
            }

            todos.push(currentTodo)
            localStorage.setItem("todos", JSON.stringify(todos))
            showTodos([currentTodo])

        }

    })

    inputTodo.addEventListener('keydown', (e) => {

        if (e.key == 'Enter') {
            addtodo.click()
        }
    })

    // filter list by Todos type (completed or active)

    filter.addEventListener('click', (e) => {

        const id = e.target.id
        if (id) {
            document.querySelector(".on").classList.remove("on")
            document.getElementById(id).classList.add("on")
            document.querySelector(".todos").className = (`todos ${id}`)
        }
    })

    // remove all completed Todos by click on button

    clearCompletedBtn.addEventListener('click', () => {

        var deletedIndex = []

        document.querySelectorAll(".card.checked").forEach((card) => {
            deletedIndex.push([...document.querySelectorAll(".todos .card")].indexOf(card))

            card.classList.add("fall")

            card.addEventListener('animationend', () => {
                card.remove()
            })

        })


        removeCompleted(deletedIndex)

    })


}


// remove an item from Todos list


function removeTodo(index) {

    const todos = JSON.parse(localStorage.getItem("todos"))
    todos.splice(index, 1)
    localStorage.setItem("todos", JSON.stringify(todos))

}

// remove all completed Todos

function removeCompleted(indexes) {

    var todos = JSON.parse(localStorage.getItem("todos"))

    todos = todos.filter((todo, index) => {
        return !indexes.includes(index)
    })

    localStorage.setItem("todos", JSON.stringify(todos))

}


// change state of an item (isCompleted)

function todoState(index, isComplete) {

    const todos = JSON.parse(localStorage.getItem("todos"))
    todos[index].isCompleted = isComplete
    localStorage.setItem("todos", JSON.stringify(todos))

}



function showTodos(array) {

    if (!array) {
        return null
    }

    const itemsLeft = document.querySelector("#items-left")

    array.forEach(objects => {

        // create html elements

        const card = document.createElement("li")
        const cbContainer = document.createElement("div");
        const cbInput = document.createElement("input");
        const checkSpan = document.createElement("span");
        const item = document.createElement("p");
        const clearBtn = document.createElement("button");
        const img = document.createElement("img");


        // set class for html elements

        card.classList.add("card")
        cbContainer.classList.add("cb-container");
        cbInput.classList.add("cb-input");
        checkSpan.classList.add("check");
        item.classList.add("item");
        clearBtn.classList.add("clear");

        // set attributes for html elements

        card.setAttribute("draggable", true)
        cbInput.setAttribute("type", "checkbox");
        img.setAttribute("src", "./assets/images/icon-cross.svg");
        img.setAttribute("alt", "Clear It");
        item.innerText = objects.item

        // show checked and completed Todos on refresh the app

        if (objects.isCompleted) {
            card.classList.add("checked")
            cbInput.setAttribute("checked", "checked")
        }

        // append html elements as childs to each others

        clearBtn.appendChild(img)
        cbContainer.appendChild(cbInput);
        cbContainer.appendChild(checkSpan);
        card.appendChild(cbContainer);
        card.appendChild(item);
        card.appendChild(clearBtn);

        document.querySelector(".todos").appendChild(card)

        // add eventListeners to elements

        card.addEventListener('dragstart', () => {
            card.classList.add("dragging")
        })

        card.addEventListener('dragend', () => {
            card.classList.remove("dragging")
        })


        clearBtn.addEventListener('click', (e) => {

            const currentCard = clearBtn.parentElement
            currentCard.classList.add('fall')
            const currentCardIndex = [...document.querySelectorAll(".todos .card")].indexOf(currentCard)
            removeTodo(currentCardIndex)

            currentCard.addEventListener('animationend', () => {

                setTimeout(() => {

                    currentCard.remove()
                    itemsLeft.innerText = document.querySelectorAll(".todos .card:not(.checked)").length

                }, 300)

            })

        })


        cbInput.addEventListener('click', (e) => {

            const currentCard = cbInput.parentElement.parentElement
            const checked = cbInput.checked
            const currentCardIndex = [...document.querySelectorAll(".todos .card")].indexOf(currentCard)
            todoState(currentCardIndex, checked)

            checked ? currentCard.classList.add("checked") : currentCard.classList.remove("checked")

            itemsLeft.innerText = document.querySelectorAll(".todos .card:not(.checked)").length


        })

    });

    itemsLeft.innerText = document.querySelectorAll(".todos .card:not(.checked)").length


}


document.addEventListener("DOMContentLoaded", main)

