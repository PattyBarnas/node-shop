const Product = require("../model/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.imageUrl
  );
  console.log(product);
  product.save();
  res.redirect("/admin/products");
};

exports.getAdminProduct = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/product-list.ejs", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  console.log(prodId);

  Product.deleteById(prodId);
  res.redirect("/admin/products");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product.ejs", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDescription,
    updatedPrice
  );

  updatedProduct.save();
  res.redirect("/");
};
