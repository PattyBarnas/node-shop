const errorController = require("./controllers/error");
const express = require("express");
const bodyParser = require("body-parser");
const User = require("./model/user");
const mongoose = require("mongoose");
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.set("views", "views");

app.use((req, res, next) => {
  User.findById("648caadace12843967626101")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://pbarnas:test@shop.g7mtiea.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((result) => {
      const user = new User({
        name: "Patryk Barnas",
        email: "test@test.com",
        cart: {
          items: [],
        },
      });
      user.save();
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
