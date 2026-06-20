const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authenticateUser = async (email, password) => {

  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return null;
  }

  return user;
};

module.exports = authenticateUser;