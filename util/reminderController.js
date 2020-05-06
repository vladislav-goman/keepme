const Reminder = require("../models/reminder");
const Note = require("../models/note");
const emailer = require("./emailer");
const { Op } = require("sequelize");

const reminderController = async () => {
  const triggeredReminders = await Reminder.findAll({
    where: { timestamp: { [Op.lte]: Date.now() } },
    include: Note,
  });

  triggeredReminders.forEach(async (reminder) => {
    if (!reminder.dataValues.noteId) {
      reminder.destroy();
    } else {
      const currentNote = await reminder.getNote();
      const currentUser = await currentNote.getUser();

      const msg = {
        to: currentUser.dataValues.email,
        from: "info.keepme@gmail.com",
        subject: "Reminder from keepme.tech",
        html: `<h1 style="text-align:center">Hello from keepme!</h1>
            <h2 style="text-align:center">We're reminding about your note:</h2>
            <p>Note title: ${currentNote.dataValues.title}</p>
            <p>Note text: ${currentNote.dataValues.text}</p>
            <p>Your text to remind: ${reminder.dataValues.remindText}</p>
            <br />
            <p>This reminder will be deleted automatically.</p>
            <p>Thanks for working with us!</p>`,
      };
      emailer.sendMail(msg).catch((err) => console.log(err));
      reminder.destroy();
    }
  });
};

module.exports = reminderController;
