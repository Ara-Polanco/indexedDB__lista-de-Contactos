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