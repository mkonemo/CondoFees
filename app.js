const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

// ROOT

app.post("/", (req, res) => {

});

// ALL || 404
app.all('*', (req, res) => {
  res.send("404 page");
})

app.listen(3000, () => {
  console.log("Server running on port 3000. App: 'CondoFees'");
});
