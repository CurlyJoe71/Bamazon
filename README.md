# Bamazon
Welcome ot my CLI using Node.js and SQL to create a small version of an online store.

This app also uses the npm cli-table and colors packages to add some extra user-friendly styling.

The customer can use `node bamazonCustomer.js` to access the purchasing functions of the app.

The manager can use `node bamazonManager.js` to manipulate the inventory.

## **bamazonCustomer.js**
After viewing the current inventory, the customer can select which item they'd like to purchase. Then they cna indicate how much they'd like to purchase. If the inventory doesn't have enough for the order, the customer will be notified and allowed to continue with a different purchase.

## **bamazonManager.js**
The manager has several options:
* View the current inventory, including:
    * id
    * Name of Product
    * Department
    * Price
    * Quantity of product in stock

* View those items the quantity of which are under 5

* Adjust the total stock quantity of any item

* Add a completely new item to the global inventory

![gif of demo](/images/bamazon_demo.gif)


