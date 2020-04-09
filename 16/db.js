const db = require('oracledb');

const dbconf = {
    user: 'system',
    password: 'pomazafaP1',
    connectString: '//localhost/orcl'
}

let connection;
console.log('Connecting to database...');
db.getConnection(dbconf).then(result => {
    connection = result;
    console.log('Database connected');
}).catch(err => {
    console.error(`DB connection error ${err.message}`);
})

exports.DB = {
    getFaculties: async function () {
        console.log('getFaculties');
        let resultSet = await connection.execute('SELECT * FROM FACULTY');
        let result = [];
        for (let row of resultSet.rows) {
            result.push({
                faculty: row[0],
                faculty_name: row[1]
            });
        }
        return result;
    },

    getPulpits: async function () {
        console.log('getPulpits');
        let resultSet = await connection.execute('SELECT * FROM PULPIT');
        let result = [];
        for (let row of resultSet.rows) {
            result.push({
                pulpit: row[0],
                pulpit_name: row[1],
                faculty: row[2]
            });
        }
        return result;
    },

    getTeachers: async function () {
        console.log('getTeachers');
        let resultSet = await connection.execute('SELECT * FROM TEACHER');
        let result = [];
        for (let row of resultSet.rows) {
            result.push({
                teacher: row[0],
                teacher_name: row[1],
                pulpit: row[2]
            });
        }
        return result;
    },

    getSubjects: async function () {
        console.log('getSubjects');
        let resultSet = await connection.execute('SELECT * FROM SUBJECT');
        let result = [];
        for (let row of resultSet.rows) {
            result.push({
                subject: row[0],
                subject_name: row[1],
                pulpit: row[2]
            });
        }
        return result;
    },

    getFaculty: async function (faculty) {
        console.log('getFaculty');
        let resultSet = await connection.execute(`SELECT * FROM FACULTY WHERE FACULTY like '%${faculty}%'`);
        if (resultSet.rows.length === 0)
            return null;
        else
            return {
                faculty: resultSet.rows[0][0],
                faculty_name: resultSet.rows[0][1]
            }
    },

    getPulpit: async function (pulpit) {
        console.log('getPulpit');
        let resultSet = await connection.execute(`SELECT * FROM PULPIT WHERE PULPIT like '%${pulpit}%'`);
        if (resultSet.rows.length === 0)
            return null;
        else
            return {
                pulpit: resultSet.rows[0][0],
                pulpit_name: resultSet.rows[0][1],
                faculty: resultSet.rows[0][2]
            }
    },

    getTeacher: async function (teacher) {
        console.log('getTeacher');
        let resultSet = await connection.execute(`SELECT * FROM TEACHER WHERE TEACHER like '%${teacher}%'`);
        if (resultSet.rows.length === 0)
            return null;
        else
            return {
                teacher: resultSet.rows[0][0],
                teacher_name: resultSet.rows[0][1],
                pulpit: resultSet.rows[0][2]
            }
    },

    getSubject: async function (subject) {
        console.log('getFaculties');
        let resultSet = await connection.execute(`SELECT * FROM SUBJECT WHERE SUBJECT like '%${subject}%'`);
        if (resultSet.rows.length === 0)
            return null;
        else
            return {
                subject: resultSet.rows[0][0],
                subject_name: resultSet.rows[0][1],
                pulpit: resultSet.rows[0][2]
            }
    },

    getTeachersByFaculty: async function (faculty) {
        console.log("getTeachersByFaculty");
        let resultSet = await connection.execute("SELECT TEACHER, TEACHER_NAME, TEACHER.PULPIT FROM TEACHER INNER JOIN PULPIT ON TEACHER.PULPIT=PULPIT.PULPIT INNER JOIN FACULTY ON PULPIT.FACULTY = FACULTY.FACULTY WHERE FACULTY.FACULTY = '" + faculty + "'");
        if (resultSet.rows.length === 0)
            return null;
        let result = [];
        resultSet = resultSet.rows;
        for (let i = 0; i < resultSet.length; i++)
            result[i] = {
                teacher: resultSet[i][0],
                teacher_name: resultSet[i][1],
                pulpit: resultSet[i][2]
            };
        return result;
    },


    getSubjectsByFaculty: async function (faculty) {
        console.log("getSubjectsByFaculty");
        let resultSet = await connection.execute("SELECT SUBJECT, SUBJECT_NAME, SUBJECT.PULPIT FROM SUBJECT INNER JOIN PULPIT ON SUBJECT.PULPIT = PULPIT.PULPIT INNER JOIN FACULTY ON PULPIT.FACULTY = FACULTY.FACULTY WHERE FACULTY.FACULTY = '" + faculty + "'");
        if (resultSet.rows.length === 0)
            return null;
        let result = [];
        resultSet = resultSet.rows;
        for (let i = 0; i < resultSet.length; i++)
            result[i] = {
                subject: resultSet[i][0],
                subject_name: resultSet[i][1],
                pulpit: resultSet[i][2]
            };
        return result;
    },

    // MUTATIONS

    // Faculty 

    addFaculty: async function (faculty) {
        console.log("addFaculty");
        await connection.execute("INSERT INTO FACULTY (FACULTY, FACULTY_NAME) VALUES ('" + faculty.faculty+ "', '" + faculty.faculty_name + "')");
        return faculty;
    },

    updateFaculty: async function (faculty) {
        console.log("updateFaculty");
        await connection.execute(`UPDATE FACULTY SET FACULTY_NAME = '${faculty.faculty_name}' WHERE FACULTY like '%${faculty.faculty}%'`);
        return faculty;
    },

    delFaculty: async function (faculty) {
        console.log("delFaculty");
        let resultSet = await connection.execute("SELECT * FROM FACULTY WHERE FACULTY='" + faculty+"'");
        if (resultSet.rows.length === 0) {
            return null;
        }

        await connection.execute("DELETE FROM FACULTY WHERE FACULTY='" + faculty + "'");
        return faculty;
    },

    // Pulpit

    addPulpit: async function (pulpit) {
        console.log("addPulpit");
        await connection.execute(`INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY) VALUES ('${pulpit.pulpit}', '${pulpit.pulpit_name}','${pulpit.faculty}')`);
        return pulpit;
    },

    updatePulpit: async function (pulpit) {
        console.log("updatePulpit");
        await connection.execute(`UPDATE PULPIT SET PULPIT_NAME = '${pulpit.pulpit_name}', FACULTY = '${pulpit.faculty}' WHERE PULPIT like '%${pulpit.pulpit}%'`);
        return pulpit;
    },

    delPulpit: async function (pulpit) {
        console.log("delPulpit");
        let resultSet = await connection.execute("SELECT * FROM PULPIT WHERE PULPIT='" + pulpit + "'");
        if (resultSet.rows.length === 0) {
            return null;
        }

        await connection.execute("DELETE FROM PULPIT WHERE PULPIT='" + pulpit + "'");
        return pulpit;
    },

    // Teacher

    addTeacher: async function (teacher) {
        console.log("addTeacher");
        await connection.execute(`INSERT INTO TEACHER (TEACHER, TEACHER_NAME, PULPIT) VALUES ('${teacher.teacher}', '${teacher.teacher_name}','${teacher.pulpit}')`);
        return teacher;
    },

    updateTeacher: async function (teacher) {
        console.log("updateTeacher");
        await connection.execute(`UPDATE TEACHER SET TEACHER_NAME = '${teacher.teacher_name}', PULPIT = '${teacher.pulpit}' WHERE TEACHER like '%${teacher.teacher}%'`);
        return teacher;
    },

    delTeacher: async function (teacher) {
        console.log("delTeacher");
        let resultSet = await connection.execute("SELECT * FROM TEACHER WHERE TEACHER='" + teacher + "'");
        if (resultSet.rows.length === 0) {
            return null;
        }

        await connection.execute("DELETE FROM TEACHER WHERE TEACHER='" + teacher + "'");
        return teacher;
    },

    // Subject

    addSubject: async function (subject) {
        console.log("addSubject");
        await connection.execute(`INSERT INTO SUBJECT (SUBJECT,SUBJECT_NAME, PULPIT) VALUES ('${subject.subject}', '${subject.subject_name}','${subject.pulpit}')`);
        return subject;
    },

    updateSubject: async function (subject) {
        console.log("updateSubject");
        await connection.execute(`UPDATE SUBJECT SET SUBJECT_NAME = '${subject.subject_name}', PULPIT = '${subject.pulpit}' WHERE SUBJECT like '%${subject.subject}%'`);
        return subject;
    },

    delSubject: async function (subject) {
        console.log("delSubject");
        let resultSet = await connection.execute("SELECT * FROM SUBJECT WHERE SUBJECT='" + subject + "'");
        if (resultSet.rows.length === 0) {
            return null;
        }

        await connection.execute("DELETE FROM SUBJECT WHERE SUBJECT='" + subject + "'");
        return subject;
    },

    // commit

    commit: async function() {
        await connection.execute('commit');
    }
}