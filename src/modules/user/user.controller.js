import { profile } from "./user.service.js";
import { Router } from "express";
const router = Router();

router.get("/", (req, res, next) => {
  const result = profile(req.query.id);
  return res.status(200).json({ message: "Profile", result });
});
export default router;
