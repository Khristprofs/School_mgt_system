const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Klass = require("../models/Klass");
const Session = require("../models/Session");
const Term = require("../models/Term");
const Fee = require("../models/Fee");
const Result = require("../models/Result");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Attendence = require("../models/Attendence");
const Payment = require("../models/Payment");
const ReportCard = require("../models/ReportCard");
const Level = require("../models/Level");
const Subject = require("../models/Subject");
const Test = require("../models/Test");
const Quiz = require("../models/Quiz");
const Exam = require("../models/Exam");
const AssessmentItem = require("../models/AssessmentItems");
const Assessment = require("../models/Assessment");
const { calculateGradeAndRemark } = require("../helper/assessmentHelper");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      students,
      teachers,
      classes,
      sessions,
      terms,
      fees,
      results,
      attendences,
      payments,
      reportCards,
    ] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Teacher.countDocuments(),
      Klass.countDocuments(),
      Session.countDocuments(),
      Term.countDocuments(),
      Fee.countDocuments(),
      Result.countDocuments(),
      Attendence.countDocuments(),
      Payment.countDocuments(),
      ReportCard.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        students,
        teachers,
        classes,
        sessions,
        terms,
        fees,
        results,
        attendences,
        payments,
        reportCards,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "title surname middlename lastname email role active createdAt"
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// GET SINGLE USER
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let extraData = {};

    if (user.role === "student") {
      const student = await Student.findOne({ user: user._id });
      if (student) extraData.regNo = student.regNo;
    }

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ user: user._id });
      if (teacher) extraData.staffNo = teacher.staffNo;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        ...extraData,
      },
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const allowedFields = [
      "title",
      "surname",
      "middlename",
      "lastname",
      "email",
      "phone",
      "address",
      "isActive",
    ];

    // Role-specific
    if (user.role === "Teacher") allowedFields.push("staffNo");
    if (user.role === "Student") allowedFields.push("regNo");

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      title,
      surname,
      middlename,
      lastname,
      email,
      phone,
      address,
      password,
      role,
      regNo,
      staffNo,
      isActive,
    } = req.body;

    if (!email || !password || !surname || !lastname || !phone || !address || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      title,
      surname,
      middlename,
      lastname,
      email,
      phone,
      address,
      password: hashedPassword,
      role,
      isActive: isActive ?? true,
      regNo,
      staffNo,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "userId",
        select: "title surname middlename lastname email",
      })
      .populate({
        path: "parentId",
        select: "surname middlename lastname email",
      })
      .populate({
        path: "klassId",
        select: "name",
      })
      .sort({ createdAt: -1 });

    const formattedStudents = students.map((s) => ({
      id: s._id,
      regNo: s.regNo,
      studentName: s.userId
        ? `${s.userId.title || ""} ${s.userId.surname} ${s.userId.middlename || ""} ${s.userId.lastname}`
          .replace(/\s+/g, " ")
          .trim()
        : "N/A",
      parentName: s.parentId
        ? `${s.parentId.surname} ${s.parentId.middlename || ""} ${s.parentId.lastname}`
          .replace(/\s+/g, " ")
          .trim()
        : "N/A",
      className: s.klassId?.name || "N/A",
      createdAt: s.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedStudents.length,
      data: formattedStudents,
    });
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate({
        path: "userId",
        select: "title surname middlename lastname email phone"
      })
      .populate({
        path: "parentId",
        select: "surname middlename lastname email phone"
      })
      .populate({
        path: "klassId",
        select: "name"
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: student._id,
        regNo: student.regNo,

        studentName: `${student.userId?.surname} ${student.userId?.middlename || ""} ${student.userId?.lastname}`,
        studentEmail: student.userId?.email,
        studentPhone: student.userId?.phone,

        parentName: `${student.parentId?.surname} ${student.parentId?.middlename || ""} ${student.parentId?.lastname}`,
        parentEmail: student.parentId?.email,
        parentPhone: student.parentId?.phone,

        className: student.klassId?.name,

        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      }
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student"
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, parentFullName } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // 2️⃣ Check class exists (exact match)
    const klass = await Klass.findOne({
      name: className.trim()
    });

    if (!klass) {
      return res.status(400).json({
        success: false,
        message: "Class does not exist"
      });
    }

    // 3️⃣ Check parent exists using FULL NAME match
    const parent = await User.findOne({
      role: "Parent",
      $expr: {
        $eq: [
          {
            $trim: {
              input: {
                $concat: [
                  "$surname",
                  " ",
                  { $ifNull: ["$middlename", ""] },
                  " ",
                  "$lastname"
                ]
              }
            }
          },
          parentFullName.trim()
        ]
      }
    });

    if (!parent) {
      return res.status(400).json({
        success: false,
        message: "Parent does not exist"
      });
    }
    student.klassId = klass._id;
    student.parentId = parent._id;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully"
    });

  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student"
    });
  }
};

