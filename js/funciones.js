let DB
const formElement = document.querySelector('#form')

function connectDB() {
    const openConnection = window.indexedDB.open('contactos', 1)

    openConnection.onerror = function() {
        console.log('Hubo un error')
    }

    openConnection.onsuccess = function() {
        DB = openConnection.result
    }
}

function printAlert(message, typeMessage) {

    const alert = document.querySelector('.alert')
    if(!alert) { /* If alert doesn´t exist, it is created */

        const messageContainer = document.createElement('P')
        messageContainer.classList.add('alert', 'text-center')

        if(typeMessage === 'error') {
            messageContainer.classList.add('error')
        } else {
            messageContainer.classList.add('correct')
        }
        messageContainer.textContent = message
        formElement.appendChild(messageContainer)

        setTimeout(() => {
            messageContainer.remove()
        }, 3000);
    }   
}

