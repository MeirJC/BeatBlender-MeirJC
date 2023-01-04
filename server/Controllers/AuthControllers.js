const UserModel = require("../Models/UserModels");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "Super Secret Key By Meir J C @ BeatBlender App", {
    expiresIn: maxAge,
  });
};
const handleErrors = (err) => {
  console.log(
    "|||||||err.message",
    err.message,
    "||||||err.code",
    err.code,
    " err.errors|||||",
    err.errors,
    "|||||||||err",
    err
  );
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "Incorrect password") {
    errors.email = "That password is incorrect";
  }
  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// const handleErrors = (err) => {
//   let errors = { email: "", password: "" };

//   console.log(err);
//   if (err.message === "Incorrect email") {
//     errors.email = "That email is not registered";
//   }

//   if (err.message === "Incorrect password") {
//     errors.password = "That password is incorrect";
//   }

//   if (err.code === 11000) {
//     errors.email = "Email is already registered";
//     return errors;
//   }

//   if (err.message.includes("Users validation failed")) {
//     Object.values(err.errors).forEach(({ properties }) => {
//       errors[properties.path] = properties.message;
//     });
//   }

//   return errors;
// };

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(201).json({ user: user._id, created: true });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ err, errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id, created: true });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ err, errors, created: false });
  }
};
