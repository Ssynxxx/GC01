# P2-Challenge-1 (Server Side) – Movie App

- **Tema aplikasi:** Movie (Netflix / Viu / WeTV style)
- **Stack:** Express.js, Sequelize, PostgreSQL, JWT, bcryptjs, multer + ImageKit, Jest + Supertest
- **Port:** 3000
- **Deployment:** `https://api.domainkamu.com` ← isi setelah deploy
- **API Docs:** lihat [API_DOCS.md](./API_DOCS.md)

## Entitas
- **User** – username, email (unique), password (hash), role (Admin/Staff), phoneNumber, address
- **Movie** – title, synopsis, trailerUrl, imgUrl, rating (min 1), genreId, authorId
- **Genre** – name
- Relasi: User 1–N Movie, Genre 1–N Movie

## Menjalankan lokal
```bash
npm install
cp .env.example .env        # isi kredensial DB, JWT_SECRET, ImageKit
npx sequelize db:create
npm run db:migrate
npm run db:seed             # admin@mail.com / admin12345, staff@mail.com / staff12345
npm run dev
```

## Testing
```bash
npm run test:db   # sekali saja: membuat database <DB_NAME>_test
npm test
```
Upload ImageKit di-mock saat test sehingga tidak memakai jaringan.

## Deployment AWS EC2 (ringkas)
1. Launch EC2 Ubuntu, buka port 22/80/443 di Security Group. Pasang Node.js, PostgreSQL (atau pakai RDS), nginx, git.
2. `git clone` repo, `npm ci --omit=dev`, buat `.env` (`NODE_ENV=production`), lalu `npx sequelize db:migrate` dan `db:seed`.
3. Jalankan dengan pm2: `pm2 start bin/www.js --name movie-api && pm2 save && pm2 startup`.
4. nginx reverse proxy `server_name api.domainkamu.com;` → `proxy_pass http://127.0.0.1:3000;`.
5. Arahkan A record domain ke Elastic IP EC2, lalu SSL: `sudo certbot --nginx -d api.domainkamu.com`.

## Database Supabase (opsional)
1. Ambil **Session pooler** connection string dari Supabase (Project Settings → Database).
2. Isi `.env`: `NODE_ENV=production` dan `DATABASE_URL=...` (jangan di-commit).
3. `npx sequelize db:migrate && npx sequelize db:seed:all` dengan `NODE_ENV=production`.
