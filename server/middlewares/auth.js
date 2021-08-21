const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // check if access token exist
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Authentication failed." });
    // check if access token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.status(400).json({ msg: "Authentication failed." });
      // if all pass
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
