const express = require('express');
const router = express.Router();
const LevelController = require('../controllers/level_view')
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
        )
    )
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
        ),
        LevelController.getAllLevel
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
        ),
        LevelController.getLevel
    )
router.route('/session/:sessionId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
        ),
        LevelController.getLevelsInSession
    )
router.route('/:id/update')
    .put(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
        ),
        LevelController.updateLevel
    )
router.route('/:id/delete')
    .put(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
            roleList.Headteacher,
        ),
        LevelController.deleteLevel
    )

module.exports = router;