const sendMail = require("../helpers/sendMail");
const createToken = require("../helpers/createToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateEmail = require("../helpers/validateEmail");
const User = require("../models/userModel");
const { google } = require("googleapis");
const { create } = require("../models/userModel");
const { OAuth2 } = google.auth;

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // check for empty fields
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });

      // check for valid email format
      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address." });

      // check if user exist
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: "This email is already registered in our system." });

      // check password
      if (password.length < 6)
        return res
          .status(400)
          .json({ mgs: "Password must be at least 6 characters long." });

      // hash pass
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      // create activation token
      const newUser = { name, email, password: hashPassword };
      const activation_token = createToken.activation(newUser);

      // send email to validate email address
      const url = `${process.env.CLIENT_URL}/api/auth/activate/${activation_token}`;
      sendMail.sendEmailRegister(email, url, "Verify your email");

      // registered success
      res.status(200).json({ msg: "Welcome! Please check your email." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  activate: async (req, res) => {
    try {
      // get token
      const { activation_token } = req.body;
      // verify token
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
      const { name, email, password } = user;
      // double check if user exist
      const check = await User.findOne({ email });
      if (check)
        return res
          .status(400)
          .json({ msg: "This email is already registered." });
      // add user
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      // add user success
      res
        .status(200)
        .json({ msg: "Your account has been activated, you can now sign in." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      // check email
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "This email is not registered in our system." });
      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "The password is incorrect." });
      // create refresh token
      const rf_token = createToken.refresh({ id: user._id });
      res.cookie("_apprftoken", rf_token, {
        httpOnly: true,
        path: "/api/auth/access",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours // 86,400,000 millisecond
      });
      // signin success
      res.status(200).json({ msg: "Login success !" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  access: async (req, res) => {
    try {
      // check for refresh token
      const rf_token = req.cookies._apprftoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login." });
      // check if refresh token is valid
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please try login again." });
        // create access token
        const ac_token = createToken.access({ id: user.id });
        // access success
        return res.status(200).json({ ac_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgot: async (req, res) => {
    try {
      const { email } = req.body;
      // check if email exist
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "This email is not registered in our system." });
      // create access token
      const ac_token = createToken.access({ id: user.id });
      // send email
      const url = `${process.env.CLIENT_URL}/auth/reset-password/${ac_token}`;
      const name = user.name;
      sendMail.sendEmailReset(email, url, "Reset your password", name);
      // success
      res
        .status(200)
        .json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  // mw
  reset: async (req, res) => {
    try {
      const { password } = req.body;
      // hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      // find user and update password
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { password: hashPassword }
      );
      // success
      res.status(200).json({ msg: "Password was updated successfully!" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  // mw
  info: async (req, res) => {
    try {
      // get info -password
      const user = await User.findById(req.user.id).select("-password");
      // return user
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  // mw
  update: async (req, res) => {
    try {
      // get info
      const { name, avatar } = req.body;
      // update it
      await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
      // success
      res.status(200).json({ msg: "Update success !" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  signout: async (req, res) => {
    try {
      res.clearCookie("_apprftoken", { path: "/api/auth/access" });
      return res.status(200).json({ msg: "Sign out success !" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  google: async (req, res) => {
    try {
      // Google Token Id
      const { tokenId } = req.body;
      // verify the Token Id
      const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });
      // get verify data
      const { email_verified, email, name, picture } = verify.payload;
      // failed verification
      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });
      // passed verification
      // 1. If user exist then create refresh token and sign them in
      const user = await User.findOne({ email });
      if (user) {
        const rf_token = createToken.refresh({ id: user._id });
        res.cookie("_apprftoken", rf_token, {
          httpOnly: true,
          path: "/api/auth/access",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        res.status(200).json({ message: "Signin with Google success !" });
      } else {
        // 2. Else create new user
        const password = email + process.env.MAILING_SERVICE_CLIENT_ID; // give default pass
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          name,
          email,
          password: hashPassword,
          avatar: picture,
        });
        await newUser.save();
        // sign user in
        const rf_token = createToken.refresh({ id: newUser.id });
        res.cookie("_apprftoken", rf_token, {
          httpOnly: true,
          path: "/api/auth/access",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        // success
        res.status(200).json({ message: "Signin with Google success !" });
      }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
