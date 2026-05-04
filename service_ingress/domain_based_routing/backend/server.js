const express = require("express");

const app = express();
app.use(express.json());

/* -------------------------------
   Precomputed (cached) reports
--------------------------------*/
const precomputedReports = {
  sales: "Sales Report: ₹10,000",
  users: "User Report: 120 users",
  orders: "Orders Report: 45 orders",
};

/* -------------------------------
   Small report (fast path)
--------------------------------*/
app.post("/api/submit", (req, res) => {
  const { name } = req.body;

  const result =
    precomputedReports[name?.toLowerCase()] ||
    "Default small report data";

  console.log("Small report served:", name);

  res.send(result);
});

/* -------------------------------
   Stress (dependency failure)
--------------------------------*/
let isStressed = false;

app.get("/api/stress", (req, res) => {
  isStressed = true;
  console.log("Backend marked UNHEALTHY");
  res.send("Backend is now UNHEALTHY");
});

app.get("/api/recover", (req, res) => {
  isStressed = false;
  console.log("Backend RECOVERED");
  res.send("Backend RECOVERED");
});

/* -------------------------------
   Block (CPU-heavy simulation)
--------------------------------*/
let isBlocked = false;

app.get("/api/block", (req, res) => {
  if (isBlocked) return res.send("Already blocking");

  isBlocked = true;
  console.log("Blocking started (CPU spike)");

  const start = Date.now();

  // simulate heavy computation
  while (Date.now() - start < 20000) {}

  isBlocked = false;
  console.log("Blocking ended");

  res.send("Large report generated (after heavy processing)");
});

/* -------------------------------
   Health check (readiness)
--------------------------------*/
app.get("/healthz", (req, res) => {
  if (isStressed) {
    return res.status(500).send("NOT OK");
  }
  res.status(200).send("OK");
});

/* -------------------------------
   Liveness check
--------------------------------*/
app.get("/api/live", (req, res) => {
  res.status(200).send("ALIVE");
});

/* -------------------------------
   Logger
--------------------------------*/
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.path);
  next();
});

/* -------------------------------
   Start server
--------------------------------*/
app.listen(80, () => {
  console.log("Backend running on port 80");
});
