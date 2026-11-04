import joi from "joi";
import { generalRules } from "../../common/utils/generalRules.js";

const requestBodyMessages = {
    "any.required": "Request body is required.",
    "object.base": "Request body must be an object.",
    "object.unknown": 'Unsupported field "{#key}" in request body.'
};

export const signupSchema = {
    body: joi.object({
        userName: generalRules.userName.required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        phone: generalRules.phone.required(),
        gender: generalRules.gender,
        DOB: generalRules.DOB
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const loginSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const signupWithGmailSchema = {
    body: joi.object({
        idToken: joi
            .string()
            .trim()
            .required()
            .label("Google ID token")
            .messages({
                "any.required": "Google ID token is required.",
                "string.base": "Google ID token must be a string.",
                "string.empty": "Google ID token cannot be empty."
            })
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const confirmEmailSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        otp:joi.string().length(6).required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const resendOTPSchema = {
    body: joi.object({
        email:generalRules.email.required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const forgetPasswordSendOTPSchema = {
    body: joi.object({
        email: generalRules.email.required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const updatePasswordVerifyOTPSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        otp:joi.string().length(6).required(),
        newPassword:generalRules.password.required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};


export const sendOtpTwoFactorSchema = {
    body: joi.object({
        status:joi.number().valid(0,1).required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

export const confirmOtpTwoFactorSchema = {
    body: joi.object({
        otp:joi.string().length(6).required(),
        status:joi.number().valid(0,1).required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};
export const loginConfirmEmailTwoFactorAuthenticationSchema = {
    body: joi.object({
        otp:joi.string().length(6).required(),
        email:generalRules.email.required()
    })
        .unknown(false)
        .required()
        .label("Request body")
        .messages(requestBodyMessages)
};

