const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

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
              console.log(err);
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

exports.postSignup = (req, res, next) => {
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

  User.findOne({ where: { email } })
    .then(async (userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one."
        );
        req.flash("email", `${email}`);
        req.flash("login", `${login}`);
        return res.redirect("/auth/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            login,
            password: hashedPassword,
          });
          return user.save();
        })
        .then(() => {
          req.flash("email", `${email}`);
          req.flash(
            "success",
            `Welcome, ${login}! Your account has been successfully registered!`
          );
          res.redirect("/auth/login");
          const msg = {
            to: email.trim(),
            from: "vlad.mangoman@gmail.com",
            subject: "Your signup on keepme succeeded!",
            html: `<h1 style="text-align:center">Your account has been successfully created!</h1>
              <h2 style="text-align:center">Welcome to keepme, ${login}!</h2>`,
          };
          return sgMail.send(msg).then((err) => console.log(err));
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
