const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.get('/signup/:userId', authController.getActivate);

router.post('/logout', authController.postLogout);

router.get('/forgot-password', authController.getForgotPassword);

router.get('/forgot-password/:userId/:recoveryString', authController.getSetNewPassword);

router.post('/forgot-password', authController.postForgotPassword);

router.post('/set-new-password', authController.postSetNewPassword);

module.exports = router;