const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const userDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");
const UserDTO = require("../dto/user");
const authController = {
  // ____________________________________REGISTER API_______________________________________//

  async register(req, res, next) {
    const { name, username, email, password } = req.body;

    //validation
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(3).max(15).required(),

      name: Joi.string().min(3).max(15).required(),

      email: Joi.string().min(5).required(),

      password: Joi.string().required(),

      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);
    //if its a validation error
    if (error) {
      return next(error);
    }
    //destructuring the request body

    try {
      //if user already exists
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });
      //if email already exists
      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already exists !",
        };

        return next(error);
      }
      //if username already exists
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username already exists !",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //password hashing

    const hashedPassword = await bcrypt.hash(password, 10);

    //ready to store the user in the databse
    let newUser;
    let accessToken;
    let refreshToken;
    try {
      const newDoc = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });
      newUser = await newDoc.save();
      //JWT WORK
      accessToken = JWTService.signAccessToken({ _id: newUser._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: newUser._id }, "60m");
    } catch (error) {
      return next(error);
    }

    //Store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, newUser._id);

    //sending tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //Res send to the user
    const userDto = new userDTO(newUser);
    return res.status(201).json({ user: userDto, auth: true });
  },

  // ____________________________________LOGIN API__________________________________________//

  async login(req, res, next) {
    const { username, email, password } = req.body;

    const loginUserSchema = Joi.object({
      username: Joi.string().min(3).max(15).required(),
      password: Joi.string().required(),
    });

    const { error } = loginUserSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    let user;
    let accessToken;
    let refreshToken;
    try {
      //if email exists
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          satus: 401,
          message: "Invalid Username",
        };
        return next(error);
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const error = {
          satus: 401,
          message: "Invalid Password",
        };
        return next(error);
      }
      //JWT WORK
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    //update refresh token in db
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        {
          token: refreshToken,
        },
        { upsert: true }
      );
    } catch (error) {}

    //sending tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //response to user

    const userDto = new userDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },

  // ____________________________________LOGOUT API__________________________________________//

  async logout(req, res, next) {
    // console.log(req.user );
    //delete refresh token form db
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //response to user
    return res.status(200).json({ user: null, auth: false });
  },

  // ____________________________________REFRESH TOKEN API____________________________________//

  async refresh(req, res, next) {
    // getting refresh token
    const orignalRefreshToken = req.cookies.refreshToken;

    // verifying refresh tokens
    let id;
    try {
      id = JWTService.verifyRefreshToken(orignalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };
      return next(error);
    }
    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: orignalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    try {
      // generating new tokens
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      // updating db, return response
      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (error) {
      next(error);
    }
    //finding user against the id we get from refresh token
    const user = await User.findOne({ _id: id });
    const userDto = new UserDTO(user);
    //response to user
    res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
