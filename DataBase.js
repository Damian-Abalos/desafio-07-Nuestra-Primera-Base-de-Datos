class DataBase {

    constructor(tabla, client) {
        this.tableName = tabla

        this.client = client

        this.options = {}

        if (this.client == 'mysql') {
            this.options = {
                client: this.client,
                connection: {
                    host: '127.0.0.1',
                    user: 'root',
                    password: '',
                    database: 'ecommerce'
                }
            }
        } else if (this.client == 'sqlite3') {
            this.options = {
                client: this.client,
                connection: {
                    filename: `${__dirname}/DB/mydb.sqlite`
                },
                useNullAsDefault: true
            }
        } else {
            this.options = {}
        }

        this.knex = require('knex')(this.options);
    }

    createTable() {
        this.knex.schema.createTable(this.tableName, table => {
            // table.increments('id').primary()
            table.string('nombre').notNullable()
            // table.string('codigo').notNullable()
            table.float('precio')
            // table.integer('stock')
            table.string('imagen').notNullable()
        })
            .then(() => console.log("table created"))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                this.knex.destroy();
            })
    }

    insertData(data) {
        this.knex(this.tableName)
            .insert(data)
            .then(() => console.log("data inserted:" + data.nombre))
            .catch((err) => { console.log(err); throw err })
            .finally(() => { this.knex.destroy(); });
    }

    selectData() {
        return new Promise((resolve, reject) => {
            this.knex.from(this.tableName).select('*')
                .then((res) => { resolve(res) })
                .catch((err) => { console.log(err); throw err })
                .finally(() => { this.knex.destroy(); })
        })
    }

    updateWhere(key, value) {
        this.knex.from(this.tableName).where(key, value).update({ stock: 0 })
            .then(console.log('data updated'))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                this.knex.destroy();
            })
    }

    deleteData() {
        this.knex.from(this.tableName).del()
            .then(console.log('data deleted'))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                this.knex.destroy();
            })
    }

    deleteWhere(key, value) {
        this.knex.from('articulos')
            .where(key, value)
            .del()
            .then(console.log('data deleted'))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                this.knex.destroy();
            })
    }
}
const articulos = [
    { nombre: "palta", codigo: 10, precio: 10.10, stock: 10 },
    { nombre: "tomate", codigo: 20, precio: 20.20, stock: 20 },
    { nombre: "cebolla", codigo: 30, precio: 30.30, stock: 30 },
    { nombre: "limon", codigo: 40, precio: 40.40, stock: 40 },
    { nombre: "cilantro", codigo: 50, precio: 50.50, stock: 50 }
]
// const test = new DataBase('articulos', 'mysql')
// const test = new Desafio('articulos', 'sqlite3')
// test.createTable()
// test.insertData(articulos)
// test.selectData() 
// test.updateWhere('id', '2')
// test.deleteWhere('id', '3')
// test.selectData() 

module.exports = DataBase