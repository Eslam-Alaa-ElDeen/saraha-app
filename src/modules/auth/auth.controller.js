import { Router } from 'express'
import {  confirmEmail, confirmOtpTwoFactor, forgetPasswordSendOTP, login, loginConfirmEmailTwoFactorAuthentication, resendOTP, sendOtpTwoFactor, signup, signupWithGmail, updatePasswordVerifyOTP } from './auth.service.js';
import { successResponse } from '../../common/utils/response/success.response.js';
import { Validation } from "../../middleware/validation.middleware.js";
import {
    confirmEmailSchema,
    confirmOtpTwoFactorSchema,
    forgetPasswordSendOTPSchema,
    loginConfirmEmailTwoFactorAuthenticationSchema,
    loginSchema,
    resendOTPSchema,
    sendOtpTwoFactorSchema,
    signupSchema,
    signupWithGmailSchema,
    updatePasswordVerifyOTPSchema
} from "./auth.validation.js";
import { authentication } from '../../middleware/authentication.middleware.js';
import { TOKEN_TYPE } from '../../common/enum/token.enum.js';
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
        data:result.access_token?{access_token:result.access_token,refresh_token:result.refresh_token}:undefined,
        message:result?.message?.length? result.message :"user logged in successfully"
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
        status:200,
        data:result,
        message:"password updated successfully"
    })
})

router.post("/send-otp-two-factor",authentication(TOKEN_TYPE.access),Validation(sendOtpTwoFactorSchema),async(req,res,next)=>{
    const result = await sendOtpTwoFactor(req.user,req.body)

    successResponse({
        res,
        status:200,
        data:result,
        message:"send otp successfully"
    })
})

router.patch("/confirm-otp-two-factor",authentication(TOKEN_TYPE.access),Validation(confirmOtpTwoFactorSchema),async(req,res,next)=>{
    const result = await confirmOtpTwoFactor(req.user,req.body)

    successResponse({
        res,
        status:200,
        data:result,
        message:"otp confirmed successfully"
    })
})

router.post("/login-confirm-email-two-factor-authentication",
    Validation(loginConfirmEmailTwoFactorAuthenticationSchema),
    async(req,res,next)=>{
        const result = await loginConfirmEmailTwoFactorAuthentication(req.body,`${req.protocol}://${req.host}`)

        successResponse({
            res,
            status:200,
            data:result,
            message:"otp confirmed successfully"
        })
})

export default router