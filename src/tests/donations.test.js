const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Generate token untuk simulasi admin login
const token = jwt.sign(
  { id: 1, email: 'admin@iom.com' },
  process.env.SECRET_KEYS || 'local-dev-secret'
);

const authHeader = { Authorization: `Bearer ${token}` };

let createdId;

// ─────────────────────────────────────────────
// 1. READ
// ─────────────────────────────────────────────
describe('1. Read — Tampil Data', () => {
  test('Data donasi tampil dalam bentuk tabel', async () => {
    const res = await request(app)
      .get('/donations/admin')
      .set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Pagination — response memiliki properti pagination', async () => {
    const res = await request(app)
      .get('/donations/admin')
      .set(authHeader);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('currentPage');
    expect(res.body.pagination).toHaveProperty('totalPages');
    expect(res.body.pagination).toHaveProperty('start');
    expect(res.body.pagination).toHaveProperty('end');
    expect(res.body.pagination).toHaveProperty('totalEntries');
  });

  test('Showing X to Y of Z Entries — nilai start dan end sesuai', async () => {
    const res = await request(app)
      .get('/donations/admin?page=1&limit=5')
      .set(authHeader);
    const { start, end, totalEntries } = res.body.pagination;
    expect(start).toBe(1);
    expect(end).toBeLessThanOrEqual(Math.min(5, totalEntries));
  });

  test('Search by nama — filter berfungsi', async () => {
    const res = await request(app)
      .get('/donations/admin?search=a')
      .set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('Sort by Tanggal Donasi (orderBy=date)', async () => {
    const res = await request(app)
      .get('/donations/admin?orderBy=date&sort=DESC')
      .set(authHeader);
    expect(res.statusCode).toBe(200);
  });

  test('Sort by Tanggal Dibuat (orderBy=createdAt)', async () => {
    const res = await request(app)
      .get('/donations/admin?orderBy=createdAt&sort=ASC')
      .set(authHeader);
    expect(res.statusCode).toBe(200);
  });

  test('Limit per halaman — limit=5', async () => {
    const res = await request(app)
      .get('/donations/admin?limit=5')
      .set(authHeader);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  test('Limit per halaman — limit=10', async () => {
    const res = await request(app)
      .get('/donations/admin?limit=10')
      .set(authHeader);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });

  test('Limit per halaman — limit=20', async () => {
    const res = await request(app)
      .get('/donations/admin?limit=20')
      .set(authHeader);
    expect(res.body.data.length).toBeLessThanOrEqual(20);
  });
});

// ─────────────────────────────────────────────
// 2. CREATE
// ─────────────────────────────────────────────
describe('2. Create', () => {
  test('Berhasil submit dengan semua field wajib → 201 Created', async () => {
    const res = await request(app)
      .post('/donations')
      .set(authHeader)
      .send({
        name: 'Test Donatur',
        email: 'test@donatur.com',
        noWhatsapp: '081234567890',
        amount: 100000,
        date: '2026-04-04',
        bank: 'BCA',
        notification: ['whatsapp'],
        nameIsHidden: false,
        isHambaAllah: false,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    createdId = res.body.data.id;
  });

  test('Submit tanpa field name → error dari server', async () => {
    const res = await request(app)
      .post('/donations')
      .set(authHeader)
      .send({
        email: 'test@donatur.com',
        noWhatsapp: '081234567890',
        notification: ['whatsapp'],
      });
    expect(res.statusCode).toBe(400);
  });

  test('Submit tanpa email dan noWhatsapp → error dari server', async () => {
    const res = await request(app)
      .post('/donations')
      .set(authHeader)
      .send({
        name: 'Test Donatur',
        notification: ['whatsapp'],
      });
    expect(res.statusCode).toBe(400);
  });

  test('Submit tanpa JWT → 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/donations')
      .send({ name: 'Test', notification: ['whatsapp'], email: 'a@b.com' });
    expect(res.statusCode).toBe(401);
  });

  test('Checkbox Sembunyikan Nama & Hamba Allah bisa diset', async () => {
    const res = await request(app)
      .post('/donations')
      .set(authHeader)
      .send({
        name: 'Donatur Anonim',
        email: 'anonim@donatur.com',
        noWhatsapp: '081234567891',
        amount: 50000,
        date: '2026-04-04',
        bank: 'Mandiri',
        notification: ['email'],
        nameIsHidden: true,
        isHambaAllah: true,
      });
    expect(res.statusCode).toBe(201);
    // Hapus data uji ini
    await request(app)
      .delete(`/donations/${res.body.data.id}`)
      .set(authHeader);
  });

  test('Notifikasi via whatsapp dan email (multi checkbox)', async () => {
    const res = await request(app)
      .post('/donations')
      .set(authHeader)
      .send({
        name: 'Multi Notif',
        email: 'multi@donatur.com',
        noWhatsapp: '081234567892',
        amount: 75000,
        date: '2026-04-04',
        bank: 'BNI',
        notification: ['whatsapp', 'email'],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.notification).toContain('whatsapp');
    expect(res.body.data.notification).toContain('email');
    // Hapus data uji ini
    await request(app)
      .delete(`/donations/${res.body.data.id}`)
      .set(authHeader);
  });
});

// ─────────────────────────────────────────────
// 3. UPDATE
// ─────────────────────────────────────────────
describe('3. Update', () => {
  test('Update field teks (nama) → tersimpan', async () => {
    const res = await request(app)
      .put(`/donations/${createdId}`)
      .set(authHeader)
      .send({ name: 'Nama Diupdate' });
    expect(res.statusCode).toBe(200);
  });

  test('Update tanpa ganti bukti bayar → proof lama tetap', async () => {
    const getRes = await request(app)
      .get(`/donations/${createdId}`)
      .set(authHeader);
    const proofBefore = getRes.body.data?.proof;

    await request(app)
      .put(`/donations/${createdId}`)
      .set(authHeader)
      .send({ name: 'Update Tanpa Proof' });

    const getRes2 = await request(app)
      .get(`/donations/${createdId}`)
      .set(authHeader);
    expect(getRes2.body.data?.proof).toBe(proofBefore);
  });

  test('Upload bukti bayar baru → 200 OK', async () => {
    const dummyImagePath = path.join(__dirname, 'dummy.jpg');
    // Buat dummy image file sementara
    fs.writeFileSync(dummyImagePath, Buffer.from('dummy image content'));

    const res = await request(app)
      .put(`/donations/${createdId}`)
      .set(authHeader)
      .attach('proof', dummyImagePath);

    fs.unlinkSync(dummyImagePath);
    expect(res.statusCode).toBe(200);
  });

  test('Submit tanpa mengubah field apapun → 400 Bad Request', async () => {
    const res = await request(app)
      .put(`/donations/${createdId}`)
      .set(authHeader)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('Update ID yang tidak ada → 404 Not Found', async () => {
    const res = await request(app)
      .put('/donations/999999')
      .set(authHeader)
      .send({ name: 'Tidak Ada' });
    expect(res.statusCode).toBe(404);
  });

  test('Update tanpa JWT → 401 Unauthorized', async () => {
    const res = await request(app)
      .put(`/donations/${createdId}`)
      .send({ name: 'Tanpa Auth' });
    expect(res.statusCode).toBe(401);
  });
});

// ─────────────────────────────────────────────
// 4. DELETE
// ─────────────────────────────────────────────
describe('4. Delete', () => {
  test('Delete berhasil → 200 OK', async () => {
    const res = await request(app)
      .delete(`/donations/${createdId}`)
      .set(authHeader);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Donation deleted successfully');
  });

  test('Delete ID yang tidak ada → 404 Not Found', async () => {
    const res = await request(app)
      .delete('/donations/999999')
      .set(authHeader);
    expect(res.statusCode).toBe(404);
  });

  test('Delete tanpa JWT → 401 Unauthorized', async () => {
    const res = await request(app)
      .delete(`/donations/${createdId}`);
    expect(res.statusCode).toBe(401);
  });
});
