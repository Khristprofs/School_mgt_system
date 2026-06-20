const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_view");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/stats", adminController.getDashboardStats);

// USERS
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users", adminController.createUser)

router.get("/students", adminController.getAllStudents);
router.delete("/students/:id", adminController.deleteStudent);
router.get("/students/:id", adminController.getStudentById);
router.put("/students/:id", adminController.updateStudent);
router.post("/students", adminController.createStudent);
router.get("/form-data", adminController.getStudentFormData);

router.get("/teacher-users", adminController.getTeacherUsers);
router.get("/levels", adminController.getTeacherLevels);
router.get("/teachers",adminController.getAllTeachers);
router.post("/teachers", adminController.createTeacher);
router.get("/teachers/:id", adminController.getTeacherById);
router.delete("/teachers/:id", adminController.deleteTeacher);
router.put("/teachers/:id", adminController.updateTeacher);

router.get("/academics/analytics", adminController.getAcademicAnalytics);
router.get("/academics/levels", adminController.getAllLevels);
router.delete("/academics/levels/:id", adminController.deleteLevel);
router.get("/academics/levels/:id", adminController.getLevelById);
router.put("/academics/level/:id", adminController.updateLevel);
router.post("/academics/levels", adminController.createLevel);

router.get("/academics/subjects", adminController.getAllSubjects);
router.get("/subjects/form-data", adminController.getSubjectFormData);
router.get("/academics/subjects/:id", adminController.getSubjectById);
router.put("/academics/subjects/:id", adminController.updateSubject);
router.post("/academics/subjects", adminController.createSubject);

router.get("/academics/attendance", adminController.getAllAttendance);
router.get("/attendance/form-data", adminController.getAttendanceFormData);
router.get("/academics/attendance/:id", adminController.getAttendanceById);
router.put("/academics/attendance/:id", adminController.updateAttendance);
router.post("/academics/attendance", adminController.createAttendance);

router.get("/academics/tests", adminController.getAllTests);
router.get("/test/form-data", adminController.getTestFormData);
router.get("/academics/tests/:id", adminController.getTestById);
router.put("/academics/tests/:id", adminController.updateTest);
router.post("/academics/tests", adminController.createTest);

router.get("/academics/quizzes", adminController.getAllQuizzes);
router.get("/quiz/form-data", adminController.getQuizFormData);
router.post("/academics/quizzes", adminController.createQuiz);
router.get("/academics/quizzes/:id", adminController.getQuizById);
router.put("/academics/quizzes/:id", adminController.updateQuiz);

router.get("/academics/exams", adminController.getAllExams);
router.get("/exam/form-data", adminController.getExamFormData);
router.get("/academics/exams/:id", adminController.getExamById);
router.put("/academics/exams/:id", adminController.updateExam);
router.post("/academics/exams", adminController.createExam);

router.get("/academics/assessment-items", adminController.getAllAssessmentItems);
router.get("/assessment-items/form-data", adminController.getAssessmentItemFormData);
router.get("/academics/assessment-items/:id", adminController.getAssessmentItemById);
router.put("/academics/assessment-items/:id", adminController.updateAssessmentItem);
router.post("/academics/assessment-items", adminController.createAssessmentItem);

router.get("/assessments", adminController.getAllAssessments);
router.get("/assessments/form-data", adminController.getAssessmentFormData);
router.get("/assessments/student-items", adminController.getStudentAssessmentItems);
router.get("/assessments/:id", adminController.getAssessmentById);
router.put("/assessments/:id/update", adminController.updateAssessment);
router.post("/assessments", adminController.createAssessment);

module.exports = router;