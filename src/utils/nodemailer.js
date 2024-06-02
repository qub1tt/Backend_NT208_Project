const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "clonenick169@gmail.com",
    pass: "swzg otva ojsp mfkw",
  },
});

exports.sendEmail = async (email, token) => {
  let mailOptions = {
    from: '"BOOK SHOP" <clonenick169@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Account Verification Token", // Subject line
    text: "Hello my friend",
    html:
      "<b>Verify your account</b>" +
      " <br/>" +
      "<span>Please verify your account by clicking the link</span>" +
      "<br/>" +
      `<span>${process.env.PAGE_URL}/confirm/` +
      token +
      "</span>",
  };
  try {
    let send = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

exports.sendEmailForgotPassword = async (email, token) => {
  let mailOptions = {
    from: '"BOOK SHOP" <clonenick169@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password Verification Token", // Subject line
    html:
      "<b>Forgot password</b>" +
      " <br/>" +
      "<span>Please enter OTP below</span>" +
      "<br/>" +
      "<span>" +
      token +
      "</span>",
  };
  try {
    let send = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
exports.sendMailConfirmPayment = async (email, token) => {
  let mailOptions = {
    from: '"BOOK SHOP" <clonenick169@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Payment Verification Token", // Subject line
    text: "Hello my friend",
    html:
      "<b>Verify your payment</b>" +
      " <br/>" +
      "<span>Please verify your payment by clicking the link</span>" +
      "<br/>" +
      `<span>${process.env.PAGE_URL}/payment/` +
      token +
      "</span>",
  };
  try {
    let send = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};
