DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(60) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("EYEPhone", "Electronics", 389.95, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Bulk Deodorant (300 Count)", "Personal Care", 1215.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Wireless Computer", "Electronics", 879.55, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Frontless Dress", "Clothes", 6.99, 10000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Hoverboard", "Sports & Athletic Equipment", 22.35, 71);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Frozen Hearty Meals: Gooey Ooey Cheese Steak", "Food", 12.75, 641);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Frozen Hearty Meals: Not Horse Meat", "Food", 7.85, 752);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Ocean Spice Man Smell", "Personal Care", 19.25, 197);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Pew! Pew! Pew!: American Revolution 2", "Video Games", 58.99, 61000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("Rogkthar's Revenge: Into the Misty Valley", "Books", 19.99, 21000);