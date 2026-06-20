const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test_view')
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.post('/create', TestController.createTest)
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Teacher,
       ),
        TestController.getAllTests
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Teacher,
            roleList.Student,
            roleList.Headteacher,
            roleList.Vice_headteacher,
            roleList.Principal,
            roleList.Vice_principal,
        ),
        TestController.getTestById
    )
router.route("/class/:classId/term/:termId")
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
            roleList.Teacher,
            roleList.Student,
        ),
        TestController.getTestsByClassAndTerm
    )
router.route("/class/:classId/session/:sessionId")
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
            roleList.Teacher,
        ),
        TestController.getTestsByClassAndSession
    )
router.route("/class/:classId/subject/:subjectId")
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
            roleList.Teacher,
        ),
        TestController.getTestsBySubjectAndClass
    )
router.put('/:id/update', TestController.updateTest);
router.delete('/:id/delete', TestController.deleteTest);

module.exports = router;