exports.getStudentFormData = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" })
      .select("_id title surname middlename lastname regNo");

    const parents = await User.find({ role: "Parent" })
      .select("_id title surname middlename lastname");

    const classes = await Klass.find().select("_id name");

    const formatName = (u) =>
      `${u.title || ""} ${u.surname} ${u.middlename || ""} ${u.lastname}`
        .replace(/\s+/g, " ")
        .trim();

    res.status(200).json({
      success: true,
      students: students.map((s) => ({
        value: s._id,
        label: formatName(s),
        regNo: s.regNo,
      })),
      parents: parents.map((p) => ({
        value: p._id,
        label: formatName(p),
      })),
      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createStudent = async (req, res) => {
  try {
    const { userId, klassId, regNo, parentId } = req.body;

    if (!userId || !klassId || !regNo || !parentId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "Student") {
      return res.status(400).json({
        message: "Selected user is not a student",
      });
    }

    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "Parent") {
      return res.status(400).json({
        message: "Selected user is not a parent",
      });
    }

    const klass = await Klass.findById(klassId);
    if (!klass) {
      return res.status(400).json({
        message: "Class not found",
      });
    }

    const existingStudent = await Student.findOne({ userId });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student already created",
      });
    }

    const student = new Student({
      userId,
      klassId,
      regNo,
      parentId,
    });

    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      student: savedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate({
        path: "userId",
        select: "title surname middlename lastname email",
      })
      .populate({
        path: "levelId",
        select: "name",
      })
      .sort({ createdAt: -1 });

    const formattedTeachers = teachers.map((t) => ({
      id: t._id,
      fullName: t.userId
        ? `${t.userId.title || ""} ${t.userId.surname} ${t.userId.middlename || ""} ${t.userId.lastname}`
          .replace(/\s+/g, " ")
          .trim()
        : "N/A",
      levelName: t.levelId?.name || "N/A",
      subjects: t.subjects || [],
      specialization: t.specialization,
      createdAt: t.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedTeachers.length,
      data: formattedTeachers,
    });
  } catch (error) {
    console.error("Fetch teachers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete teacher",
    });
  }
};


exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid teacher ID"
      });
    }

    const teacher = await Teacher.findById(id)
      .populate("userId")
      .populate("levelId");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    const teacherName = `
      ${teacher.userId?.surname}
      ${teacher.userId?.middlename || ""}
      ${teacher.userId?.lastname}
    `.replace(/\s+/g, " ").trim();

    res.status(200).json({
      success: true,
      data: {
        id: teacher._id,
        teacherName,
        staffNo: teacher.userId?.staffNo,
        email: teacher.userId?.email,
        phone: teacher.userId?.phone,
        levelName: teacher.levelId?.name,
        specialization: teacher.specialization,
        subjects: teacher.subjects.join(", "),
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }
    });

  } catch (error) {
    console.error("Get teacher error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher"
    });
  }
};

// UPDATE TEACHER
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { levelName, specialization, subjects } = req.body;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    // Validate Level
    const level = await Level.findOne({ name: levelName.trim() });

    if (!level) {
      return res.status(400).json({
        success: false,
        message: "Level does not exist"
      });
    }

    // Update allowed fields
    teacher.levelId = level._id;
    teacher.specialization = specialization.trim();
    teacher.subjects = subjects.split(",").map(s => s.trim());

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully"
    });

  } catch (error) {
    console.error("Update teacher error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update teacher"
    });
  }
};


exports.createTeacher = async (req, res) => {
  try {
    const { userId, levelId, subjects, specialization } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User is required" });
    }

    if (!levelId) {
      return res.status(400).json({ message: "Level is required" });
    }

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Subjects are required" });
    }

    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }
    const user = await User.findById(userId);
    if (!user || user.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid teacher user selected" });
    }
    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(400).json({ message: "Level not found" });
    }
    const existingTeacher = await Teacher.findOne({
      userId,
      levelId
    });

    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already assigned to this level" });
    }

    const teacher = await Teacher.create({
      userId,
      levelId,
      subjects,
      specialization
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher
    });

  } catch (error) {
    console.error("Create teacher error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create teacher"
    });
  }
};

exports.getTeacherUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "Teacher" })
      .select("surname middlename lastname staffNo email");

    const formatted = users.map(user => ({
      id: user._id,
      fullName: `${user.surname} ${user.middlename || ""} ${user.lastname}`.replace(/\s+/g, " ").trim(),
      staffNo: user.staffNo
    }));

    res.status(200).json({ success: true, data: formatted });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teacher users" });
  }
};

exports.getTeacherLevels = async (req, res) => {
  try {
    const levels = await Level.find().select("name");

    res.status(200).json({
      success: true,
      data: levels
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch levels" });
  }
};

exports.getAcademicAnalytics = async (req, res) => {
  try {

    const [
      levels,
      subjects,
      tests,
      quizzes,
      exams,
      assessmentItems,
      attendance
    ] = await Promise.all([
      Level.countDocuments(),
      Subject.countDocuments(),
      Test.countDocuments(),
      Quiz.countDocuments(),
      Exam.countDocuments(),
      AssessmentItem.countDocuments(),
      Attendence.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        levels,
        subjects,
        tests,
        quizzes,
        exams,
        assessmentItems,
        attendance
      }
    });

  } catch (error) {
    console.error("Academic analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch academic analytics"
    });
  }
};

exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find()
      .populate({
        path: "termId",
        select: "name",
      })
      .populate({
        path: "sessionId",
        select: "name",
      })
      .sort({ createdAt: -1 });

    const formattedLevels = levels.map((l) => ({
      id: l._id,
      name: l.name,
      termName: l.termId?.name || "N/A",
      sessionName: l.sessionId?.name || "N/A",
      createdAt: l.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedLevels.length,
      data: formattedLevels,
    });
  } catch (error) {
    console.error("Fetch levels error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch levels",
    });
  }
};

exports.deleteLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Level deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete level",
    });
  }
};

