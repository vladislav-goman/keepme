const forceHTTPS = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] === "https") {
    return next();
  } else {
    res.redirect("https://" + req.headers.host + req.path);
  }
};

module.exports = forceHTTPS;
