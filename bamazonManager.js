const mysql = require("mysql");
const cTable = require('console.table');
const Table = require('./database')
const inquirer = require('inquirer')

var products = new Table("products")
products.connect()

console.log("Welcome back Bamazon Manager, I hope you're having a great day\n")

function selectAction() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'How can we help you today?',
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (response) {
        if (response.action === "View Products for Sale") {
            console.log("Here are the items we have in stock today:")
            products.print()
            selectAction()
        } else if (response.action === "View Low Inventory") {
            console.log("Here are the items we are running low on stock:")
            lowInventory()
        } else if (response.action === "Add to Inventory") {
            addToInventory()
        } else if (response.action === "Add New Product") {
            addNew()
        }
        else if (response.action === "Quit") {
            console.log("Thank you for being a valued employee of Bamazon. We hope to see you again!")
            products.connection.end()
            return
        }
    })
}

function lowInventory() {
    products.getItem("stock_quantity", "5", "<").then((response) => {
        console.table(response)
        selectAction()
    })
}
function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Enter the ID of product that you want to add to inventory."
        },
        {
            type: "input",
            name: "amount",
            message: "Enter how many of this product you would like to add to inventory."
        }
    ]).then(function (response) {
        products.getItem("item_id",response.id).then((item)=>{
            products.changeTable("stock_quantity",Number(response.amount)+Number(item[0].stock_quantity),"item_id",response.id)
            console.log("Great! You have successfully added "+response.amount+" new "+item[0].product_name+"s to inventory.")
            selectAction()
        })
    })
}
function addNew() {

}

selectAction()