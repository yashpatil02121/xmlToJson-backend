import express from "express";
import { router } from "./routes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

app.use(express.json());

// routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
