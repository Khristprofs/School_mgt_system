const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacher_view');

router.post('/create', TeacherController.createTeacher);
router.get('/all', TeacherController.getAllTeacher);
router.get('/:id/get', TeacherController.getTeacher);
router.put('/:id/update', TeacherController.updateTeacher);
router.delete('/:id/delete', TeacherController.deleteTeacher);

module.exports = router;