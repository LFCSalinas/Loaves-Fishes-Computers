const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

require("dotenv").config();

const auth = {
    auth: {
        api_key: process.env.API_KEY,
        domain: process.env.DOMAIN
    }
};
const transporter = nodemailer.createTransport(mailGun(auth));

exports.sendMail = (mailOptions) => {
    return transporter.sendMail(mailOptions)
        .then((info) => {
            console.log('Message sent: %s', info.messageId);
            return { success: true, message: 'Email sent successfully', info };
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            return { success: false, message: 'Error sending email', error };
        });
};

