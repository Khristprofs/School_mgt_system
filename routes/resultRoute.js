const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/result_view')
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
        ),
        ResultController.createResult
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
            roleList.Dean_of_study,
        ),
        ResultController.getAllResults
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
            roleList.Dean_of_study,
            roleList.Teacher,
            roleList.Student,
            roleList.Parent,
        ),
        ResultController.getResultById
    )
router.route('/klass/:klassId/get')
    .get(
        ResultController.getClassResults
    )
router.put('/:id/update', ResultController.updateResult);
router.delete('/:id/delete', ResultController.deleteResult);

module.exports = router;