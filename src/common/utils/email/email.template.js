const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

export const emailTemplate = ({
    preheader = "A message from sara7a app.",
    title = "Confirm email",
    subtitle = "We've got an update waiting.",
    message = "Thank you for being with us.",
    name = "",
    buttonText = "",
    buttonUrl = "",
    imageCid = "",
    imageAlt = "",
    otp = "",
    otpLabel = "Your verification code",
    otpExpiry = "",
    footerText = "If you didn't request this email, you can safely ignore it."
}) => {
    const safeName = escapeHtml(name);
    const safeTitle = escapeHtml(title);
    const safeSubtitle = escapeHtml(subtitle);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const safePreheader = escapeHtml(preheader);
    const safeButtonText = escapeHtml(buttonText);
    const safeFooter = escapeHtml(footerText);

    let safeButtonUrl = "";
    if (buttonUrl) {
        try {
            const url = new URL(buttonUrl);
            if (url.protocol === "https:") safeButtonUrl = escapeHtml(url.href);
        } catch {
            safeButtonUrl = "";
        }
    }

    const year = new Date().getFullYear();

    const safeCid = String(imageCid).replace(/[^a-zA-Z0-9._@-]/g, "");
    const safeImageAlt = escapeHtml(imageAlt);

    const imageBlock = safeCid
        ? `
                    <!-- Featured image -->
                    <tr>
                        <td class="fade d2" style="padding: 0; font-size: 0; line-height: 0; background-color: #faf5f5;">
                            <img
                                src="cid:${safeCid}"
                                alt="${safeImageAlt}"
                                width="600"
                                style="
                                    display: block;
                                    width: 100%;
                                    max-width: 600px;
                                    height: auto;
                                    border: 0;
                                    outline: none;
                                    text-decoration: none;
                                "
                            >
                        </td>
                    </tr>`
        : "";

    const otpChars = String(otp).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase().split("");
    const safeOtpLabel = escapeHtml(otpLabel);
    const safeOtpExpiry = escapeHtml(otpExpiry);

    const otpBlock = otpChars.length
        ? `
        <tr>
            <td class="fade d3" style="padding: 28px 0 4px;">
                <p style="margin:0 0 12px; color:#8B1426; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase;">
                    ${safeOtpLabel}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="
                    background-color:#faf3f4;
                    border: 1px solid #efd9dc;
                    border-radius: 14px;
                ">
                    <tr>
                        <td style="padding: 16px 16px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    ${otpChars.map((c, i) => `
                                    <td class="otp-box" align="center" valign="middle" width="44" height="54" style="
                                        width: 44px;
                                        height: 54px;
                                        background-color: #ffffff;
                                        border: 1px solid #e6c9ce;
                                        border-bottom: 3px solid #8B1426;
                                        border-radius: 10px;
                                        color: #4A0813;
                                        font-family: 'Courier New', Courier, monospace;
                                        font-size: 26px;
                                        font-weight: 800;
                                        animation: popIn 0.5s ${(0.55 + i * 0.07).toFixed(2)}s cubic-bezier(.2,.9,.3,1.3) both;
                                    ">${escapeHtml(c)}</td>
                                    ${i < otpChars.length - 1 ? '<td width="8" style="width:8px; font-size:0;">&nbsp;</td>' : ""}`).join("")}
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <p style="margin:14px 0 0; color:#6b5a5e; font-size:13px; line-height:1.7;">
                    Or copy it directly:
                    <span style="
                        display: inline-block;
                        margin-left: 6px;
                        padding: 4px 10px;
                        background-color: #faf3f4;
                        border: 1px dashed #d9a9b0;
                        border-radius: 7px;
                        color: #4A0813;
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 15px;
                        font-weight: 800;
                        letter-spacing: 2px;
                        -webkit-user-select: all;
                        user-select: all;
                    ">${otpChars.map(escapeHtml).join("")}</span>
                </p>
                ${safeOtpExpiry ? `
                <p style="margin:12px 0 0; color:#9a8a8e; font-size:12px; line-height:1.7;">
                    ${safeOtpExpiry}
                </p>` : ""}
                <p style="margin:6px 0 0; color:#b9a9ad; font-size:12px; line-height:1.7;">
                    Never share this code with anyone.
                </p>
            </td>
        </tr>`
        : "";

    const button = safeButtonUrl && safeButtonText
        ? `
        <tr>
            <td align="left" class="fade d3" style="padding: 30px 0 4px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${safeButtonUrl}" style="height:52px;v-text-anchor:middle;width:230px;" arcsize="20%" stroke="f" fillcolor="#8B1426">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${safeButtonText}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <a href="${safeButtonUrl}" target="_blank" class="cta" style="
                    display: inline-block;
                    background-color: #8B1426;
                    background-image: linear-gradient(110deg, #6E0F1F 0%, #8B1426 35%, #B3243A 50%, #8B1426 65%, #6E0F1F 100%);
                    background-size: 250% 100%;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    padding: 16px 34px;
                    border-radius: 10px;
                    box-shadow: 0 10px 24px -8px rgba(139, 20, 38, 0.55);
                ">
                    ${safeButtonText}<span class="arrow" style="display:inline-block; margin-left:10px;">&rarr;</span>
                </a>
                <!--<![endif]-->
            </td>
        </tr>`
        : "";

    return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>${safeTitle}</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    <style>
        @keyframes riseIn {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
            from { opacity: 0; transform: translateY(26px) scale(0.985); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sheen {
            0%   { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }
        @keyframes drift {
            0%, 100% { transform: translate(0, 0); }
            50%      { transform: translate(-14px, 10px); }
        }
        @keyframes pulseDot {
            0%   { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.55); }
            70%  { box-shadow: 0 0 0 9px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        @keyframes popIn {
            from { opacity: 0; transform: translateY(10px) scale(0.85); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lineGrow {
            from { width: 0; }
            to   { width: 56px; }
        }

        .card  { animation: cardIn 0.8s cubic-bezier(.2,.8,.2,1) both; }
        .fade  { animation: riseIn 0.7s cubic-bezier(.2,.8,.2,1) both; }
        .d1 { animation-delay: 0.25s; }
        .d2 { animation-delay: 0.4s; }
        .d3 { animation-delay: 0.55s; }
        .d4 { animation-delay: 0.7s; }
        .orb   { animation: drift 9s ease-in-out infinite; }
        .dot   { animation: pulseDot 2.2s ease-out infinite; }
        .rule  { animation: lineGrow 0.9s 0.5s cubic-bezier(.2,.8,.2,1) both; }
        .cta   { animation: sheen 4.5s linear infinite; transition: transform .25s ease, box-shadow .25s ease; }
        .cta:hover { transform: translateY(-2px); box-shadow: 0 16px 30px -10px rgba(139, 20, 38, 0.7) !important; }
        .arrow { transition: transform .25s ease; }
        .cta:hover .arrow { transform: translateX(5px); }

        @media (prefers-reduced-motion: reduce) {
            .card, .fade, .orb, .dot, .rule, .cta, .otp-box { animation: none !important; }
        }
        @media only screen and (max-width: 480px) {
            .otp-box { width: 34px !important; height: 46px !important; font-size: 21px !important; }
            .px     { padding-left: 22px !important; padding-right: 22px !important; }
            .h1     { font-size: 26px !important; }
            .hero   { padding: 34px 22px 30px !important; }
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f4efee; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; -webkit-text-size-adjust:100%;">

    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; mso-hide:all;">
        ${safePreheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4efee;">
        <tr>
            <td align="center" style="padding: 40px 14px;">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 24px 60px -24px rgba(90, 10, 24, 0.35);
                ">

                    <!-- Hero -->
                    <tr>
                        <td class="hero" style="
                            position: relative;
                            padding: 38px 38px 34px;
                            background-color: #6E0F1F;
                            background-image: linear-gradient(135deg, #4A0813 0%, #6E0F1F 45%, #8B1426 100%);
                            overflow: hidden;
                        ">
                            <!-- soft decorative circles -->
                            <div class="orb" style="position:absolute; top:-70px; right:-50px; width:210px; height:210px; border-radius:50%; background:rgba(255,255,255,0.07);"></div>
                            <div class="orb" style="position:absolute; bottom:-90px; right:90px; width:150px; height:150px; border-radius:50%; background:rgba(255,255,255,0.05); animation-delay:-4s;"></div>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="position:relative;">
                                <tr>
                                    <td align="center" valign="middle" width="40" height="40" style="
                                        width: 40px;
                                        height: 40px;
                                        background-color: #ffffff;
                                        border-radius: 11px;
                                        color: #6E0F1F;
                                        font-size: 20px;
                                        font-weight: 800;
                                    ">3</td>
                                    <td style="padding-left: 12px; color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.2px;">
                                        sara7a app
                                    </td>
                                    <td style="padding-left: 14px;" valign="middle">
                                        <span class="dot" style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#ffffff;"></span>
                                    </td>
                                </tr>
                            </table>

                            <p class="fade d1" style="
                                position: relative;
                                margin: 30px 0 0;
                                color: rgba(255,255,255,0.72);
                                font-size: 11px;
                                font-weight: 700;
                                letter-spacing: 2.4px;
                                text-transform: uppercase;
                            ">
                                ${safePreheader}
                            </p>

                            <h1 class="fade d2 h1" style="
                                position: relative;
                                margin: 12px 0 0;
                                color: #ffffff;
                                font-size: 32px;
                                line-height: 1.2;
                                font-weight: 800;
                                letter-spacing: -0.9px;
                            ">
                                ${safeTitle}
                            </h1>
                        </td>
                    </tr>

                    ${imageBlock}

                    <!-- Body -->
                    <tr>
                        <td class="px" style="padding: 38px 38px 40px;">

                            <div class="rule" style="width:56px; height:3px; background-color:#8B1426; border-radius:3px; margin-bottom:26px; font-size:0; line-height:3px;">&nbsp;</div>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                ${safeName ? `
                                <tr>
                                    <td class="fade d1" style="padding-bottom: 8px; color:#1d1416; font-size:17px; font-weight:700; line-height:1.5;">
                                        Hi ${safeName},
                                    </td>
                                </tr>` : ""}

                                <tr>
                                    <td class="fade d2" style="padding-bottom: 14px; color:#3b2a2e; font-size:16px; line-height:1.75;">
                                        ${safeSubtitle}
                                    </td>
                                </tr>

                                <tr>
                                    <td class="fade d3" style="
                                        padding: 4px 0 4px 18px;
                                        border-left: 3px solid #E9D3D6;
                                        color: #6b5a5e;
                                        font-size: 14.5px;
                                        line-height: 1.85;
                                    ">
                                        ${safeMessage}
                                    </td>
                                </tr>

                                ${otpBlock}

                                ${button}

                            </table>

                            <p class="fade d4" style="margin: 34px 0 0; color:#9a8a8e; font-size:12px; line-height:1.8;">
                                ${safeFooter}
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 24px 24px 26px; background-color:#faf5f5; border-top:1px solid #f0e3e5;">
                            <p style="margin:0 0 6px; color:#6E0F1F; font-size:13px; font-weight:800; letter-spacing:0.2px;">
                                sara7a app
                            </p>
                            <p style="margin:0; color:#a8979b; font-size:11px; line-height:1.8;">
                                This is an automated email, please don't reply to it directly.
                            </p>
                            <p style="margin:10px 0 0; color:#b9a9ad; font-size:11px;">
                                &copy; ${year} Eslam Alaa . All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
};