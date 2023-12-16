(function() {

    let DB

    document.addEventListener('DOMContentLoaded', () => {
        createDB()

        if(window.indexedDB.open('contactos', 1) ) {
            getContacts()
        }
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
            console.log('Hubo un error')
        }

        openConnection.onsuccess = function() {
            DB = openConnection.result

            const objectStore = DB.transaction('contactos').objectStore('contactos')

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result

                if(cursor) {
                    const { nombre, apellido, telefono, empresa, correo, id } = cursor.value

                    const contactList = document.querySelector('.contacts__tbody')

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
                            <a href="#" data-cliente="${id}" class="contacts__a">Eliminar</a>
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

})()