const User = require("../models/user");
const Color = require("../models/color");
const Note = require("../models/note");
const Tag = require("../models/tag");
const Reminder = require("../models/reminder");
const Language = require("../models/language");
const formatDate = require("../util/formatDate");
const { Op } = require("sequelize");

exports.getIndex = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const user = await User.findByPk(userId);
  const locales = await Language.findAll();
  const userNotes = await user.getNotes({
    include: [Color, Tag],
    where: {
      isArchived: {
        [Op.not]: true,
      },
      isPinned: {
        [Op.is]: true,
      },
    },
    order: [["updatedAt", "DESC"]],
  });

  res.render("main/index", {
    pageTitle: "Home",
    path: "/",
    notes: userNotes,
    user,
    locales,
  });
};

exports.getNotes = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const user = await User.findByPk(userId);
  const userNotes = await user.getNotes({
    include: [Color, Tag],
    where: {
      isArchived: {
        [Op.not]: true,
      },
    },
    order: [["updatedAt", "DESC"]],
  });
  res.render("main/notes-list", {
    pageTitle: "Your Notes",
    path: "/notes",
    notes: userNotes,
  });
};

exports.getAddNote = async (req, res, next) => {
  const { id: userId } = req.session.user;
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  const currentUser = await User.findByPk(userId);
  const colors = await Color.findAll();
  const userTags = await currentUser.getTags({
    order: [["updatedAt", "DESC"]],
  });

  res.render("main/add-note", {
    pageTitle: "Add Note",
    path: "/add-note",
    colors,
    errorMessage,
    editMode: false,
    userTags,
  });
};

exports.postAddNote = async (req, res, next) => {
  const { title, text, colorId = 1, tags } = req.body;
  const image = req.file;
  const { id: userId } = req.session.user;
  const noteText = text.trim();
  let imagePath = null;

  if (image) {
    imagePath = image.path;
  }

  const selectedTags = tags && (tags.length ? tags : [tags]);

  if (!noteText && !image && !title) {
    req.flash("error", "Note can't be blank!");
    return res.redirect("/add-note");
  }

  const currentUser = await User.findByPk(userId);

  currentUser
    .createNote({
      title: title.trim(),
      text: noteText,
      colorId,
      imagePath,
    })
    .then((note) => {
      return selectedTags ? note.setTags(selectedTags) : note.setTags([]);
    })
    .then(() => {
      res.redirect("/notes");
    });
};

exports.postPinNote = (req, res, next) => {
  const { noteId } = req.body;
  Note.findByPk(noteId)
    .then((note) => {
      note.isPinned = !note.isPinned;
      return note.save();
    })
    .then(() => {
      res.redirect("/notes");
    });
};

exports.postDeleteNote = async (req, res, next) => {
  const { noteId } = req.body;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);

  const [noteData] = await currentUser.getNotes({
    where: { id: noteId },
  });
  if (!noteData) {
    res.redirect("/notes");
  }

  noteData.destroy().then(() => {
    res.redirect("/archive");
  });
};

exports.postArchiveNote = (req, res, next) => {
  const { noteId } = req.body;
  Note.findByPk(noteId)
    .then((note) => {
      note.isArchived = !note.isArchived;
      return note.save();
    })
    .then(() => {
      res.redirect("/notes");
    });
};

exports.getEditNote = async (req, res, next) => {
  const { noteId } = req.params;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);
  const userTags = await currentUser.getTags({
    order: [["updatedAt", "DESC"]],
  });

  const [noteData] = await currentUser.getNotes({
    where: { id: noteId },
  });
  if (!noteData) {
    res.redirect("/notes");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  const colors = await Color.findAll();
  const appliedTags = await noteData.getTags({
    order: [["updatedAt", "DESC"]],
  });
  const appliedTagsIdArray = appliedTags.map((tag) => tag.dataValues.id);
  const {
    dataValues: { title, text, colorId, imagePath },
  } = noteData;

  res.render("main/add-note", {
    pageTitle: "Add Note",
    path: "/add-note",
    colors,
    errorMessage,
    editMode: true,
    title,
    colorId,
    text,
    noteId,
    userTags,
    appliedTags: appliedTagsIdArray,
    imagePath,
  });
};

exports.postEditNote = async (req, res, next) => {
  const { noteId, title, text, colorId = null, tags } = req.body;
  const image = req.file;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);
  const noteText = text.trim();
  const selectedTags = tags && (tags.length ? tags : [tags]);

  const [note] = await currentUser.getNotes({
    where: { id: noteId },
  });
  if (!note) {
    res.redirect("/notes");
  }

  if (!noteText && !image && !title) {
    req.flash("error", "Note can't be blank!");
    return res.redirect("/edit-note");
  }

  note.title = title;
  note.text = noteText;
  note.colorId = colorId;
  if (image) {
    note.imagePath = image.path;
  }

  note
    .save()
    .then((note) => {
      return selectedTags ? note.setTags(selectedTags) : note.setTags([]);
    })
    .then(() => {
      res.redirect("/notes");
    });
};

