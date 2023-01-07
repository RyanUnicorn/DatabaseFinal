const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '192.168.192.77',
    user: 'site',
    password: 'i_am_password',
    database: 'dormitory',
    connectionLimit: 5,
});

module.exports = {
    validLogin: async (name, pass) => {

        let regex = /[^\w\d]+/g;
        name = name.replace(regex, '');
        pass = pass.replace(regex, '');

        if(name === 'admin'){
            name = 'A0000000';
        }

        // console.log(name, pass);
        let student = Array.from(await pool.query(`SELECT * FROM student WHERE student_id='${name}' AND password='${pass}';`));

        if(student.length){
            // Found someone with the name&pass combo
            
            let userRoles = '';

            let dormAdmin = Array.from(await pool.query(`SELECT * FROM dorm_admin NATURAL JOIN student WHERE student_id='${name}';`));

            if(dormAdmin.length){
                userRoles = 'DormAdmin ';
                // console.log('is DormAdmin');
            }

            if(name === 'A0000000'){
                userRoles = 'Admin';
                // console.log('is Admin');
            }else{
                userRoles += 'Student'
                // console.log('is Student');
            }
            
            return {
                userName: student[0].name,
                userId: student[0].student_id,
                userRoles: userRoles,
            }
        }else{
            // Nobody was found
            return null;
        }

        console.log(student);
    },

    getAllBuilding: async () => {
        let result = await pool.query(`SELECT * FROM building`);
        return Array.from(result);
    },

    insertBuilding: async (name, cost) => {
        name = name.replace(/[^\w\d]+/g, '');
        cost = Math.max(0, parseInt(cost, 10));
        return pool.query(`INSERT INTO building VALUES ('${name}', ${cost});`);
    },

    getDormAdminsBuilding: async (id) => {
        let result = await pool.query(`SELECT building_name FROM dorm_admin WHERE student_id='${id}';`);
        result = Array.from(result);
        return result[0].building_name;
    },

    getAllRoom: async (buildingName) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        let result = await pool.query(`SELECT room_number, building_name FROM room LEFT JOIN building ON building_name = name WHERE building_name='${buildingName}';`);
        return Array.from(result);
    },

    insertRoom: async (buildingName, roomNumber) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        roomNumber = Math.max(0, parseInt(roomNumber, 10));
        return pool.query(`INSERT INTO room VALUES ('${roomNumber}', '${buildingName}');`);
    },

    getAllRoomsStudent: async (buildingName, roomNumber) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        roomNumber = Math.max(0, parseInt(roomNumber, 10));
        let result = await pool.query(`SELECT student_id, name FROM student NATURAL JOIN room WHERE building_name='${buildingName}' AND room_number=${roomNumber};`);
        return Array.from(result);
    },

    getAllApprovedHomelessStudent: async () => {
        let result = await pool.query(`SELECT * FROM student NATURAL JOIN application WHERE room_number IS NULL and building_name IS NULL;`);
        return Array.from(result);
    },

    assignStudentToRoom: async (buildingName, roomNumber, studentId) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        roomNumber = Math.max(0, parseInt(roomNumber, 10));
        studentId = studentId.replace(/[^\w\d]+/g, '');
        return pool.query(`UPDATE student SET room_number='${roomNumber}', building_name='${buildingName}' WHERE student_id='${studentId}';`);
    },

    getAllRoomsEquipment: async (buildingName, roomNumber) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        roomNumber = Math.max(0, parseInt(roomNumber, 10));
        let result = await pool.query(`SELECT * FROM room_equipment WHERE room_number='${roomNumber}' AND building_name='${buildingName}';`);
        return Array.from(result);
    },

    updateEquipment: async (buildingName, roomNumber, equipmentName, quantity) => {
        buildingName = buildingName.replace(/[^\w\d]+/g, '');
        equipmentName = equipmentName.replace(/[^\w\d]+/g, '');
        roomNumber = Math.max(0, parseInt(roomNumber, 10));
        quantity = Math.max(1, parseInt(quantity, 10));
        let result = await pool.query(`UPDATE room_equipment SET quantity=${quantity} WHERE room_number='${roomNumber}' AND building_name='${buildingName}' AND name='${equipmentName}';`);
        return Array.from(result);
    },

    getAllStudent: async () => {
        let result = await pool.query(`SELECT * FROM student;`)
        return Array.from(result).filter(s => !(s.student_id === 'a0000000'));
    },

    getStudentById: async (studentId) => {
        studentId = studentId.replace(/[^\w\d]+/g, '');
        let result = await pool.query(`SELECT * FROM student WHERE student_id='${studentId}';`);
        return Array.from(result)[0];
    },

    getAllApplication: async () => {
        let result = await pool.query(`SELECT * FROM application WHERE approve = 'P';`);
        return Array.from(result);
    },
    getViolationData: async () => {
        let result = await pool.query(`SELECT * FROM violation_record NATURAL JOIN (SELECT student_id, name, room_number, building_name FROM student) s ORDER BY violation_date;`);
        return Array.from(result);
    },

    getViolationDataForDormAdmin: async (dormAdminId) => {
        dormAdminId = dormAdminId.replace(/[^\w\d]+/g, '');
        let result = await pool.query(`SELECT * FROM violation_record NATURAL JOIN (SELECT student_id, name, room_number, building_name FROM student) s WHERE dorm_admin_id='${dormAdminId}' ORDER BY violation_date;`);
        return Array.from(result);
    },

    deleteViolationWithAdmin: async (violationId) => {
        violationId = Math.max(0, parseInt(violationId, 10));
        return await pool.query(`DELETE FROM violation_record WHERE violation_id=${violationId};`);
    },

    deleteViolationWithDormAdmin: async (violationId, dormAdminId) => {
        dormAdminId = dormAdminId.replace(/[^\w\d]+/g, '');
        violationId = Math.max(0, parseInt(violationId, 10));
        return await pool.query(`DELETE FROM violation_record WHERE violation_id=${violationId} AND dorm_admin_id='${dormAdminId}';`);
    },

    updateAllApplication: async (Student, Paid, Approve) => {
        await pool.query(`UPDATE application SET paid = '${Paid}', approve = '${Approve}' WHERE student_id = '${Student}';`);
    },

    insertViolation: async (dormAdminId, studentId, detail, punishment) => {
        dormAdminId = dormAdminId.replace(/[^\w\d]+/g, '');
        studentId = studentId.replace(/[^\w\d]+/g, '');
        detail = detail.replace(/[;'`@]+/g, '');
        punishment = punishment.replace(/[;'`@]+/g, '');
        await pool.query(`INSERT INTO violation_record (violation_detail, punishment, student_id, dorm_admin_id) VALUES ('${detail}', '${punishment}', '${studentId}', '${dormAdminId}');`);
    },

    getApplication: async (stu_id) => {
        let result = await pool.query(`SELECT * FROM application WHERE student_id = '${stu_id}';`);
        return Array.from(result);
    },

    insertApplication: async (stu_id, school_year, semester) => {
        await pool.query(`INSERT INTO application ( student_id, school_year, semester) VALUES ('${stu_id}', '${school_year}', '${semester}');`);
    },

    getAllAnouncement: async () => {
        let result = await pool.query(`SELECT announcement_id, content, student_id, name FROM announcement NATURAL JOIN student;`);
        return Array.from(result);
    },

    deleteAnnouncement: async (announcementId, dormAdminId) => {
        announcementId = Math.max(0, parseInt(announcementId, 10));
        let result;
        if(!dormAdminId){
            // Admin
            result = await pool.query(`DELETE FROM announcement WHERE announcement_id=${announcementId};`);
        }else{
            // DormAdmin
            dormAdminId = dormAdminId.replace(/[^\w\d]+/g, '');
            result = await pool.query(`DELETE FROM announcement WHERE announcement_id=${announcementId} AND student_id='${dormAdminId}';`);
        }
        return Array.from(result);
    },

    postAnnouncement: async (content, posterId) => {
        content = content.replace(/[;'`@]+/g, '');
        return await pool.query(`INSERT INTO announcement (content, student_id) VALUES ('${content}', '${posterId}');`);
    },

    getAllComment: async () => {
        let result = await pool.query(`SELECT comment_id, comment, name, student_id FROM comment natural JOIN student;`);
        return Array.from(result);
    },

    postComment: async (comment, posterId) => {
        comment = comment.replace(/[;'`@]+/g, '');
        return await pool.query(`INSERT INTO comment (comment, student_id) VALUES ('${comment}', '${posterId}');`);
    },

    deleteComment: async (commentId) => {
        commentId = Math.max(0, parseInt(commentId, 10));
        let result = await pool.query(`DELETE FROM comment WHERE comment_id=${commentId};`);
        return Array.from(result);
    },
}