exports.getLevelById = async (req, res) => {
  try {
    const { id } = req.params;

    const level = await Level.findById(id)
      .populate({
        path: "termId",
        select: "name"
      })
      .populate({
        path: "sessionId",
        select: "name"
      });

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: level._id,
        name: level.name,

        termName: level.termId?.name,
        sessionName: level.sessionId?.name,

        createdAt: level.createdAt,
        updatedAt: level.updatedAt
      }
    });
  } catch (error) {
    console.error("Get level error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch level"
    });
  }
};

exports.updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, termName, sessionName } = req.body;
    const level = await Level.findById(id);
    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found"
      });
    }

    // Check class exists (exact match)
    const term = await Term.findOne({
      name: termName.trim()
    });

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Term does not exist"
      });
    }
    const session = await Session.findOne({
      name: sessionName.trim()
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Session does not exist"
      });
    }


    level.name = name.trim();
    level.termId = term._id;
    level.sessionId = session._id;

    await level.save();

    res.status(200).json({
      success: true,
      message: "Level updated successfully"
    });

  } catch (error) {
    console.error("Update level error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student"
    });
  }
};

exports.createLevel = async (req, res) => {
  try {
    const { name, termId, sessionId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!termId) {
      return res.status(400).json({ message: "Term is required" });
    }

    if (!sessionId) {
      return res.status(400).json({ message: "Session is required" });
    }
    const term = await Term.findById(termId);
    if (!term) {
      return res.status(400).json({ message: "Term not found" });
    }
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({ message: "Session not found" });
    }
    const existingLevel = await Level.findOne({
      name,
      termId,
      sessionId
    });

    if (existingLevel) {
      return res.status(400).json({ message: "Level already assigned to this term and session" });
    }

    const level = await Level.create({
      name,
      termId,
      sessionId
    });

    res.status(201).json({
      success: true,
      message: "Level created successfully",
      data: level
    });

  } catch (error) {
    console.error("Create level error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create level"
    });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: "klassId",
        select: "name",
      })
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname email",
        },
      })
      .sort({ createdAt: -1 });

    const formattedSubjects = subjects.map((s) => {
      const u = s.teacherId?.userId || {};

      const teacherName = [
        u.title,
        u.surname,
        u.middlename,
        u.lastname,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: s._id,
        name: s.name,
        klassName: s.klassId?.name || "N/A",
        teacherName: teacherName || "N/A",
        createdAt: s.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSubjects.length,
      data: formattedSubjects,
    });
  } catch (error) {
    console.error("Fetch subjects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id)
      .populate("klassId", "name")
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname"
        }
      });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const teacherUser = subject.teacherId?.userId;

    const teacherName = teacherUser
      ? `${teacherUser.title || ""} ${teacherUser.surname} ${teacherUser.middlename || ""} ${teacherUser.lastname}`
        .replace(/\s+/g, " ")
        .trim()
      : null;

    res.status(200).json({
      success: true,
      data: {
        id: subject._id,
        name: subject.name,
        className: subject.klassId?.name || "",
        teacherId: subject.teacherId?._id || "", // ✅ REQUIRED
        teacherName
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject"
    });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, className, teacherId } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const klass = await Klass.findOne({
      name: className.trim()
    });

    if (!klass) {
      return res.status(400).json({
        success: false,
        message: "Class does not exist"
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher does not exist"
      });
    }

    subject.name = name.trim();
    subject.klassId = klass._id;
    subject.teacherId = teacher._id;

    await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully"
    });

  } catch (error) {
    console.error("Update subject error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subject"
    });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, klassId, teacherId } = req.body;

    if (!name || !klassId || !teacherId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const teacher = await Teacher.findById(teacherId).populate("userId");

    if (!teacher) {
      return res.status(400).json({
        message: "Teacher not found",
      });
    }

    if (!teacher.userId || teacher.userId.role !== "Teacher") {
      return res.status(400).json({
        message: "Selected user is not a teacher",
      });
    }

    const klass = await Klass.findById(klassId);
    if (!klass) {
      return res.status(400).json({
        message: "Class not found",
      });
    }

    const existingSubject = await Subject.findOne({ name, teacherId });
    if (existingSubject) {
      return res.status(400).json({
        message: "Subject already created",
      });
    }

    const subject = new Subject({
      name,
      klassId,
      teacherId,
    });

    const savedSubject = await subject.save();

    res.status(201).json({
      success: true,
      subject: savedSubject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getSubjectFormData = async (req, res) => {
  try {
    const teachersRaw = await Teacher.find()
      .populate("userId", "title surname middlename lastname")
      .select("_id userId");

    const teachers = teachersRaw.map((t) => {
      const u = t.userId || {};

      const teacherName = [
        u.title,
        u.surname,
        u.middlename,
        u.lastname,
      ]
        .filter(Boolean) // removes undefined/null/empty
        .join(" ");

      return {
        _id: t._id,
        teacherName,
      };
    });

    const classes = await Klass.find().select("_id name");

    res.status(200).json({
      teachers,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendence.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname email",
        },
      })
      .populate({
        path: "klassId",
        select: "name",
      })
      .populate({
        path: "termId",
        select: "name",
      })
      .populate({
        path: "sessionId",
        select: "name",
      })
      .populate({
        path: "markedBy",
        populate: {
          path: "userId",
          select: "title surname middlename lastname email",
        },
      })
      .sort({ createdAt: -1 });

    const formattedAttendance = attendance.map((a) => ({
      id: a._id,

      studentName: a.studentId
        ? `${a.studentId.userId.title || ""} ${a.studentId.userId.surname} ${a.studentId.userId.middlename || ""} ${a.studentId.userId.lastname}`
          .replace(/\s+/g, " ")
          .trim()
        : "N/A",

      className: a.klassId?.name || "N/A",
      termName: a.termId?.name || "N/A",
      sessionName: a.sessionId?.name || "N/A",

      markedByName: a.markedBy?.userId
        ? `${a.markedBy.userId.title || ""} ${a.markedBy.userId.surname} ${a.markedBy.userId.middlename || ""} ${a.markedBy.userId.lastname}`
          .replace(/\s+/g, " ")
          .trim()
        : "N/A",

      date: a.date,
      status: a.status,
      remarks: a.remarks,
      createdAt: a.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      data: formattedAttendance,
    });
  } catch (error) {
    console.error("Fetch attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance ID",
      });
    }

    const attendance = await Attendence.findById(id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname email",
        },
      })
      .populate({ path: "klassId", select: "name" })
      .populate({ path: "termId", select: "name" })
      .populate({ path: "sessionId", select: "name" })
      .populate({
        path: "markedBy",
        populate: {
          path: "userId",
          select: "title surname middlename lastname email",
        },
      });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    const student = attendance.studentId?.userId;
    const marker = attendance.markedBy?.userId;

    res.status(200).json({
      success: true,
      data: {
        id: attendance._id,
        studentName: student
          ? `${student.title || ""} ${student.surname} ${student.middlename || ""} ${student.lastname}`.replace(/\s+/g, " ").trim()
          : "N/A",
        className: attendance.klassId?.name,
        termName: attendance.termId?.name,
        sessionName: attendance.sessionId?.name,
        markedByName: marker
          ? `${marker.title || ""} ${marker.surname} ${marker.middlename || ""} ${marker.lastname}`.replace(/\s+/g, " ").trim()
          : "N/A",
        date: attendance.date,
        status: attendance.status,
        remarks: attendance.remarks,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, className, sessionName, termName, date, status, remarks, markedByName } = req.body;

    const attendance = await Attendence.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found"
      });
    }

    const user = await User.findOne({
      surname: new RegExp(`^${surname}$`, "i"),
      middleName: new RegExp(`^${middleName}$`, "i"),
      lastName: new RegExp(`^${lastName}$`, "i"),
    });

    if (!user) {
      return res.status(400).json({
        message: "Student user not found"
      });
    }

    const student = await Student.findOne({
      userId: user._id
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student does not exist"
      });
    }
    const klass = await Klass.findOne({
      name: className.trim()
    });

    if (!klass) {
      return res.status(400).json({
        success: false,
        message: "Class does not exist"
      });
    }
    const session = await Session.findOne({
      name: sessionName.trim()
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Session does not exist"
      });
    }
    const term = await Term.findOne({
      name: termName.trim()
    });

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Term does not exist"
      });
    }

    const markedBy = await User.findOne({
      name: markedByName.trim()
    });

    if (!markedBy) {
      return res.status(400).json({
        success: false,
        message: "Teacher does not exist as a user"
      });
    }

    attendance.studentId.userId = student._id;
    attendance.klassId = klass._id;
    attendance.sessionId = session._id;
    attendance.termId = term._id;
    attendance.date = date.trim(" ");
    attendance.status = status.trim(" ");
    attendance.remarks = remarks.trim(" ");
    attendance.markedBy = markedBy._id;

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully"
    });

  } catch (error) {
    console.error("Update attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance"
    });
  }
};

