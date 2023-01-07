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
        await pool.query(`INSERT INTO room VALUES ('${roomNumber}', '${buildingName}');`);
    },

    getAllApplication: async () => {
        let result = await pool.query(`SELECT * FROM application;`);
        return Array.from(result);
    },

    updateAllApplication: async (Student, Paid, Approve) => {
        await pool.query(`UPDATE application SET paid = '${Paid}', approve = '${Approve}' WHERE student_id = '${Student}';`);
    },
}