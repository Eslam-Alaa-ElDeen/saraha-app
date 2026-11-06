import { BREVO_API_KEY, PROJECT_NAME, APP_EMAIL } from "../../../../config/config.service.js";
import { BadRequestException } from "../../exception/error.exception.js";

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
    attachments = []
}) => {
    try {
        if (!to)
            throw new BadRequestException("missing email sender");

        const apiKey = BREVO_API_KEY || process.env.BREVO_API_KEY;
        const recipientEmail = Array.isArray(to) ? to[0] : to;

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: PROJECT_NAME || "Saraha App",
                    email: APP_EMAIL
                },
                to: [{ email: recipientEmail }],
                subject: subject,
                htmlContent: html,
                textContent: text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("Email sent successfully via Brevo API:", data);
        return data;
    } catch (err) {
        console.error("Error while sending mail via Brevo:", err);
        throw err;
    }
};