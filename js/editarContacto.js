(function() {
    /* let DB  */
    let idContact

    const name = document.querySelector('#name')
    const lastName = document.querySelector('#last-name')
    const phone = document.querySelector('#phone')
    const company = document.querySelector('#company')
    const email = document.querySelector('#email')
    const form = document.querySelector('#form')

    document.addEventListener('DOMContentLoaded', () => {
        connectDB()
        /* update the registry */
        form.addEventListener('submit', updateContact)

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

        name.value = nombre
        lastName.value = apellido
        phone.value = telefono
        company.value = empresa
        email.value = correo
    }

    function updateContact(e) {
        e.preventDefault()
        if(name.value === '' || lastName.value === '' || phone.value === '' || company.value === '' || email.value === '') {
            printAlert('Todos los campos son obligatorios', 'error')
            return
        }

        /* Update contact */
        const updatedContact = {
            nombre: name.value,
            apellido: lastName.value,
            telefono: phone.value,
            empresa: company.value,
            correo: email.value,
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
            printAlert('Hubo un error enUpdateContact', 'error')
        }
    }

})()

