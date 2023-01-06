const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/UserController');
const router = express.Router();


router.get('/Login', controller.getLogin);

router.use(auth('Student'));
router.get('/Application', controller.getApplication); // 住宿申請
router.get('/Comment', controller.getComment); // 留言板
router.get('/Announcement', controller.getAnnouncement); // 公告
router.get('/Violation', controller.getViolation); // 違規紀錄

module.exports = router;