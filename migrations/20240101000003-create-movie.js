module.exports = {
  async up(q, S) {
    await q.createTable('Movies', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: S.INTEGER },
      title: { type: S.STRING, allowNull: false },
      synopsis: { type: S.TEXT, allowNull: false },
      trailerUrl: S.STRING,
      imgUrl: S.STRING,
      rating: S.INTEGER,
      genreId: { type: S.INTEGER, allowNull: false, references: { model: 'Genres', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      authorId: { type: S.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      createdAt: { allowNull: false, type: S.DATE },
      updatedAt: { allowNull: false, type: S.DATE },
    });
  },
  async down(q) { await q.dropTable('Movies'); },
};
