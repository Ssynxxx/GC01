const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) throw { name: 'Unauthenticated' };
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) throw { name: 'Unauthenticated' };
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id);
    if (!user) throw { name: 'Unauthenticated' };
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};
