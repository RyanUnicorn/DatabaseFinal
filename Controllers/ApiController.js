const db = require('../Models/DormDb');

module.exports = {
    postLogin: async (req, res) => {
        // console.log(req.body.name, req.body.pass);

        let userData = await db.validLogin(req.body.name, req.body.pass);
        // console.log(userData);

        if(userData){
            req.session.regenerate(err => {
                if(err) next(err);

                req.session.userRoles = userData.userRoles;
                req.session.userId = userData.userId;
                req.session.userName = userData.userName;
                
                req.session.save(err => {
                    if(err) next(err);
                    let roles = new Set(req.session.userRoles.split(' '));
                    if(roles.has('Admin')){
                        res.redirect('/Admin/Dorm');
                    }else if(roles.has('DormAdmin')){
                        res.redirect('/DormAdmin/Announcement');
                    }else{
                        res.redirect('/Student/Announcement');
                    }
                });
            });
        }else{
            res.send('<script> alert("Login Failed!"); window.location = "/"; </script>');
        }
    },

    getLogout: async (req, res) => {
        req.session.userRoles = null;
        req.session.userId = null;
        req.session.userName = null;
        req.session.save(err => {
            if(err) next(err);

            req.session.regenerate(err => {
                if(err) next(err);
                res.redirect('/');
            });
        });
    },

    postAdminAddBuilding: async (req, res) => {
        // console.log(req.body.buildingName, req.body.buildingCost);
        await db.insertBuilding(req.body.buildingName, req.body.buildingCost);
        res.redirect('/Admin/Dorm');
    },

    postAdminAddRoom: async (req, res) => {
        // console.log(req.body.buildingName, req.body.roomNumber);
        await db.insertRoom(req.body.buildingName, req.body.roomNumber);
        res.redirect(`/Admin/Dorm/${req.body.buildingName}`);
    },

    postAdminAssignStudent: async (req, res) => {
        // console.log(req.body.buildingName, req.body.roomNumber, req.body.studentId);

        let homeless = await db.getAllApprovedHomelessStudent();
        let assignable = false;
        // console.log(homeless);
        for(let s of homeless){
            // console.log(s.building_name, s.room_number, s.student_id);
            if(!s.building_name && !s.room_number && s.student_id === req.body.studentId){
                assignable = true;
                break;
            }
        }
        if(assignable){
            await db.assignStudentToRoom(req.body.buildingName, req.body.roomNumber, req.body.studentId);
        }
        
        res.redirect(`/Admin/Dorm/${req.body.buildingName}/${req.body.roomNumber}`);
    },

    postAdminUpdateEquipment: async (req, res) => {
        let buildingName = req.body.buildingName;
        let roomNumber = req.body.roomNumber;
        let equipmentName = req.body.equipmentName;
        let quantity = req.body.quantity;
        
        await db.updateEquipment(buildingName, roomNumber, equipmentName, quantity);
        res.redirect(`/Admin/Dorm/${buildingName}/${roomNumber}`);
    },

    postAdminDeleteViolation: async (req, res) => {
        db.deleteViolationWithAdmin(req.body.violationId);
        res.redirect('/Admin/Violation');
    },

    postDormAdminDeleteViolation: async (req, res) => {
        db.deleteViolationWithDormAdmin(req.body.violationId, req.userData.id);
        res.redirect('/DormAdmin/Violation');
    },

    postAdminUpdateApplication: async (req, res) => {
        var student = JSON.parse(req.body.data).StudentTemp;
        var paid = JSON.parse(req.body.data).PaidTemp;
        var approve = JSON.parse(req.body.data).ApproveTemp;
        var application = await db.getAllApplication();
        for(let i=0; i<application.length   ; i++){
            if(paid[i] != application[i].paid || approve[i] != application[i].approve){
                await db.updateAllApplication(student[i], paid[i], approve[i]);
                console.log("Update Student: "+student[i]+" Paid: "+paid[i]+" Approve: "+approve[i]);
            }
        }
        res.redirect('/Admin/Application');
    },

    postApply: async (req, res) => {
        await db.insertApplication(req.userData.id, req.body.school_year, req.body.semester);
        res.redirect('/Student/Application');
    },

    postDormAdminNewViolation: async (req, res) => {
        // console.log(req.userData.id, req.body.studentId, req.body.detail, req.body.punishment);
        await db.insertViolation(req.userData.id, req.body.studentId, req.body.detail, req.body.punishment);
        res.redirect('/DormAdmin/Violation');
    },

    postAdminDeleteAnnouncement: async (req, res) => {
        db.deleteAnnouncement(req.body.announcementId);
        res.redirect('/Admin/Announcement');
    },

    postDormAdminDeleteAnnouncement: async (req, res) => {
        db.deleteAnnouncement(req.body.announcementId, req.userData.id);
        res.redirect('/DormAdmin/Announcement');
    },

    postAnnouncement: async (req, res) => {
        // console.log(req.body.content, req.userData.id);
        db.postAnnouncement(req.body.content, req.userData.id);
        res.redirect(`/${req.userData.roles.has('Admin')? 'Admin' : 'DormAdmin'}/Announcement`);
    },
};