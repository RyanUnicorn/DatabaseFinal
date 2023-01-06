module.exports = {
    getDorm: async (req, res) => {
        res.renderInjected('Admin/Dorm');
    },
    
    getStudent: async (req, res) => {
        res.renderInjected('Admin/Student');
    },
    
    getStudentId: async (req, res) => {
        res.renderInjected('Admin/StudentId');
    },
    
    getApplication: async (req, res) => {
        res.renderInjected('Admin/Application');
    },

    getEquipment: async (req, res) => {
        res.renderInjected('Admin/Equipment');
    },
};