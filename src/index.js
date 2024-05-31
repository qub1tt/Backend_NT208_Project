const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("./utils/cloudinary");
const userRouter = require("./routers/user.router");
const categoryRouter = require("./routers/categoy.router");
const publisherRouter = require("./routers/publisher.router");
const bookRouter = require("./routers/book.router");
const authorRouter = require("./routers/author.router");
const commentRouter = require("./routers/comment.router");
const billRouter = require("./routers/bill.router");
const adminRouter = require("./routers/admin.router");
const cartRouter = require("./routers/cart.router");
const chatBotRouter = require("./routers/chatbot.router");
const paymentRouter = require("./routers/payment.router");
const dotenv = require("dotenv");
dotenv.config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

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
chatBotRouter(app);
paymentRouter(app);
app.get("/", (req, res) => {
  res.send("welcome to Book_store");
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`"server running on port ${PORT}"`));
