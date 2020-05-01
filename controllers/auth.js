const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const crypto = require("crypto");

const mailAuth = {
  auth: {
    api_key: process.env.MAIL_SERVER_API_KEY,
    domain: process.env.MAIL_SERVER_DOMAIN,
  },
};

const emailer = nodemailer.createTransport(mg(mailAuth));

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error");
  let email = req.flash("email");
  let successMessage = req.flash("success");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (email.length > 0) {
    email = email[0];
  } else {
    email = null;
  }
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage,
    email,
    successMessage,
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error");
  let email = req.flash("email");
  let login = req.flash("login");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (email.length > 0) {
    email = email[0];
  } else {
    email = null;
  }
  if (login.length > 0) {
    login = login[0];
  } else {
    login = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage,
    email,
    login,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        req.flash("email", `${email}`);
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.dataValues.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password.");
          req.flash("email", `${email}`);
          res.redirect("/auth/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/auth/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const login = req.body.login;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match!");
    req.flash("email", `${email}`);
    req.flash("login", `${login}`);
    return res.redirect("/auth/signup");
  }

  const userDoc = await User.findOne({ where: { email } });

  if (userDoc) {
    req.flash("error", "E-Mail exists already, please pick a different one.");
    req.flash("email", `${email}`);
    req.flash("login", `${login}`);
    return res.redirect("/auth/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    login,
    password: hashedPassword,
  });

  user.save();

  req.flash("email", `${email}`);
  req.flash(
    "success",
    `Welcome, ${login}! Your account has been successfully registered!`
  );
  res.redirect("/auth/login");

  const msg = {
    to: email.trim(),
    from: "admin@keepme.tech",
    subject: "Your signup on keepme succeeded!",
    html: `<h1 style="text-align:center">Your account has been successfully created!</h1>
              <h2 style="text-align:center">Welcome to keepme, ${login}!</h2>`,
  };
  emailer.sendMail(msg).catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getForgotPassword = (req, res, next) => {
  let errorMessage = req.flash("error");
  let email = req.flash("email");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (email.length > 0) {
    email = email[0];
  } else {
    email = null;
  }

  res.render("auth/forgot-password", {
    path: "/forgot-password",
    pageTitle: "Forgot password?",
    errorMessage,
    email,
  });
};

exports.postForgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const currentUser = await User.findOne({ where: { email } });

  if (!currentUser) {
    req.flash("error", "We don't have user with such email.");
    req.flash("email", `${email}`);
    return res.redirect("/auth/forgot-password");
  }

  const recoveryString = crypto.randomBytes(20).toString("hex");
  const recoveryHash = await bcrypt.hash(recoveryString, 12);

  currentUser.recoveryHash = recoveryHash;

  currentUser.save().then(() => {
    req.flash("success", `To change your password please check your email.`);
    res.redirect("login");

    const msg = {
      to: currentUser.dataValues.email,
      from: "admin@keepme.tech",
      subject: "Reset password on keepme",
      html: `<h1 style="text-align:center">If you want to reset your password please follow this link:</h1>
      <a style="margin: auto; text-decoration: none; font-size: 20px; padding: 0.4rem 0.8rem; background-color: #d9534f; border-radius: 8px; color: #ffffff;" href="${`${
        req.protocol
      }://${req.get("host")}${req.originalUrl}/${
        currentUser.dataValues.id
      }/${recoveryString}`}">Reset Password</a>`,
    };
    emailer.sendMail(msg).catch((err) => console.log(err));
  });
};

exports.getSetNewPassword = async (req, res, next) => {
  const { userId, recoveryString } = req.params;
  let errorMessage = req.flash("error");

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  const currentUser = await User.findByPk(userId);
  if (!currentUser) res.redirect("/");

  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    recoveryString,
    errorMessage,
    userId: currentUser.dataValues.id,
  });
};

exports.postSetNewPassword = async (req, res, next) => {
  const { userId, recoveryString, password, confirmPassword } = req.body;

  console.log(recoveryString);

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/auth/login");
  }

  const currentUser = await User.findByPk(userId);
  if (!currentUser) return res.redirect("/");

  if (!password) {
    req.flash("error", "New password can't be blank");
    return res.redirect("/auth/forgot-password");
  }

  const doMatch = await bcrypt.compare(
    recoveryString,
    currentUser.dataValues.recoveryHash
  );

  if (!doMatch) return res.redirect("/");

  const hashedPassword = await bcrypt.hash(password, 12);
  currentUser.password = hashedPassword;

  currentUser.save().then(() => {
    req.flash("success", `Password has been successfully changed!`);
    req.flash("email", `${currentUser.dataValues.email}`);
    res.redirect("auth/login");
  });
};
