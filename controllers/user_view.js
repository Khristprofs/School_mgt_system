const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.createAdmin = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Admin already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Admin',
            phone
        });
        const newAdmin = await admin.save();
        const returnAdmin = {
            _id: newAdmin._id,
            title: newAdmin.title,
            surname: newAdmin.surname,
            middlename: newAdmin.middlename,
            lastname: newAdmin.lastname,
            email: newAdmin.email,
            password: newAdmin.password,
            role: newAdmin.role,
            phone: newAdmin.phone,
        }
        res.status(201).json({ message: 'Admin created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin'}).select('-password -_v');
        res.status(200).json(admins);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(admin);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        const updatableFields = ['title', 'surname', 'middlename', 'lastname', 'email', 'password', 'role', 'phone'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                admin[field] = req.body[field];
            }
        });
        const updatedUser = await admin.save();
        res.status(200).json({ message: 'Admin updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        await admin.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createSchool_admin = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'School Admin already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const school_admin = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'School_admin',
            phone
        });
        const newSchool_admin = await school_admin.save();
        const returnSchool_admin = {
            _id: newSchool_admin._id,
            title: newSchool_admin.title,
            surname: newSchool_admin.surname,
            middlename: newSchool_admin.middlename,
            lastname: newSchool_admin.lastname,
            email: newSchool_admin.email,
            password: newSchool_admin.password,
            role: newSchool_admin.role,
            phone: newSchool_admin.phone,
        }
        res.status(201).json({ message: 'School admin created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getSchool_admins = async (req, res) => {
    try {
        const school_admins = await User.find({ role: 'School_admin'}).select('-password -_v');
        res.status(200).json(school_admins);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getSchool_admin = async (req, res) => {
    try {
        const school_admin = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(school_admin);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateSchool_admin = async (req, res) => {
    try {
        const school_admin = await User.findById(req.params.id);
        if (!school_admin) return res.status(404).json({ message: 'School admin not found' });
        const updatableFields = ['title', 'surname', 'middlename', 'lastname', 'email', 'password', 'role', 'phone'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                school_admin[field] = req.body[field];
            }
        });
        const updatedUser = await school_admin.save();
        res.status(200).json({ message: 'School admin updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteSchool_admin = async (req, res) => {
    try {
        const school_admin = await User.findById(req.params.id);
        if (!school_admin) return res.status(404).json({ message: 'School admin not found' });
        await school_admin.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'School admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProperietor = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Properietor already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const properietor = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Properietor',
            phone
        });
        const newProperietor = await properietor.save();
        const returnProperietor = {
            _id: newProperietor._id,
            title: newProperietor.title,
            surname: newProperietor.surname,
            middlename: newProperietor.middlename,
            lastname: newProperietor.lastname,
            email: newProperietor.email,
            password: newProperietor.password,
            role: newProperietor.role,
            phone: newProperietor.phone,
        }
        res.status(201).json({ message: 'Properietor created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProperietors = async (req, res) => {
    try {
        const properietors = await User.find({ role: 'Properietor'}).select('-password -_v');
        res.status(200).json(properietors);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getProperietor = async (req, res) => {
    try {
        const properietor = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(properietor);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateProperietor = async (req, res) => {
    try {
        const properietor = await User.findById(req.params.id);
        if (!properietor) return res.status(404).json({ message: 'Properietor not found' });
        const updatableFields = ['title', 'surname', 'middlename', 'lastname', 'email', 'password', 'role', 'phone'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                properietor[field] = req.body[field];
            }
        });
        const updatedUser = await properietor.save();
        res.status(200).json({ message: 'Properietor updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteProperietor = async (req, res) => {
    try {
        const properietor = await User.findById(req.params.id);
        if (!properietor) return res.status(404).json({ message: 'Properietor not found' });
        await properietor.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Properietor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProperietress = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Properietress already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const properietress = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Properietress',
            phone
        });
        const newProperietress = await properietress.save();
        const returnProperietress = {
            _id: newProperietress._id,
            title: newProperietress.title,
            surname: newProperietress.surname,
            middlename: newProperietress.middlename,
            lastname: newProperietress.lastname,
            email: newProperietress.email,
            password: newProperietress.password,
            role: newProperietress.role,
            phone: newProperietress.phone,
        }
        res.status(201).json({ message: 'Properietress created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProperietresses = async (req, res) => {
    try {
        const properietresses = await User.find({ role: 'Properietress'}).select('-password -_v');
        res.status(200).json(properietresses);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getProperietress = async (req, res) => {
    try {
        const properietress = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(properietress);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateProperietress = async (req, res) => {
    try {
        const properietress = await User.findById(req.params.id);
        if (!properietress) return res.status(404).json({ message: 'Properietress not found' });
        const updatableFields = ['title', 'surname', 'middlename', 'lastname', 'email', 'password', 'role', 'phone'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                properietress[field] = req.body[field];
            }
        });
        const updatedUser = await properietress.save();
        res.status(200).json({ message: 'Properietress updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteProperietress = async (req, res) => {
    try {
        const properietress = await User.findById(req.params.id);
        if (!properietress) return res.status(404).json({ message: 'properietress not found' });
        await properietress.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Properietress deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createPrincipal = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname, staffNo: staffNo })
        if (existingUser) {
            return res.status(400).json({ message: 'Principal already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const principal = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Principal',
            staffNo,
            address,
            phone
        });
        const newPrincipal = await principal.save();
        const returnPrincipal = {
            _id: newPrincipal._id,
            title: newPrincipal.title,
            surname: newPrincipal.surname,
            middlename: newPrincipal.middlename,
            lastname: newPrincipal.lastname,
            email: newPrincipal.email,
            password: newPrincipal.password,
            role: newPrincipal.role,
            staffNo: newPrincipal.staffNo,
            address: newPrincipal.address,
            phone: newPrincipal.phone,
        }
        res.status(201).json({ message: 'Principal created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getPrincipals = async (req, res) => {
    try {
        const principals = await User.find({ role: 'Principals'}).select('-password -_v');
        res.status(200).json(principals);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getPrincipal = async (req, res) => {
    try {
        const principal = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(principal);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updatePrincipal = async (req, res) => {
    try {
        const principal = await User.findById(req.params.id);
        if (!principal) return res.status(404).json({ message: 'Principal not found' });
        const updatableFields = ['title', 'surname', 'middlename', 'lastname', 'email', 'password', 'role', 'phone'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                principal[field] = req.body[field];
            }
        });
        const updatedUser = await principal.save();
        res.status(200).json({ message: 'Principal updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deletePrincipal = async (req, res) => {
    try {
        const principal = await User.findById(req.params.id);
        if (!principal) return res.status(404).json({ message: 'Principal not found' });
        await principal.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Principal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createVice_principal = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname, staffNo: staffNo })
        if (existingUser) {
            return res.status(400).json({ message: 'Vice Principal already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Vice_principal = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Vice_principal',
            staffNo,
            address,
            phone
        });
        const newVicePrincipal = await Vice_principal.save();
        const returnVicePrincipal = {
            _id: newVicePrincipal._id,
            title: newVicePrincipal.title,
            surname: newVicePrincipal.surname,
            middlename: newVicePrincipal.middlename,
            lastname: newVicePrincipal.lastname,
            email: newVicePrincipal.email,
            password: newVicePrincipal.password,
            role: newVicePrincipal.role,
            staffNo: newVicePrincipal.staffNo,
            address: newVicePrincipal.address,
            phone: newVicePrincipal.phone,
        }
        res.status(201).json({ message: 'Vice Principal created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getVice_principals = async (req, res) => {
    try {
        const vice_principals = await User.find({ role: 'Vice_principals'}).select('-password -_v');
        res.status(200).json(vice_principals);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getVice_principal = async (req, res) => {
    try {
        const vice_principal = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(vice_principal);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateVice_principal = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const vice_principal = await User.findById(req.params.id);
        if(!vice_principal) return res.status(404).json({ message: 'Principal not found'})
        vice_principal.title = title;
        vice_principal.surname = surname;
        vice_principal.middlename = middlename;
        vice_principal.lastname = lastname;
        vice_principal.email = email;
        vice_principal.password = password;
        vice_principal.role = role;
        vice_principal.staffNo = staffNo;
        vice_principal.address = address;
        vice_principal.phone = phone;
        const updateUser = await vice_principal.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Vice principal updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteVice_principal = async (req, res) => {
    try {
        const vice_principal = await User.findById(req.params.id);
        if (!vice_principal) return res.status(404).json({ message: 'Vice principal not found' });
        await vice_principal.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Vice principal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createHeadteacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname, staffNo: staffNo })
        if (existingUser) {
            return res.status(400).json({ message: 'Headteacher already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Headteacher = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Headteacher',
            staffNo,
            address,
            phone
        });
        const newHeadteacher = await Headteacher.save();
        const returnHeadteacher = {
            _id: newHeadteacher._id,
            title: newHeadteacher.title,
            surname: newHeadteacher.surname,
            middlename: newHeadteacher.middlename,
            lastname: newHeadteacher.lastname,
            email: newHeadteacher.email,
            password: newHeadteacher.password,
            role: newHeadteacher.role,
            staffNo: newHeadteacher.staffNo,
            address: newHeadteacher.address,
            phone: newHeadteacher.phone,
        }
        res.status(201).json({ message: 'Headteacher created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getHeadteachers = async (req, res) => {
    try {
        const headteachers = await User.find({ role: 'Headteacher'}).select('-password -_v');
        res.status(200).json(headteachers);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getHeadteacher = async (req, res) => {
    try {
        const headteacher = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(headteacher);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateHeadteacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const headteacher = await User.findById(req.params.id);
        if(!headteacher) return res.status(404).json({ message: 'Hheadteachereadteacher not found'})
        headteacher.title = title;
        headteacher.surname = surname;
        headteacher.middlename = middlename;
        headteacher.lastname = lastname;
        headteacher.email = email;
        headteacher.password = password;
        headteacher.role = role;
        headteacher.staffNo = staffNo;
        headteacher.address = address;
        headteacher.phone = phone;
        const updateUser = await headteacher.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Headteacher updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteHeadteacher = async (req, res) => {
    try {
        const headteacher = await User.findById(req.params.id);
        if (!headteacher) return res.status(404).json({ message: 'Headteacher not found' });
        await headteacher.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Headteacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createVice_headteacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname, staffNo: staffNo })
        if (existingUser) {
            return res.status(400).json({ message: 'Vice headteacher already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Vice_headteacher = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Vice_headteacher',
            staffNo,
            address,
            phone
        });
        const newViceHeadteacher = await Vice_headteacher.save();
        const returnViceHeadteacher = {
            _id: newViceHeadteacher._id,
            title: newViceHeadteacher.title,
            surname: newViceHeadteacher.surname,
            middlename: newViceHeadteacher.middlename,
            lastname: newViceHeadteacher.lastname,
            email: newViceHeadteacher.email,
            password: newViceHeadteacher.password,
            role: newViceHeadteacher.role,
            staffNo: newViceHeadteacher.staffNo,
            address: newViceHeadteacher.address,
            phone: newViceHeadteacher.phone,
        }
        res.status(201).json({ message: 'Vice headteacher created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getVice_headteachers = async (req, res) => {
    try {
        const vice_headteachers = await User.find({ role: 'Vice_headteacher'}).select('-password -_v');
        res.status(200).json(vice_headteachers);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getVice_headteacher = async (req, res) => {
    try {
        const vice_headteacher = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(vice_headteacher);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateVice_headteacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const vice_headteacher = await User.findById(req.params.id);
        if(!vice_headteacher) return res.status(404).json({ message: 'Vice_headteacherice headteacher not found'})
        vice_headteacher.title = title;
        vice_headteacher.surname = surname;
        vice_headteacher.middlename = middlename;
        vice_headteacher.lastname = lastname;
        vice_headteacher.email = email;
        vice_headteacher.password = password;
        vice_headteacher.role = role;
        vice_headteacher.staffNo = staffNo;
        vice_headteacher.address = address;
        vice_headteacher.phone = phone;
        const updateUser = await vice_headteacher.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Vice headteacher updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteVice_headteacher = async (req, res) => {
    try {
        const vice_principal = await User.findById(req.params.id);
        if (!vice_principal) return res.status(404).json({ message: 'Vice principal not found' });
        await vice_principal.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Vice principal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBursar = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Bursar already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Bursar = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Bursar',
            staffNo,
            address,
            phone
        });
        const newBursar = await Bursar.save();
        const returnBursar = {
            _id: newBursar._id,
            title: newBursar.title,
            surname: newBursar.surname,
            middlename: newBursar.middlename,
            lastname: newBursar.lastname,
            email: newBursar.email,
            password: newBursar.password,
            role: newBursar.role,
            staffNo: newBursar.staffNo,
            address: newBursar.address,
            phone: newBursar.phone,
        }
        res.status(201).json({ message: 'Bursar created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getBursars = async (req, res) => {
    try {
        const bursars = await User.find({ role: 'Bursar'}).select('-password -_v');
        res.status(200).json(bursars);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getBursar = async (req, res) => {
    try {
        const bursar = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(bursar);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateBursar = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const bursar = await User.findById(req.params.id);
        if(!bursar) return res.status(404).json({ message: 'Principal not found'})
        bursar.title = title;
        bursar.surname = surname;
        bursar.middlename = middlename;
        bursar.lastname = lastname;
        bursar.email = email;
        bursar.password = password;
        bursar.role = role;
        bursar.staffNo = staffNo;
        bursar.address = address;
        bursar.phone = phone;
        const updateUser = await bursar.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Bursar updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteBursar = async (req, res) => {
    try {
        const bursar = await User.findById(req.params.id);
        if (!bursar) return res.status(404).json({ message: 'Bursar not found' });
        await bursar.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Bursar deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAuditor = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Auditor already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Bursar = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Auditor',
            staffNo,
            address,
            phone
        });
        const newBursar = await Bursar.save();
        const returnBursar = {
            _id: newBursar._id,
            title: newBursar.title,
            surname: newBursar.surname,
            middlename: newBursar.middlename,
            lastname: newBursar.lastname,
            email: newBursar.email,
            password: newBursar.password,
            role: newBursar.role,
            staffNo: newBursar.staffNo,
            address: newBursar.address,
            phone: newBursar.phone,
        }
        res.status(201).json({ message: 'Auditor created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAuditors = async (req, res) => {
    try {
        const auditors = await User.find({ role: 'Auditor'}).select('-password -_v');
        res.status(200).json(auditors);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getAuditor = async (req, res) => {
    try {
        const auditor = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(auditor);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateAuditor = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const auditor = await User.findById(req.params.id);
        if(!auditor) return res.status(404).json({ message: 'Auditor not found'})
        auditor.title = title;
        auditor.surname = surname;
        auditor.middlename = middlename;
        auditor.lastname = lastname;
        auditor.email = email;
        auditor.password = password;
        auditor.role = role;
        auditor.staffNo = staffNo;
        auditor.address = address;
        auditor.phone = phone;
        const updateUser = await auditor.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Auditor updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteAuditor = async (req, res) => {
    try {
        const auditor = await User.findById(req.params.id);
        if (!auditor) return res.status(404).json({ message: 'Auditor not found' });
        await auditor.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Auditor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTeacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (role !== 'Teacher') {
            return res.status(400).json({ message: 'Invalid role. This endpoint is only for teachers.' });
        }
        if (!title || !surname || !middlename || !lastname || !email || !password || !role || !address || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!staffNo || staffNo.trim() === "") {
            return res.status(400).json({ message: 'staffNo is required for teachers' });
        }
        const existingUser = await User.findOne({ 
            $or: [
                { email },
                { phone },
                { staffNo }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Teacher with same email, phone, or staffNo already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Teacher',
            staffNo,
            address,
            phone
        });

        await teacher.save();

        res.status(201).json({ message: 'Teacher created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'Teacher'}).select('-password -_v');
        res.status(200).json(teachers);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(teacher);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateTeacher = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const teacher = await User.findById(req.params.id);
        if(!teacherteacher) return res.status(404).json({ message: 'Teacher not found'})
        teacher.title = title;
        teacher.surname = surname;
        teacher.middlename = middlename;
        teacher.lastname = lastname;
        teacher.email = email;
        teacher.password = password;
        teacher.role = role;
        teacher.staffNo = staffNo;
        teacher.address = address;
        teacher.phone = phone;
        const updateUser = await teacher.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Teacher updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        await teacher.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { surname, middlename, lastname, email, password, role, regNo, address, phone } = req.body;
        if (role !== 'Student') {
            return res.status(400).json({ message: 'Invalid role for this endpoint' });
        }
        if (!surname || !middlename || !lastname || !email || !password || !role || !regNo || !address || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const regExists = await User.findOne({ regNo });
        if (regExists) {
            return res.status(400).json({ message: 'Registration number already exists' });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new User({
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Student',
            regNo,
            address,
            phone
        });
        await newStudent.save();
        res.status(201).json({
            message: 'Student created successfully',
            student: {
                _id: newStudent._id,
                surname: newStudent.surname,
                middlename: newStudent.middlename,
                lastname: newStudent.lastname,
                email: newStudent.email,
                role: newStudent.role,
                regNo: newStudent.regNo,
                address: newStudent.address,
                phone: newStudent.phone
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'Student'}).select('-password -_v');
        res.status(200).json(students);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(student);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, regNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || regNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const student = await User.findById(req.params.id);
        if(!student) return res.status(404).json({ message: 'Student not found'})
        student.title = title;
        student.surname = surname;
        student.middlename = middlename;
        student.lastname = lastname;
        student.email = email;
        student.password = password;
        student.role = role;
        student.regNo = regNo;
        student.address = address;
        student.phone = phone;
        const updateUser = await student.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            regNo: updateUser.regNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        await student.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createDean_of_study = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Dean of Study already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Dean_of_study = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Dean_of_study',
            staffNo,
            address,
            phone
        });
        const newDeanOfStudy = await Dean_of_study.save();
        const returnDeanOfStudy = {
            _id: newDeanOfStudy._id,
            title: newDeanOfStudy.title,
            surname: newDeanOfStudy.surname,
            middlename: newDeanOfStudy.middlename,
            lastname: newDeanOfStudy.lastname,
            email: newDeanOfStudy.email,
            password: newDeanOfStudy.password,
            role: newDeanOfStudy.role,
            staffNo: newDeanOfStudy.staffNo,
            address: newDeanOfStudy.address,
            phone: newDeanOfStudy.phone,
        }
        res.status(201).json({ message: 'Dean of Study created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getDean_of_studys = async (req, res) => {
    try {
        const dean_of_studys = await User.find({ role: 'Dean_of_study'}).select('-password -_v');
        res.status(200).json(dean_of_studys);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getDean_of_study = async (req, res) => {
    try {
        const dean_of_study = await User.findById(req.params.id).select('-password -_v');
        res.status(200).json(dean_of_study);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateDean_of_study = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const dean_of_study = await User.findById(req.params.id);
        if(!dean_of_study) return res.status(404).json({ message: 'Dean of dean_of_studystudy not found'})
        dean_of_study.title = title;
        dean_of_study.surname = surname;
        dean_of_study.middlename = middlename;
        dean_of_study.lastname = lastname;
        dean_of_study.email = email;
        dean_of_study.password = password;
        dean_of_study.role = role;
        dean_of_study.staffNo = staffNo;
        dean_of_study.address = address;
        dean_of_study.phone = phone;
        const updateUser = await dean_of_study.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            staffNo: updateUser.staffNo,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Dean of study updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteDean_of_study = async (req, res) => {
    try {
        const dean_of_study = await User.findById(req.params.id);
        if (!dean_of_study) return res.status(404).json({ message: 'Dean of study not found' });
        await dean_of_study.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Dean of study deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createParent = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, staffNo, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || staffNo === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const existingUser = await User.findOne({ email: email, phone: phone, surname: surname })
        if (existingUser) {
            return res.status(400).json({ message: 'Parent already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const Parent = new User({
            title,
            surname,
            middlename,
            lastname,
            email,
            password: hashedPassword,
            role: 'Parent',
            staffNo,
            address,
            phone
        });
        const newParent = await Parent.save();
        const returnParent = {
            _id: newParent._id,
            title: newParent.title,
            surname: newParent.surname,
            middlename: newParent.middlename,
            lastname: newParent.lastname,
            email: newParent.email,
            password: newParent.password,
            role: newParent.role,
            staffNo: newParent.staffNo,
            address: newParent.address,
            phone: newParent.phone,
        }
        res.status(201).json({ message: 'Parent created successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getParents = async (req, res) => {
    try {
        const parents = await User.find({ role: 'Parent'}).select('-password -_v');
        res.status(200).json(parents);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}
exports.getParent = async (req, res) => {
    try {
        const parent = await User.findById(dean_of_studys).select('-password -_v');
        res.status(200).json(parent);
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

exports.updateParent = async (req, res) => {
    try {
        const { title, surname, middlename, lastname, email, password, role, address, phone } = req.body;
        if (title === "" || surname === "" || middlename === "" || lastname === "" || email === "" || password === "" || role === "" || address === "" || phone === "") {
            return res.status(400).json({ message: 'All field are required' })
        }
        const parent = await User.findById(req.params.id);
        if(!parent) return res.status(404).json({ message: 'Parent not found'})
        parent.title = title;
        parent.surname = surname;
        parent.middlename = middlename;
        parent.lastname = lastname;
        parent.email = email;
        parent.password = password;
        parent.role = role;
        parent.address = address;
        parent.phone = phone;
        const updateUser = await parent.save();
        const returnUser = {
            _id: updateUser._id,
            surname: updateUser.surname,
            middlename: updateUser.middlename,
            lastname: updateUser.lastname,
            email: updateUser.email,
            password: updateUser.password,
            role: updateUser.role,
            address: updateUser.address,
            phone: updateUser.phone,
        };
        res.status(200).json({ message: 'Parent updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteParent = async (req, res) => {
    try {
        const parent = await User.findById(req.params.id);
        if (!parent) return res.status(404).json({ message: 'Parent not found' });
        await parent.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Parent deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}