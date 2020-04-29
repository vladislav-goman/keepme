const Color = require("../models/color");

exports.getColors = async (req, res, next) => {
  const colors = await Color.findAll({ attributes: ["name", "hash"] });
  res.render("admin/colors", {
    colors: colors,
    pageTitle: "Colors",
    path: "/colors",
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
    path: "/colors",
    errorMessage,
  });
};

exports.postColors = (req, res, next) => {
  res.redirect("/");
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
