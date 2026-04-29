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

app.get("/healthz", (req, res) => {
   if (isStressed) {
    return res.status(500).send("NOT OK"); // 👈 THIS triggers Route53 failover
  }
  res.status(200).send("OK");
});

app.get("/live", (req, res) => {
  res.status(200).send("ALIVE");
});

app.use((req, res, next) => {
  console.log("Incoming path:", req.path);
  next();
});

app.listen(80, () => {
    console.log("Backend running on port 80");
  });


