const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");

const app = express();

let fees = [{feeId:112, feeDesc:"Buy food", feePaymentReason:"Riscaldamento"}, {feeId: 432, feeDesc:"Cook food"}, {feeId:564, feeDesc:"Eat food", feePaid: "NO"}];

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

  let fee = {
    feeId:req.body.feeId,
    feeDesc:req.body.feeDescription,
    feeDesc:req.body.feeAmount,
    feeDueDate: new Date(req.body.feeDueDate).toLocaleDateString('en-GB'),
    feePaid:req.body.feePaid,
    feePaymentMethod:req.body.feePaymentMethod,
    feePaymentDate:new Date(req.body.feePaymentDate).toLocaleDateString('en-GB'),
    feePaymentReason:req.body.feePaymentReason
  }

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
