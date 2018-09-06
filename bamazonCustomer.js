const mysql = require("mysql");
const cTable = require('console.table');
const Table = require('./database')
const inquirer = require('inquirer')

// EXAMPLE SEQUENCE TO TEST OUT OUR TABLE CONSTRUCTOR
// var products = new Table("products")
// products.connect()
// products.print()
// products.getItem("product_name","Playstation")
// products.changeTable("stock_quantity",10,"product_name","TV")
// products.connection.end()


var products = new Table("products")
products.connect()
// products.getItem("product_name","Playstation")
// products.connection.end()
console.log("Welcome to Bamazon! \n")
function selectAction() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'How can we help you today?',
            choices: ["Purchase a Product", "Quit"]
        }
    ]).then(function (response) {
        if (response.action === "Purchase a Product") {
            console.log("Here are the items we have in stock today:")
            products.print(["item_id","product_name","department_name","price"]).then(function(){
                purchaseSequence()
            })
        } else if (response.action === "Quit") {
            console.log("Thank you for shopping with Bamazon. We hope to see you again!")
            products.connection.end()
            return
        }
    })
}

function purchaseSequence() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please type the ID of the item you would like to buy!",
            validate:numberValidate
        },
        {
            type: "input",
            name: "amount",
            message: "Please insert a quantity for your purchase.",
            validate:numberValidate
        }
    ]).then(function (response) {
        console.log("Please wait as I look for your items...")
        products.getItem("item_id", response.id).then((desiredItem) => {
            if (!desiredItem[0] || !desiredItem[0].item_id) {
                console.log("Sorry I couldn't find that item, please try again.")
            } else if (response.id == desiredItem[0].item_id) {
                var receipt = [{ ID: desiredItem[0].item_id, Name: desiredItem[0].product_name, "Unit Price": "$" + desiredItem[0].price, Quantity: response.amount, Subtotal: "$" + response.amount * desiredItem[0].price }]
                if (response.amount > desiredItem[0].stock_quantity) {
                    console.log("Sorry, it seems we don't have that many " + desiredItem[0].product_name + "s in stock right now. Please try a smaller amount, or purchase something else.")
                } else {
                    console.log("Great, here is your receipt! Thank you for shopping with Bamazon.\n")
                    console.table(receipt)
                    products.changeTable("stock_quantity", desiredItem[0].stock_quantity - response.amount, "item_id", desiredItem[0].item_id)
                    products.changeTable("product_sales", Number(desiredItem[0].product_sales) + (desiredItem[0].price*response.amount), "item_id", desiredItem[0].item_id)
                }
            } else {
                console.log("Something went wrong, please try again later.")
            }
            selectAction()
        });
    })
}

function numberValidate(input) {
    var isValid = !isNaN(parseFloat(input));
    return isValid || "Your input should be a number!";
}
selectAction()