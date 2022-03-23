const express = require("express");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const { error } = require("console");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const {faker} = require('@faker-js/faker')
const DataBase = require('./DataBase.js');
const productosMariaDB = new DataBase('productos', 'mysql');
const mensajesSQLite3 = new DataBase('tablaMensajes', 'sqlite3');

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// no se en que parte del codigo deberia crear las tablas y que condicion usar para que: si ya hay una tabla creada con ese nombre, no haga nada
// no termino de entender como hacer la promesas en estos casos

app.get("/api/productos-test", (req,res)=>{
    const data = generarData(10)
    res.send(data)
})

app.get("/", (req, res) => {
    // productosMariaDB.createTable()
    // mensajesSQLite3.createTable()
    res.sendFile("/index.html", { root: __dirname });
});

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



const getProducts = async () => {
    return await productosMariaDB.selectData();
}

const saveProduct = async (product) => {
    const producto = await productosMariaDB.insertData(product)
    return producto
}

const getMessages = async () => {
    return await mensajesSQLite3.selectData();
};
const saveMessage = async (message) => {
    const idMessage = await mensajesSQLite3.insertData(message);
    return idMessage;
}

io.on("connection", async (socket) => {

    console.log("¡Nuevo cliente conectado!");
    // await mensajesSQLite3.createTable()
    // mensajesSQLite3.createTable()
    const mensajes = await getMessages()
    socket.emit("mensajeDesdeElServidor", mensajes)
    const listaProductos = await generarData(5)
    socket.emit("productoDesdeElServidor", listaProductos) //nombre del evento + data

    socket.on("mensajeDesdeElCliente", async (data) => {
        await saveMessage(data)
        const mensajes = await getMessages()
        io.sockets.emit("mensajeDesdeElServidor", mensajes);
    });
    socket.on("productoDesdeElCliente", async (data) => {
        await saveProduct(data)
        const listaProductos = await generarData(5)
        io.sockets.emit("productoDesdeElServidor", listaProductos);
    });
});

app.use("/static", express.static("public"));

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en el servidor ${error}`))



