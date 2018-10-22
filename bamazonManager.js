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
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: colors.blue("Hello, Hot Shit. What would you like to do today?"),
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
        .then(function (answer) {
            switch (answer.option) {
                case "View Products for Sale":
                    view();
                    break;
                case "View Low Inventory":
                    low();
                    break;
                case "Add to Inventory":
                    add();
                    break;
                case "Add New Product":
                    addNew();
                    break;
            };
        });
}; // end of function start

function view() {
    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department', 'Price', 'Quantity'],
            style: {
                head: ['yellow'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
        }
        console.log(table.toString());
        console.log(' ');
        reprompt();
    }
    )
};

function low() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, results) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department', 'Price', 'Quantity'],
            style: {
                head: ['yellow'],
                compact: false,
                colAligns: ['center'],
            }
        });

        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
            items.push(results[i].product_name);
        }
        console.log(colors.rainbow("Here's what you've got that under a quantity of 5."))
        console.log(table.toString());
        console.log(' ');
        reprompt();
    }
    )
}; //end of function low

function add() {

    connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            items.push(results[i].product_name);
        };

        inquirer.prompt([
            {
                type: "list",
                name: "id",
                message: colors.blue("The quantity of which item needs to be increased?"),
                choices: items
            },
            {
                type: "input",
                name: "quantity",
                message: "What will the new quantity be?",
                validate: function (value) {
                    if (isNaN(value)) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        ])
            .then(function (answer) {
                connection.query('UPDATE products SET ? WHERE ?', [{ stock_quantity: answer.quantity }, { product_name: answer.id }], function (err, res) {
                    if (err) throw err;
                    console.log(colors.rainbow(`Okay. We've increased ${answer.id}'s to a total of ${answer.quantity}!`))
                    console.log(' ');
                    reprompt();
                });
            })
    });//end of query
};//end of function add

function addNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "productName",
            message: "What's the name of the product you'd like to add to the inventory?"
        },
        {
            type: "input",
            name: "departmentName",
            message: "And to which department does this new item belong?"
        },
        {
            type: "input",
            name: "price",
            message: "What's the price of each item?",
            validate: function (value) {
                if (isNaN(value)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "And how much will we start with in stock?",
            validate: function (value) {
                if (isNaN(value)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ])
        .then(function (answer) {
            connection.query('INSERT INTO products SET ?', {
                product_name: answer.productName,
                department_name: answer.departmentName,
                price: answer.price,
                stock_quantity: answer.quantity
            }, function (err, res) {
                if (err) throw err;
                console.log(colors.bgMagenta(`Cool. We've added ${answer.quantity} ${answer.productName}s at the price of ${answer.price} each with a starting quantity of ${answer.quantity} to the new product the inventory.`))    
                console.log(' ');
                reprompt();
            })
        })
};//end of function addNew

function reprompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "reply",
        message: colors.rainbow("Is there something else you'd like to do today?")
    }]).then(function (ans) {
        if (ans.reply) {
            start();
        } else {
            console.log(colors.yellow("See you soon!"));
            connection.end();
        }
    });
};