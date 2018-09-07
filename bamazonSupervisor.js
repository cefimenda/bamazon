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
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(function (response) {
        if (response.action === "View Product Sales by Department") {
            console.log("Here are the items we have in stock today:")
            departments.managerView().then(function (table) {
                console.table(table)
                selectAction()
            })
        } else if (response.action === "Create New Department") {
            inquirer.prompt([
                {
                    type: "input",
                    name:"name",
                    message:"Please enter the name of the new department you would like to create."
                },
                {
                    type:"input",
                    name:"overhead",
                    message:"Please enter the overhead cost amount for this department.",
                    validate:numberValidate
                }
            ]).then(function (response){
                departments.newItem(response.name,response.overhead).then(function(message){
                    console.log(message)
                    selectAction()
                })
            })
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

function numberValidate(input) {
    var isValid = !isNaN(parseFloat(input));
    return isValid || "Your input should be a number!";
}