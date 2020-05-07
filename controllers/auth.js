const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/user");
const Language = require("../models/language");

const emailer = require("../util/emailer");

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
  User.findOne({ where: { email }, include: Language })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        req.flash("email", `${email}`);
        return res.redirect("/auth/login");
      }
      if (!user.dataValues.isMailVerified) {
        req.flash("error", "Аккаунт не был активирован.");
        req.flash("email", `${email}`);
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.dataValues.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.isAdmin = user.isAdmin;
            req.session.locale = user.dataValues.language.dataValues.shortName;
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

  const recoveryString = crypto.randomBytes(20).toString("hex");
  const recoveryHash = await bcrypt.hash(recoveryString, 12);

  const user = new User({
    email,
    login,
    password: hashedPassword,
    languageId: 1,
    recoveryHash,
  });

  const currentUser = await user.save();

  req.flash("email", `${email}`);
  req.flash(
    "success",
    `Добро пожаловать, ${login}! Ваш аккаунт был успешно создан! Для активации проверьте свой E-Mail.`
  );
  res.redirect("/auth/login");

  const msg = {
    to: email.trim(),
    from: "info.keepme@gmail.com",
    subject: "Регистрация на keepme.tech!",
    html: `<h1 style="text-align:center">Ваша регистрация на keepme.tech прошла успешно!</h1>
              <h2 style="text-align:center">Добро пожаловать, ${login}!</h2>
              <h3>Для активации аккаунта пройдите по ссылке ниже</h3>
      <a style="margin: auto; text-decoration: none; font-size: 20px; padding: 0.4rem 0.8rem; background-color: #2EC4B6; border-radius: 8px; color: #ffffff;" href="${`${
        req.protocol
      }://${req.get("host")}${req.originalUrl}/${
        currentUser.dataValues.id
      }`}">Активировать аккаунт</a>`,
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
    req.flash("error", "Такой мейл не зарегистрировн.");
    req.flash("email", `${email}`);
    return res.redirect("/auth/forgot-password");
  }

  const recoveryString = crypto.randomBytes(20).toString("hex");
  const recoveryHash = await bcrypt.hash(recoveryString, 12);

  currentUser.recoveryHash = recoveryHash;

  currentUser.save().then(() => {
    req.flash("success", `Для смены пароля пожалуйста проверьте свой имейл.`);
    res.redirect("login");

    const msg = {
      to: currentUser.dataValues.email,
      from: "info.keepme@gmail.com",
      subject: "Сброс пароля на keepme.tech",
      html: `<h1 style="text-align:center">Если вы хотите сменить пароль, пройдите по ссылке ниже:</h1>
      <a style="margin: auto; text-decoration: none; font-size: 20px; padding: 0.4rem 0.8rem; background-color: #d9534f; border-radius: 8px; color: #ffffff;" href="${`${
        req.protocol
      }://${req.get("host")}${req.originalUrl}/${
        currentUser.dataValues.id
      }/${recoveryString}`}">Сброс пароля</a>`,
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

  if (!currentUser.dataValues.isMailVerified) {
    return res.redirect(`/auth/signup/${currentUser.dataValues.id}`);
  }

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

  const newRecoveryString = crypto.randomBytes(20).toString("hex");
  const recoveryHash = await bcrypt.hash(newRecoveryString, 12);

  currentUser.recoveryHash = recoveryHash;

  currentUser.save().then(() => {
    req.flash("success", `Пароль был успешно изменён!`);
    req.flash("email", `${currentUser.dataValues.email}`);
    res.redirect("auth/login");
  });
};

exports.getActivate = async (req, res, next) => {
  const { userId } = req.params;

  const currentUser = await User.findByPk(userId);
  if (!currentUser) res.redirect("/");

  if (!currentUser.dataValues.isMailVerified) {
    currentUser.isMailVerified = true;

    return currentUser.save().then(() => {
      req.flash("success", `Ваш аккаунт был успешно активирован!`);
      req.flash("email", `${currentUser.dataValues.email}`);
      return res.redirect("/auth/login");
    });
  }
  return res.redirect("/auth/login");
};
