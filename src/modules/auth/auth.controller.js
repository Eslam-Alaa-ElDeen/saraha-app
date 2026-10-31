import { Router } from 'express'
import {  login, signup, signupWithGmail } from './auth.service.js';
import { successResponse } from '../../common/utils/response/success.response.js';
import { Validation } from "../../middleware/validation.middleware.js";
import {
    loginSchema,
    signupSchema,
    signupWithGmailSchema
} from "./auth.validation.js";
const router = Router();




router.post("/signup", Validation(signupSchema), async (req, res, next) => {
    const result = await signup(req.body);
    successResponse({
        res,
        status:201,
        data:result,
        message:"user inserted successfully"
    })
})
router.post("/signup-with-gmail", Validation(signupWithGmailSchema), async (req, res, next) => {
    try {
        const {status,tokens} = await signupWithGmail(req.body,`${req.protocol}://${req.host}`)
        successResponse({
            res,
            status,
            data:tokens,
            message:"user inserted successfully"
        })
    } catch (error) {
        res.json(error.message)
    }

})

router.post("/login", Validation(loginSchema), async (req, res, next) => {
    const result = await login(req.body,`${req.protocol}://${req.host}`)

    successResponse({
        res,
        status:201,
        data:result,
        message:"user logged in successfully"
    })
})



export default router