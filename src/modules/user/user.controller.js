import { logout, profile, rotate, uploadProfilePhoto } from "./user.service.js";
import { Router } from "express";
import {successResponse} from"../../common/utils/response/index.js"
import { authentication, authorization, uploadMiddleware } from "../../middleware/index.js";
import { TOKEN_TYPE } from "../../common/enum/token.enum.js";
import { RoleEnum } from "../../common/enum/role.enum.js";
import { fileTypeValidation, localFileUpload } from "../../common/utils/multer/local.multer.js";
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


router.post("/logout",authentication(TOKEN_TYPE.access), async (req, res, next) => {
    const result = await logout(req.user,req.payload,req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"user logout successfully"
    })
})

router.post("/profile_photo"
  ,authentication(TOKEN_TYPE.access)
  ,uploadMiddleware({
    multerMiddleware:localFileUpload({customPath:`/Admin`,customTypes:[...fileTypeValidation.image]}).single("attachment"),
    validation:[...fileTypeValidation.image],
    customPath:"user"
  })
  ,async (req, res, next) => {
    const result = await uploadProfilePhoto(req.file, req.user)

    successResponse({
        res,
        status:201,
        data:result,
        message:"photo uploaded successfully"
    })
})



export default router;
