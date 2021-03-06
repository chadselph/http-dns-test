"use strict";

const express = require("express");
const app = express();

const dns = require("dns").promises;
const https = require("https");
const url = require("url");
const fetch = require("node-fetch");

const staticLookup = (ip, v) => (hostname, opts, cb) => cb(null, ip, v || 4);
const staticDnsAgent = (scheme, ip) =>
  new require(scheme).Agent({ lookup: staticLookup(ip) });

app.use(express.json());

app.post("/dns", (req, res) => {
  dns
    .resolve(req.body.hostname)
    .then(
      results => res.send({ results: results }),
      failed => res.send({ error: failed })
    );
});

app.post("/request", (req, res) => {
  const url = new URL(req.body.url);
  const ip = req.body.ip;
  const hostname = url.hostname;
  const agent = staticDnsAgent(url.protocol.slice(0, -1), req.body.ip);
  fetch(
    url,
    {
      timeout: 5000,
      agent: agent
    },
    result => res.send(result)
  )
    .then(r =>
      r.text().then(body => res.send({ body: body, status: r.status }))
    )
    .catch(e => res.send({ error: e.message }))
    .finally(() => agent.destroy());
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
