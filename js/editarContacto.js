(function() {
    let DB 

    const nameElement = document.querySelector('#name')
    const lastNameElement = document.querySelector('#last-name')
    const phoneElement = document.querySelector('#phone')
    const companyElement = document.querySelector('#empresa')
    const emailElement = document.querySelector('#email')

    const formElement = document.querySelector('#form')

    document.addEventListener('DOMContentLoaded', () => {
        connectDB()

        /* Check url id */
        const parametrosURL = new URLSearchParams(window.location.search)
        const idContact = parametrosURL.get('id')
        
        if(idContact) {
            setTimeout(() => {
                getContact(idContact)
            }, 1000);
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
        const {nombre } = contactInfo

        nameElement.value = nombre
    }


})()

