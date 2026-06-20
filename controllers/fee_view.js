const Fee = require('../models/Fee');
const Term = require('../models/Term');
const Session = require('../models/Session');
const Klass = require('../models/Klass');

exports.createFee = async (req, res) => {
    const fee = new Fee({
        termId: req.body.termId,
        sessionId: req.body.sessionId,
        klassId: req.body.klassId,
        name: req.body.name,
        decription: req.body.decription,
        type: req.body.type,
        isActive: req.body.isActive,
        isInstallmentAllowed: req.body.isInstallmentAllowed,
        no_ofInstallments: req.body.no_ofInstallments,
        amount: req.body.amount,
        isApproved: req.body.isApproved,
    });
    try {
        const existing = await Fee.findOne({ $or: [{ name: req.body.name, termId: req.body.termId }] })
        if (existing) return res.status(409).json({ message: 'This Fee already exist' });
        const session = await Session.findById(req.body.sessionId)
        if (!session) return res.status(409).json({ message: "Session not found" })
        const term = await Term.findById(req.body.termId)
        if (!term) return res.status(409).json({message: "Term not found"})
        const klass = await Klass.findById(req.body.klassId)
        if (!klass) return res.status(409).json({message: "Class not found"})
        const newFee = await fee.save();
        res.status(201).json(newFee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('term', 'name').populate('klass', 'name')
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('term', 'name')
    if (!fee) return res.status(404).json({ message: 'Fee not found' })
    res.status(200).json(fee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('term')
    if (!fee) return res.status(404).json({ message: 'Fee not found' })
    fee.termId = req.body.termId
    fee.sessionId = req.body.sessionId
    fee.klassId = req.body.klassId
    fee.name = req.body.name
    fee.decription = req.body.decription
    fee.type = req.body.type
    fee.isActive = req.body.isActive
    fee.isInstallmentAllowed = req.body.isInstallmentAllowed
    fee.no_ofInstallments = req.body.no_ofInstallments
    fee.amount = req.body.amount
    fee.isApproved = req.body.isApproved
    const updatedFee = await fee.save()
    res.status(200).json(updatedFee)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id)
    if (!fee) return res.status(404).json({ message: 'Fee not found' })
    res.json({ message: 'Fee Deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getFeesByTerm = async (req, res) => {
  try {
    const { termId } = req.params
    const fees = await Fee.find({ term: termId }).populate('term', 'name')
    res.json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getApprovedFees = async (req, res) => {
  try {
    const fees = await Fee.find({ isApproved: true }).populate('term', 'name')
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUnapprovedFees = async (req, res) => {
  try {
    const fees = await Fee.find({ isApproved: false }).populate('term', 'name')
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getApprovedFeesByTerm = async (req, res) => {
  try {
    const { termId } = req.params
    const fees = await Fee.find({ termId: termId, isApproved: true }).populate(
      'term',
      'name'
    )
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUnapprovedFeesByTerm = async (req, res) => {
  try {
    const { termId } = req.params
    const fees = await Fee.find({ term: termId, isApproved: false }).populate(
      'term',
      'name'
    )
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.approvedFeesForAKlass = async (req, res) => {
  try {
    const { klassId } = req.params
    const fees = await Fee.find({
      klassId: klassId,
      isApproved: true,
    }).populate({
      path: 'klass', 
      select: 'name'
    }).populate({
      path: 'term',
      select: 'name',
      populate: {
        path: 'session',
        select: 'klass name',
      },
    })
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.unapprovedFeesForAKlass = async (req, res) => {
  try {
    const { klassId } = req.params
    const fees = await Fee.find({
      klassId: klassId,
      isApproved: false,
    }).populate({
      path: 'klass',
      select: 'name'
    }).populate({
      path: 'term',
      select: 'name',
      populate: {
        path: 'session',
        select: 'klass name',
      },
    })
    res.status(200).json(fees)
  }catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getFeesBySession = async (req, res) => {
  try {
    const { sessionId } = req.params
    const fees = await Fee.find({ sessionId: sessionId }).populate('term', 'name').populate('session', 'name')
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.getFeesByKlass = async (req, res) => {
  try {
    const { klassId } = req.params
    const fees = await Fee.find({ klassId: klassId }).populate('term', 'name').populate('klass', 'name')
    res.status(200).json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
