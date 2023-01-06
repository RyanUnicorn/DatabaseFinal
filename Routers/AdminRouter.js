const express = require('express');
const auth = require('../Middlewares/Auth');
const adminController = require('../Controllers/AdminController');
const userController = require('../Controllers/UserController');
const router = express.Router();

router.use(auth('Admin'));

router.get('/Dorm', adminController.getDorm); // 所有宿舍大樓頁面
router.get('/Dorm/:buildId', userController.getBuilding); // 宿舍大樓內所有房間
router.get('/Dorm/:buildId/:roomId', userController.getRoom); // 房間詳細資料
router.get('/Dorm/:buildId/:roomId/:equipId', adminController.getEquipment); // 設備詳細資料
router.get('/Student', adminController.getStudent); // 管理學生們
router.get('/Student/:id', adminController.getStudentId); // 學生詳細資料
router.get('/Application', adminController.getApplication); // 審核住宿申請
router.get('/Announcement', userController.getAnnouncement); // 管理公告
router.get('/Comment', userController.getComment); // 管理留言板
router.get('/Violation', userController.getViolation); // 違規紀錄管理

module.exports = router;