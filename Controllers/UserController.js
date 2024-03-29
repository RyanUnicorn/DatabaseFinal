const db = require('../Models/DormDb');

module.exports = {
    getLogin: async (req, res) => {
        // 登入介面
        res.renderInjected('Student/Login');
    },

    getApplication: async (req, res) => {
        // 學生申請頁面
        res.renderInjected('Student/Application',{
            Application: await db.getApplication(req.userData.id),
        });
        
    },

    getComment: async (req, res) => {
        // 留言板
        // S(tudent) : 能瀏覽、發布
        // D(ormAdmin) : 能瀏覽、發布、刪除
        // A(dmin) : 能瀏覽、刪除

        let comments = await db.getAllComment();

        res.renderInjected('_Shared/Comment', {
            comments: comments,
        });
    },

    getAnnouncement: async (req, res) => {
        // 公告
        // S : 能瀏覽
        // D : 能瀏覽、發布、刪除
        // A : 能瀏覽、刪除

        let announcements = await db.getAllAnouncement();

        res.renderInjected('_Shared/Announcement', {
            announcements: announcements,
        });
    },

    getViolation: async (req, res) => {
        // 違規紀錄
        // S : 能瀏覽
        // D : 能瀏覽、發布、刪除
        // A : 能瀏覽、刪除

        let violationDatas = await db.getViolationData();

        res.renderInjected('_Shared/Violation', {
            violationDatas: violationDatas,
        });
    },

    getBuilding: async (req, res) => {
        // 某大樓內所有房間
        // S : 不能瀏覽
        // D : 只能瀏覽自己的大樓
        // A : 能瀏覽、新增

        let buildingName;

        if(req.userData.roles.has('Admin')){
            // 管理員
            buildingName = req.params.buildId;
        }else{
            // 舍監
            buildingName = await db.getDormAdminsBuilding(req.userData.id);
        }

        let allRooms = await db.getAllRoom(buildingName);

        res.renderInjected('_Shared/Building', {
            buildingName: buildingName,
            allRooms: allRooms,
        });
    },

    getRoom: async (req, res) => {
        // 房間詳細資料頁面
        // S : 不能瀏覽
        // D : 只能瀏覽
        // A : 能瀏覽、新增、刪除?

        let buildingName;
        let roomNumber = req.params.roomId;

        if(req.userData.roles.has('Admin')){
            // 管理員
            buildingName = req.params.buildId;
        }else{
            // 舍監
            buildingName = await db.getDormAdminsBuilding(req.userData.id);
        }
        let allStudents = await db.getAllRoomsStudent(buildingName, roomNumber);
        let allEquipments = await db.getAllRoomsEquipment(buildingName, roomNumber);
        let assignableStudents = await db.getAllApprovedHomelessStudent();

        res.renderInjected('_Shared/Room', {
            buildingName: buildingName,
            roomNumber: roomNumber,
            allStudents: allStudents,
            allEquipments: allEquipments,
            assignableStudents: assignableStudents,
        });
    },
};