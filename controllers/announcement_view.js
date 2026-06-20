const Announcement = require('../models/Announcement');
const Level = require('../models/Level')

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, message, audience, created_by, publishAt, levelId } = req.body;

        if (!title || !message || !audience || !created_by || !publishAt) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const level = await Level.findById(levelId);
        if (!level) {
            return res.status(400).json({ message: 'Level not found' });
        }
        const existingAnnouncement = await Announcement.findOne({ title, message, audience
        });

        if (existingAnnouncement) {
            return res.status(400).json({ message: 'Announcement already exist' });
        }
        const announcement = new Announcement({
            title,
            message,
            audience,
            created_by,
            publishAt,
            levelId
        });

        const savedAnnouncement = await announcement.save();
        res.status(201).json(savedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncements = async (_req, res) => {
    try {
        const announcements = await Announcement.find()
            .populate('create_by', 'surname lastname email')
            .populate('levelId', 'name');
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('create_by', 'surname lastname email')
            .populate('levelId', 'name');

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncementsByLevelId = async (req, res) => {
    try {
        const announcements = await Announcement.find({ levelId: req.params.levelId })
            .populate('create_by', 'surname lastname email')
            .populate('levelId', 'name');

        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncementsByAudience = async (req, res) => {
    try {
        const announcements = await Announcement.find({ audience: req.params.audience })
            .populate('create_by', 'surname lastname email')
            .populate('levelId', 'name');

        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncementsByTitle = async (req, res) => {
    try {
        // Case-insensitive search
        const announcements = await Announcement.find({
            title: { $regex: req.params.title, $options: 'i' }
        })
            .populate('create_by', 'surname lastname email')
            .populate('levelId', 'name');

        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
