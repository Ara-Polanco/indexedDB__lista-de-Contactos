(function() {
   /*  let DB */
    const formElement = document.querySelector('#form')

    document.addEventListener('DOMContentLoaded', () => {
        /* Nos conectamos a la Base de Datos */
        connectDB()
        formElement.addEventListener('submit', validateContact)
    })

    function validateContact(e) {
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

    function createNewContact(contact) {
        const transaction = DB.transaction(['contactos'], 'readwrite')
        const objectStore = transaction.objectStore('contactos')

        objectStore.add(contact)

        transaction.oncomplete = function() {
            printAlert('El contacto se agregó correctamente')
            
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2500);
        }
        
        transaction.onerror = function() {
            printAlert('Hubo un error en CreateNewContact', 'error')
        }

    }
})()