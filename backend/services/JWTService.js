const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/index");
const RefreshToken = require("../models/token");

class JWTService {
  //BEST PRACTICE => Keep the secret key different of the acces and refresh token

  //sign Access Token
  static signAccessToken = (payload, expiryDuration) => {
    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: expiryDuration,
    });
    return token;
  };
  //sign Refresh Token
  static signRefreshToken = (payload, expiryDuration) => {
    const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: expiryDuration,
    });
    return token;
  };
  //verify Access Token
  static verifyAccessToken = (token) => {
    const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return verifiedToken;
  };
  //verify Refresh Token
  static verifyRefreshToken = (token) => {
    const verifiedToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return verifiedToken;
  };

  //store Refresh Token
  static storeRefreshToken = async (token, userId) => {
    try {
      const newToken = new RefreshToken({
        token: token,
        userId: userId,
      });
      //storing in DB
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = JWTService;
