const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");

const app = express();

//let fees = [{feeId:112, feeDesc:"Buy food", feePaymentReason:"Riscaldamento"}, {feeId: 432, feeDesc:"Cook food"}, {feeId:564, feeDesc:"Eat food", feePaid: "NO"}];

let alreadyPaid = 0;
let toBePaid = 0;

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
  feeDueDate: {type: Date, required: false},
  feePaid: String,
  feePaymentDate: {type: Date, required: false},
  feePaymentMethod: String,
  feePaymentReason: String
}

const Fee = mongoose.model("Fee", feesSchema);



// ROOT

app.get("/", function(req, res) {
  let day = new Date().toLocaleDateString('en-GB',{
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  Fee.find({}, function(err, foundFees) {

      res.render("list", {
        listTitle: "Condo Fees up to " + day,
        alreadyPaid: alreadyPaid,
        toBePaid: toBePaid,
        feeList: foundFees
      });

  })
});

app.post("/", function(req, res) {



  console.log(req.body);

  const fee = new Fee ({
    feeId: req.body.feeId,
    feeDescription: req.body.feeDescription,
    feeAmount: req.body.feeAmount,
    feeDueDate: req.body.feeDueDate,
    feePaid: req.body.feePaid,
    feePaymentMethod: req.body.feePaymentMethod,
    feePaymentDate: req.body.feePaymentDate,
    feePaymentReason: req.body.feePaymentReason
  })

  fee.save();
  res.redirect("/");

});

// DELETE DOCUMENT FROM DB
app.post("/delete", (req, res) => {
  const selectedFeeId = req.body.deleteBtn;
  Fee.findByIdAndRemove(selectedFeeId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Item deleted");
      res.redirect("/");
    }
  })
})

// ALL || 404
app.all('*', (req, res) => {
  // res.send("<h1>Ops! Page not found</h1>");
  res.render("404", {

  });
})

app.listen(3000, () => {
  console.log("Server running on port 3000. App: 'CondoFees'");
});
