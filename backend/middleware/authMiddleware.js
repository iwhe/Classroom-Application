// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js");

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    console.log(req.header("Authorization"));
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No Authorization token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({
          message: "Access denied!! User or User Role does not exist",
        });
      }

      req.user = user;
      console.log("Auth Middleware execution success!");
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
