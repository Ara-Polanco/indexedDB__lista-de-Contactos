(function() {

    let DB
    const contactList = document.querySelector('.contacts__tbody')

    document.addEventListener('DOMContentLoaded', () => {
        createDB()

        if(window.indexedDB.open('contactos', 1) ) {
            getContacts()
        }

        contactList.addEventListener('click', deleteContact)
    })


    /* Creamos la Base de Datos de IndexDB */
    function createDB() {
        const createDB = window.indexedDB.open('contactos', 1)

        createDB.onerror = function() {
            console.log('Hubo un error')
        }

        createDB.onsuccess = function() {
            DB = createDB.result
        }

        createDB.onupgradeneeded = function(e) {
            const db = e.target.result

            const objectStore = db.createObjectStore('contactos', {
                keyPath:'id',
                autoincrement: true
            })

            objectStore.createIndex('nombre', 'nombre',{unique:false })
            objectStore.createIndex('apellido', 'apellido',{ unique:false })
            objectStore.createIndex('telefono', 'telefono',{ unique:true })
            objectStore.createIndex('empresa', 'empresa',{ unique:false })
            objectStore.createIndex('correo', 'correo',{ unique:true })
            objectStore.createIndex('id', 'id',{ unique:true })

            console.log('DB lista')
        }
    }

    function getContacts() {
        const openConnection = window.indexedDB.open('contactos', 1)

        openConnection.onerror = function() {
            console.log('Hubo un error en GetContacts')
        }

        openConnection.onsuccess = function() {
            DB = openConnection.result

            const objectStore = DB.transaction('contactos').objectStore('contactos')

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result

                if(cursor) {
                    const { nombre, apellido, telefono, empresa, correo, id } = cursor.value

                   

                    contactList.innerHTML += `
                    <tr class="contacts__tr">
                        <td class="contacts__td">
                            <p class=""> ${nombre} </p>
                        </td>
                        <td class="contacts__td">
                            <p class=""> ${apellido} </p>
                        </td>
                        <td class="contacts__td">
                            <p class="">${telefono}</p>
                        </td>
                        <td class="contacts__td">
                            <a href="editar-contacto.html?id=${id}" class="contacts__a">Editar</a>
                            <a href="#" data-contacto="${id}" class="contacts__a delete">Eliminar</a>
                        </td>
                    </tr>  
                    `


                    cursor.continue()
                } else {
                    console.log('No hay más registros')
                }
            }
        }
    }

    function deleteContact(e) {
        if(e.target.classList.contains('delete') ) {
            const idDelete = Number(e.target.dataset.contacto)

            const confirmation = confirm('¿Eliminar el contacto?')
            if(confirmation) {
                const transaction = DB.transaction('contactos', 'readwrite')
                const objectStore = transaction.objectStore('contactos')

                objectStore.delete(idDelete)

                transaction.oncomplete = function() {
                    e.target.parentElement.parentElement.remove()
                }

                transaction.onerror = function() {
                    console.log('Hubo un error en Delete')
                }
                /* Todo esta listo */
            }
        }
    }

})()