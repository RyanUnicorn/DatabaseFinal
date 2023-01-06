const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/ApiController');
const router = express.Router();

router.post('/Login',express.urlencoded({extended: false}) , controller.postLogin);
router.get('/Logout', auth(), controller.getLogout);

module.exports = router;