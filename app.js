const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");

const app = express();

let fees = [{feeId:112, feeDesc:"Buy food"}, {feeId: 432, feeDesc:"Cook food"}, {feeId:564, feeDesc:"Eat food"}];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// ROOT

app.get("/", function(req, res) {
  let day = date.getDate();

  res.render("list", {
    listTitle: "Condo Fees up to " + day,
    newListFees: fees
  });
});

app.post("/", function(req, res) {
  console.log(req.body);

  let fee = {feeId:req.body.feeId, feeDesc:req.body.feeDescription, dueDate:req.body.dueDate};

    fees.push(fee);
    console.log(fees);
    res.redirect("/");

});



// ALL || 404
app.all('*', (req, res) => {
  // res.send("<h1>Ops! Page not found</h1>");
  res.render("404", {

  });
})

app.listen(3000, () => {
  console.log("Server running on port 3000. App: 'CondoFees'");
});
