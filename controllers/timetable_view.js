const Timetable = require('../models/Timetable');
const Klass = require('../models/Klass');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');

exports.createTimetable = async (req, res) => {
    try {
        const { klassId, subjectId, teacherId, day, startTime, endTime } = req.body;
        if (!klassId || !subjectId || !teacherId || !day || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const klass = await Klass.findById(klassId);
        if (!klass) return res.status(404).json({ message: 'Class not found' });
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        const existing = await Timetable.findOne({
            klassId,
            subjectId,
            teacherId,
            day,
            startTime,
            endTime
        });
        if (existing) {
            return res.status(400).json({ message: 'This timetable entry already exists' });
        }

        const timetable = new Timetable({ klassId, subjectId, teacherId, day, startTime, endTime });
        const newTimetable = await timetable.save();
        res.status(201).json(newTimetable);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find()
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id)
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }
        res.status(200).json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClassTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find({ klassId: req.params.klassId })
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        if (!timetables.length) {
            return res.status(404).json({ message: 'No timetables found for this class' });
        }
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubjectTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find({ subjectId: req.params.subjectId })
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        if (!timetables.length) {
            return res.status(404).json({ message: 'No timetables found for this subject' });
        }
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeacherTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find({ teacherId: req.params.teacherId })
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        if (!timetables.length) {
            return res.status(404).json({ message: 'No timetables found for this teacher' });
        }
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTimetablesByDay = async (req, res) => {
    try {
        const timetables = await Timetable.find({ day: req.params.day })
            .populate('klassId', 'name')
            .populate('subjectId', 'name')
            .populate('teacherId', 'name email');
        if (!timetables.length) {
            return res.status(404).json({ message: `No timetables found for ${req.params.day}` });
        }
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        const { klassId, subjectId, teacherId, day, startTime, endTime } = req.body;

        if (klassId) {
            const klass = await Klass.findById(klassId);
            if (!klass) return res.status(404).json({ message: 'Class not found' });
            timetable.klassId = klassId;
        }

        if (subjectId) {
            const subject = await Subject.findById(subjectId);
            if (!subject) return res.status(404).json({ message: 'Subject not found' });
            timetable.subjectId = subjectId;
        }
        if (teacherId) {
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            timetable.teacherId = teacherId;
        }
        if (day) timetable.day = day;
        if (startTime) timetable.startTime = startTime;
        if (endTime) timetable.endTime = endTime;
        const updatedTimetable = await timetable.save();
        res.status(200).json(updatedTimetable);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findByIdAndDelete(req.params.id);
        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};