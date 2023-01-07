const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/ApiController');
const router = express.Router();

router.get('/Logout', auth(), controller.getLogout);

router.use(express.urlencoded({extended: false}));

router.post('/Login', controller.postLogin);
router.post('/Admin/AddBuilding', auth('Admin'), controller.postAdminAddBuilding);
router.post('/Admin/AddRoom', auth('Admin'), controller.postAdminAddRoom);
router.post('/Admin/AssignStudent', auth('Admin'), controller.postAdminAssignStudent);
router.post('/Admin/UpdateEquipment', auth('Admin'), controller.postAdminUpdateEquipment);
router.post('/Admin/postAdminUpdateApplication', auth('Admin'), controller.postAdminUpdateApplication);
router.post('/Admin/DeleteViolation', auth('Admin'), controller.postAdminDeleteViolation);
router.post('/DormAdmin/DeleteViolation', auth('DormAdmin'), controller.postDormAdminDeleteViolation);
router.post('/DormAdmin/NewViolation', auth('DormAdmin'), controller.postDormAdminNewViolation);
router.post('/Admin/DeleteAnnouncement', auth('Admin'), controller.postAdminDeleteAnnouncement);
router.post('/DormAdmin/DeleteAnnouncement', auth('DormAdmin'), controller.postDormAdminDeleteAnnouncement);
router.post('/PostAnnouncement', auth('Admin DormAdmin'), controller.postAnnouncement);
router.post('/Student/postApply', auth('Student'), controller.postApply);
router.post('/PostComment', auth(), controller.postComment);
router.post('/DeleteComment', auth('Admin DormAdmin'), controller.deleteComment);


module.exports = router;