var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require("fs");
const cors = require("cors")

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "*"
}))

app.get('*', (req, res) => {
  const form = req.query.form;
  let returnForm = "";
  if(form === "SampleForm") {
    returnForm = fs.readFileSync(path.join(__dirname, "/database/SampleForm.md"))
  }
  if(returnForm === "")[
    returnForm = fs.readFileSync(path.join(__dirname, "/database/LandingPage.md"))
  ]
  res.send({
    form: String(returnForm)
  }).status(200);
});

app.listen(8080);