exports.getAttendanceFormData = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "userId",
        select: "title surname middlename lastname",
      });

    const teachers = await Teacher.find()
      .populate({
        path: "userId",
        select: "title surname middlename lastname",
      });

    const classes = await Klass.find().select("_id name");
    const sessions = await Session.find().select("_id name");
    const terms = await Term.find().select("_id name");

    const formatName = (u) =>
      `${u?.title || ""} ${u?.surname} ${u?.middlename || ""} ${u?.lastname}`
        .replace(/\s+/g, " ")
        .trim();

    res.status(200).json({
      success: true,

      students: students.map((s) => ({
        value: s._id,
        label: formatName(s.userId),
      })),

      teachers: teachers.map((t) => ({
        value: t._id,
        label: formatName(t.userId),
      })),

      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),

      sessions: sessions.map((s) => ({
        value: s._id,
        label: s.name,
      })),

      terms: terms.map((t) => ({
        value: t._id,
        label: t.name,
      })),

      statusOptions: [
        { value: "Present", label: "Present" },
        { value: "Absent", label: "Absent" },
        { value: "Late", label: "Late" },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const {
      studentId,
      klassId,
      sessionId,
      termId,
      date,
      status,
      remarks,
      markedBy,
    } = req.body;

    if (!studentId || !klassId || !sessionId || !termId || !date || !markedBy) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(400).json({
        message: "Student not found",
      });
    }

    const teacher = await Teacher.findById(markedBy);
    if (!teacher) {
      return res.status(400).json({
        message: "Teacher not found",
      });
    }

    const klass = await Klass.findById(klassId);
    if (!klass) {
      return res.status(400).json({
        message: "Class not found",
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(400).json({
        message: "Session not found",
      });
    }

    const term = await Term.findById(termId);
    if (!term) {
      return res.status(400).json({
        message: "Term not found",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Attendence.findOne({
      studentId,
      sessionId,
      termId,
      date: {
        $gte: attendanceDate,
        $lt: nextDay,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already recorded for this student on this date",
      });
    }

    // ✅ 9. Create attendance
    const attendance = new Attendence({
      studentId,
      klassId,
      sessionId,
      termId,
      date: attendanceDate,
      status: status || "Present",
      remarks,
      markedBy,
    });

    const savedAttendance = await attendance.save();

    // ✅ 10. Success response (simple like createStudent)
    res.status(201).json({
      success: true,
      attendance: savedAttendance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .sort({ created_at: -1 });

    const formatted = tests.map((test) => ({
      id: test._id,
      title: test.title,
      description: test.description,
      subjectName: test.subjectId?.name || "N/A",
      className: test.klassId?.name || "N/A",
      sessionName: test.sessionId?.name || "N/A",
      termName: test.termId?.name || "N/A",

      status: test.status,
      duration: test.duration,
      createdAt: test.created_at,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get tests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id)
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .populate("created_by", "fullName");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const formatted = {
      id: test._id,
      title: test.title,
      description: test.description,

      subjectName: test.subjectId?.name || "N/A",
      className: test.klassId?.name || "N/A",
      sessionName: test.sessionId?.name || "N/A",
      termName: test.termId?.name || "N/A",

      status: test.status,
      duration: test.duration,
      createdAt: test.created_at,
      createdBy: test.created_by?.fullName || "N/A",

      questions: test.questions,
      totalQuestions: test.questions.length,
      maxScore: test.questions.reduce((acc, q) => acc + (q.marks || 0), 0),
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get test by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch test",
    });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      duration,
      status,
      questions,
    } = req.body;

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    if (title) test.title = title;
    if (description) test.description = description;

    if (subjectId) test.subjectId = subjectId;
    if (klassId) test.klassId = klassId;
    if (sessionId) test.sessionId = sessionId;
    if (termId) test.termId = termId;

    if (duration) test.duration = duration;
    if (status) test.status = status;

    if (Array.isArray(questions)) {
      test.questions = questions;
    }

    await test.save();

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: test,
    });

  } catch (error) {
    console.error("Update test error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update test",
      error: error.message,
    });
  }
};

exports.getTestFormData = async (req, res) => {
  try {
    const subjects = await Subject.find().select("_id name");
    const teachers = await Teacher.find().populate("userId");
    const classes = await Klass.find().select("_id name");
    const sessions = await Session.find().select("_id name");
    const terms = await Term.find().select("_id name");

    const formatName = (u) =>
      `${u?.surname} ${u?.lastname}`;

    res.json({
      subjects: subjects.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      teachers: teachers.map((t) => ({
        value: t._id,
        label: formatName(t.userId),
      })),
      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),
      sessions: sessions.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      terms: terms.map((t) => ({
        value: t._id,
        label: t.name,
      })),
      statusOptions: [
        { value: "Draft", label: "Draft" },
        { value: "Published", label: "Published" },
        { value: "Closed", label: "Closed" },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    } = req.body;

    if (!title || !subjectId || !klassId || !created_by) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const test = new Test({
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    });

    const saved = await test.save();

    res.status(201).json({
      success: true,
      test: saved,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .sort({ created_at: -1 });

    const formatted = quizzes.map((quiz) => ({
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subjectName: quiz.subjectId?.name || "N/A",
      className: quiz.klassId?.name || "N/A",
      sessionName: quiz.sessionId?.name || "N/A",
      termName: quiz.termId?.name || "N/A",

      status: quiz.status,
      duration: quiz.duration,
      createdAt: quiz.created_at,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get quizzes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID",
      });
    }

    const quiz = await Quiz.findById(id)
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .populate("created_by", "fullName");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const formatted = {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,

      subjectName: quiz.subjectId?.name || "N/A",
      className: quiz.klassId?.name || "N/A",
      sessionName: quiz.sessionId?.name || "N/A",
      termName: quiz.termId?.name || "N/A",

      status: quiz.status,
      duration: quiz.duration,
      createdAt: quiz.created_at,
      createdBy: quiz.created_by?.fullName || "N/A",

      questions: quiz.questions,
      totalQuestions: quiz.questions.length,
      maxScore: quiz.questions.reduce(
        (acc, q) => acc + (q.marks || 0),
        0
      ),
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get quiz by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      duration,
      status,
      questions,
    } = req.body;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (title) quiz.title = title;
    if (description) quiz.description = description;

    if (subjectId) quiz.subjectId = subjectId;
    if (klassId) quiz.klassId = klassId;
    if (sessionId) quiz.sessionId = sessionId;
    if (termId) quiz.termId = termId;

    if (duration) quiz.duration = duration;
    if (status) quiz.status = status;

    if (Array.isArray(questions)) {
      quiz.questions = questions;
    }

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });

  } catch (error) {
    console.error("Update quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quiz",
      error: error.message,
    });
  }
};

exports.getQuizFormData = async (req, res) => {
  try {
    const subjects = await Subject.find().select("_id name");
    const teachers = await Teacher.find().populate("userId");
    const classes = await Klass.find().select("_id name");
    const sessions = await Session.find().select("_id name");
    const terms = await Term.find().select("_id name");

    const formatName = (u) =>
      `${u?.surname} ${u?.lastname}`;

    res.json({
      subjects: subjects.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      teachers: teachers.map((t) => ({
        value: t._id,
        label: formatName(t.userId),
      })),
      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),
      sessions: sessions.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      terms: terms.map((t) => ({
        value: t._id,
        label: t.name,
      })),
      statusOptions: [
        { value: "Draft", label: "Draft" },
        { value: "Published", label: "Published" },
        { value: "Closed", label: "Closed" },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    } = req.body;

    if (!title || !subjectId || !klassId || !created_by) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const quiz = new Quiz({
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    });

    const saved = await quiz.save();

    res.status(201).json({
      success: true,
      quiz: saved,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .sort({ created_at: -1 });

    const formatted = exams.map((exam) => ({
      id: exam._id,
      title: exam.title,
      description: exam.description,
      subjectName: exam.subjectId?.name || "N/A",
      className: exam.klassId?.name || "N/A",
      sessionName: exam.sessionId?.name || "N/A",
      termName: exam.termId?.name || "N/A",

      status: exam.status,
      duration: exam.duration,
      createdAt: exam.created_at,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get exam error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    const exam = await Exam.findById(id)
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .populate("created_by", "fullName");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const formatted = {
      id: exam._id,
      title: exam.title,
      description: exam.description,

      subjectName: exam.subjectId?.name || "N/A",
      className: exam.klassId?.name || "N/A",
      sessionName: exam.sessionId?.name || "N/A",
      termName: exam.termId?.name || "N/A",

      status: exam.status,
      duration: exam.duration,
      createdAt: exam.created_at,
      createdBy: exam.created_by?.fullName || "N/A",

      questions: exam.questions,
      totalQuestions: exam.questions.length,
      maxScore: exam.questions.reduce(
        (acc, q) => acc + (q.marks || 0),
        0
      ),
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get exam by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch exam",
    });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      duration,
      status,
      questions,
    } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (title) exam.title = title;
    if (description) exam.description = description;

    if (subjectId) exam.subjectId = subjectId;
    if (klassId) exam.klassId = klassId;
    if (sessionId) exam.sessionId = sessionId;
    if (termId) exam.termId = termId;

    if (duration) exam.duration = duration;
    if (status) exam.status = status;

    if (Array.isArray(questions)) {
      exam.questions = questions;
    }

    await exam.save();

    res.status(200).json({
      success: true,
      message: "EXam updated successfully",
      data: exam,
    });

  } catch (error) {
    console.error("Update exam error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update exam",
      error: error.message,
    });
  }
};

exports.getExamFormData = async (req, res) => {
  try {
    const subjects = await Subject.find().select("_id name");
    const teachers = await Teacher.find().populate("userId");
    const classes = await Klass.find().select("_id name");
    const sessions = await Session.find().select("_id name");
    const terms = await Term.find().select("_id name");

    const formatName = (u) =>
      `${u?.surname} ${u?.lastname}`;

    res.json({
      subjects: subjects.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      teachers: teachers.map((t) => ({
        value: t._id,
        label: formatName(t.userId),
      })),
      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),
      sessions: sessions.map((s) => ({
        value: s._id,
        label: s.name,
      })),
      terms: terms.map((t) => ({
        value: t._id,
        label: t.name,
      })),
      statusOptions: [
        { value: "Draft", label: "Draft" },
        { value: "Published", label: "Published" },
        { value: "Closed", label: "Closed" },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    } = req.body;

    if (!title || !subjectId || !klassId || !created_by) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const exam = new Exam({
      title,
      description,
      subjectId,
      klassId,
      sessionId,
      termId,
      created_by,
      questions,
      duration,
      status,
    });

    const saved = await exam.save();

    res.status(201).json({
      success: true,
      exam: saved,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllAssessmentItems = async (req, res) => {
  try {
    const assessmentItems = await AssessmentItem.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname",
        },
      })
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .sort({ createdAt: -1 });

    const formatted = assessmentItems.map((assessmentItem) => {
      const user = assessmentItem.studentId?.userId;

      const studentName = user
        ? `${user.title || ""} ${user.surname || ""} ${user.middlename || ""} ${user.lastname || ""}`.trim()
        : "N/A";

      return {
        id: assessmentItem._id,
        studentName,
        subjectName: assessmentItem.subjectId?.name || "N/A",
        className: assessmentItem.klassId?.name || "N/A",
        sessionName: assessmentItem.sessionId?.name || "N/A",
        termName: assessmentItem.termId?.name || "N/A",

        type: assessmentItem.type,
        title: assessmentItem.title,
        score: assessmentItem.score,
        maxScore: assessmentItem.maxScore,
        createdAt: assessmentItem.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get assessment items error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment items",
    });
  }
};

exports.getAssessmentItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment item ID",
      });
    }

    const assessmentItem = await AssessmentItem.findById(id)

      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "title surname middlename lastname",
        },
      })

      .populate({
        path: "created_by",
        populate: {
          path: "userId",
          select: "title surname middlename lastname",
        },
      })

      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name");

    if (!assessmentItem) {
      return res.status(404).json({
        success: false,
        message: "Assessment item not found",
      });
    }

    const studentUser = assessmentItem.studentId?.userId;

    const studentName = studentUser
      ? `${studentUser.title || ""} ${studentUser.surname || ""} ${studentUser.middlename || ""} ${studentUser.lastname || ""}`.trim()
      : "N/A";

    const teacherUser = assessmentItem.created_by?.userId;

    const teacherName = teacherUser
      ? `${teacherUser.title || ""} ${teacherUser.surname || ""} ${teacherUser.middlename || ""} ${teacherUser.lastname || ""}`.trim()
      : "N/A";

    const formatted = {
      id: assessmentItem._id,

      studentId: assessmentItem.studentId?._id,
      studentName,

      subjectId: assessmentItem.subjectId?._id,
      subjectName: assessmentItem.subjectId?.name || "N/A",

      klassId: assessmentItem.klassId?._id,
      className: assessmentItem.klassId?.name || "N/A",

      sessionId: assessmentItem.sessionId?._id,
      sessionName: assessmentItem.sessionId?.name || "N/A",

      termId: assessmentItem.termId?._id,
      termName: assessmentItem.termId?.name || "N/A",

      createdBy: assessmentItem.created_by?._id,
      teacherName,

      type: assessmentItem.type,
      title: assessmentItem.title,
      score: assessmentItem.score,
      maxScore: assessmentItem.maxScore,

      createdAt: assessmentItem.createdAt,
      updatedAt: assessmentItem.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error("Get assessment item by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment item",
    });
  }
};
exports.updateAssessmentItem = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment item ID",
      });
    }

    const {
      studentId,
      subjectId,
      klassId,
      sessionId,
      termId,
      type,
      title,
      score,
      maxScore,
    } = req.body;

    const assessmentItem = await AssessmentItem.findById(id);

    if (!assessmentItem) {
      return res.status(404).json({
        success: false,
        message: "Assessment item not found",
      });
    }

    assessmentItem.studentId =
      studentId || assessmentItem.studentId;

    assessmentItem.subjectId =
      subjectId || assessmentItem.subjectId;

    assessmentItem.klassId =
      klassId || assessmentItem.klassId;

    assessmentItem.sessionId =
      sessionId || assessmentItem.sessionId;

    assessmentItem.termId =
      termId || assessmentItem.termId;

    assessmentItem.type =
      type || assessmentItem.type;

    assessmentItem.title =
      title || assessmentItem.title;

    assessmentItem.score =
      score !== undefined
        ? score
        : assessmentItem.score;

    assessmentItem.maxScore =
      maxScore !== undefined
        ? maxScore
        : assessmentItem.maxScore;

    await assessmentItem.save();

    res.status(200).json({
      success: true,
      message: "Assessment item updated successfully",
      data: assessmentItem,
    });

  } catch (error) {

    console.error(
      "Update assessment item error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update assessment item",
    });

  }
};

