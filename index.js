const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/user");
const Product = require("./db/product");
const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
});

// login Api
app.post("/login", async (req, resp) => {
  console.warn(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: "No User Found" });
    }
  } else {
    resp.send({ result: "No User Found" });
  }
});

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});
app.get("/products", async (req, resp) => {
  let result = await Product.find();
  if (result.length > 0) {
    resp.send(result);
  } else {
    resp.send({ result: "No Product found" });
  }
});
app.delete("/product/:id", async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});
app.get("/product/:id", async (req, resp) => {
  const id = req.params.id.trim();
  let result = await Product.findOne({ _id: id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No REcord Found" });
  }
});
app.put("/product/:id", async (req, resp) => {
  const id = req.params.id.trim();

  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  resp.send(result);
});
// app.get("/search/:key", async (req, resp) => {
//   let result = await Product.find({
//     or: [
//       {
//         name: { $regex: req.params.key },
// //       },
//       {
//         price: { $regex: req.params.key },
//       },
//       {
//         category: { $regex: req.params.key },
//       },
//     ],
//   });
//   resp.send(result);
// });
app.get("/search/:key", async (req, resp) => {
  let result = await Product.find({
    or: [
      { name: { $regex: req.params.key } },
      {
        price: { $regex: req.params.key },
      },
      {
        category: { $regex: req.params.key },
      },
      {
        company: { $regex: req.params.key },
      },
    ],
  });
  resp.send(result);
});
app.listen(5000);
