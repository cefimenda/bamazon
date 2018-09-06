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
            choices: ["View Products for Sale", "View Low Inventory", "Edit Item", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (response) {
        if (response.action === "View Products for Sale") {
            console.log("Here are the items we have in stock today:")
            products.print().then(function () {
                selectAction()
            })
        } else if (response.action === "View Low Inventory") {
            console.log("Here are the items we are running low on stock:")
            lowInventory()
        } else if (response.action === "Add to Inventory") {
            addToInventory()
        } else if (response.action === "Add New Product") {
            addNew()
        } else if (response.action === "Edit Item") {
            editItem()
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
            message: "Enter how many of this product you would like to add to inventory.",
            validate: numberValidate
        }
    ]).then(function (response) {
        products.getItem("item_id", response.id).then((item) => {
            products.changeTable("stock_quantity", Number(response.amount) + Number(item[0].stock_quantity), "item_id", response.id)
            console.log("Great! You have successfully added " + response.amount + " new " + item[0].product_name + "s to inventory.")
            selectAction()
        })
    })
}
function addNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the product that you will be adding"
        },
        {
            type: "input",
            name: "department",
            message: "What department does this product belong to?"
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of this product? (Use numbers only)",
            validate: numberValidate
        },
        {
            type: "input",
            name: "stock",
            message: "Enter the quantity of items you would like to add to inventory.",
            validate: numberValidate
        }
    ]).then(function (response) {
        products.newItem(response.name, response.department, response.price, response.stock).then((result) => {
            console.log(result)
            selectAction()
        })
    })
}
function editItem() {
inquirer.prompt([
    {
        type:"input",
        message:"Enter the id number of the item you would like to edit",
        name: "id"
    },
    {
        type:"list",
        message:"What section would you like to change?",
        name:"column",
        choices:["product_name","department_name","price","stock_quantity"]
    },
    {
        type:"input",
        message:"What is the new value for this section?",
        name:"value",
    }
]).then(function(response){
    if (response.column ==="price"||response.column==="stock_quantity"){
        if (typeof numberValidate(response.value) === "string"){
            console.log("Expected input for this category is a number. Please try again.")
            selectAction()
            return
        }
    }
    products.changeTable(response.column,response.value,"item_id",response.id)
    console.log("You have successfully changed item with ID "+response.id+" to have a "+response.column+" value of "+response.value+".")
    selectAction()
})
}

function numberValidate(input) {
    var isValid = !isNaN(parseFloat(input));
    return isValid || "Your input should be a number!";
}
selectAction()