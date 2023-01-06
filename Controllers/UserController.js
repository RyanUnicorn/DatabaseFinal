module.exports = {
    getLogin: async (req, res) => {
        res.renderInjected('User/Login');
    },

    getApplication: async (req, res) => {
        res.renderInjected('User/Application');
    },

    getRoom: async (req, res) => {
        res.renderInjected('User/Room');
    },

    getComment: async (req, res) => {
        res.renderInjected('User/Comment');
    },

    getAnnouncement: async (req, res) => {
        res.renderInjected('User/Announcement');
    },

    getViolation: async (req, res) => {
        res.renderInjected('User/Violation');
    },

    getStudent: async (req, res) => {
        res.renderInjected('User/Student');
    },

    getStudentId: async (req, res) => {
        res.renderInjected('User/StudentId');
    },
};