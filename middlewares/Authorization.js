const config = require('config');
const jwt = require('jsonwebtoken');
const ResponseService = require('../services/ResponseService');
const User = require('../models/UserModel');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('Authorized header not found');
    }

    const token = authorization.split(' ');
    /*const user = jwt.verify(token[1], config.JWT_SECRET, (error, data) => {
      if (error) {
        throw error;
      }
      return data;
    });*/

    const decoded  = jwt.verify(token[1], 'name-directory');
    const user  = await User.findOne({ _id:decoded._id, 'tokens.token': token[1]})

    if (!user) {
      throw new Error('Unauthorized');
    }

    req.user = user;
    next();


    /*const redisClient = RedisService.getClient();
    redisClient.hgetall(`user_${user.id}`, (error, data) => {
      try {
        if (error) {
          throw error;
        }
        if (!data) {
          throw new Error('Unauthorized');
        } else if (`bearer ${data.token}` !== authorization && `Bearer ${data.token}` !== authorization) {
          throw new Error('Unauthorized');
        }
        req.user = user;
        next();
      } catch (err) {
        ResponseService.unauthorized(res, err);
      }
    });*/
  } catch (error) {
    ResponseService.unauthorized(res, error);
  }
};
