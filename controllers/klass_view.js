const Klass = require('../models/Klass')
const Level = require('../models/Level')
const Teacher = require('../models/Teacher')

exports.createKlass = async (req, res) => {
    const { name, levelId, teacherId, klassTitle } = req.body;
    if (name === undefined || name === "") {
        return res.status(400).json({ message: 'Name is required' })
    }
    if (klassTitle === undefined || klassTitle === "") {
        return res.status(400).json({ message: 'Class title is required' })
    }
    if (levelId === undefined || levelId === "") {
        return res.status(400).json({ message: 'Level ID is required' })
    }
    if (teacherId === undefined || teacherId === "") {
        return res.status(400).json({ message: 'Teacher ID is required' })
    }
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return res.status(400).json({ message: 'Teacher not found' })
    }
    const level = await Level.findById(levelId);
    if (!level) {
        return res.status(400).json({ message: 'Level not found' })
    }
    const existingClass = await Klass.findOne({ name: name, levelId: levelId });
    if (existingClass) {
        return res.status(400).json({ message: 'Class already exists' })
    }
    const klass = new Klass({
        name: name,
        levelId: levelId,
        teacherId: teacherId,
        klassTitle: klassTitle
    });
    try {
        const newKlass = await klass.save();
        res.status(201).json(newKlass)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAllKlass = async (req, res) => {
    try {
        const klasses = await Klass.find().populate('levelId', 'name');
        res.status(200).json(klasses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getKlass = async (req, res) => {
    try {
        const klass = await Klass.findById(req.params.id).populate('levelId', 'name')
        res.status(200).json(klass)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getKlassesInLevel = async (req, res) => {
    try {
        const levelId = req.params.levelId;
        const klass = await Klass.find({ levelId }).populate('levelId', 'name');
        if (!klass || klass.length === 0) {
            return res.status(404).json({ message: 'No Klass found for this Level' });
        }
        res.status(200).json(klass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateKlass = async (req, res) => {
    try {
        const klass = await Klass.findById(req.params.id);
        if (!klass) {
            return res.status(404).json({ message: 'Klass not found' })
        }
        const { name, levelId, teacherId } = req.body
        if (name !== undefined) { klass.name = name; }
        if (levelId !== undefined) {
            const level = await Level.findById(levelId);
            if (!level) {
                return res.status(404).json({ message: 'Level not found' })
            }
            klass.levelId = levelId
        }
        if (teacherId !== undefined) {
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' })
            }
            klass.teacherId = teacherId
        }
        const updatedKlass = await klass.save();
        res.status(200).json(updatedKlass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deleteKlass = async (req, res) => {
    try {
        const klass = await Klass.findById(req.params.id);
        if (!klass) { return res.status(400).json({ message: 'Klass not found' }) };
        await Klass.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Klass deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}