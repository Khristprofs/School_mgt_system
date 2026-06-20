const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const verifyRoles = require("../middleware/verifyRole");
const ROLES_LIST = require("../helper/roleList");
const studentDashboardController = require("../controllers/studentDashboard_view");

router.get("/stats", authenticateToken,
  verifyRoles(ROLES_LIST.Student),
  studentDashboardController.getDashboardStats
);

module.exports = router;