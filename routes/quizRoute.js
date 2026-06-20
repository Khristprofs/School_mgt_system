const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quiz_view')
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Teacher,
            roleList.Dean_of_study,
        ),
        QuizController.createQuiz
    )
router.route('/all')
    .get(
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
        QuizController.getAllQuizzes
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
            roleList.Teacher,
            roleList.Student,
        ),
        QuizController.getQuizById
    )
router.route("/class/:classId/term/:termId")
    .get(
        authenticateToken,
        verifyRoles(

        ),
        QuizController.getQuizzesByClassAndTerm
    )
router.get("/class/:classId/session/:sessionId", QuizController.getQuizzesByClassAndSession);
router.get("/class/:classId/subject/:subjectId", QuizController.getQuizzesBySubjectAndClass);
router.put('/:id/update', QuizController.updateQuiz);
router.delete('/:id/delete', QuizController.deleteQuiz);

module.exports = router;