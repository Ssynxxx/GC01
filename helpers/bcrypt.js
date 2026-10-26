const bcrypt = require('bcryptjs');
module.exports = {
  hashPassword: (plain) => bcrypt.hashSync(plain, 10),
  comparePassword: (plain, hash) => bcrypt.compareSync(plain, hash),
};
