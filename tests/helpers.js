const { sequelize, User, Genre } = require('../models');
const { signToken } = require('../helpers/jwt');

// Reset DB + sediakan admin, 2 staff, 2 genre
exports.setup = async () => {
  await sequelize.sync({ force: true });
  const mk = (username, role) =>
    User.create({ username, email: `${username}@mail.com`, password: `${username}12345`, role, phoneNumber: '0811', address: 'Jakarta' });
  const admin = await mk('admin', 'Admin');
  const staff1 = await mk('staff1', 'Staff');
  const staff2 = await mk('staff2', 'Staff');
  const genres = await Genre.bulkCreate([{ name: 'Action' }, { name: 'Drama' }], { returning: true });
  return {
    admin, staff1, staff2, genres,
    adminToken: signToken({ id: admin.id }),
    staff1Token: signToken({ id: staff1.id }),
    staff2Token: signToken({ id: staff2.id }),
  };
};
exports.close = () => sequelize.close();
