const sendMail = require("../helpers/sendMail");
const createToken = require("../helpers/createToken");
const validateEmail = require("../helpers/validateEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const userController = {
  register: async (req, res) => {
    try {
      // get info
      const { name, email, password } = req.body;

      // check fields
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });

      // check email
      if (!validateEmail(email))
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address." });

      // check user
      const user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ msg: "This email is already registered in our system." });

      // check password
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      // hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      // create token
      const newUser = { name, email, password: hashPassword };
      const activation_token = createToken.activation(newUser);

      // send email
      const url = `http://localhost:3000/api/auth/activate/${activation_token}`;
      sendMail.sendEmailRegister(email, url, "Verify your email");

      // registration success
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

      // check user
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

      // activation success
      res
        .status(200)
        .json({ msg: "Your account has been activated, you can now sign in." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  signing: async (req, res) => {
    try {
      // get cred
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
        return res.status(400).json({ msg: "This password is incorrect." });

      // refresh token
      const rf_token = createToken.refresh({ id: user._id });
      res.cookie("_apprftoken", rf_token, {
        httpOnly: true,
        path: "/api/auth/access",
        maxAge: 24 * 60 * 60 * 1000, // 24h
      });

      // signing success
      res.status(200).json({ msg: "Signing success" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  access: async (req, res) => {
    try {
      // rf token
      const rf_token = req.cookies._apprftoken;
      if (!rf_token) return res.status(400).json({ msg: "Please sign in." });

      // validate
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please sign in again." });
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
      // get email
      const { email } = req.body;

      // check email
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "This email is not registered in our system." });

      // create ac token
      const ac_token = createToken.access({ id: user.id });

      // send email
      const url = `http://localhost:3000/auth/reset-password/${ac_token}`;
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
  reset: async (req, res) => {
    try {
      // get password
      const { password } = req.body;

      // hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      // update password
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { password: hashPassword }
      );

      // reset success
      res.status(200).json({ msg: "Password was updated successfully." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
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
  update: async (req, res) => {
    try {
      // get info
      const { name, avatar } = req.body;

      // update
      await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
      // success
      res.status(200).json({ msg: "Update success." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  signout: async (req, res) => {
    try {
      // clear cookie
      res.clearCookie("_apprftoken", { path: "/api/auth/access" });
      // success
      return res.status(200).json({ msg: "Signout success." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  google: async (req, res) => {
    try {
      // get Token Id
      const { tokenId } = req.body;

      // verify Token Id
      const client = new OAuth2(process.env.G_CLIENT_ID);
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.G_CLIENT_ID,
      });

      // get data
      const { email_verified, email, name, picture } = verify.payload;

      // failed verification
      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });

      // passed verification
      const user = await User.findOne({ email });
      // 1. If user exist / sign in
      if (user) {
        // refresh token
        const rf_token = createToken.refresh({ id: user._id });
        // store cookie
        res.cookie("_apprftoken", rf_token, {
          httpOnly: true,
          path: "/api/auth/access",
          maxAge: 24 * 60 * 60 * 1000, // 24hrs
        });
        res.status(200).json({ msg: "Signing with Google success." });
      } else {
        // new user / create user
        const password = email + process.env.G_CLIENT_ID;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          name,
          email,
          password: hashPassword,
          avatar: picture,
        });
        await newUser.save();
        // sign in the user
        // refresh token
        const rf_token = createToken.refresh({ id: user._id });
        // store cookie
        res.cookie("_apprftoken", rf_token, {
          httpOnly: true,
          path: "/api/auth/access",
          maxAge: 24 * 60 * 60 * 1000, // 24hrs
        });
        // success
        res.status(200).json({ msg: "Signing with Google success." });
      }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
