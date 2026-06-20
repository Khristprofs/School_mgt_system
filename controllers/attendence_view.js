const Attendance = require('../models/Attendence');
const Student = require('../models/Student');
const Klass = require('../models/Klass');
const Session = require('../models/Session');
const Term = require('../models/Term');
const Teacher = require('../models/Teacher');

exports.createAttendance = async (req, res) => {
    const { studentId, klassId, sessionId, termId, date, status, remarks, markedBy } = req.body;
    if (!studentId || studentId === "") {
        return res.status(400).json({ message: 'Student ID is required' });
    }
    if (!klassId || klassId === "") {
        return res.status(400).json({ message: 'Class ID is required' });
    }
    if (!sessionId || sessionId === "") {
        return res.status(400).json({ message: 'Session ID is required' });
    }
    if (!termId || termId === "") {
        return res.status(400).json({ message: 'Term ID is required' });
    }
    if (!date || date === "") {
        return res.status(400).json({ message: 'Date is required' });
    }
    if (!markedBy || markedBy === "") {
        return res.status(400).json({ message: 'MarkedBy (Teacher ID) is required' });
    }
    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(400).json({ message: 'Student not found' });
    }

    const klass = await Klass.findById(klassId);
    if (!klass) {
        return res.status(400).json({ message: 'Class not found' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        return res.status(400).json({ message: 'Session not found' });
    }

    const term = await Term.findById(termId);
    if (!term) {
        return res.status(400).json({ message: 'Term not found' });
    }

    const teacher = await Teacher.findById(markedBy);
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher (markedBy) not found' });
    }

    const existingAttendance = await Attendance.findOne({
        studentId,
        klassId,
        sessionId,
        termId,
        date
    });

    if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance already marked for this student on this date in this class/session/term' });
    }

    // ✅ Create new attendance
    const attendance = new Attendance({
        studentId,
        klassId,
        sessionId,
        termId,
        date,
        status: status || 'Present',
        remarks,
        markedBy
    });

    try {
        const newAttendance = await attendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// ✅ Get All Attendance
exports.getAllAttendance = async (_req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('studentId', 'surname lastname regNo')
            .populate('klassId', 'name')
            .populate('sessionId', 'name')
            .populate('termId', 'name')
            .populate('markedBy', 'surname lastname staffNo');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id)
            .populate('studentId', 'surname lastname regNo')
            .populate('klassId', 'name')
            .populate('sessionId', 'name')
            .populate('termId', 'name')
            .populate('markedBy', 'surname lastname staffNo');

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByClass = async (req, res) => {
    try {
        const { klassId } = req.params;
        const attendance = await Attendance.find({ klassId })
            .populate('studentId', 'surname lastname regNo');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByClassAndDate = async (req, res) => {
    try {
        const { klassId, date } = req.params;

        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const attendance = await Attendance.find({
            klassId,
            date: { $gte: start, $lte: end },
        }).populate('studentId', 'surname lastname regNo');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get Attendance for a Class in a Term
exports.getAttendanceByClassAndTerm = async (req, res) => {
    try {
        const { klassId, termId } = req.params;
        const attendance = await Attendance.find({ klassId, termId })
            .populate('studentId', 'surname lastname regNo');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByClassAndSession = async (req, res) => {
    try {
        const { klassId, sessionId } = req.params;
        const attendance = await Attendance.find({ klassId, sessionId })
            .populate('studentId', 'surname lastname regNo');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Delete Attendance
exports.deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found' });
        }

        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};