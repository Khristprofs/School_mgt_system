const Term = require('../models/Term')
const Session = require('../models/Session')

exports.createTerm = async (req, res) => {
    const { sessionId, name, startDate, endDate, isCurrent } = req.body;
    if (sessionId === undefined || sessionId === ""){
        return res.status(400).json({ message: 'Session ID is required' });
    }
    if (name === undefined || name === ""){
        return res.status(400).json({ message: 'Name is required' });
    }
    if (startDate === undefined || startDate === ""){
        return res.status(400).json({ message: 'Start date is required' });
    }
    if (endDate === undefined || endDate === ""){
        return res.status(400).json({ message: 'End date is required' });
    }
    if (isCurrent === undefined || isCurrent === ""){
        return res.status(400).json({ message: 'Is current is required' });
    }
    const session = await Session.findById(sessionId);
    if(!session) {
        return res.status(400).json({ message: 'Session not found' });
    }
    const existingTerm = await Term.findOne({ name: name, session: sessionId});
    if(existingTerm){
        return res.status(400).json({ message: 'Term already exist'})
    }
    const term = new Term({
        sessionId: sessionId,
        name: name,
        startDate: startDate,
        endDate: endDate,
        isCurrent: isCurrent
    })
    try{
        const newTerm = await term.save();
        res.status(201).json(newTerm)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getTerms = async (req, res) => {
  try {
    const terms = await Term.find().populate('sessionId', 'name');

    res.status(200).json({
      success: true,
      data: terms
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTerm = async (req, res) => {
    try{
        const term = await Term.findById(req.params.id).populate('sessionId', 'name')
        res.status(200).json(term)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getTermsInSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const term = await Term.find({ sessionId }).populate('sessionId', 'name');
        if (!term || term.length === 0) {
            return res.status(404).json({ message: 'No terms found for this session' });
        }
        res.status(200).json(term);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTerm = async (req, res) => {
    try{
        const term = await Term.findById(req.params.id);
        if(!term){
            return res.status(404).json({ message: 'Term not found'})
        }
        const { sessionId, name, startDate, endDate, isCurrent } = req.body
        if(name !== undefined) { term.name = name; }
        if(sessionId !== undefined) { 
            const session = await Session.findById(sessionId);
            if(!session){
                return res.status(404).json({ message: 'Session not found'})
            }
            term.sessionId = sessionId
         }
        if(startDate !== undefined) { term.startDate = startDate; }
        if(endDate !== undefined) { term.endDate = endDate; }
        if(isCurrent !== undefined) { term.isCurrent = isCurrent; }
        const updatedTerm = await term.save();
        res.status(200).json(updatedTerm);
    } catch(error){
        res.status(400).json({ message: error.message });
    }
}

exports.deleteTerm = async (req, res) => {
    try{
        const term = await Term.findById(req.params.id);
        if (!term) { return res.status(400).json({ message: 'Term not found'})};
        await Term.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Term deleted successfully'});
    } catch(error){
        res.status(500).json({ message: error.messagem})
    }
}