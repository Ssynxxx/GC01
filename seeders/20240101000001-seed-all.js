const { hashPassword } = require('../helpers/bcrypt');
const now = new Date();
module.exports = {
  async up(q) {
    await q.bulkInsert('Users', [
      { username: 'admin', email: 'admin@mail.com', password: hashPassword('admin12345'), role: 'Admin', phoneNumber: '081111111111', address: 'Jakarta', createdAt: now, updatedAt: now },
      { username: 'staff', email: 'staff@mail.com', password: hashPassword('staff12345'), role: 'Staff', phoneNumber: '082222222222', address: 'Bandung', createdAt: now, updatedAt: now },
    ]);
    const genres = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'];
    await q.bulkInsert('Genres', genres.map((name) => ({ name, createdAt: now, updatedAt: now })));
    const movies = Array.from({ length: 15 }, (_, i) => ({
      title: `Sample Movie ${i + 1}`,
      synopsis: `Synopsis untuk sample movie ${i + 1}.`,
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imgUrl: 'https://placehold.co/300x450',
      rating: (i % 5) + 1,
      genreId: (i % genres.length) + 1,
      authorId: (i % 2) + 1,
      createdAt: new Date(now.getTime() + i * 1000),
      updatedAt: now,
    }));
    await q.bulkInsert('Movies', movies);
  },
  async down(q) {
    await q.bulkDelete('Movies', null, { truncate: true, cascade: true, restartIdentity: true });
    await q.bulkDelete('Genres', null, { truncate: true, cascade: true, restartIdentity: true });
    await q.bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true });
  },
};
