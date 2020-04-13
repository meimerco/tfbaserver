const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "./views/",
    layoutsDir: "./views/",
    defaultLayout: "layout.hbs",
  },
  viewPath: "./views/",
  extName: ".hbs",
};

// transporter.use("compile", hbs(handlebarOptions));

app.use(
  cors({
    origin: process.env.CLIENT || "http://localhost:3000",
    credentials: true,
  })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello Node + GitHub! This code push has auto-deployed!");
});

app.get("/api/contactForm", (req, res) => {
  res.send("send contact form");
});

app.post("/api/contactForm", (req, res) => {
  const data = req.body;
  // var mailOptions = {
  //   from: process.env.EMAIL_USERNAME,
  //   to: process.env.CONTACT_FORM_SEND_TO,
  //   cc: process.env.CONTACT_FORM_CC,
  //   subject: "You've got a contact request from TacticalFBA",
  //   template: "contactformreply",
  //   context: { data },
  // };
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  const msg = {
    to: process.env.CONTACT_FORM_SEND_TO,
    from: process.env.EMAIL_USERNAME,
    cc: process.env.CONTACT_FORM_CC,
    subject: "You've got a contact request from TacticalFBA",
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage:${data.message}`,
  };
  sgMail
    .send(msg)
    .then((res) => {
      console.log(res);
    })
    .then(() => {
      res.send("contact form sent");
    })
    .catch((err) => console.log(err));
});

app.get("/api/orderEmail", (req, res) => {
  res.send("order email server");
});

app.post("/api/orderEmail", (req, res) => {
  const data = req.body;
  console.log(data);

  var mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: data.info.user,
    cc: process.env.CONTACT_FORM_CC,
    subject: `TacticalFBA Order Confirmation`,
    text: data.info.date,
    template: "orderEmail",
    context: { data },
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.send("order email sent");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
