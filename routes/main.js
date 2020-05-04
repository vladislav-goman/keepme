const express = require("express");

const mainController = require("../controllers/main");

const router = express.Router();

router.get("/", mainController.getIndex);

// Notes

router.get("/notes", mainController.getNotes);

router.get("/add-note", mainController.getAddNote);

router.post("/add-note", mainController.postAddNote);

router.get("/edit-note/:noteId", mainController.getEditNote);

router.post("/edit-note", mainController.postEditNote);

router.post("/delete-note", mainController.postDeleteNote);

// Features

router.post("/archive-note", mainController.postArchiveNote);

router.post("/pin-note", mainController.postPinNote);

router.get("/archive", mainController.getArchive);

// Tags

router.get("/tags", mainController.getTags);

router.get("/tags/:tagId", mainController.getTag);

router.get("/add-tag", mainController.getAddTag);

router.post("/add-tag", mainController.postAddTag);

router.get("/edit-tag/:tagId", mainController.getEditTag);

router.post("/edit-tag", mainController.postEditTag);

router.post("/delete-tag", mainController.postDeleteTag);

// Reminders

router.get("/reminders", mainController.getReminders);

router.get("/add-reminder/:noteId", mainController.getAddReminder);

router.post("/add-reminder", mainController.postAddReminder);

router.post("/edit-reminder", mainController.postEditReminder);

router.get("/edit-reminder/:reminderId", mainController.getEditReminder);

router.post("/delete-reminder", mainController.postDeleteReminder);

// Search

router.get("/search", mainController.getSearch);

router.post("/search", mainController.postSearch);

// Locales

router.post("/change-locale", mainController.poshChangeLocale);

module.exports = router;
