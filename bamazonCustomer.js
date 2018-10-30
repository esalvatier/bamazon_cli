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
        return (/^[0-9]/g.test(input) && input <= limit);
      }
    },
    {
      message: "How many would you like to buy?",
      name: "amount",
      validate: function (input) {
        return (/^[0-9]/g.test(input));
      }
    }
  ]).then(function (userInput) {
    var ident = userInput.identifier;
    var quant = userInput.amount;
    updateDB(ident, quant);
  });
}

function updateDB(id, amnt) {
  if (dbInfo[id - 1].stock_quantity < amnt) {
    console.log("Insufficient Quantity!");
  } else {
    connection.query("UPDATE products SET ? WHERE ?", [{
      stock_quantity: dbInfo[id - 1].stock_quantity - amnt
    }, {
      item_id: id
    }], function (err, res) {
      if (err) throw err;
    });

    console.log("\nTotal Cost: " + (dbInfo[id - 1].price * amnt) + "\nSuccessful Transaction");
    connection.end();
  }
}