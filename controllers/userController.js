const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

module.exports = class UserController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: 'BadRequest', message: 'Email is required' };
      if (!password) throw { name: 'BadRequest', message: 'Password is required' };
      const user = await User.findOne({ where: { email } });
      if (!user || !comparePassword(password, user.password)) throw { name: 'LoginInvalid' };
      res.status(200).json({
        access_token: signToken({ id: user.id }),
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } catch (err) { next(err); }
  }

  // hanya admin; role selalu Staff
  static async addUser(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const user = await User.create({ username, email, password, phoneNumber, address, role: 'Staff' });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err) { next(err); }
  }
};
