const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile_view')
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

router.post('/create', ProfileController.createProfile);
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
        ),
        ProfileController.getAllUserProfile
    )
router.get('/:id/get', ProfileController.getProfile);
router.put('/:id/update', ProfileController.updateProfile);
router.delete('/:id/delete', ProfileController.deleteProfile);

module.exports = router;