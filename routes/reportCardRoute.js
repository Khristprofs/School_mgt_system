const express = require('express');
const router = express.Router();
const reportCardController = require('../controllers/reportCard_view');
const authenticateToken = require('../middleware/authenticateToken');
const roleList = require('../helper/roleList');
const verifyRoles = require('../middleware/verifyRole');

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Teacher,
            roleList.Dean_of_study,
            roleList.Principal,
            roleList.Headteacher,
        ),
        reportCardController.createReportCard
    )
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_headteacher,
            roleList.Headteacher,
            roleList.Vice_principal,
        ),
        reportCardController.getAllReportCards
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_headteacher,
            roleList.Headteacher,
            roleList.Vice_principal,
            roleList.Teacher,
            roleList.Student,
            roleList.Parent,
        ),
        reportCardController.getReportCardById
    )
router.route('/klass/:klassId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_headteacher,
            roleList.Headteacher,
            roleList.Vice_principal,
            roleList.Teacher,
            roleList.Student,
            roleList.Parent,
        ),
       reportCardController.getReportCardsByClass
    )
router.route('/klass/:klassId/term/:termId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_headteacher,
            roleList.Headteacher,
            roleList.Vice_principal,
        ),
       reportCardController.getReportCardsByClassAndTerm
    )
router.route('/klass/:klassId/session/:sessionId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Vice_headteacher,
            roleList.Headteacher,
            roleList.Vice_principal,
        ),
       reportCardController.getReportCardsByClassAndSession
    )
router.put('/:id/update', reportCardController.updateReportCard);
router.delete('/:id/delete', reportCardController.deleteReportCard);

module.exports = router;