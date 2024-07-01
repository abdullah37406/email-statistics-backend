const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid"); // To generate unique IDs for tracking

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost",
  database: "emails", // Your PostgreSQL database name
  password: "admin", // Your PostgreSQL password
  port: 5432, // Your PostgreSQL port
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
});

const emailAccounts = [
  { user: "caronjoel023@gmail.com", pass: "ecmh pvik lwha flbi" },
  { user: "dosogne.t2017@gmail.com", pass: "azzk izof ptte uuix" },
  { user: "shiraz.032031@gmail.com", pass: "dehi ugre sxau lntb" },
  { user: "ahmed012855556@gmail.com", pass: "hozm afeo ydpe clki" },
  { user: "mutuellefrancaise722@gmail.com", pass: "famo pwin errd nzjw" },
];

let currentAccountIndex = 0;
let recipients = [];

// Function to generate email body with click tracking
const emailBodyWithClickTracking = (body, trackingId, url) => {
  return `${body}<a href="http://localhost:3000/api/track-click?tid=${trackingId}&url=${encodeURIComponent(
    url
  )}">Click here</a>`;
};

function sendEmail(to, subject, body, url) {
  const trackingId = uuid.v4();

  const emailBody = emailBodyWithClickTracking(body, trackingId, url);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailAccounts[currentAccountIndex].user,
      pass: emailAccounts[currentAccountIndex].pass,
    },
  });

  const mailOptions = {
    from: emailAccounts[currentAccountIndex].user,
    to,
    subject,
    html: `${emailBody}<img src="http://localhost:3000/api/track-open?tid=${trackingId}" />`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error occurred when sending to ${to}:`, error);
    } else {
      console.log(
        `Email sent successfully to ${to} from ${emailAccounts[currentAccountIndex].user}: ${info.response}`
      );

      const queryInsert = `
  INSERT INTO email_statistics (uuid, subject, body, status)
  VALUES ($1, $2, $3, 'sent')
`;

      pool.query(queryInsert, [trackingId, subject, body], (err, results) => {
        if (err) {
          console.error("Error storing tracking data:", err);
        } else {
          console.log("Tracking data stored successfully");
        }
      });
    }
  });
}

app.post("/api/send-email", (req, res) => {
  const { to, subject, body, url } = req.body;
  sendEmail(to, subject, body, url);
  res.send({ message: "Email sent successfully" });
});

// Open tracking endpoint
app.get("/api/track-open", (req, res) => {
  const { tid } = req.query;
  console.log(`Email opened with tracking ID: ${tid}`);
  res.sendFile(__dirname + "/transparent.png"); // Return a 1x1 pixel transparent image
});

// Click tracking endpoint
app.get("/api/track-click", (req, res) => {
  const { tid, url } = req.query;
  console.log(`Link clicked with tracking ID: ${tid}`);

  // Update tracking data in the database
  const queryUpdate = `
      UPDATE email_statistics
      SET status = 'clicked'
      WHERE uuid = $1
    `;

  pool.query(queryUpdate, [tid], (err, results) => {
    if (err) {
      console.error("Error updating tracking data:", err);
      // Handle the error if needed
      res.status(500).send("Error updating tracking data");
    } else {
      console.log("Tracking data updated successfully");
      // Redirect to the specified URL after updating the database
      res.redirect(url);
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
