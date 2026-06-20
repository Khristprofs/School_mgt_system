const Student = require('../models/Student')
const User = require('../models/User')
const Klass = require('../models/Klass')

exports.createStudent = async (req, res) => {
    const { userId, klassId, regNo, parentId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    if (!klassId) {
        return res.status(400).json({ message: 'Class ID is required' });
    }
    if (!regNo) {
        return res.status(400).json({ message: 'Reg number is required' });
    }
    if (!parentId) {
        return res.status(400).json({ message: 'Parent ID is required' });
    }
    const parent = await User.findById(userId);
    if (!parent) {
        return res.status(400).json({ message: 'User not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (user.regNo !== regNo) {
        return res.status(400).json({ message: 'Reg number does not match the one in User record' });
    }
    const klass = await Klass.findById(klassId);
    if (!klass) {
        return res.status(400).json({ message: 'Class not found' });
    }
    const existingStudent = await Student.findOne({ userId, klassId, regNo });
    if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists in this class' });
    }
    const student = new Student({
        userId,
        klassId,
        regNo,
        parentId,
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getAllStudent = async (req, res) => {
    try {
        const students = await Student.find().populate('userId', 'klassId');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('userId', 'klassId')
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getStudentsInParticularKlass = async (req, res) => {
    try {
        const { klassId } = req.params;
        const students = await Student.find({ klassId })
            .populate('userId', 'name regNo email')
            .populate('klassId', 'name');
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found for this class' });
        }
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAStudentInKlass = async (req, res) => {
    try {
        const { klassId, studentId } = req.params;
        const student = await Student.findOne({ klassId, _id: studentId })
            .populate('userId', 'name regNo email')
            .populate('klassId', 'name');
        if (!student) {
            return res.status(404).json({ message: 'Student not found in this class' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const { userId, klassId, regNo } = req.body;
        if (userId !== undefined) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (regNo !== undefined && user.regNo !== regNo) {
                return res.status(400).json({ message: 'Reg number does not match the one in User record' });
            }
            student.userId = userId;
        } else {
            if (regNo !== undefined) {
                const currentUser = await User.findById(student.userId);
                if (currentUser.regNo !== regNo) {
                    return res.status(400).json({ message: 'Reg number does not match the one in User record' });
                }
            }
        }
        if (regNo !== undefined) {
            student.regNo = regNo;
        }
        if (klassId !== undefined) {
            const klass = await Klass.findById(klassId);
            if (!klass) {
                return res.status(404).json({ message: 'Klass not found' });
            }
            student.klassId = klassId;
        }

        const updatedStudent = await student.save();
        res.status(200).json(updatedStudent);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) { return res.status(400).json({ message: 'Student not found' }) };
        await student.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Student class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}