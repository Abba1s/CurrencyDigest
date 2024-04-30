const User = require("../models/user");
const JWTService = require("../services/JWTService");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {
  try {
    // getting and verifying access and refresh tokens
    const { accessToken, refreshToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    let id;
    try {
      id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }
    let user;
    try {
      user = await User.findOne({ _id: id });
    } catch (error) {
      next(error);
    }

    const userDto = new UserDTO(user);

    req.user = userDto;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