exports.getArchive = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const user = await User.findByPk(userId);
  const userNotes = await user.getNotes({
    include: [Color, Tag],
    where: {
      isArchived: {
        [Op.is]: true,
      },
    },
    order: [["updatedAt", "DESC"]],
  });
  res.render("main/archive", {
    pageTitle: "Achieved Notes",
    path: "/archive",
    notes: userNotes,
  });
};

exports.getTags = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const user = await User.findByPk(userId);
  const userTags = await user.getTags({ order: [["updatedAt", "DESC"]] });
  const editMode = req.query.action;

  res.render("main/tags-list", {
    pageTitle: "Your Tags",
    path: "/tags",
    tags: userTags,
    editMode,
  });
};

exports.getAddTag = (req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("main/add-tag", {
    pageTitle: "Add Tag",
    path: "/add-tag",
    errorMessage,
    editMode: false,
  });
};

exports.postAddTag = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name) {
    req.flash("error", "You should name your tag!");
    return res.redirect("/add-tag");
  }
  const { id: userId } = req.session.user;

  const currentUser = await User.findByPk(userId);

  currentUser
    .createTag({
      name: name.trim(),
      description: description.trim(),
    })
    .then(() => {
      res.redirect("/tags");
    });
};

exports.getTag = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const { tagId } = req.params;
  const currentUser = await User.findByPk(userId);
  const userNotes = await currentUser.getNotes({
    include: [Color, Tag],
    where: {
      isArchived: {
        [Op.not]: true,
      },
    },
    order: [["updatedAt", "DESC"]],
  });
  const [currentTag] = await currentUser.getTags({
    where: { id: tagId },
    order: [["updatedAt", "DESC"]],
  });
  if (!currentTag) res.redirect("/notes");

  const tagNotes = await currentTag.getNotes({
    attributes: ["id"],
    order: [["updatedAt", "DESC"]],
  });
  const tagNotesIds = tagNotes.map(({ dataValues }) => dataValues.id);

  const notesToShow = userNotes.filter(({ dataValues }) =>
    tagNotesIds.includes(dataValues.id)
  );

  res.render("main/tag-notes", {
    pageTitle: `keep me! ${currentTag.dataValues.name}`,
    path: "/tags",
    notes: notesToShow,
    currentTag,
  });
};

exports.getEditTag = async (req, res, next) => {
  const { tagId } = req.params;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);
  const [userTag] = await currentUser.getTags({ where: { id: tagId } });

  if (!userTag) {
    res.redirect("/notes");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("main/add-tag", {
    pageTitle: "Edit Tag",
    path: "/add-tag",
    errorMessage,
    editMode: true,
    tag: userTag,
  });
};

exports.postEditTag = async (req, res, next) => {
  const { tagId, name, description } = req.body;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);

  if (!name) {
    req.flash("error", "Tag must have a name!");
    return res.redirect("/edit-tag");
  }

  const [tag] = await currentUser.getTags({
    where: { id: tagId },
  });
  if (!tag) {
    res.redirect("/notes");
  }

  tag.name = name;
  tag.description = description;

  tag.save().then(() => {
    res.redirect("/tags?action=edit");
  });
};

exports.postDeleteTag = async (req, res, next) => {
  const { tagId } = req.body;
  const { id: userId } = req.session.user;
  const currentUser = await User.findByPk(userId);

  const [tagData] = await currentUser.getTags({
    where: { id: tagId },
  });

  if (!tagData) {
    res.redirect("/notes");
  }

  tagData.destroy().then(() => {
    res.redirect("/tags?action=edit");
  });
};

