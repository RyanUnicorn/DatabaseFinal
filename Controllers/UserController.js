const db = require('../Models/DromDb');

module.exports = {
    getLogin: async (req, res) => {
        // 登入介面
        res.renderInjected('Student/Login');
    },

    getApplication: async (req, res) => {
        // 學生住請頁面
        res.renderInjected('Student/Application');
    },

    getComment: async (req, res) => {
        // 留言板
        // S(tudent) : 能瀏覽、發布
        // D(ormAdmin) : 能瀏覽、發布、刪除
        // A(dmin) : 能瀏覽、刪除
        res.renderInjected('_Shared/Comment');
    },

    getAnnouncement: async (req, res) => {
        // 公告
        // S : 能瀏覽
        // D : 能瀏覽、發布、刪除
        // A : 能瀏覽、刪除
        res.renderInjected('_Shared/Announcement');
    },

    getViolation: async (req, res) => {
        // 違規紀錄
        // S : 能瀏覽
        // D : 能瀏覽、發布、刪除
        // A : 能瀏覽、刪除
        res.renderInjected('_Shared/Violation');
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
        console.log(allRooms);

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

        res.renderInjected('_Shared/Room');
    },
};