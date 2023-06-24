const Product = require("../model/product");
const Order = require("../model/order");

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    // console.log(products);
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId).then((product) => {
    res.render(`shop/product-detail`, {
      product: product,
      pageTitle: product.title,
      path: `/products`,
    });
  });
};

// BEFORE DB
// Cart.getCart((cart) => {
//   Product.fetchAll((products) => {
//     const cartProducts = [];
//     for (let product of products) {
//       const cartProductData = cart.products.find(
//         (prod) => prod.id === product.id
//       );
//       if (cartProductData) {
//         cartProducts.push({ productData: product, qty: cartProductData.qty });
//       }
//     }

//     res.render("shop/cart.ejs", {
//       pageTitle: "Cart",
//       path: "/cart",
//       products: cartProducts,
//     });
//   });
// });

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart.ejs", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
      });
      console.log(products, "pp");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findById(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    // console.log(products);
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
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("shop/orders.ejs", {
      pageTitle: "Orders",
      path: "/orders",
      orders: orders,
    });
  });
};
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: { name: req.user.name, userId: req.user },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    });
};
