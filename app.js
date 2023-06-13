const errorController = require("./controllers/error");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./model/user");
const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.set("views", "views");

app.use((req, res, next) => {
  User.findById("64886add64eb7ce933a29cd5")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  console.log("connected");
  app.listen(3000);
});
