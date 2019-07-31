/* THIRD PARTY LIBRARIES */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const nunjucks = require("nunjucks");
const request = require("request");

// const flash = require("express-flash");

const app = express();

app.use(helmet());
/* Middlewares for setting up templates and static folders - SPECIFICALLY FOR BUILDING WEB PAGES LATER ON */
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
  noCache: true
});

app.set("view engine", "html");
app.use(express.static(__dirname + "/public"));
/* END */

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App URL
app.get("/", (req, res) => {
  res.render("landing");
});

// // Post to mailchimp and redirect to thank you
app.post("/", (req, res) => {
    request({
        url: 'https://us3.api.mailchimp.com/3.0/lists/1bec33e3d1/members',
        method: 'POST',
        headers: {
            'Authorization': 'randomUser 51d7a64048d539757fae3a3bb0068f39-us3',
            'Content-Type': 'application/json'
        },
        json: {
            'email_address': req.body.email,
            'status': 'subscribed'
        }
    }, (err, response, body) => {
        console.log(err)
        console.log(response)
        if (err) {
            return res.redirect('/error');
        } else {
            return res.redirect('/thank-you')
        }
    });
});

app.get("/thank-you", (req, res) => {
  res.render("thank-you");
});

app.listen(8000, err => {
  if (err) console.log(err);
  console.log(`Running on port 8000`);
});
