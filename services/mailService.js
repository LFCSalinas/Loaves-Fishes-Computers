const mail = require("./mail");
require("dotenv").config();

const lfcSender = process.env.MAIL_SENDER
const lfcReceiver = process.env.MAIL_RECEIVER
const siteURL = process.env.HEROKU_URL


contactUsEmail = async (name, email, message) => {
    await mail.sendMail({
        from: email,
        to: lfcReceiver,
        subject: `New contact us message from ${name}`,
        text: `Message: ${message}`
    });
}

sendApplyEmail = async (full_name, phone, email) => {
    await mail.sendMail({
        from: email,
        to: lfcReceiver,
        subject: `Yay! ${full_name} is interested in volunteering`,
        text: `Full name: ${full_name}\nPhone: ${phone}\nEmail: ${email}`
    })
}

resetPasswordEmail = async (email, id, token) => {
    await mail.sendMail({
        from: lfcSender,
        to: email,
        subject: "Loaves Fishes Computers Password Reset",
        // html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process <strong>within one hour</strong> of receiving it.<br><br><a href="http://localhost:5000/password-reset-update/${id}${token}">http://localhost:5000/password-reset-update/${id}${token}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>The LFC team</p>`
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process <strong>within one hour</strong> of receiving it.<br><br><a href="${siteURL}/password-reset-update/${id}${token}">${siteURL}/${id}${token}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>The LFC team</p>`
    })
}

activateAccountEmail = async (email, id, token) => {
    await mail.sendMail({
        from: lfcSender,
        to: email,
        subject: "Loaves Fishes Computers Account Verification",
        // html: `<p>Please click the link below or paste it into your browser to complete the account verification process.<br><br><a href="http://localhost:5000/account-verification-message/${id}${token}">http://localhost:5000/account-verification-message/${id}${token}</a><br><br>The LFC team</p>`
        html: `<p>Please click the link below or paste it into your browser to complete the account verification process.<br><br><a href="${siteURL}/account-verification-message/${id}${token}">${siteURL}/account-verification-message/${id}${token}</a><br><br>The LFC team</p>`
    })
};

module.exports = {contactUsEmail, sendApplyEmail, resetPasswordEmail, activateAccountEmail};
