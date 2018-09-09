# bamazon

INTRO:

Bamazon is a 3 part node project that runs on the CLI built for a homework assignment for Columbia University Web Development Bootcamp.

For a video demonstrating how each part of the application works, click on the link below.

DEMO VIDEO: https://drive.google.com/file/d/1MAbS12GquKQEIUzBdfbNqhpK0sLNghvE/view

INSTRUCTIONS:

1) In order to run the application you will need to clone the contents and run npm install to install all of the dependencies. 

2) Later you will need to set up your own mysql database, create tables (using code in schema.sql) and insert values (using code in seeds.sql).

3) Lastly you will need to add in the necessary information to access your database in database.js > Table constructor > this.config. 

*By default config values are set up for a local database named bamazon with no password.

DESCRIPTION:

bamazonCustomer.js --> Allows users to: 
    - view id, product name, department name and price for each product, and
    - (mock) purchase products.
users also get a 'receipt' for their products displaying id, name, unit price of item, quantity purchased and subtotal. Purchase totals are recorded for the managers and supervisors to be able to access in their corresponding apps.

bamazonManager.js --> Allows users to:
    - get a more extended view of all products that also displays stock quantities and product sales,
    - view items that are running low on inventory, 
    - add more of an existing item to inventory, 
    - add a new product, 
    - edit an existing item, and 
    - delete an existing item.

bamazonSupervisor.js --> Allows users to:
    - view department related information including id, name, overhead costs, sales totals and profits,
    - add new departments where managers can add new products.

METHOD:

I have made extensive use of the 'mysql' package in order to build a constructor (located in database.js) that allowed me to access any table in my database with ease. Most of the methods defined in the constructor return Promises, which makes them really easy to work with asynchronously. I plan on expanding this constructor over time and using it as a module in any future projects involving mysql databases.