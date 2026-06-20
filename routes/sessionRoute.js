const express = require('express');
const router = express.Router();
const SessionController = require('../controllers/session_view');
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
        SessionController.createSession
    );

router.route('/all')
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
        SessionController.getAllSession
    );
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
        SessionController.getSessionById
    );
router.route('/:id/update')
    .put(
        authenticateToken, 
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress
        ),
        SessionController.updateSession
    );
router.route('/:id/delete')
    .delete(
        authenticateToken, 
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress
        ),
        SessionController.deleteSession
    );
module.exports = router;