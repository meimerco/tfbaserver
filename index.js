const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: new URL("https://www.tacticalfba.com/"),
    credentials: true,
  })
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.get("/", (req, res) => {
  res.send("TacticalFBA");
});

app.post("/api/contactForm", (req, res) => {
  const data = req.body;
  console.log(data);
  const msg = {
    to: process.env.CONTACT_FORM_SEND_TO,
    from: { email: process.env.EMAIL_USERNAME_SERVICE, name: "TacticalFBA" },
    subject: "You've got a contact request from TacticalFBA",
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => console.log(err));
});

app.post("/api/orderEmail", (req, res) => {
  const data = req.body;
  console.log(data);

  const msg = {
    to: data.info.user,
    from: { email: process.env.EMAIL_USERNAME, name: "TacticalFBA" },
    template_id: "d-428e70d4b7544649b3499499ab220c06",
    dynamic_template_data: data,
  };

  sgMail
    .send(msg)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => console.log(err));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
