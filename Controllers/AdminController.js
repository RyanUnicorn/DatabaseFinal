const db = require('../Models/DormDb');

module.exports = {
    getStudent: async (req, res) => {
        // 所有學生
        // S : 不能瀏覽
        // D : 不能瀏覽
        // A : 能瀏覽、新增、刪除?
        res.renderInjected('Admin/Student');
    },

    getStudentId: async (req, res) => {
        // 學生詳細資料
        // S : 不能瀏覽
        // D : 不能瀏覽
        // A : 能瀏覽、修改
        res.renderInjected('Admin/StudentDetail');
    },
    
    getApplication: async (req, res) => {
        // 住宿申請審查
        // S : 不能瀏覽
        // D : 不能瀏覽
        // A : 能瀏覽、審核
        res.renderInjected('Admin/Application');
    },

    getDorm: async (req, res) => {
        // 所有大樓頁面
        // S : 不能瀏覽
        // D : 不能瀏覽
        // A : 能瀏覽、新增、刪除?
        res.renderInjected('Admin/Dorm', {
            allBuilding: await db.getAllBuilding(),
        });
    },

    getEquipment: async (req, res) => {
        // 某房間內的設施
        // S : 不能瀏覽
        // D : 不能瀏覽
        // A : 能瀏覽、新增、更改、刪除
        res.renderInjected('Admin/Equipment');
    },
};