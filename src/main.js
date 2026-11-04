import { ALLOWED_ORIGINS, port } from "../config/config.service.js";
import { connectionDB } from "./DB/connection.db.js";
import { globalErrorHandling } from "./middleware/index.js";
import { authRouter, messageRouter, userRouter } from "./modules/index.js";
import express from "express";
import cors from "cors"
import {  connectRedis } from "./DB/redis.connection.js";
import helmet from "helmet";

let corsOptions = {
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.includes(origin) || origin===undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS & Unauthorized origin"), false);
    }
  }
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet())

await connectionDB()
await connectRedis()

app.get("/", (req, res) => res.json({message:"Welcome to Eslam 3laa server"}));
app.use("/uploads",express.static("./uploads"))
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

app.use("{/*dummy}", (req, res) => {
  return res.status(404).json({ message: "Invalid application routing" });
});

app.use(globalErrorHandling);

app.listen(port, () => console.log(`Sara7a app listening on port ${port}!`));


