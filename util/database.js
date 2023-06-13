const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://pbarnas:test@shop.g7mtiea.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;