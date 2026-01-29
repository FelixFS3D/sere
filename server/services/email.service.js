const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

/**
 * Sends an email using the configured transporter.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.html - HTML content of the email.
 * @returns {Promise<Object>} - The result of the email transmission.
 */
async function sendMail({to, subject, html}) {
    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
    });
}

module.exports = { sendMail };
