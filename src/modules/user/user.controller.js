import { profile, rotate } from "./user.service.js";
import { Router } from "express";
import {successResponse} from"../../common/utils/response/index.js"
import { authentication } from "../../middleware/index.js";
import { TOKEN_TYPE } from "../../common/enum/token.enum.js";
import { authorization } from "../../middleware/authorization.middleware.js";
import { RoleEnum } from "../../common/enum/role.enum.js";
const router = Router();

router.get("/profile",authentication(TOKEN_TYPE.access),authorization([RoleEnum.ADMIN,RoleEnum.USER]), async(req, res, next) => {
  const result = await profile(req.user);
  
  successResponse({
    res,
    status:200,
    message:"done on search",
    data:result
  })
});

router.post("/rotate-token",authentication(TOKEN_TYPE.refresh), async(req, res, next) => {
  const result = await rotate(req.payload,req.user,`${req.protocol}://${req.host}`);
  
  successResponse({
    res,
    status:200,
    message:"done on search",
    data:result
  })
});
export default router;
