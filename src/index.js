const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routers/user.router");
const categoryRouter = require("./routers/categoy.router");
const publisherRouter = require("./routers/publisher.router");
const bookRouter = require("./routers/book.router");
const authorRouter = require("./routers/author.router");
const commentRouter = require("./routers/comment.router");
const billRouter = require("./routers/bill.router");
const cartRouter = require("./routers/cart.router");
const adminRouter = require("./routers/admin.router");
const addressVnRouter = require("./routers/address.vn.router");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://clonenick169:w80czikIFiNybzwu@bookstore.kfmtois.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

const address = require("./models/address.vn.model");
const test = () => {
  Object.keys(data).forEach(function (k) {
    var _dic = [];
    var _ward = [];
    Object.keys(data[k].district).forEach(function (j) {
      Object.keys(data[k].district[j].ward).forEach(function (l) {
        _ward.push({
          name: data[k].district[j].ward[l].name,
          code: data[k].district[j].ward[l].code,
        });
      });
      _dic.push({
        name: data[k].district[j].name,
        code: data[k].district[j].code,
        ward: _ward,
      });
    });
    const new_address = new address({
      city: data[k].name,
      district: _dic,
      code: data[k].code,
    });
    try {
      new_address.save();
    } catch (Err) {
      console.log(Err);
    }
  });
};
// test();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors());

userRouter(app);
categoryRouter(app);
publisherRouter(app);
bookRouter(app);
authorRouter(app);
commentRouter(app);
billRouter(app);
cartRouter(app);
adminRouter(app);
addressVnRouter(app);
app.get("/", (req, res) => {
  res.send("welcome to Book_store");
});

app.listen(port, () => console.log("server running on port " + port));
