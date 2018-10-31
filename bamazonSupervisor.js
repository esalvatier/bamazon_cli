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

function superVisorPrompt() {
  inquirer.prompt([{
    type: "list",
    message: "What do you want to do?",
    name: "action",
    choices: [{
        name: "View Product Sales by Department",
        value: "view"
      },
      {
        name: "Create New Department",
        value: "new"
      },
      {
        name: "Exit",
        value: "exit"
      }
    ]
  }]).then(function (userIput) {
    switch (userIput.action) {
      case "view":
        viewDepartments();
        break;
      case "new":
        newDeparment();
        break;
      case "exit":
        connection.end();
        break;
    }
  })
}

function viewDepartments() {
  connection.query("SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales, (product_sales - over_head_costs) AS total_profits FROM departments LEFT JOIN products ON products.department_name = departments.department_name GROUP BY departments.department_id", function (err, res) {
    if (err) throw err;
    var headers = ["department_id", "department_name", "over_head_costs", "product_sales", "total_profits"];
    console.log("| " + headers.join(" | ") + " |");
    res.forEach(department => {
      var id = "";
      if (department.department_id <= 9) {
        id += "0" + department.department_id;
      } else {
        id += department.department_id;
      }
      console.log("| " + pad(id, "             ") + " | " + pad(department.department_name, "               ") + " | " + pad(department.over_head_costs, "               ") + " | " + pad(department.product_sales, "             ") + " | " + pad(department.total_profits, "             ") + " |");
    });
    superVisorPrompt();
  });
}

function newDeparment() {
  inquirer.prompt([{
      message: "What is the name of the new department?",
      name: "name",
      validate: function (input) {
        return (input.length <= 60);
      },
    },
    {
      message: "What is the over head cost for the department? (must come in decimal format)",
      name: "overhead",
      validate: function (input) {
        return (/^(\d{1,18})+\.{1}(\d{1,2})$/g.test(input)) && (input.length <= 21);
      }
    }
  ]).then(function (userIput) {
    connection.query("INSERT INTO departments (department_name, over_head_costs) VALUE (?, ?)", [userIput.name, userIput.overhead], function (err, res) {
      if (err) throw err;
    });
    superVisorPrompt();
  });
}

function pad(str, padding) {
  return String(padding + str).slice(-padding.length);
}

connection.connect(function (err) {
  if (err) throw err;
  superVisorPrompt();
})