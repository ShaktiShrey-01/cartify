import dotenv from "dotenv";
dotenv.config(
  {
    path:".env"
  }
);
import app from "./app.js";
import connectDb  from "./db/index.js";

const PORT = Number(process.env.PORT) || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      // Server started (log removed for production)
    })
  })
  .catch((err) => {
    console.error("Failed to start server:", err)
    process.exit(1)
  })
