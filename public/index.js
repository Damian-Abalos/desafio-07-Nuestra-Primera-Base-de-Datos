const socket = io()
const time = Date(Date.now()).toString()

function addProduct(e) {
    const producto = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        imagen: document.getElementById('imagen').value
    };
    socket.emit('productoDesdeElCliente', producto);
    return false;
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value
    };
    socket.emit('mensajeDesdeElCliente', mensaje);
    return false;
}

socket.on('productoDesdeElServidor', prod => {
    console.log(prod);
    const productosHTML = prod
        .map(prod => `
        <tr class="warning">
            <td>${prod.nombre}</td>             
            <td>${prod.precio}</td>             
            <td style="width: 33%"><img style="max-width: 50px;" src="${prod.imagen}" alt=""></td>             
        </tr>`)
    document.getElementById('mi-tr').innerHTML = productosHTML
})

socket.on('mensajeDesdeElServidor', msjs => {
    const mensajesHTML = msjs
        .map(msj => `<div class="d-flex"><p style="color: blue;">${msj.mensaje.author}</p><p style="color: brown;">[${time}]</p>:<p style="color: green;">${msj.mensaje.text}</p></div>`)
        .join('')
    document.getElementById('mi-p').innerHTML = mensajesHTML
})