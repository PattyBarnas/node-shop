const Product = require("../model/product");
const Cart = require("../model/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId, (product) => {
    res.render(`shop/product-detail`, {
      product: product,
      pageTitle: product.title,
      path: `/products`,
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart.ejs", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index.ejs", {
      prods: products,
      pageTitle: "Index",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
exports.getCheckout = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/checkout.ejs", {
      prods: products,
      pageTitle: "Check Out",
      path: "/checkout",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders.ejs", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
