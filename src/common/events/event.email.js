import { EventEmitter } from "node:events";
import { sendEmail } from "../utils/email/sendEmail.js";
import { emailTemplate } from "../utils/email/email.template.js";

export const eventEmitterEmail = new EventEmitter();

eventEmitterEmail.on("confirm_email", async ({ email, otp }) => {
    try {
        await sendEmail({
            to: email,
            subject: "Confirm email",
            html: emailTemplate({
                title: "Verify your email",
                subtitle: "Use the code below to finish",
                otp,
                otpExpiry: "This code expires in 5 minutes.",
            })
        });
    } catch (error) {
        console.error("Failed to send confirmation email:", error);
    }
});