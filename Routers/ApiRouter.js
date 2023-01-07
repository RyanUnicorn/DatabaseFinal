const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/ApiController');
const router = express.Router();

router.post('/Login',express.urlencoded({extended: false}) , controller.postLogin);
router.get('/Logout', auth(), controller.getLogout);

router.post('/Admin/AddBuilding', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAddBuilding);
router.post('/Admin/AddRoom', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAddRoom);
router.post('/Admin/AssignStudent', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAssignStudent);
router.post('/Admin/UpdateEquipment', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminUpdateEquipment);
router.post('/Admin/postAdminUpdateApplication', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminUpdateApplication);
router.post('/Admin/DeleteViolation', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminDeleteViolation);
router.post('/DormAdmin/DeleteViolation', auth('DormAdmin'), express.urlencoded({extended: false}) , controller.postDormAdminDeleteViolation);
router.post('/DormAdmin/NewViolation', auth('DormAdmin'), express.urlencoded({extended: false}) , controller.postDormAdminNewViolation);
router.post('/Admin/DeleteAnnouncement', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminDeleteAnnouncement);
router.post('/DormAdmin/DeleteAnnouncement', auth('DormAdmin'), express.urlencoded({extended: false}) , controller.postDormAdminDeleteAnnouncement);
router.post('/PostAnnouncement', auth('Admin DormAdmin'), express.urlencoded({extended: false}) , controller.postAnnouncement);


module.exports = router;