exports.getAssessmentItemFormData = async (req, res) => {
  try {

    const [
      subjects,
      teachers,
      classes,
      sessions,
      terms,
      students,
    ] = await Promise.all([

      Subject.find().select("_id name"),

      Teacher.find().populate(
        "userId",
        "title surname middlename lastname"
      ),

      Klass.find().select("_id name"),

      Session.find().select("_id name"),

      Term.find().select("_id name"),

      Student.find().populate(
        "userId",
        "title surname middlename lastname"
      ),

    ]);

    const formatName = (u) =>
      `${u?.title || ""} ${u?.surname || ""} ${u?.middlename || ""} ${u?.lastname || ""}`.trim();

    res.status(200).json({

      subjects: subjects.map((s) => ({
        value: s._id,
        label: s.name,
      })),

      teachers: teachers.map((t) => ({
        value: t._id,
        label: formatName(t.userId),
      })),

      students: students.map((s) => ({
        value: s._id,
        label: formatName(s.userId),
      })),

      classes: classes.map((c) => ({
        value: c._id,
        label: c.name,
      })),

      sessions: sessions.map((s) => ({
        value: s._id,
        label: s.name,
      })),

      terms: terms.map((t) => ({
        value: t._id,
        label: t.name,
      })),

      assessmentTypes: [
        {
          value: "Quiz",
          label: "Quiz",
        },
        {
          value: "Test",
          label: "Test",
        },
        {
          value: "Exam",
          label: "Exam",
        },
      ],

    });

  } catch (error) {

    console.error(
      "Get assessment form data error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch form data",
    });

  }
};

