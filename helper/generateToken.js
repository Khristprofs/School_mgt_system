const jwt = require("jsonwebtoken");

const getAuthToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      roles: [user.role],
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const genRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const generateToken = (user) => {

  const authToken = getAuthToken(user);
  const refreshToken = genRefreshToken(user);

  return {
    authToken,
    refreshToken
  };

};

module.exports = generateToken;