const Profile = require('../models/Profile')
const User = require('../models/User')

exports.createProfile = async (req, res) => {
    const { userId, img, DOB, dateOfAdmission, graduationYear, bio, contactAddress, resetPasswordToken, refreshToken } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    if (userId === undefined || userId === "") {
        return res.status(400).json({ message: 'User ID is required' })
    }
    if (DOB === undefined || DOB === "") {
        return res.status(400).json({ message: 'Date of birth is required' })
    }
    const existingProfile = await Profile.findOne({ userId: userId });
    if (existingProfile) {
        return res.status(400).json({ message: 'Profile already exists' })
    }
    const profile = new Profile({
        userId: userId,
        img: img,
        DOB: DOB,
        dateOfAdmission: dateOfAdmission,
        graduationYear: graduationYear,
        bio: bio,
        contactAddress: contactAddress,
        resetPasswordToken: resetPasswordToken,
        refreshToken: refreshToken
    });
    try {
        const newProfile = await profile.save();
        res.status(201).json(newProfile)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('userId', 'name');
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate('userId', 'name')
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' })
        }
        const { userId, img, DOB, dateOfAdmission, graduationYear, bio, contactAddress, resetPasswordToken, refreshToken } = req.body
        if (img !== undefined) { profile.img = img; }
        if (DOB !== undefined) { profile.DOB = DOB; }
        if (dateOfAdmission !== undefined) { profile.dateOfAdmission = dateOfAdmission; }
        if (graduationYear !== undefined) { profile.graduationYear = graduationYear; }
        if (bio !== undefined) { profile.bio = bio; }
        if (contactAddress !== undefined) { profile.contactAddress = contactAddress; }
        if (resetPasswordToken !== undefined) { profile.resetPasswordToken = resetPasswordToken; }
        if (refreshToken !== undefined) { profile.refreshToken = refreshToken; }
        if (userId !== undefined) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            profile.userId = userId
        }
        const updatedProfile = await profile.save();
        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) { return res.status(400).json({ message: 'Profile not found' }) };
        await Profile.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}