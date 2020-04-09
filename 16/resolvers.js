exports.Resolvers = {
    faculties: function(args, context) {
        return context.getFaculties();
    },

    subjects: function (args, context) {
        return context.getSubjects();
    },

    pulpits: function (args, context) {
        return context.getPulpits();
    },

    teachers: function (args, context) {
        return context.getTeachers();
    },

    faculty: function(args, context) {
        return context.getFaculty(args.faculty);
    },

    pulpit: function (args, context) {
        return context.getPulpit(args.pulpit);
    },

    teacher: function (args, context) {
        return context.getTeacher(args.teacher);
    },

    subject: function (args, context) {
        return context.getSubject(args.subject);
    },

    teachers_by_faculty: function (args, context) {
        return context.getTeachersByFaculty(args.faculty);
    },

    subjects_by_faculty: function (args, context) {
        return context.getSubjectsByFaculty(args.faculty);
    },
    
    // mutations

    // faculty

    add_faculty: async function(args, context) {
        let result;
        try {
            result = await context.addFaculty(args.faculty);
            console.log(result);
        } catch (e) {
            console.log('db update faculty');
            result = await context.updateFaculty(args.faculty);
        }
        await context.commit();
        return result;
    },

    del_faculty: async function (args, context) {
        result = await context.delFaculty(args.faculty);
        if (result === null)
            return "faculty not found";
        await context.commit();
        return args.faculty;
    },

    // pulpit

    add_pulpit: async function (args, context) {
        let result;
        try {
            result = await context.addPulpit(args.pulpit);
        } catch (e) {
            console.log('db update pulpit');
            result = await context.updatePulpit(args.pulpit);
        }
        await context.commit();
        return result;
    },


    del_pulpit: async function (args, context) {
        result = await context.delPulpit(args.pulpit);
        if (result === null)
            return "pulpit not found";
        await context.commit();
        return args.pulpit;
    },

    // teacher

    add_teacher: async function (args, context) {
        let result;
        try {
            result = await context.addTeacher(args.teacher);
        } catch (e) {
            console.log('db update teacher');
            result = await context.updateFaculty(args.teacher);
        }
        await context.commit();
        return result;
    },

    del_teacher: async function (args, context) {
        result = await context.delTeacher(args.teacher);
        if (result === null)
            return "teacher not found";
        await context.commit();
        return args.teacher;
    },

    // subject

    add_subject: async function (args, context) {
        let result;
        try {
            result = await context.addSubject(args.subject);
        } catch (e) {
            console.log('db update subject');
            result = await context.updateFaculty(args.subject);
        }
        await context.commit();
        return result;
    },

    del_subject: async function (args, context) {
        result = await context.delSubject(args.subject);
        if (result === null)
            return "subject not found";
        await context.commit();
        return args.subject;
    }
} 	