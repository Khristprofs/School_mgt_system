const express = require('express');
const router = express.Router();
const paymentProfileController = require('../controllers/paymentProfile_view');
const authenticateToken = require('../middleware/authenticateToken');
const roleList = require('../helper/roleList');
const verifyRoles = require('../middleware/verifyRole');

router.route('/create')
    .post(
        authenticateToken,
        verifyRoles(
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Bursar,
            roleList.Auditor,
        ),
        paymentProfileController.createPaymentProfile
    )
router.route('/all')
    .get(
        authenticateToken,
        verifyRoles(
            roleList.Admin,
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Principal,
            roleList.Headteacher,
            roleList.Bursar,
            roleList.Auditor,
        ),
        paymentProfileController.getAllPaymentProfiles
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
            roleList.Headteacher,
            roleList.Bursar,
            roleList.Auditor,
            roleList.Student,
            roleList.Parent,
            roleList.User,
        ),
        paymentProfileController.getPaymentProfile
    )
router.route('/:id/update')
    .put(
        authenticateToken,
        verifyRoles(
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Bursar,
            roleList.Auditor,
        ),
        paymentProfileController.updatePaymentProfile
    )
router.route('/:id/delete')
    .delete(
        authenticateToken,
        verifyRoles(
            roleList.School_admin,
            roleList.Properietor,
            roleList.Properietress,
            roleList.Bursar,
            roleList.Auditor,
        ),
        paymentProfileController.deletePaymentProfile
    )

module.exports = router;