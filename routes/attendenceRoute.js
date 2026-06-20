// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendence_view');
const authenticateToken = require('../middleware/authenticateToken');
const roleList = require('../helper/roleList');
const verifyRoles = require('../middleware/verifyRole');

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.Teacher,
            roleList.Dean_of_study,
            roleList.Vice_principal,
            roleList.Vice_headteacher,
        ),
        attendanceController.createAttendance
    )
router.get('/all', attendanceController.getAllAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.get('/class/:classId', attendanceController.getAttendanceByClass);
// Get all attendance for a class on a particular day
router.get('/class/:classId/date/:date', attendanceController.getAttendanceByClassAndDate);
// Get all attendance for a class in a term
router.get('/class/:classId/term/:termId', attendanceController.getAttendanceByClassAndTerm);
// Get all attendance for a class in a session
router.get('/class/:classId/session/:sessionId', attendanceController.getAttendanceByClassAndSession);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
