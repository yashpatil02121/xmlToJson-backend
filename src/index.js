import express from "express";
import { router } from "./routes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local dev
      "https://xmltojson-frontend.onrender.com" // deployed frontend
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
