const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getAdminIndex);

router.get('/colors', adminController.getColors);

router.get('/add-color', adminController.getAddColor);

router.post('/add-color', adminController.postAddColor);

router.get('/edit-color/:colorId', adminController.getEditColor);

router.post('/edit-color', adminController.postEditColor);

router.post('/delete-color', adminController.postDeleteColor);

router.get('/edit-user/:userId', adminController.getEditUser);

router.post('/edit-user', adminController.postEditUser);

router.post('/delete-user', adminController.postDeleteUser);

router.post('/clear-user-notes', adminController.postClearNotes);

router.post('/clear-user-tags', adminController.postClearTags);

router.post('/change-admin-role', adminController.postChangeAdminRole);

module.exports = router;
