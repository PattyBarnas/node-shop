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
  static deleteProduct = (id, productPrice) => {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((p) => p.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  };

  static getCart = (cb) => {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  };
};
