const User = require("../models/User");
const Student = require("../models/Student");
const Profile = require("../models/Profile");

exports.getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    const student = await Student.findOne({ userId: user._id }).populate("klassId").populate("parentId");

    const profile = await Profile.findOne({
      userId: user._id,
    });

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: user._id,
          fullname: `${user.title || ""} ${user.surname} ${user.middlename} ${user.lastname}`,
          title: user.title,
          surname: user.surname,
          middlename: user.middlename,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
          regNo: student?.regNo || user.regNo,
          className: student?.klassId?.name || null,
          parentFullname:
            student?.parentId ? `${student.parentId.surname} ${student.parentId.lastname}` : null,
          profile,
        },
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};