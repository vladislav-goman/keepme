const Color = require("../models/color");
const User = require("../models/user");
const Note = require("../models/note");
const Tag = require("../models/tag");

exports.getAdminIndex = async (req, res, next) => {
  const { id: userId } = req.session.user;

  const currentUser = await User.findByPk(userId);
  const allUsers = await User.findAll({
    include: [Note, Tag],
    order: [["id"]],
  });

  res.render("admin/index", {
    pageTitle: "Admin Panel",
    path: "/admin",
    users: allUsers,
    currentUser: currentUser,
  });
};

exports.getColors = async (req, res, next) => {
  const colors = await Color.findAll({ order: [["updatedAt", "DESC"]] });
  const editMode = req.query.action;

  res.render("admin/colors", {
    colors,
    pageTitle: "Colors",
    path: "/admin",
    editMode,
  });
};

exports.getAddColor = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render("admin/add-color", {
    pageTitle: "Colors",
    path: "/admin",
    errorMessage,
    editMode: false,
  });
};

exports.postAddColor = (req, res, next) => {
  const { name, hash } = req.body;
  const colorHash = hash.toLowerCase();
  if (!name) {
    req.flash("error", "Name can't be blank!");
    return res.redirect("/admin/add-color");
  }
  const regexp = /#[0-9a-f]{6}/;
  if (!regexp.test(colorHash) || colorHash.length !== 7) {
    req.flash("error", "Invalid color hash");
    return res.redirect("/admin/add-color");
  }
  Color.findOne({ where: { hash: colorHash } })
    .then((colorProfile) => {
      if (colorProfile) {
        req.flash("error", "This color already exists!");
        return res.redirect("/admin/add-color");
      }
      const newColor = new Color({
        hash: colorHash,
        name,
      });
      return newColor.save();
    })
    .then(() => {
      return res.redirect("/admin/colors");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditColor = async (req, res, next) => {
  const { colorId } = req.params;
  const currentColor = await Color.findByPk(colorId);

  if (!currentColor) {
    res.redirect("/admin/colors");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("admin/add-color", {
    pageTitle: "Edit Color",
    path: "/admin",
    errorMessage,
    editMode: true,
    color: currentColor,
  });
};

exports.postEditColor = async (req, res, next) => {
  const { colorId, hash, name } = req.body;
  const currentColor = await Color.findByPk(colorId);

  if (!currentColor) {
    res.redirect("/colors");
  }

  if (!name) {
    req.flash("error", "You should specify a color a name!");
    return res.redirect(`/admin/edit-color/${colorId}`);
  }

  if (!hash) {
    req.flash("error", "You should specify a color a hash code!");
    return res.redirect(`/admin/edit-color/${colorId}`);
  }

  const regexp = /#[0-9a-f]{6}/;
  if (!regexp.test(hash) || hash.length !== 7) {
    req.flash("error", "Invalid color hash!");
    return res.redirect(`/admin/edit-color/${colorId}`);
  }

  currentColor.name = name;
  currentColor.hash = hash;

  currentColor.save().then(() => {
    res.redirect("/admin/colors?action=edit");
  });
};

exports.postDeleteColor = async (req, res, next) => {
  const { colorId } = req.body;
  const currentColor = await Color.findByPk(colorId);

  if (!currentColor) {
    res.redirect("/admin/colors");
  }

  currentColor.destroy().then(() => {
    res.redirect("/admin/colors?action=edit");
  });
};

exports.getEditUser = async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = await User.findByPk(userId);

  if (!currentUser) {
    res.redirect("/admin");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("admin/edit-user", {
    pageTitle: "Edit User",
    path: "/admin",
    errorMessage,
    currentUser,
  });
};

exports.postEditUser = async (req, res, next) => {
  const { userId, login, email } = req.body;
  const currentUser = await User.findByPk(userId);

  if (!currentUser) {
    res.redirect("/admin");
  }

  if (!login) {
    req.flash("error", "You should specify user login!");
    return res.redirect(`/admin/edit-user/${colorId}`);
  }

  if (!email) {
    req.flash("error", "You should specify user email!");
    return res.redirect(`/admin/edit-user/${colorId}`);
  }

  currentUser.login = login;
  currentUser.email = email;

  currentUser.save().then(() => {
    res.redirect("/admin");
  });
};

exports.postDeleteUser = async (req, res, next) => {
  const { userId } = req.body;
  const currentUser = await User.findByPk(userId);

  if (!currentUser) {
    res.redirect("/admin");
  }

  currentUser.destroy().then(() => {
    res.redirect("/admin");
  });
};

exports.postClearNotes = async (req, res, next) => {
  const { userId } = req.body;
  const currentUser = await User.findByPk(userId);

  if (!currentUser) {
    res.redirect("/admin");
  }

  currentUser
    .setNotes([])
    .then(() => {
      return Note.destroy({ where: { userId: null } });
    })
    .then(() => {
      res.redirect("/admin");
    });
};

exports.postClearTags = async (req, res, next) => {
  const { userId } = req.body;
  const currentUser = await User.findByPk(userId);

  if (!currentUser) {
    res.redirect("/admin");
  }

  currentUser
    .setTags([])
    .then(() => {
      return Tag.destroy({ where: { userId: null } });
    })
    .then(() => {
      res.redirect("/admin");
    });
};

exports.postChangeAdminRole = (req, res, next) => {
  const { userId } = req.body;
  User.findByPk(userId)
    .then((user) => {
      if (!user) return res.redirect("/admin");
      user.isAdmin = !user.isAdmin;
      return user.save();
    })
    .then(() => {
      res.redirect("/admin");
    });
};
