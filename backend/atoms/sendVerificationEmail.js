const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Verify your email address",
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address</p>`,
  };

  await transporter.sendMail(message);
};

module.exports = sendVerificationEmail;
