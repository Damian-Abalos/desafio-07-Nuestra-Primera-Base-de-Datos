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
            table.string('author')
            table.string('text')

            // table.string('nombre').notNullable()
            // table.float('precio')
            // table.string('imagen').notNullable()
        })
            .then(() => console.log("table created"))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                this.knex.destroy();
            })
    }

    async insertData(data) {
        try {
            const [id] = await this.knex(this.tableName).insert(data);
            return id;
        } catch (error) {
            console.log(error); throw error;
        }
    }

    async selectData() {
        try {
            const rows = await this.knex.from(this.tableName).select('*');
            return rows;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async updateWhere(whereKey, whereValue) {
        try {
            const dataUpdated = await this.knex.from(this.tableName).where(whereKey, whereValue).update({ stock: 0 })
            return dataUpdated;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async deleteData() {
        try {
            await this.knex.from(this.tableName).del()
            return ('data deleted')
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async deleteWhere(key, value) {
        try {
            await this.knex.from(this.tableName).where(key, value).del()
            return ('data deleted')
        } catch (error) {
            console.log('Error:', error);
        }
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