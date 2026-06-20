const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user_view');
const authenticateToken = require('../middleware/authenticateToken')
const roleList = require('../helper/roleList')
const verifyRoles = require('../middleware/verifyRole')

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
        UserController.getUsers
    )
router.post('/admin/create', UserController.createAdmin);
router.get('/admin/all', UserController.getAdmins);
router.get('/admin/:id/get', UserController.getAdmin);
router.put('/admin/:id/update', UserController.updateAdmin);
router.delete('/admin/:id/delete', UserController.deleteAdmin);

router.post('/schoolAdmin/create', UserController.createSchool_admin);
router.get('/schoolAdmin/all', UserController.getSchool_admins);
router.get('/schoolAdmin/:id/get', UserController.getSchool_admin);
router.put('/schoolAdmin/:id/update', UserController.updateSchool_admin);
router.delete('/SchoolAdmin/:id/delete', UserController.deleteSchool_admin)

router.post('/properietor/create', UserController.createProperietor);
router.get('/properietor/all', UserController.getProperietors);
router.get('/properietor/:id/get', UserController.getProperietor);
router.put('/properietor/:id/update', UserController.updateProperietor);
router.delete('/properietor/:id/delete', UserController.deleteProperietor);

router.post('/properietress/create', UserController.createProperietress);
router.get('/properietress/all', UserController.getProperietresses);
router.get('/properietress/:id/get', UserController.getProperietress);
router.put('/properietress/:id/update', UserController.updateProperietress);
router.delete('/properietress/:id/delete', UserController.deleteProperietress);

router.post('/principal/create', UserController.createPrincipal);
router.get('/principal/all', UserController.getPrincipals);
router.get('/principal/:id/get', UserController.getPrincipal);
router.put('/principal/:id/update', UserController.updatePrincipal);
router.delete('/principal/:id/delete', UserController.deletePrincipal);

router.post('/vicePrincipal/create', UserController.createVice_principal);
router.get('/vicePrincipal/all', UserController.getVice_principals);
router.get('/vicePrincipal/:id/get', UserController.getVice_principal);
router.put('/vicePrincipal/:id/update', UserController.updateVice_principal);
router.delete('/vicePrincipal/:id/delete', UserController.deleteVice_principal);

router.post('/headteacher/create', UserController.createHeadteacher);
router.get('/headteacher/all', UserController.getHeadteachers);
router.get('/headteacher/:id/get', UserController.getHeadteacher);
router.put('/headteacher/:id/update', UserController.updateHeadteacher);
router.delete('/headteacher/:id/delete', UserController.deleteHeadteacher);

router.post('/viceHeadteacher/create', UserController.createVice_headteacher);
router.get('/viceHeadteacher/all', UserController.getVice_headteachers);
router.get('/viceHeadteacher/:id/get', UserController.getVice_headteacher);
router.put('/viceHeadteacher/:id/update', UserController.updateVice_headteacher);
router.delete('/viceHeadteacher/:id/delete', UserController.deleteVice_headteacher);

router.post('/bursar/create', UserController.createBursar);
router.get('/bursar/all', UserController.getBursars);
router.get('/bursar/:id/get', UserController.getBursar);
router.put('/bursar/:id/update', UserController.updateBursar);
router.delete('/bursar/:id/delete', UserController.deleteBursar);

router.post('/auditor/create', UserController.createAuditor);
router.get('/auditor/all', UserController.getAuditors);
router.get('/auditor/:id/get', UserController.getAuditor);
router.put('/auditor/:id/update', UserController.updateAuditor);
router.delete('/auditor/:id/delete', UserController.deleteAuditor);

router.post('/teacher/create', UserController.createTeacher);
router.get('/teacher/all', UserController.getTeachers);
router.get('/teacher/:id/get', UserController.getTeacher);
router.put('/teacher/:id/update', UserController.updateTeacher);
router.delete('/teacher/:id/delete', UserController.deleteTeacher);

router.post('/student/create', UserController.createStudent);
router.get('/student/all', UserController.getStudents);
router.get('/student/:id/get', UserController.getStudent);
router.put('/student/:id/update', UserController.updateStudent);
router.delete('/student/:id/delete', UserController.deleteStudent);

router.post('/dean/create', UserController.createDean_of_study);
router.get('/dean/all', UserController.getDean_of_studys);
router.get('/dean/:id/get', UserController.getDean_of_study);
router.put('/dean/:id/update', UserController.updateDean_of_study);
router.delete('/dean/:id/delete', UserController.deleteDean_of_study);

router.post('/parent/create', UserController.createParent);
router.get('/parent/all', UserController.getParents);
router.get('/parent/:id/get', UserController.getParent);
router.put('/parent/:id/update', UserController.updateParent);
router.delete('/parent/:id/delete', UserController.deleteParent);

module.exports = router;