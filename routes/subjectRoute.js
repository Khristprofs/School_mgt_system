const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/subject_view')
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
        SubjectController.createSubject
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
        ),
        SubjectController.getSubject
    )
router.get('/all', SubjectController.getAllSubjects);
router.get('/klass/:klassId/get', SubjectController.getSubjectsInKlass);
router.get('/teacher/:teacherId/get', SubjectController.getTeacherSubjects);
router.put('/:id/update', SubjectController.updateSubject);
router.route('/:id/delete')
    .delete(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
            roleList.Teacher,
        ),
        SubjectController.deleteSubject
    )

module.exports = router;