exports.createAssessmentItem = async (req, res) => {
  try {

    const {
      studentId,
      subjectId,
      klassId,
      sessionId,
      termId,
      type,
      title,
      score,
      maxScore,
      created_by,
    } = req.body;

    if (
      !studentId ||
      !subjectId ||
      !klassId ||
      !sessionId ||
      !termId ||
      !type ||
      !title ||
      score === undefined ||
      maxScore === undefined ||
      !created_by
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const assessmentItem =
      await AssessmentItem.create({
        studentId,
        subjectId,
        klassId,
        sessionId,
        termId,
        type,
        title,
        score,
        maxScore,
        created_by,
      });

    res.status(201).json({
      success: true,
      message:
        "Assessment item created successfully",
      data: assessmentItem,
    });

  } catch (error) {

    console.error(
      "Create assessment item error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create assessment item",
    });

  }
};

exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select:
            "title surname middlename lastname",
        },
      })

      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .populate("quiz", "title score maxScore type")
      .populate("test", "title score maxScore type")
      .populate("exam", "title score maxScore type")
      .sort({ createdAt: -1 });

    const formatted = assessments.map(
      (assessment) => {
        const studentUser = assessment.studentId?.userId;
        const studentName = studentUser
          ? `${studentUser.title || ""} ${studentUser.surname || ""} ${studentUser.middlename || ""} ${studentUser.lastname || ""}`.trim()
          : "N/A";

        return {
          id: assessment._id,
          studentName,
          subjectName: assessment.subjectId?.name || "N/A",
          className: assessment.klassId?.name || "N/A",
          sessionName: assessment.sessionId?.name || "N/A",
          termName: assessment.termId?.name || "N/A",
          quiz: assessment.quiz?.title || "N/A",
          test: assessment.test?.title || "N/A",
          exam: assessment.exam?.title || "N/A",
          totalScore: assessment.totalScore,
          grade: assessment.grade,
          remark: assessment.remark,
          createdAt: assessment.createdAt,
        };

      }
    );

    res.status(200).json({
      success: true,
      data: formatted,
    });

  } catch (error) {
    console.error(
      "Get all assessments error:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch assessments",
    });

  }
};

