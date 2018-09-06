USE bamazon;
CREATE TABLE products (
item_id INT(11) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(50) NOT NULL,
price INT(11) NOT NULL,
stock_quantity INT(11) NOT NULL,
PRIMARY KEY (item_id)
);

CREATE TABLE departments(
    department_id INT(11) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INT(11) NOT NULL,
    PRIMARY KEY (department_id)
);

