const request = require('supertest');
const app = require('../app');
const { Movie } = require('../models');
const { setup, close } = require('./helpers');

let ctx, m1, m2; // m1 milik staff1, m2 milik staff2
const auth = (t) => ({ Authorization: `Bearer ${t}` });
const valid = () => ({ title: 'Film Baru', synopsis: 'Cerita', rating: 5, genreId: ctx.genres[0].id });

beforeAll(async () => {
  ctx = await setup();
  m1 = await Movie.create({ ...valid(), title: 'M1', authorId: ctx.staff1.id });
  m2 = await Movie.create({ ...valid(), title: 'M2', authorId: ctx.staff2.id });
});
afterAll(close);

describe('Create (4 test)', () => {
  it('berhasil membuat entitas utama', async () => {
    const res = await request(app).post('/movies').set(auth(ctx.staff1Token)).send(valid());
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Film Baru');
  });
  it('gagal karena belum login', async () => {
    const res = await request(app).post('/movies').send(valid());
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });
  it('gagal karena token tidak valid', async () => {
    const res = await request(app).post('/movies').set(auth('tokenacak')).send(valid());
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });
  it('gagal ketika request body tidak sesuai (validation required)', async () => {
    const res = await request(app).post('/movies').set(auth(ctx.staff1Token)).send({ ...valid(), title: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Title is required');
  });
});

describe('Update PUT (6 test)', () => {
  const body = () => ({ ...valid(), title: 'Updated' });
  it('berhasil mengupdate berdasarkan params id', async () => {
    const res = await request(app).put(`/movies/${m1.id}`).set(auth(ctx.staff1Token)).send(body());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated');
  });
  it('gagal karena belum login', async () => {
    const res = await request(app).put(`/movies/${m1.id}`).send(body());
    expect(res.status).toBe(401);
  });
  it('gagal karena token tidak valid', async () => {
    const res = await request(app).put(`/movies/${m1.id}`).set(auth('tokenacak')).send(body());
    expect(res.status).toBe(401);
  });
  it('gagal karena id entity tidak terdapat di database', async () => {
    const res = await request(app).put('/movies/99999').set(auth(ctx.adminToken)).send(body());
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Movie not found');
  });
  it('gagal ketika Staff mengolah data entity yang bukan miliknya', async () => {
    const res = await request(app).put(`/movies/${m2.id}`).set(auth(ctx.staff1Token)).send(body());
    expect(res.status).toBe(403);
  });
  it('gagal ketika request body tidak sesuai', async () => {
    const res = await request(app).put(`/movies/${m1.id}`).set(auth(ctx.staff1Token)).send({ ...body(), synopsis: '' });
    expect(res.status).toBe(400);
  });
});

describe('Delete (5 test)', () => {
  it('berhasil menghapus berdasarkan params id', async () => {
    const res = await request(app).delete(`/movies/${m1.id}`).set(auth(ctx.staff1Token));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Movie success to delete');
  });
  it('gagal karena belum login', async () => {
    const res = await request(app).delete(`/movies/${m2.id}`);
    expect(res.status).toBe(401);
  });
  it('gagal karena token tidak valid', async () => {
    const res = await request(app).delete(`/movies/${m2.id}`).set(auth('tokenacak'));
    expect(res.status).toBe(401);
  });
  it('gagal karena id entity tidak terdapat di database', async () => {
    const res = await request(app).delete('/movies/99999').set(auth(ctx.adminToken));
    expect(res.status).toBe(404);
  });
  it('gagal ketika Staff menghapus entity yang bukan miliknya', async () => {
    const res = await request(app).delete(`/movies/${m2.id}`).set(auth(ctx.staff1Token));
    expect(res.status).toBe(403);
  });
});