exports.getAssessmentById = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });

    }

    const assessment = await Assessment.findById(id)
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select:
            "title surname middlename lastname",
        },
      })
      .populate("subjectId", "name")
      .populate("klassId", "name")
      .populate("sessionId", "name")
      .populate("termId", "name")
      .populate({ path: "quiz", select: "title type score maxScore",
      })
      .populate({
        path: "test",
        select: "title type score maxScore",
      })
      .populate({
        path: "exam",
        select: "title type score maxScore",
      });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });

    }

    const studentUser =
      assessment.studentId?.userId;

    const studentName = studentUser
      ? `${studentUser.title || ""} ${studentUser.surname || ""} ${studentUser.middlename || ""} ${studentUser.lastname || ""}`.trim()
      : "N/A";

    res.status(200).json({
      success: true,
      data: {
        id: assessment._id,
        student: { id: assessment.studentId?._id, name: studentName },
        subject: { id: assessment.subjectId?._id, name: assessment.subjectId?.name },
        klass: { id: assessment.klassId?._id, name: assessment.klassId?.name },
        session: { id: assessment.sessionId?._id, name: assessment.sessionId?.name },
        term: { id: assessment.termId?._id, name: assessment.termId?.name },
        quiz: assessment.quiz,
        test: assessment.test,
        exam: assessment.exam,
        totalScore: assessment.totalScore,
        grade: assessment.grade,
        remark: assessment.remark,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get assessment by ID error:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch assessment",
    });
  }
};

