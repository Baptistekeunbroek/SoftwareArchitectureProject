require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(require("./controllers/products"));

app.listen(process.env.PORT || 5053, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 5053}`)
);

require("./passport")(app);
