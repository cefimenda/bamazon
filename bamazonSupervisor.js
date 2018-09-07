const mysql = require("mysql");
const cTable = require('console.table');
const Table = require('./database')
const inquirer = require('inquirer')

var products = new Table("products")
var departments = new Table("departments")

products.connect()
departments.connect()

console.log("Welcome back Mr. Bamazon Supervisor Sir, what an honor it is to be working for you!\n")

function selectAction() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'How can I help you today sir?',
            choices: ["View Product Sales by Department", "Create New Department",  "Quit"]
        }
    ]).then(function (response) {
        if (response.action === "View Product Sales by Department") {
            console.log("Here are the items we have in stock today:")
            departments.print().then(function () {
                selectAction()
            })
        } else if (response.action === "Create New Department") {
            console.log("Coming Soon")
            selectAction()
        }
        else if (response.action === "Quit") {
            console.log("Thank you for making this world a better place Mr. Supervisor. I sincerely hope I will get to perform the tasks you assign me once again in the near future!")
            products.connection.end()
            departments.connection.end()
            return
        }
    })
}
selectAction()