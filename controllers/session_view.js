const Session = require('../models/Session')

exports.createSession = async (req, res) => {
    const session = new Session({
        name: req.body.name,
        isCurrent: req.body.isCurrent,
    });
    const existingSession = await Session.findOne({ name: req.body.name })
    if(existingSession) return res.status(400).json({ message: 'Session already exit' });
    try{
        const newSession = await session.save();
        res.status(201).json(newSession);
    } catch (error){
        res.start(400).json({ message: error.message })
    }
}

exports.getAllSession = async (req, res) => {
  try {
    const sessions = await Session.find().populate('name');

    res.status(200).json({
      success: true,
      data: sessions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id);
        res.status(200).json(session)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(400).json({ message: 'Session not found' });
        session.name = req.body.name;
        session.isCurrent = req.body.isCurrent;
        const updateSession = await session.save();
        res.status(200).json(updateSession);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id)
        if (!session) return res.status(400).json({ message: 'Session not found'});
        await session.deleteOne({_id: req.params.id});
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}