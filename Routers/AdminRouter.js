const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/AdminController');
const router = express.Router();

router.use(auth('Admin'));

router.get('/Dorm', controller.getDorm);
router.get('/Student', controller.getStudent);
router.get('/Student/:id', controller.getStudentId);
router.get('/Application', controller.getApplication);
router.get('/Equipment/:id', controller.getEquipment);

module.exports = router;