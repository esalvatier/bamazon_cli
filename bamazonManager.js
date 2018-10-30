var inquirer = require("inquirer");
var secret = require("./password");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: secret.password.pass,
  database: "bamazon_db"
});

var options = [{
  type: "list",
  message: "What do you want to do?",
  name: "action",
  choices: [{
      name: "View Products for Sale",
      value: "sale"
    },
    {
      name: "View Low Inventory",
      value: "inventory"
    },
    {
      name: "Add to Inventory",
      value: "add"
    },
    {
      name: "Add New Product",
      value: "new"
    }
  ]
}];

inquirer.prompt(options).then(function (userInput) {
  doThingToDB(userInput.action);
});


function doThingToDB(action) {
  switch (action) {
    case "sale":
      productDisplay();
      break;
    case "inventory":
      lowProduct();
      break;
    case "add":
      addInventory();
      break;
    case "new":
      addProduct();
      break;
  }
};

function productDisplay() {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      res.forEach(product => {
        console.log("ID: " + product.item_id + " | Name: " + product.product_name + " | Price: $" + product.price + " | Quantity: " + product.stock_quantity);
        limit = product.item_id;
      });
      console.log("\n");
      connection.end()
    });
  });
};

function lowProduct() {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
      if (err) throw err;
      res.forEach(product => {
        console.log("ID: " + product.item_id + " | Name: " + product.product_name + " | Price: $" + product.price);
        limit = product.item_id;
      });
      console.log("\n");
      connection.end()
    });
  });
};

function addInventory() {
  var productList = []
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      res.forEach(product => {
        productList.push(product);
      });
    });
    inquirer.prompt([{
        message: "Enter the ID of the product you wish to add inventory too: ",
        name: "id",
        validate: function (input) {
          return (/^[0-9]/g.test(input));
        }
      },
      {
        message: "How much of the product do you want add?",
        name: "amnt",
        validate: function (input) {
          return (/^[0-9]/g.test(input));
        }
      }
    ]).then(function (userInput) {

      connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: (productList[userInput.id - 1].stock_quantity + parseInt(userInput.amnt))
      }, {
        item_id: userInput.id
      }], function (err, res) {
        if (err) throw err;
      });
      connection.end()
      console.log("Inventory Successfully Added");
    })
  });
}

function addProduct() {
  var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE (?, ? , ?, ?);";
  inquirer.prompt([{
      message: "What is the name of the product you wish to add?",
      name: "product_name",
      validate: function (input) {
        return (input.length > 0);
      }
    },
    {
      message: "What department should the product be added too?",
      name: "department_name",
      validate: function (input) {
        return (input.length > 0);
      }
    },
    {
      message: "What price should the product be sold for? (no greater than 99999999.99)",
      name: "price",
      validate: function (input) {
        return (/(\d{1,8})+\.{1}\d{1,2}/.test(input));
      }
    },
    {
      message: "How much initial stock would you like to add?",
      name: "stock_quantity",
      validate: function (input) {
        return (/^[0-9.]/g.test(input));
      }
    }
  ]).then(function (userInput) {
    var info = [];
    info.push(userInput.product_name, userInput.department_name, userInput.price, userInput.stock_quantity);
    connection.query(sql, info, function (err, res) {
      if (err) throw err;
      connection.end();
      console.log("Product Successfully Added!");
    });
  });
}