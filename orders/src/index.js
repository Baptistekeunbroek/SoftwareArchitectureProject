require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

require("./passport")(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// Routes
app.use(require("./controllers/orders"));

app.listen(process.env.PORT || 5051, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 5051}`)
);
