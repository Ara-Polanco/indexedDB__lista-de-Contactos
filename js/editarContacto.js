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

        const expressions = {
            company: /^[a-zA-ZÀ-ÿ0-9\s\_\-/*+:,;.%$()&=¿?!¡]{2,30}$/, // Diversos caracteres
            name: /^[a-zA-ZÀ-ÿ\s]{3,40}$/, // Letras y espacios, pueden llevar acentos.
            email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            number: /^\d{10,14}$/ // 10 a 14 numeros.
        }

        /* Reading inputs value */
        const name = document.querySelector('#name').value
        const lastName = document.querySelector('#last-name').value
        const phone = document.querySelector('#phone').value
        const company = document.querySelector('#company').value
        const email = document.querySelector('#email').value

        const elementsValidation = {
            name: false,
            lastName: false,
            phone: false,
            company: false,
            email: false
        }
       
        if(expressions.name.test(name)) {
            elementsValidation.name = true
        } 
        if(expressions.name.test(lastName)) {
            elementsValidation.lastName = true
        }  
        if(expressions.number.test(phone)) {
            elementsValidation.phone = true
        }  
        if(expressions.company.test(company)) {
            elementsValidation.company = true
        }  
        if(expressions.email.test(email)) {
            elementsValidation.email = true
        }  
        console.log(elementsValidation) /* Borrar */

        if(elementsValidation.name === false || elementsValidation.lastName === false || elementsValidation.phone === false || elementsValidation.company === false || elementsValidation.email === false) {

            if(elementsValidation.name == false) {
                printAlert('Error, nombre inválido', 'error')
            }
            if(elementsValidation.lastName == false) {
                printAlert('Error, apellido inválido', 'error')
            }
            if(elementsValidation.phone == false) {
                printAlert('Error, teléfono inválido', 'error')
            }
            if(elementsValidation.company == false) {
                printAlert('Error, empresa inválida', 'error')
            }
            if(elementsValidation.email == false) {
                printAlert('Error, correo inválido', 'error')
            }
            printAlert('Todos los campos son obligatorios y deben ser correctos', 'error')
            return
        }

        /* Update contact */
        const updatedContact = {
            nombre: name,
            apellido: lastName,
            telefono: phone,
            empresa: company,
            correo: email,
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


