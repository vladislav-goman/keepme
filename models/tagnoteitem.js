const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TagNoteItem = sequelize.define('tagged_note_item');

module.exports = TagNoteItem;
