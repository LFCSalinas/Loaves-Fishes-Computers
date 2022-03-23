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

contactUsEmail = (name, email, message, cb) => {
  const mailOptions = {
    from: email,
    to: "mignunez@csumb.edu",
    subject: `New contact us message from ${name}`,
    text : `Message: ${message}`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

sendApplyEmail = (full_name, phone, email, cb) => {
  const mailOptions = {
    from: email,
    to: "mignunez@csumb.edu",
    subject: `Yay! ${full_name} is interested in volunteering`,
    text : `Full name: ${full_name}\nPhone: ${phone}\nEmail: ${email}`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

resetPasswordEmail = (email, id, token, cb) => {
 var mailOptions = {
      from: "mignunez@csumb.edu",
      to: email,
      subject: "Loaves Fishes Computers Password Reset",
      // html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process <strong>within one hour</strong> of receiving it.<br><br><a href="http://localhost:5000/password-reset-update/${id}${token}">http://localhost:5000/password-reset-update/${id}${token}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>The LFC team</p>`
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process <strong>within one hour</strong> of receiving it.<br><br><a href="https://minu-loaves-fishes-computers.herokuapp.com/password-reset-update/${id}${token}">https://minu-loaves-fishes-computers.herokuapp.com/${id}${token}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>The LFC team</p>`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

activateAccountEmail = (email, id, token, cb) => {
  var mailOptions = {
      from: "mignunez@csumb.edu",
      to: email,
      subject: "Loaves Fishes Computers Account Verification",
      // html: `<p>Please click the link below or paste it into your browser to complete the account verification process.<br><br><a href="http://localhost:5000/account-verification-message/${id}${token}">http://localhost:5000/account-verification-message/${id}${token}</a><br><br>The LFC team</p>`
      html: `<p>Please click the link below or paste it into your browser to complete the account verification process.<br><br><a href="https://minu-loaves-fishes-computers.herokuapp.com/account-verification-message/${id}${token}">https://minu-loaves-fishes-computers.herokuapp.com/account-verification-message/${id}${token}</a><br><br>The LFC team</p>`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

module.exports = {contactUsEmail, sendApplyEmail, resetPasswordEmail, activateAccountEmail};
