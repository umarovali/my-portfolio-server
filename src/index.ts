import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { contactRouter } from "./routes/contact";
import { aiRouter } from "./routes/ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-porftfolio-ali.netlify.app"],
  }),
);

app.use(express.json());

app.use("/api", contactRouter);
app.use("/api/ai", aiRouter);

app.get("/", (_, res) => {
  res.json({ status: "ok", message: "Portfolio API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
