require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");
const memoryRoutes = require("./routes/memory");

const app = express();
const port = process.env.PORT || 50902;

if (!db) {
  console.error("Failed to initialize Firestore");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", memoryRoutes);

const server = app
  .listen(port, () => {
    console.log(`Server running on port ${server.address().port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy, trying the next one...`);
      server.listen(0); // automatically assign an available port
    } else {
      console.error("Error starting server:", err);
    }
  });
