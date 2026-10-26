module.exports = {
  async up(q, S) {
    await q.createTable('Genres', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: S.INTEGER },
      name: { type: S.STRING, allowNull: false },
      createdAt: { allowNull: false, type: S.DATE },
      updatedAt: { allowNull: false, type: S.DATE },
    });
  },
  async down(q) { await q.dropTable('Genres'); },
};
