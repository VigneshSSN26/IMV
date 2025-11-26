require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendMail() {
    console.log("Loaded credentials:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "MISSING");
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "SMTP Test",
            text: "SMTP test email working!"
        });

        console.log("Email Sent:", info.messageId);
    } catch (error) {
        console.error("SMTP Error:", error);
    }
}

sendMail();
