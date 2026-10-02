import { profile } from "./user.service.js";
import { Router } from "express";
import {successResponse} from"../../common/utils/response/index.js"
const router = Router();

router.get("/profile", async(req, res, next) => {
  const result = await profile(req.headers.authorization);
  
  successResponse({
    res,
    status:200,
    message:"done on search",
    data:result
  })
});
export default router;
