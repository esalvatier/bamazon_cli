var inquirer = require("inquirer");
var secret = require("./password");
var mysql = require("mysql");
var limit = 0;

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

productDisplay();

function productDisplay() {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, res) {
      if (err) throw err;
      res.forEach(product => {
        console.log("ID: " + product.item_id + " | Name: " + product.product_name + " | Price: $" + product.price);
        limit = product.item_id;
      });
      console.log("\n");
      purchaseOrder(res);
    });
  });
}

function purchaseOrder(dbInfo) {
  inquirer.prompt([{
      message: "What is the ID of the product your are look got purchase?",
      name: "identifier",
      validate: function (input) {
        return (/^\d{1}/g.test(input) && input <= limit);
      }
    },
    {
      message: "How many would you like to buy?",
      name: "amount",
      validate: function (input) {
        return (/^\d/g.test(input));
      }
    }
  ]).then(function (userInput) {
    updateDB(dbInfo, userInput.identifier, userInput.amount);
  });
}

function updateDB(products, id, amnt) {
  var totalPrice = products[id - 1].price * amnt;
  if (products[id - 1].stock_quantity < amnt) {
    console.log("Insufficient Quantity!");
  } else {
    connection.query("UPDATE products SET ? ,? WHERE ?", [{
        stock_quantity: products[id - 1].stock_quantity - amnt
      },
      {
        product_sales: products[id - 1].product_sales + (totalPrice)
      },
      {
        item_id: id
      }
    ], function (err, res) {
      if (err) throw err;
    });

    console.log("\nTotal Cost: $" + (totalPrice.toFixed(2)) + "\nSuccessful Transaction");
  }
  inquirer.prompt([{
    type: "confirm",
    message: "Would you like to  try making another purchase?",
    name: "again",
    default: false
  }]).then(function (userInput) {
    if (userInput.again) {
      connection.query("SELECT * FROM products", function (err, res) {
        purchaseOrder(res);
      });
    } else {
      connection.end();
    }
  })
}