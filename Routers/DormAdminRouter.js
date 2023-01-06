const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/UserController');
const router = express.Router();


router.get('/Login', controller.getLogin);

router.use(auth('Student'));
router.use(auth('DormAdmin'));
router.get('/Application', controller.getApplication); // 住宿申請
router.get('/Comment', controller.getComment); // 留言板 + 管理 (可以發布 + 刪除)
router.get('/Announcement', controller.getAnnouncement); // 公告 + 管理 (可以發布 + 刪除)
router.get('/Violation', controller.getViolation); // 違規紀錄 + 管理 (可以新增 + 刪除)
router.get('/Room', controller.getBuilding); // 房間管理 (他管的房間的資料，只有學生資料)
router.get('/Room/:roomId', controller.getRoom); // 房間詳細管理 (他管的房間的資料，只有學生資料)


module.exports = router;