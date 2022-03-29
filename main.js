const express = require("express");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const { error } = require("console");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const {faker} = require('@faker-js/faker')
const normalizr = require("normalizr");
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
const DataBase = require('./DataBase.js');
// const productosMariaDB = new DataBase('productos', 'mysql');
const mensajesFirebase = new DataBase('mensajes');

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Rutas */

app.get("/api/productos-test", (req,res)=>{    
    res.send(productosFaker)
})

app.get("/", (req, res) => {
    res.sendFile("/index.html", { root: __dirname });
});

/*------------- crear productos con faker faker-------------*/
function generarCombinacion() {
    return{
        nombre:faker.commerce.product(),
        precio:faker.commerce.price(),
        imagen:faker.image.imageUrl()
    }
}
function generarData(cantidad) {
    const productos = []
    for (let i = 0; i < cantidad; i++) {
        productos.push(generarCombinacion())
    }
    return productos
}
const productosFaker = generarData(5)

/*----------------------------------------------*/
const getMessages = async () => {
    return await mensajesFirebase.getMessages();
};
const saveMessage = async (message) => {
    const idMessage = await mensajesFirebase.saveMessages(message);
    return idMessage;
}
/*----------------------------------------------*/

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


/*-------------------------------------------*/


io.on("connection", async (socket) => {

    console.log("¡Nuevo cliente conectado!");

    const listaProductos = await productosFaker
    socket.emit("productoDesdeElServidor", listaProductos) //nombre del evento + data
    // console.log(listaProductos);

    const mensajes = await getMessages()
	let messagesNormalizr = normalize(mensajes, schemaMensajes)
	socket.emit('mensajeDesdeElServidor', messagesNormalizr)


    socket.on("mensajeDesdeElCliente", async (data) => {
        await saveMessage(data)
        const mensajes = await getMessages()
        io.sockets.emit("mensajeDesdeElServidor", mensajes);
    });

    // socket.on("productoDesdeElCliente", async (data) => {
    //     await saveProduct(data)
    //     const listaProductos = await generarData(5)
    //     io.sockets.emit("productoDesdeElServidor", listaProductos);
    // });
});

app.use("/static", express.static("public"));

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en el servidor ${error}`))



