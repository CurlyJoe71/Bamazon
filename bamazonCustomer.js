var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');
var items = [];

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Jmg070181mu$ic",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department', 'Price'],
            style: {
                head: ['yellow'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price]
            );
            items.push(results[i].product_name);
        }
        console.log(table.toString());
        console.log(' ');

        inquirer.prompt([
            {
                type: "list",
                name: "id",
                message: colors.blue("Which item would you like to purchase?"),
                choices: items
            },
            {
                type: "input",
                name: "quantity",
                message: colors.green.italic("How much of this item would you like to order?"),
                validate: function (value) {
                    if (isNaN(value)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ])
            .then(function (answer) {

                connection.query('SELECT * FROM products WHERE ?', {product_name: answer.id},
                function(err, stockItem) {
                    if (err) throw err;
                    
                    if (stockItem[0].stock_quantity > answer.quantity) {
                        console.log(colors.rainbow("I can do that for you!"));
                        connection.query('UPDATE products SET ? WHERE ?', [{stock_quantity: stockItem[0].stock_quantity - answer.quantity}, {product_name: answer.id}], function(err, res) {
                            if (err) throw err;
                            console.log('Great! You\'re total is: ' + colors.bgMagenta(stockItem[0].price * answer.quantity));
                            reprompt();
                        })
                    }
                    else {
                        console.log(colors.red("I'm afraid we don't have enough in stock to fill that order."));
                        reprompt();
                    }
                });//end of stockItem query

            })//end of inquirer.then

    });//end of connection.query

};//end of function start

function reprompt(){
    inquirer.prompt([{
      type: "confirm",
      name: "reply",
      message: colors.rainbow("Would you like to purchase another item?")
    }]).then(function(ans){
      if(ans.reply){
        start();
      } else{
        console.log(colors.yellow("See you soon!"));
        connection.end();
      }
    });
  };