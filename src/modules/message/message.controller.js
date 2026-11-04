import {Router}from"express";
import {successResponse} from"../../common/utils/response/index.js"
import { authentication, authorization, uploadMiddleware, Validation } from "../../middleware/index.js";
import { TOKEN_TYPE } from "../../common/enum/token.enum.js";
import { RoleEnum } from "../../common/enum/role.enum.js";
import { deleteMessage, getMessage, getMessages, sendMessage, sendMessageByAccount } from "./message.service.js";
import { fileTypeValidation, localFileUpload } from "../../common/utils/multer/local.multer.js";
import { deleteMessagesSchema, getMessageSchema, getMessagesSchema, sendMessageSchema } from "./message.validation.js";

const router = Router();

router.get("/",authentication(TOKEN_TYPE.access),Validation(getMessagesSchema), async(req, res, next) => {
    const { dataInfo, ...messages } = await getMessages(req.query,req.user);
    
    successResponse({
        res,
        status:200,
        message:"done on search",
        data:{
            ...dataInfo,
            messages
        }
    })
});

router.delete("/:messageId",authentication(TOKEN_TYPE.access),Validation(deleteMessagesSchema), async(req, res, next) => {
    const  result = await deleteMessage(req.params,req.user);
    
    successResponse({
        res,
        status:200,
        message:"done on search",
        data:result
    })
});

router.get("/:messageId",authentication(TOKEN_TYPE.access),Validation(getMessageSchema), async(req, res, next) => {
    const  result = await getMessage(req.params,req.user);
    
    successResponse({
        res,
        status:200,
        message:"done on search",
        data:result
    })
});

router.post("/",
    uploadMiddleware({
        multerMiddleware:localFileUpload({customPath:`message`,customTypes:[...fileTypeValidation.image]}).array("attachments",3),
        validation:[...fileTypeValidation.image],
        customPath:"message",
        isRequired:false
    }),
    Validation(sendMessageSchema),
    async(req, res, next) => {
        const result = await sendMessage(req.body, req.filesPaths);
        
        successResponse({
            res,
            status:201,
            message:"message sent successfully",
            data:result
        })
});

router.post("/by-account",
    authentication(TOKEN_TYPE.access),
    uploadMiddleware({
        multerMiddleware:localFileUpload({customPath:`message`,customTypes:[...fileTypeValidation.image]}).array("attachments",3),
        validation:[...fileTypeValidation.image],
        customPath:"message",
        isRequired:false
    }),
    Validation(sendMessageSchema),
    async(req, res, next) => {
        const result = await sendMessageByAccount(req.body, req.filesPaths,req.user);
        
        successResponse({
            res,
            status:201,
            message:"message sent successfully",
            data:result
        })
});

export default router;