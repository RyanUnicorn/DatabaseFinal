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
}