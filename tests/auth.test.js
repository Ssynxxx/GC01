const request = require('supertest');
const app = require('../app');
const { setup, close } = require('./helpers');

beforeAll(async () => { await setup(); });
afterAll(close);

describe('POST /login (5 test)', () => {
  it('berhasil login dan mengirimkan access_token', async () => {
    const res = await request(app).post('/login').send({ email: 'admin@mail.com', password: 'admin12345' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('access_token', expect.any(String));
  });
  it('email tidak diberikan / tidak diinput', async () => {
    const res = await request(app).post('/login').send({ password: 'admin12345' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email is required');
  });
  it('password tidak diberikan / tidak diinput', async () => {
    const res = await request(app).post('/login').send({ email: 'admin@mail.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Password is required');
  });
  it('email diberikan invalid / tidak terdaftar', async () => {
    const res = await request(app).post('/login').send({ email: 'x@mail.com', password: 'admin12345' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
  it('password diberikan salah / tidak match', async () => {
    const res = await request(app).post('/login').send({ email: 'admin@mail.com', password: 'salah' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});