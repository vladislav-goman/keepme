const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/colors', adminController.getColors);

router.get('/add-color', adminController.getAddColor);

router.post('/add-color', adminController.postAddColor);

router.post('/colors', adminController.postColors);

module.exports = router;
