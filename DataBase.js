const admin = require("firebase-admin");
const serviceAccount = require("./DB/basefirebase-a035b-firebase-adminsdk-8uw8n-2507f5c523.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


class DataBase {

    constructor(collection) {
        this.collection = collection
    }

    async getMessages() {
        try {
            const db = admin.firestore();
            const query = db.collection(this.collection);
            const querySnapshot = await query.get()
            let docs = querySnapshot.docs;

            const response = docs.map((doc) => ({
                author: {
                    id: doc.data().mail,
                    nombre: doc.data().nombre,
                    apellido: doc.data().apellido,
                    edad: doc.data().edad,
                    alias: doc.data().alias,
                    avatar: doc.data().urlFoto
                },
                text: doc.data().mensajeUsuario
            }))
            console.log(response);
            return response
        } catch (error) {
            throw new Error(`Error al buscar: ${error}`)
        }
    }



    saveMessages = async (mensaje) => {
        const db = admin.firestore();
        const query = db.collection(this.collection);
        const data = await this.getAll()
        let ultimoId;
        let ultimomensaje = await data[data.length - 1];

        if (data.length == 0) { ultimoId = 0 } else { ultimoId = ultimomensaje.id }

        const nId = await ultimoId + 1
        const time = Date(Date.now()).toString()
        let doc = query.doc(`${nId}`)
        await doc.create({ ...mensaje, timestamp: time, id: nId })
        return 'mensaje enviado 🆗'   
    };

}


module.exports = DataBase