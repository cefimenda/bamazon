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
            this.connection.query(query, [filter, this.name, 100], function (err, res) {
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
    this.newItem = function (first, second, third, fourth) {
        return new Promise((resolve, reject) => {
            if (this.name === "products") {
                var query = "INSERT INTO products (product_name,department_name,price,stock_quantity) values (?,?,?,?);";
                this.connection.query(query, [first, second, third, fourth], function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(fourth + " " + first + "s have been successfully added to inventory as a new product under the " + second + " department.")
                })
            } else if (this.name === "departments") {
                var query = "INSERT INTO departments (department_name,over_head_costs) values (?,?);";
                this.connection.query(query, [first, second], function (err, res) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("You have successfully added a new department called " + first + " with overhead costs of " + second + ".")
                })
            }
        })
    };
    this.getDepartments = function () {
        return new Promise((resolve, reject) => {
            var query = "SELECT DISTINCT department_name FROM departments"
            this.connection.query(query, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    };
    this.managerView = function () {
        return new Promise((resolve, reject) => {
            var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS sales_total, (SUM(products.product_sales) - over_head_costs) AS total_profit FROM departments LEFT JOIN products ON products.department_name = departments.department_name GROUP BY department_name, department_id;"
            this.connection.query(query, function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(res)
            })
        })
    };
    this.deleteItem = function (column, target) {
        return new Promise((resolve, reject) => {
            var query = "DELETE FROM ?? WHERE ?? = ?";
            this.connection.query(query, [this.name, column, target], function (err, res) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve("You have successfully deleted item(s) with a " + column + " of " + target + ".")
            })
        })
    }
}


module.exports = Table
