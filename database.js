const mysql = require("mysql");
const cTable = require('console.table');


function Table(name) {
    this.name = name;
    this.config = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "bamazon"
    };
    this.connect = function () {
        this.connection = mysql.createConnection(this.config)
    };
    this.print = function (input) {
        return new Promise((resolve, reject) => {
            var query = "SELECT ?? FROM ?? LIMIT ?";
            var filter = input || "*"

            this.connection.query(query, [filter,this.name, 100], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                console.table(res)
                resolve()
            });
        })
    };
    this.getItem = function (column, target, comparison) {
        return new Promise((resolve, reject) => {
            var compare = comparison || "="
            if (compare === "=") {
                var query = "SELECT * FROM ?? WHERE ?? = ?";
            } else if (compare === "<") {
                var query = "SELECT * FROM ?? WHERE ?? < ?";
            }
            this.connection.query(query, [this.name, column, target], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            });
        })
    };
    this.changeTable = function (propToChange, newValueforProp, columnToTarget, targetCriteria) {
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?;"
        this.connection.query(query, [this.name, propToChange, newValueforProp, columnToTarget, targetCriteria], function (err, res) {
            if (err) { console.log(err) }
        });
    };
    this.newItem = function (name, department, price, stock) {
        return new Promise((resolve, reject) => {
            if (this.name === "products") {
                var query = "INSERT INTO products (product_name,department_name,price,stock_quantity) values (?,?,?,?);";
                this.connection.query(query, [name, department, price, stock], function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(stock+" "+name+"s have been successfully added to inventory as a new product under the "+department+" department.")
                })
            }
        })
    }
}


module.exports = Table





// EXAMPLE SEQUENCE TO TEST OUT OUR TABLE CONSTRUCTOR
// var products = new Table("products")
// products.connect()
// products.print()
// products.getItem("product_name","Playstation")
// products.changeTable("stock_quantity",10,"product_name","TV")
// products.connection.end()


