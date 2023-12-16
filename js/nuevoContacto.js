(function() {
    let DB
    const formElement = document.querySelector('#form')

    document.addEventListener('DOMContentLoaded', () => {
        /* Nos conectamos a la Base de Datos */
        connectDB()

        formElement.addEventListener('submit', validateContact)

    })


    function connectDB() {
        const openConnection = window.indexedDB.open('contactos', 1)

        openConnection.onerror = function() {
            console.log('Hubo un error')
        }

        openConnection.onsuccess = function() {
            DB = openConnection.result
        }
    }

    function validateContact(e) {
        e.preventDefault()

        /* Reading inputs value */
        const name = document.querySelector('#name').value
        const lastName = document.querySelector('#last-name').value
        const phone = document.querySelector('#phone').value
        const company = document.querySelector('#company').value
        const email = document.querySelector('#email').value

        if(name === '' || lastName === '' || phone === '' || company === '' || email === '') {
            printAlert('Todos los campos son obligatorios', 'error')
            return
        }

        /* Creating an object with the information */
        const contact = {
            nombre : name,
            apellido: lastName,
            telefono: phone,
            empresa: company,
            correo: email,
            id: Date.now()
        }

        createNewContact(contact)
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

    function createNewContact(contact) {
        const transaction = DB.transaction(['contactos'], 'readwrite')
        const objectStore = transaction.objectStore('contactos')

        objectStore.add(contact)

        transaction.onerror = function() {
            printAlert('Hubo un error', 'error')
        }

        transaction.oncomplete = function() {
            printAlert('El contacto se agregó correctamente')

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
    }
})()