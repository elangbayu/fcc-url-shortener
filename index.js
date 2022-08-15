require("dotenv").config();
const dns = require("node:dns");
const express = require("express");
const { nanoid } = require("nanoid");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

let db = [];

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

app.post("/api/shorturl", function (req, res) {
  if (!isValidURL(req.body.url)) {
    res.json({
      error: "invalid url",
    });
  } else {
    const url = new URL(req.body.url);
    const hostname = url.hostname;
    dns.lookup(hostname, { family: 4 }, (err, addresses) => {
      if (err) {
        res.json({
          error: "Invalid Hostname",
        });
      } else if (addresses === "36.86.63.182") {
        res.json({
          error: "Invalid Hostname",
        });
      } else {
        const id = nanoid(10);
        res.json({
          original_url: req.body.url,
          short_url: id,
        });
        db.push({ id: id, url: req.body.url });
      }
    });
  }
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  const reqid = req.params.shorturl;
  const url = db.find(({ id }) => id === reqid);
  res.redirect(url.url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
