const express = require("express");

const app = express();
app.use(express.json());

// API endpoint
app.post("/api/submit", (req, res) => {
  const { name } = req.body;
  res.send(`Hello ${name}, data received from backend`);
});

let isStressed = false;

app.get("/api/stress", (req, res) => {
  isStressed = true;
  res.send("Backend is now UNHEALTHY");
});

app.get("/api/recover", (req, res) => {
  isStressed = false;
  res.send("Backend RECOVERED");
});

let isBlocked = false;

app.get("/api/block", (req, res) => {
  if (isBlocked) return res.send("Already blocking");

  isBlocked = true;
  console.log("Blocking started");

  const start = Date.now();
  while (Date.now() - start < 20000) {}

  isBlocked = false;
  console.log("Blocking ended");

  res.send("Recovered");
});

app.get("/healthz", (req, res) => {
   if (isStressed) {
    return res.status(500).send("NOT OK"); // 👈 THIS triggers Route53 failover
  }
  res.status(200).send("OK");
});

app.get("/api/live", (req, res) => {
  res.status(200).send("ALIVE");
});

app.use((req, res, next) => {
  console.log("Incoming path:", req.path);
  next();
});

app.listen(80, () => {
    console.log("Backend running on port 80");
  });


