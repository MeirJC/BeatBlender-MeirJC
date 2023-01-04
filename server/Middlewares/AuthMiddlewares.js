const User = require("../Models/UserModels");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      "Super Secret Key By Meir J C @ BeatBlender App",
      async (err, decodedToken) => {
        if (err) {
          // console.log("|||||||||||||| IN AUTHMIDDLEWARE IF", err.message);
          res.json({ status: false });
          res.locals.user = null;
          next();
        } else {
          // console.log("||||||||||| IN AUTHMIDDLEWARE ELSE", decodedToken);
          const user = await User.findById(decodedToken.id);
          if (user) res.json({ status: true, user: user.email });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};
