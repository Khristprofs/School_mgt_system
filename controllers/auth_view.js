const authenticateUser = require('../helper/authenticateUser');
const generateToken = require('../helper/generateToken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { authToken, refreshToken } = generateToken(user);

    // refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true only in production https
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          title: user.title,
          surname: user.surname,
          middlename: user.middlename,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          staffNo: user.staffNo,
          regNo: user.regNo,
          address: user.address,
          phone: user.phone,
        },
        accessToken: authToken,
      },
    });

  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {

    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};