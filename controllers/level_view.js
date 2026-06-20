const Level = require('../models/Level')
const Session = require('../models/Session')
const Term = require('../models/Term')

exports.createLevel = async (req, res) => {
    const { name, termId, sessionId, } = req.body;
    if (name === undefined || name === "") {
        return res.status(400).json({ message: 'Name is required' })
    }
    if (termId === undefined || termId === "") {
        return res.status(400).json({ message: 'Term ID is required' })
    }
    if (sessionId === undefined || sessionId === "") {
        return res.status(400).json({ message: 'Session ID is required' })
    }
    const session = await Session.findById(sessionId);
    if (!session) {
        return res.status(400).json({ message: 'Session not found' })
    }
    const term = await Term.findById(termId);
    if (!term) {
        return res.status(400).json({ message: 'Term not found' })
    }
    const existingLevel = await Level.findOne({ name: name, termId: termId, sessionId: sessionId });
    if (existingLevel) {
        return res.status(400).json({ message: 'Level already exists' })
    }
    const level = new Level({
        name: name,
        termId: termId,
        sessionId: sessionId,
    });
    try {
        const newLevel = await level.save();
        res.status(201).json(newLevel)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAllLevel = async (req, res) => {
  try {
    const levels = await Level.find().populate('sessionId', 'name');

    res.status(200).json({
      success: true,
      data: levels
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLevel = async (req, res) => {
    try {
        const level = await Level.findById(req.params.id).populate('sessionId', 'name')
        res.status(200).json(level)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getLevelsInSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const level = await Level.find({ sessionId }).populate('sessionId', 'name');
        if (!level || level.length === 0) {
            return res.status(404).json({ message: 'No Levels found for this session' });
        }
        res.status(200).json(level);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLevel = async (req, res) => {
    try {
        const level = await Level.findById(req.params.id);
        if (!level) {
            return res.status(404).json({ message: 'Level not found' })
        }
        const { name, termId, sessionId } = req.body
        if (name !== undefined) { level.name = name; }
        if (termId !== undefined) {
            const term = await Term.findById(termId);
            if (!term) {
                return res.status(404).json({ message: 'Term not found' })
            }
            level.termId = termId
        }
        if (sessionId !== undefined) {
            const session = await Session.findById(sessionId);
            if (!session) {
                return res.status(404).json({ message: 'Session not found' })
            }
            level.sessionId = sessionId
        }
        const updatedlevel = await level.save();
        res.status(200).json(updatedlevel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deleteLevel = async (req, res) => {
    try {
        const level = await Level.findById(req.params.id);
        if (!level) { return res.status(400).json({ message: 'Level not found' }) };
        await Level.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Level deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}