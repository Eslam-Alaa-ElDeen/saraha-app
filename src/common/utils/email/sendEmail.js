import nodemailer from "nodemailer";
import { APP_EMAIL, APP_PASSWORD, PROJECT_NAME } from "../../../../config/config.service.js";
import { BadRequestException } from "../../exception/error.exception.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: APP_EMAIL,
        pass:APP_PASSWORD
    }
});

export const sendEmail=async({
    to,
    subject,
    html,
    text,
    attachments=[]
})=>{
try {
    if(!to?.length)
        throw new BadRequestException("missing email sender")
    const info = await transporter.sendMail({
        from: `${PROJECT_NAME} <${APP_EMAIL}>` ,
        to,
        subject,
        text,
        html,
        attachments
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
    console.error("Error while sending mail:", err);
    }
}