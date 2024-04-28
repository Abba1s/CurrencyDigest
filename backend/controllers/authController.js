const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const userDTO = require("../dto/user");
const UserDTO = require("../dto/user");

const authController = {
  // ____________________________________REGISTER API__________________________________________//

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

    console.log(req.body);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    const newDoc = await newUser.save();

    const userDto = new userDTO(newDoc);

    return res.status(201).json({ user: userDto });
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
      // const {name,username, email} = user;
      result = {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      return next(error);
    }
    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto });
  },
};

module.exports = authController;
