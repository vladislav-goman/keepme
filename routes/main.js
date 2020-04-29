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

// router.get("/edit-reminder/:reminderId", mainController.getEditReminder);

// router.post("/edit-reminder", mainController.postEditReminder);

// router.post("/delete-reminder", mainController.postDeleteReminder);

module.exports = router;
