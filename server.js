"use strict";
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const dns = require("dns").promises;
const https = require("https");
const url = require("url");

app.use(express.json());


app.post("/dns", (req, res) => {
  dns
    .resolveAny(req.body.hostname)
    .then(
      results => res.send({ results: results }),
      failed => res.send({ error: failed })
    );
});

app.post("/request", (req, res) => {
  const url = new URL(req.body.url);
  const ip = req.body.ip;
  const hostname = url.hostname;
  url.hostname = ip;
  https.get(
    url.toString(),
    {
      headers: { host: hostname },
      timeout: 5000
    },
    result => res.send(result)
  );
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