exports.getAddReminder = async (req, res, next) => {
  const { noteId } = req.params;
  const { id: userId } = req.session.user;

  const currentUser = await User.findByPk(userId);
  const [currentNote] = await currentUser.getNotes({ where: { id: noteId } });

  if (!currentNote) {
    return res.redirect("/notes");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("main/add-reminder", {
    pageTitle: "Add Reminder",
    path: "/add-reminder",
    errorMessage,
    editMode: false,
    note: currentNote,
  });
};

exports.postAddReminder = async (req, res, next) => {
  const { timestamp, remindText, noteId } = req.body;
  if (!timestamp) {
    req.flash("error", "You should specify remind date!");
    return res.redirect(`/add-reminder/${noteId}`);
  }

  const targetDate = formatDate(timestamp);
  const today = formatDate(Date.now());

  if (targetDate < today) {
    req.flash("error", "Remind date should be in future!");
    return res.redirect(`/add-reminder/${noteId}`);
  }
  const { id: userId } = req.session.user;

  const currentUser = await User.findByPk(userId);
  const [currentNote] = await currentUser.getNotes({ where: { id: noteId } });

  if (!currentNote) {
    return res.redirect("/notes");
  }

  currentNote
    .createReminder({
      remindText: remindText.trim(),
      timestamp: timestamp,
    })
    .then(() => {
      res.redirect("/reminders");
    });
};

exports.getReminders = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const editMode = req.query.action;
  const user = await User.findByPk(userId);
  const userNotes = await user.getNotes({
    include: [Reminder, Color],
    order: [["updatedAt", "DESC"]],
  });
  const remindNotes = userNotes.filter(
    ({ dataValues }) => dataValues.reminders.length
  );

  res.render("main/reminders-list", {
    pageTitle: "Your Reminders",
    path: "/reminders",
    notes: remindNotes,
    editMode,
  });
};

exports.getEditReminder = async (req, res, next) => {
  const { reminderId } = req.params;
  const { id: userId } = req.session.user;

  const currentReminder = await Reminder.findByPk(reminderId);
  const currentUser = await User.findByPk(userId);
  const userReminder = await Reminder.findByPk(reminderId);
  const [currentNote] = await currentUser.getNotes({
    where: { id: currentReminder.dataValues.noteId },
  });

  const targetDate = formatDate(userReminder.dataValues.timestamp);

  if (!userReminder) {
    res.redirect("/reminders");
  }

  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render("main/add-reminder", {
    pageTitle: "Edit Reminder",
    path: "/add-reminder",
    errorMessage,
    editMode: true,
    reminder: userReminder,
    note: currentNote,
    targetDate,
  });
};

exports.postEditReminder = async (req, res, next) => {
  const { reminderId, timestamp, remindText } = req.body;
  const { id: userId } = req.session.user;
  const reminder = await Reminder.findByPk(reminderId);
  const currentNote = await reminder.getNote();

  if (currentNote.dataValues.userId !== userId) {
    res.redirect("/reminders");
  }
  const target = new Date(timestamp);
  const now = new Date(Date.now());
  const targetDate = `${target.getFullYear()}-${
    target.getMonth() + 1
  }-${target.getDate()}`;
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  if (targetDate < today) {
    req.flash("error", "Remind date should be in future!");
    return res.redirect(`/edit-reminder/${reminderId}`);
  }

  if (!timestamp) {
    req.flash("error", "You must specify remind date!");
    return res.redirect(`/edit-reminder/${reminderId}`);
  }
  if (!reminder) {
    res.redirect("/reminders");
  }

  reminder.timestamp = timestamp;
  reminder.remindText = remindText;

  reminder.save().then(() => {
    res.redirect("/reminders?action=edit");
  });
};

exports.postDeleteReminder = async (req, res, next) => {
  const { reminderId } = req.body;
  const { id: userId } = req.session.user;

  const currentReminder = await Reminder.findByPk(reminderId);
  const currentNote = await currentReminder.getNote();

  if (currentNote.dataValues.userId !== userId) {
    res.redirect("/reminders?action=edit");
  }

  currentReminder.destroy().then(() => {
    res.redirect("/reminders?action=edit");
  });
};

exports.getSearch = async (req, res, next) => {
  res.render("main/search", {
    pageTitle: "Search",
    path: "/search",
    notes: [],
    searchTerm: false,
  });
};

exports.postSearch = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const { searchTerm } = req.body;
  const currentUser = await User.findByPk(userId);

  const query = {
    [Op.or]: {
      title: { [Op.substring]: searchTerm },
      text: {
        [Op.substring]: searchTerm,
      },
    },
  };

  const foundNotes = await currentUser.getNotes({
    where: query,
    include: [Color, Tag],
    order: [["updatedAt", "DESC"]],
  });

  res.render("main/search", {
    pageTitle: "Search",
    path: "/search",
    notes: foundNotes,
    searchTerm,
  });
};

exports.poshChangeLocale = async (req, res, next) => {
  const { id: userId } = req.session.user;
  const { localeId } = req.body;
  const currentUser = await User.findByPk(userId);
  const currentLocale = await Language.findByPk(localeId);

  req.session.locale = currentLocale.dataValues.shortName;

  currentUser.languageId = localeId;

  currentUser.save().then(() => {
    res.redirect("/");
  });
};
