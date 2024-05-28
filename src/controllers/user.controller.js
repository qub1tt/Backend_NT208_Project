"use strict";
const user = require("../models/user.model");
const nodemailer = require("../utils/nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otp = require("../utils/otp");
const { cloudinary } = require("../utils/cloudinary");

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, address, phone_number } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !address ||
      !phone_number
    ) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Kiểm tra định dạng email và độ dài mật khẩu
    if (!isValidEmail(email) || password.length < 6) {
      return res.status(422).json({ msg: "Invalid email or password" });
    }

    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already exists" });
    }

    const token = randomstring.generate();
    let sendEmail = await nodemailer.sendEmail(email, token);
    if (!sendEmail) {
      res.status(500).json({ msg: "Send email fail" });
      return;
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới người dùng
    const newUser = new user({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      address: address,
      phone_number: phone_number,
      token: token,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Trả về kết quả thành công
    res.status(201).json({ msg: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

exports.verifyAccount = async (req, res) => {
  try {
    // Kiểm tra xem token có tồn tại không
    const token = req.params.token;
    if (!token) {
      return res.status(402).json({ msg: "Invalid token" });
    }

    // Tìm kiếm người dùng với token tương ứng
    const userWithToken = await user.findOne({ token: token });
    if (!userWithToken) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Cập nhật trạng thái xác thực của người dùng
    await user.findByIdAndUpdate(
      userWithToken._id,
      { $set: { is_verify: true } },
      { new: true }
    );

    // Trả về kết quả thành công
    res.status(200).json({ msg: "Account verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    // Kiểm tra xem email và mật khẩu đã được cung cấp chưa
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(402).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Kiểm tra xem tài khoản đã được xác minh chưa
    if (!userFind.is_verify) {
      return res.status(401).json({ msg: "Account not verified" });
    }

    // Kiểm tra tính hợp lệ của mật khẩu
    if (!bcrypt.compareSync(password, userFind.password)) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { email: email, iat: Math.floor(Date.now() / 1000) - 60 * 30 },
      "shhhhh"
    );

    // Trả về thông tin người dùng và token khi đăng nhập thành công
    res.status(200).json({
      msg: "Login success",
      token: token,
      user: {
        email: userFind.email,
        firstName: userFind.firstName,
        lastName: userFind.lastName,
        address: userFind.address,
        phone_number: userFind.phone_number,
        id: userFind._id,
        id_avatar: userFind.id_avatar,
        avatar_url: userFind.avatar_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.requestForgotPassword = async (req, res) => {
  try {
    // Kiểm tra xem email đã được cung cấp chưa
    const email = req.params.email;
    if (!email) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Kiểm tra xem tài khoản đã được xác minh chưa
    if (!userFind.is_verify) {
      return res.status(401).json({ msg: "Account not verified" });
    }

    // Tạo mã OTP mới
    const token = otp.generateOTP();

    // Gửi email chứa mã OTP
    let sendEmail = await nodemailer.sendEmailForgotPassword(email, token);
    if (!sendEmail) {
      return res.status(500).json({ msg: "Send email fail" });
    }

    // Lưu mã OTP vào tài khoản người dùng
    userFind.token = token;
    await userFind.save();

    // Trả về thông báo thành công cùng với email đã gửi mã OTP
    res.status(201).json({ msg: "Success", email: email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.verifyForgotPassword = async (req, res) => {
  try {
    // Kiểm tra xem email và mã OTP đã được cung cấp chưa
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Kiểm tra xem mã OTP có khớp với mã đã lưu trong tài khoản không
    if (userFind.token !== otp) {
      return res.status(422).json({ msg: "Invalid OTP" });
    }

    // Trả về thông báo thành công cùng với mã OTP
    res.status(200).json({ msg: "Success", otp: otp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // Kiểm tra xem email, mã OTP và mật khẩu mới đã được cung cấp chưa
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Kiểm tra xem mã OTP có khớp với mã đã lưu trong tài khoản không
    if (userFind.token !== otp) {
      return res.status(422).json({ msg: "Invalid OTP" });
    }

    // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
    userFind.password = bcrypt.hashSync(newPassword, 10);
    await userFind.save();

    // Trả về thông báo thành công
    res.status(201).json({ msg: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.updateInfor = async (req, res) => {
  try {
    // Kiểm tra xem các trường thông tin đã được cung cấp chưa
    const { email, firstName, lastName, address, phone_number, avatarBase64 } =
      req.body;
    if (!email || !firstName || !lastName || !address || !phone_number) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "User not found" });
    }

    // Cập nhật thông tin của người dùng
    userFind.firstName = firstName;
    userFind.lastName = lastName;
    userFind.address = address;
    userFind.phone_number = phone_number;

    // Kiểm tra và upload ảnh avatar nếu có
    if (avatarBase64) {
      // 'avatar' là base64 string từ req.body
      // Hủy avatar cũ nếu có
      if (userFind.id_avatar) {
        await cloudinary.uploader.destroy(
          userFind.id_avatar,
          function (error, result) {
            console.log(result, error);
          }
        );
      }
      const fileStr = req.body.avatarBase64;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "user_ava", // Tùy chọn preset upload của bạn
      });
      userFind.id_avatar = uploadResponse.public_id;
      userFind.avatar_url = uploadResponse.secure_url;
    }

    await userFind.save();

    // Tạo token mới
    const token = jwt.sign({ email: email }, "shhhhh");

    // Trả về thông tin người dùng đã được cập nhật và token mới
    res.status(200).json({
      msg: "Success",
      token: token,
      user: {
        email: userFind.email,
        firstName: userFind.firstName,
        lastName: userFind.lastName,
        address: userFind.address,
        phone_number: userFind.phone_number,
        id: userFind._id,
        id_avatar: userFind.id_avatar,
        avatar_url: userFind.avatar_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    // Kiểm tra xem các trường thông tin đã được cung cấp chưa
    const { email, oldpassword, newpassword } = req.body;
    if (!email || !oldpassword || !newpassword) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Tìm kiếm người dùng dựa trên email
    const userFind = await user.findOne({ email: email });
    if (!userFind) {
      return res.status(422).json({ msg: "User not found" });
    }

    // Kiểm tra mật khẩu cũ
    if (!bcrypt.compareSync(oldpassword, userFind.password)) {
      return res.status(422).json({ msg: "Old password is incorrect" });
    }

    // Cập nhật mật khẩu mới và lưu vào cơ sở dữ liệu
    userFind.password = bcrypt.hashSync(newpassword, 10);
    await userFind.save();

    // Trả về thông báo thành công
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};
