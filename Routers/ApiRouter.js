const express = require('express');
const auth = require('../Middlewares/Auth');
const controller = require('../Controllers/ApiController');
const router = express.Router();

router.post('/Login',express.urlencoded({extended: false}) , controller.postLogin);
router.get('/Logout', auth(), controller.getLogout);

router.post('/Admin/AddBuilding', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAddBuilding);
router.post('/Admin/AddRoom', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAddRoom);
router.post('/Admin/AssignStudent', auth('Admin'), express.urlencoded({extended: false}) , controller.postAdminAssignStudent);
router.post('/Admin/UpdateEquipment', auth('Admin'), express.urlencoded({extended: false}) , controller.postUpdateEquipment);


module.exports = router;