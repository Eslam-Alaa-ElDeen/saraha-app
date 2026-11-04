import joi from "joi";
import { generalRules } from "../../common/utils/generalRules.js";

const requestBodyMessages = {
    "any.required": "Request body is required.",
    "object.base": "Request body must be an object.",
    "object.unknown": 'Unsupported field "{#key}" in request body.'
};

export const sendMessageSchema={
    body:joi.object({
        content:joi.string().min(2).max(10000),
        receiverId:generalRules.id.required()
    })
        .unknown(false)
        .label("Request body")
        .messages(requestBodyMessages)
    ,
    files:joi.array().items(generalRules.file).max(3).messages({
        "array.base":"Attachments must be an array.",
        "array.max":"You can upload a maximum of 3 attachments."
    })
}
export const getMessagesSchema={
        query:joi.object({
            type:joi.string().valid("0", "1", "2").default("2"),
            page:joi.number().integer().min(1).default(1),
            limit:joi.number().integer().min(1).max(100).default(10),
            search:joi.string().min(1).max(10000),
            populate:joi.string().valid("senderId","receiverId").default("receiverId"),
        })
            .unknown(false)
            .label("Request query")
            .messages({
                "any.required": "Request query is required.",
                "object.base": "Request query must be an object.",
                "object.unknown": 'Unsupported field "{#key}" in request query.'
            })
}

export const deleteMessagesSchema={
    params:joi.object({
        messageId:generalRules.id.required()
    })
        .unknown(false)
        .label("Request params")
        .messages({
            "any.required": "Request params are required.",
            "object.base": "Request params must be an object.",
            "object.unknown": 'Unsupported field "{#key}" in request params.'
        })
}

export const getMessageSchema={
    params:joi.object({
        messageId:generalRules.id.required()
    })
        .unknown(false)
        .label("Request params")
        .messages({
            "any.required": "Request params are required.",
            "object.base": "Request params must be an object.",
            "object.unknown": 'Unsupported field "{#key}" in request params.'
        })
}

