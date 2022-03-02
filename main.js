const express = require("express");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const { error } = require("console");
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const DataBase = require('./DataBase.js');
const productosMariaDB = new DataBase('productos','mysql');
const mensajesSQLite3 = new DataBase('mensajes', 'sqlite3');

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// no se en que parte del codigo deberia crear las tablas y que condicion usar para que: si ya hay una tabla creada con ese nombre, no haga nada
// no termino de entender como hacer la promesas en estos casos

app.get("/", (req, res) => {
    productosMariaDB.createTable()
    mensajesSQLite3.createTable()
    res.sendFile("/index.html", { root: __dirname });
});

const listaProductos = productosMariaDB.selectData();
const mensajes = mensajesSQLite3.selectData()

io.on("connection", (socket) => {
    
    console.log("¡Nuevo cliente conectado!");
    
    socket.emit("productoDesdeElServidor", listaProductos) //nombre del evento + data
    socket.emit("mensajeDesdeElServidor", mensajes) 
    
    socket.on("productoDesdeElCliente", (data) => {
        // listaProductos.push({socketid: socket.id, producto: data})
        productosMariaDB.insertData(data)
        io.sockets.emit("productoDesdeElServidor", listaProductos);
    });
    socket.on("mensajeDesdeElCliente", (data) => {
        // mensajes.push({socketid: socket.id, mensaje: data})
        mensajesSQLite3.insertData(data)
        io.sockets.emit("mensajeDesdeElServidor", mensajes);
    });

});

app.use("/static", express.static("public"));

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en el servidor ${error}`))



