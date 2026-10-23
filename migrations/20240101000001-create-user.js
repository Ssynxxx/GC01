module.exports = {
  async up(q, S) {
    await q.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: S.INTEGER },
      username: S.STRING,
      email: { type: S.STRING, allowNull: false, unique: true },
      password: { type: S.STRING, allowNull: false },
      role: { type: S.STRING, defaultValue: 'Staff' },
      phoneNumber: S.STRING,
      address: S.STRING,
      createdAt: { allowNull: false, type: S.DATE },
      updatedAt: { allowNull: false, type: S.DATE },
    });
  },
  async down(q) { await q.dropTable('Users'); },
};
