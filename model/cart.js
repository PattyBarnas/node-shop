const fs = require("fs");
const pathUtil = require("../util/path");
const path = require("path");
// Helper function
const p = path.join(pathUtil, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        // console.log("no error", cart);
        cart = JSON.parse(fileContent);
      }
      //analyze cart ==> find exisiting products

      const exisitingProductsIndex = cart.products.findIndex((prod) => {
        return prod.id === id;
      });
      const exisitingProducts = cart.products[exisitingProductsIndex];

      let updatedProduct;
      if (exisitingProducts) {
        console.log("exisiting");
        updatedProduct = { ...exisitingProducts };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[exisitingProductsIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      //add new product / increase quantity
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};