const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const forceHTTPS = require("./middleware/forceHTTPS");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const User = require("./models/user");
const Note = require("./models/note");
const Color = require("./models/color");
const Tag = require("./models/tag");
const Reminder = require("./models/reminder");

const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const loggingStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: loggingStream }));

if (process.env.NODE_ENV === "production") {
  app.use(forceHTTPS);
}

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (
    !req.session.isLoggedIn &&
    !(
      req.url === "/auth/login" ||
      req.url === "/auth/signup" ||
      req.url === "/auth/set-new-password" ||
      req.url.includes("/auth/forgot-password")
    )
  ) {
    return res.redirect("/auth/login");
  } else next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(mainRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(errorController.get404);

User.hasMany(Note, { constraints: true, onDelete: "CASCADE" });
Note.belongsTo(User);

Note.belongsTo(Color);
Color.hasMany(Note);

User.hasMany(Tag, { constraints: true, onDelete: "CASCADE" });
Tag.belongsTo(User);

Note.hasMany(Reminder);
Reminder.belongsTo(Note);

Note.belongsToMany(Tag, {
  through: "tagged_note_item",
});
Tag.belongsToMany(Note, {
  through: "tagged_note_item",
});

const syncConfig = process.env.FORCE_SYNC ? { force: true } : {};

sequelize
  .sync(syncConfig)
  .then(() => {
    if (process.env.FORCE_SYNC) {
      Color.create({
        name: "White",
        hash: "#ffffff",
      });
      Color.create({
        name: "Gray",
        hash: "#e8eaed",
      });
      Color.create({
        name: "Brown",
        hash: "#e6c9a8",
      });
      Color.create({
        name: "Pink",
        hash: "#fdcfe8",
      });
      Color.create({
        name: "Purple",
        hash: "#d7aefb",
      });
      Color.create({
        name: "Dark Blue",
        hash: "#aecbfa",
      });
      Color.create({
        name: "Blue",
        hash: "#cbf0f8",
      });
      Color.create({
        name: "Salad",
        hash: "#a7ffeb",
      });
      Color.create({
        name: "Green",
        hash: "#ccff90",
      });
      Color.create({
        name: "Yellow",
        hash: "#fff475",
      });
      Color.create({
        name: "Orange",
        hash: "#fbbc04",
      });
      Color.create({
        name: "Red",
        hash: "#f28b82",
      });
    }
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
