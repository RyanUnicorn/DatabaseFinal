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
        await pool.query(`INSERT INTO building VALUES ('${name}', ${cost});`);
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
        let result = await pool.query(`SELECT * FROM application;`);
        return Array.from(result);
    },

    updateAllApplication: async (Student, Paid, Approve) => {
        await pool.query(`UPDATE application SET paid = '${Paid}', approve = '${Approve}' WHERE student_id = '${Student}';`);
    },

    getApplication: async (stu_id) => {
        let result = await pool.query(`SELECT * FROM application WHERE student_id = '${stu_id}';`);
        return Array.from(result);
    },

    insertApplication: async (stu_id, school_year, semester) => {
        await pool.query(`INSERT INTO application ( student_id, school_year, semester) VALUES ('${stu_id}', '${school_year}', '${semester}');`);
    },
}