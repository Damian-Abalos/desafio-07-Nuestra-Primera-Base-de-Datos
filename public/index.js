const socket = io();
// const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
const time = Date(Date.now()).toString()

const schemaAuthor = new schema.Entity('author', {}, {
    idAttribute: 'mail'
})
// Mensaje
const schemaMensaje = new schema.Entity('mensaje', {
    author: schemaAuthor
}, {
    idAttribute: 'id'
})
// Mensajes
const schemaMensajes = new schema.Entity('mensajes', {
    mensajes: [schemaMensaje]
}, {
    idAttribute: 'id'
})

// function addProduct(e) {
//     const producto = {
//         nombre: document.getElementById('nombre').value,
//         precio: document.getElementById('precio').value,
//         imagen: document.getElementById('imagen').value
//     };
//     socket.emit('productoDesdeElCliente', producto);
//     return false;
// }

function SendMesage() {

    if (document.getElementById('mail').value == "" ||
        document.getElementById('nombre').value == "" ||
        document.getElementById('apellido').value == "" ||
        document.getElementById('edad').value == "" ||
        document.getElementById('alias').value == "" ||
        document.getElementById('avatar').value == "" ||
        document.getElementById('mensaje').value == "") {
        alert("Campos Incompletos")
        return false
    }
    const time = Date(Date.now()).toString()
    const mensaje = {
        author: {
            mail: document.getElementById('mail').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: document.getElementById('mensaje').value,
        date: time,
    }
    socket.emit('mensajeDesdeElCliente', mensaje);
    document.getElementById('mensaje').value = "";
    return false;
}

socket.on('mensajeDesdeElServidor', messages => {
    const denormalizedData = denormalize(messages.result, schemaMensajes, messages.entities)
    const newMessages = denormalizedData.messages
    const mensajesHTML = newMessages
        .map(newMessages => `
        <div class="d-flex">
            <p style="color: blue;">${newMessages.author.mail}</p>
            <p style="color: brown;">[${time}]:</p>            
            <p style="color: green;">${newMessages.text}</p>
        </div>
        `)
        .join('')
    document.getElementById('tableMessages').innerHTML = mensajesHTML
})

socket.on('productoDesdeElServidor', listaProductos => {
    console.log(`productos faker: ${listaProductos}`);
    const productosHTML = listaProductos
        .map(listaProductos => `
        <div class="row w-80">
            <div class="col-4">${listaProductos.nombre}</div>             
            <div class="col-4">$${listaProductos.precio}</div>             
            <div class="col-4"><img style="max-width: 50px;" src="${listaProductos.imagen}" alt=""></td>             
        </div>`)
        .join('')
    document.getElementById('misProductos').innerHTML = productosHTML
})
