const express = require('express');
const router = express.Router();
const TermController = require('../controllers/term_view');
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress
        ),
        TermController.createTerm
    );

router
    .route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
        ),
        TermController.getTerms
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
        ),
        TermController.getTerm
    )
router.route('/session/:sessionId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Principal,
            roleList.Vice_principal,
            roleList.Headteacher,
            roleList.Vice_headteacher,
        ),
        TermController.getTermsInSession
    );
router.put('/:id/update', TermController.updateTerm);
router.delete('/:id/delete', TermController.deleteTerm);

module.exports = router;