const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/UserController');
const router = express.Router();


router.get('/Login', controller.getLogin);

router.use(auth('Student'));
router.get('/Application', controller.getApplication);
router.get('/Room', controller.getRoom);
router.get('/Comment', controller.getComment);
router.get('/Announcement', controller.getAnnouncement);
router.get('/Violation', controller.getViolation);
router.get('/Student', controller.getStudent);
router.get('/Student/:id', controller.getStudentId);

module.exports = router;