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
    this.print = function () {
        var query = "SELECT * FROM ?? LIMIT ?";
        this.connection.query(query, [this.name, 100], function (err, res) {
            if (err) { console.log(err) }
            console.table(res)
        });
    };
    this.getItem = function (column, target, comparison) {
        return new Promise((resolve, reject) => {
            var compare = comparison || "=" 
            if (compare === "="){
                var query = "SELECT * FROM ?? WHERE ?? = ?";
            }else if (compare ==="<"){
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
    this.newItem = function (){
        
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


