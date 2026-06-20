const express = require('express');
const router = express.Router();
const TimetableController = require('../controllers/timetable_view');
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
            roleList.Teacher,
            roleList.Dean_of_study,
        ),
        TimetableController.createTimetable
    )
router.get('/all', TimetableController.getAllTimetables);
router.get('/:id/get', TimetableController.getTimetableById);
router.get('/class/:klassId/get', TimetableController.getClassTimetables);
router.get('/subject/:subjectId/get', TimetableController.getSubjectTimetables);
router.get('/teacher/:teacherId/get', TimetableController.getTeacherTimetables);
router.get('/day/:day', TimetableController.getTimetablesByDay);
router.put('/:id/update', TimetableController.updateTimetable);
router.delete('/:id/delete', TimetableController.deleteTimetable);

module.exports = router;
