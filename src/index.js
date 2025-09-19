import express from "express";
import { router } from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
