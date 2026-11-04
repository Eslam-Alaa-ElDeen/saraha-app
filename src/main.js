import { ALLOWED_ORIGINS, port } from "../config/config.service.js";
import { connectionDB } from "./DB/connection.db.js";
import { globalErrorHandling } from "./middleware/index.js";
import { authRouter, messageRouter, userRouter } from "./modules/index.js";
import express from "express";
import cors from "cors"
import {  connectRedis } from "./DB/redis.connection.js";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";


let corsOptions = {
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.includes(origin) || origin===undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS & Unauthorized origin"), false);
    }
  }
}

const limiter=rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  handler: function (req, res,next) {
    return res.status(429).json({
      message: "Too many requests, please try again later."
    });
  },
  keyGenerator: function (req, res) {
    const ip=ipKeyGenerator(req.ip,52)
    return `${ip}-${req.method}-${req.originalUrl}`;
  },
  legacyHeaders: false,
  standardHeaders:true
})

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors(corsOptions));
app.use(limiter);
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


