(function() {
    let DB 
    let idContact

    const nameElement = document.querySelector('#name')
    const lastNameElement = document.querySelector('#last-name')
    const phoneElement = document.querySelector('#phone')
    const companyElement = document.querySelector('#company')
    const emailElement = document.querySelector('#email')
    const formElement = document.querySelector('#form')

    document.addEventListener('DOMContentLoaded', () => {
        connectDB()
        /* update the registry */
        formElement.addEventListener('submit', updateContact)

        /* Check url id */
        const parametrosURL = new URLSearchParams(window.location.search)
        idContact = parametrosURL.get('id')
        
        if(idContact) {
            setTimeout(() => {
                getContact(idContact)
            }, 500);
        }
    })

    function getContact(idContact) {
        const transaction = DB.transaction(['contactos'], 'readwrite')
        const objectStore = transaction.objectStore('contactos')
        const contact = objectStore.openCursor()

        contact.onsuccess = function(e) {
            const cursor = e.target.result

            if(cursor) {
                if(cursor.value.id === Number(idContact)) {
                    fillForm(cursor.value)
                }
                cursor.continue()
            }
        }
    }

    function connectDB() {
        const openConnection = window.indexedDB.open('contactos', 1)

        openConnection.onerror = function() {
            console.log('Hubo un error')
        }

        openConnection.onsuccess = function() {
            DB = openConnection.result
        }
    }
    function fillForm(contactInfo) {
        const {nombre, apellido, telefono, empresa, correo } = contactInfo

        nameElement.value = nombre
        lastNameElement.value = apellido
        phoneElement.value = telefono
        companyElement.value = empresa
        emailElement.value = correo
    }

    function updateContact(e) {
        e.preventDefault()
        if(nameElement.value === '' || lastNameElement.value === '' || phoneElement.value === '' || companyElement.value === '' || emailElement.value === '') {
            printAlert('Todos los campos son obligatorios', 'error')
            return
        }

        /* Update contact */
        const updatedContact = {
            nombre: nameElement.value,
            apellido: lastNameElement.value,
            telefono: phoneElement.value,
            empresa: companyElement.value,
            correo: emailElement.value,
            id: Number(idContact)
        }
        const transaction = DB.transaction(['contactos'], 'readwrite')
        const objectStore = transaction.objectStore('contactos')

        objectStore.put(updatedContact)

        transaction.oncomplete = function() {
            printAlert('Actualizado correctamente')

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }
        transaction.onerror = function() {
            printAlert('Hubo un error', 'error')
        }
    }

})()

