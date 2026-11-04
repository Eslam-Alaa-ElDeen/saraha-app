import { Router } from 'express'
import {  confirmEmail, forgetPasswordSendOTP, login, resendOTP, signup, signupWithGmail, updatePasswordVerifyOTP } from './auth.service.js';
import { successResponse } from '../../common/utils/response/success.response.js';
import { Validation } from "../../middleware/validation.middleware.js";
import {
    confirmEmailSchema,
    forgetPasswordSendOTPSchema,
    loginSchema,
    resendOTPSchema,
    signupSchema,
    signupWithGmailSchema,
    updatePasswordVerifyOTPSchema
} from "./auth.validation.js";
const router = Router({
    caseSensitive: true,
    strict: true,
    mergeParams: true
});




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

router.patch("/confirm_otp",Validation(confirmEmailSchema), async (req, res, next) => {
    const result = await confirmEmail(req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"email confirmed successfully"
    })
})

router.post("/resend_otp", Validation(resendOTPSchema),async (req, res, next) => {
    const result = await resendOTP(req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"otp resend successfully"
    })
})

router.post("/forget_password_send_otp",Validation(forgetPasswordSendOTPSchema),async(req,res,next)=>{
    const result = await forgetPasswordSendOTP(req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"send otp successfully"
    })
})

router.patch("/update_password",Validation(updatePasswordVerifyOTPSchema),async(req,res,next)=>{
    const result = await updatePasswordVerifyOTP(req.body)

    successResponse({
        res,
        status:201,
        data:result,
        message:"password updated successfully"
    })
})

export default router