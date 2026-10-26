const request = require('supertest');
const app = require('../app');
const { Movie } = require('../models');
const { setup, close } = require('./helpers');

let ctx;
beforeAll(async () => {
  ctx = await setup();
  // 20 data: ganjil -> Action, genap -> Drama
  for (let i = 1; i <= 20; i++) {
    await Movie.create({
      title: `Movie ${i}`, synopsis: `Synopsis ${i}`, rating: 3,
      genreId: ctx.genres[i % 2 === 1 ? 0 : 1].id, authorId: ctx.admin.id,
    });
  }
});
afterAll(close);

describe('Endpoint List public site (3 test)', () => {
  it('berhasil mendapatkan Entitas Utama tanpa query filter parameter', async () => {
    const res = await request(app).get('/pub/movies');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body).toMatchObject({ page: 1, totalData: 20, totalPage: 2 });
  });
  it('berhasil mendapatkan Entitas Utama dengan 1 query filter parameter', async () => {
    const res = await request(app).get(`/pub/movies?genreId=${ctx.genres[0].id}`);
    expect(res.status).toBe(200);
    expect(res.body.totalData).toBe(10);
    expect(res.body.data.every((m) => m.genreId === ctx.genres[0].id)).toBe(true);
  });
  it('berhasil mendapatkan Entitas Utama dengan panjang sesuai pada page tertentu', async () => {
    const res = await request(app).get('/pub/movies?page=2&sort=ASC');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.data[0].title).toBe('Movie 11');
  });
});

describe('Endpoint Detail public site (2 test)', () => {
  it('berhasil mendapatkan 1 Entitas Utama sesuai params id', async () => {
    const list = await request(app).get('/pub/movies');
    const id = list.body.data[0].id;
    const res = await request(app).get(`/pub/movies/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });
  it('gagal karena params id tidak ada di database / invalid', async () => {
    const res = await request(app).get('/pub/movies/99999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Movie not found');
  });
});