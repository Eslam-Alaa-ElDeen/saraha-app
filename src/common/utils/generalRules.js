import joi from "joi";
import { Types } from "mongoose";
import { GenderEnum } from "../enum/user.enum.js";
import { RoleEnum } from "../enum/role.enum.js";

const requiredMessage = "{#label} is required.";
const stringMessage = "{#label} must be a string.";

export const generalRules = {
    email: joi
        .string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2 })
        .max(254)
        .label("Email")
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "Email cannot be empty.",
            "string.email": "Enter a valid email address.",
            "string.max": "Email cannot exceed 254 characters."
        }),
    password: joi
        .string()
        .min(8)
        .max(128)
        .label("Password")
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "Password cannot be empty.",
            "string.min": "Password must be at least 8 characters long.",
            "string.max": "Password cannot exceed 128 characters."
        }),
    file: joi.object({
        fieldname: joi.string().required().messages({
            "any.required": "File field name is required."
        }),
        originalname: joi.string().required().messages({
            "any.required": "Original file name is required."
        }),
        encoding: joi.string().required().messages({
            "any.required": "File encoding is required."
        }),
        mimetype: joi.string().required().messages({
            "any.required": "File type is required."
        }),
        path: joi.string(),
        destination: joi.string(),
        filename: joi.string(),
        buffer: joi.binary(),
        finalPath: joi.string().required().messages({
            "any.required": "Final file path is required."
        }),
        size: joi.number().positive().required().messages({
            "number.base": "File size must be a number.",
            "number.positive": "File must not be empty.",
            "any.required": "File size is required."
        })
    }).messages({
        "object.base": "File information must be an object."
    }),
    age: joi
        .number()
        .integer()
        .min(20)
        .max(80)
        .label("Age")
        .messages({
            "any.required": requiredMessage,
            "number.base": "Age must be a number.",
            "number.integer": "Age must be a whole number.",
            "number.min": "Age must be at least 20.",
            "number.max": "Age cannot be greater than 80."
        }),
    phone: joi
        .string()
        .pattern(/^\d{11}$/)
        .label("Phone number")
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "Phone number cannot be empty.",
            "string.pattern.base": "Phone number must contain exactly 11 digits."
        }),
    gender: joi
        .number()
        .valid(...Object.values(GenderEnum))
        .label("Gender")
        .messages({
            "any.required": requiredMessage,
            "number.base": "Gender must be a number.",
            "any.only": "Gender must be 0 (male) or 1 (female)."
        }),
    role: joi
        .number()
        .valid(...Object.values(RoleEnum))
        .label("Role")
        .messages({
            "any.required": requiredMessage,
            "number.base": "Role must be a number.",
            "any.only": "Role must be a valid role."
        }),
    fName: joi
        .string()
        .trim()
        .min(2)
        .max(30)
        .label("First name")
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "First name cannot be empty.",
            "string.min": "First name must be at least 2 characters long.",
            "string.max": "First name cannot exceed 30 characters."
        }),
    lName: joi
        .string()
        .trim()
        .min(2)
        .max(30)
        .label("Last name")
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "Last name cannot be empty.",
            "string.min": "Last name must be at least 2 characters long.",
            "string.max": "Last name cannot exceed 30 characters."
        }),
    DOB: joi
        .date()
        .max("now")
        .label("Date of birth")
        .messages({
            "date.base": "Enter a valid date of birth.",
            "date.max": "Date of birth cannot be in the future."
        }),
    token: joi.object({
        authorization: joi.string().required().messages({
            "any.required": "Authorization header is required.",
            "string.empty": "Authorization header cannot be empty."
        }),
        "postman-token": joi.string(),
        "content-length": joi.string(),
        host: joi.string(),
        "user-agent": joi.string(),
        accept: joi.string(),
        connection: joi.string(),
        "accept-encoding": joi.string()
    }).messages({
        "object.base": "Request headers must be an object."
    }),
    id: joi
        .string()
        .custom((value, helpers) =>
            Types.ObjectId.isValid(value) ? value : helpers.error("any.invalid")
        )
        .label("ID")
        .messages({
            "string.base": "ID must be a string.",
            "string.empty": "ID cannot be empty.",
            "any.invalid": "Enter a valid ID."
        }),
    userName: joi
        .string()
        .trim()
        .label("Full name")
        .min(5)
        .max(80)
        .messages({
            "any.required": requiredMessage,
            "string.base": stringMessage,
            "string.empty": "Full name cannot be empty.",
            "string.fullName": "Enter a first and last name, each 2 to 30 characters long."
        })
};