exports.updateAssessment = async (req, res) => {
  try {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment ID",
      });

    }
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });

    }
    const { studentId, subjectId, klassId, sessionId, termId, quiz, test, exam } = req.body;

    const quizItem = await AssessmentItem.findById(quiz);
    const testItem = await AssessmentItem.findById(test);
    const examItem = await AssessmentItem.findById(exam);

    if (!quizItem || !testItem || !examItem) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid assessment items selected",
      });

    }
    const totalScore = Number(quizItem.score || 0) + Number(testItem.score || 0) + Number(examItem.score || 0);
    const { grade, remark } = calculateGradeAndRemark(totalScore);

    assessment.studentId = studentId;
    assessment.subjectId = subjectId;
    assessment.klassId = klassId;
    assessment.sessionId = sessionId;
    assessment.termId = termId;
    assessment.quiz = quiz;
    assessment.test = test;
    assessment.exam = exam;
    assessment.totalScore = totalScore;
    assessment.grade = grade;
    assessment.remark = remark;

    await assessment.save();

    res.status(200).json({
      success: true,
      message:
        "Assessment updated successfully",
      data: assessment,
    });

  } catch (error) {

    console.error(
      "Update assessment error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });

  }
};

exports.getAssessmentFormData = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "userId",
        select: "title surname middlename lastname",
      });

    const subjects = await Subject.find();
    const klasses = await Klass.find();
    const sessions = await Session.find();
    const terms = await Term.find();

    return res.status(200).json({
      success: true,
      data: {
        students,
        subjects,
        klasses,
        sessions,
        terms,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStudentAssessmentItems = async (req, res) => {
  try {

    const { studentId, subjectId, sessionId, termId } = req.query;
    const baseQuery = { studentId, subjectId, sessionId, termId };

    const quiz = await AssessmentItem.findOne({ ...baseQuery, type: "Quiz" });
    const test = await AssessmentItem.findOne({ ...baseQuery, type: "Test" });
    const exam = await AssessmentItem.findOne({ ...baseQuery, type: "Exam" });

    return res.status(200).json({
      success: true,
      data: {
        quiz,
        test,
        exam,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};

exports.createAssessment = async (req, res) => {
  try {
    const { studentId, subjectId, klassId, sessionId, termId, quiz, test, exam } = req.body;
    console.log(req.body);

    if (!studentId || !subjectId || !klassId || !sessionId || !termId) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (!quiz || !test || !exam) {
      return res.status(400).json({
        success: false,
        message: "Quiz, Test or Exam score not found"
      });
    }
    const quizData = await AssessmentItem.findById(quiz);
    const testData = await AssessmentItem.findById(test);
    const examData = await AssessmentItem.findById(exam);

    if (!quizData) {
      return res.status(404).json({
        success: false,
        message: "Quiz record missing"
      });
    }

    if (!testData) {
      return res.status(404).json({
        success: false,
        message: "Test record missing"
      });
    }

    if (!examData) {
      return res.status(404).json({
        success: false,
        message: "Exam record missing"
      });
    }
    const totalScore = Number(quizData.score || 0) + Number(testData.score || 0) + Number(examData.score || 0);
    const { grade, remark } = calculateGradeAndRemark(totalScore);
    const assessment = await Assessment.create({
      studentId,
      subjectId,
      klassId,
      sessionId,
      termId,
      quiz,
      test,
      exam,
      totalScore,
      grade,
      remark
    });

    return res.status(201).json({
      success: true,
      message: "Assessment created",
      data: assessment
    });
  } catch (error) {
    console.log(
      "CREATE ASSESSMENT ERROR:",
      error
    );
    return res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};