const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");

const app = express();

//let fees = [{feeId:112, feeDesc:"Buy food", feePaymentReason:"Riscaldamento"}, {feeId: 432, feeDesc:"Cook food"}, {feeId:564, feeDesc:"Eat food", feePaid: "NO"}];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// INIT MONGOOSE
mongoose.connect("mongodb://localhost:27017/condoFeesDB", {
  useNewUrlParser: true
}); // setting DB connection

const feesSchema = {
  feeId: {type: Number},
  feeDescription: String,
  feeAmount: Number,
  feeDueDate: {type: Date, default: Date.now, required: false},
  feePaid: String,
  feePaymentDate: {type: Date, default: Date.now, required: false},
  feePaymentMethod: String,
  feePaymentReason: String
}

const Fee = mongoose.model("Fee", feesSchema);

const fee1 = new Fee({
  feeId: 01,
  feeDescription: "Test fee description",
  feeAmount: 00,
  feeDueDate: new Date(),
  feePaid: "off",
  feePaymentMethod: "bonifico",
  feePaymentDate: new Date(),
  feePaymentReason: "Test payment"
});

const defaultFees = [fee1];

// ROOT

app.get("/", function(req, res) {
  let day = new Date().toLocaleDateString('en-GB',{
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  Fee.find({}, function(err, foundFees) {
    if (foundFees.length === 0) {
      Fee.insertMany(defaultFees, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Condo Fees up to " + day,
        feeList: foundFees
      });
    }
  })
});

app.post("/", function(req, res) {
  console.log(req.body);

  const fee = new Fee ({
    feeId: req.body.feeId,
    feeDescription: req.body.feeDescription,
    feeAmount: req.body.feeAmount,
    feeDueDate: new Date(req.body.feeDueDate),
    feePaid: req.body.feePaid,
    feePaymentMethod: req.body.feePaymentMethod,
    feePaymentDate: new Date(req.body.feePaymentDate),
    feePaymentReason: req.body.feePaymentReason
  })

  fee.save();
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
