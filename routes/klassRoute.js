const express = require('express');
const router = express.Router();
const KlassController = require('../controllers/klass_view')
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
        ),
        KlassController.createKlass
    )
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
        ),
        KlassController.getAllKlass
    )
router.route('/:id/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
        ),
        KlassController.getKlass
    )
router.route('/level/:levelId/get')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
        ),
        KlassController.getKlassesInLevel
    )
router.route('/:id/update')
    .put(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
        ),
        KlassController.updateKlass
    )
router.route('/:id/delete')
    .delete(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Principal,
        ),
        KlassController.deleteKlass
    )

module.exports = router;