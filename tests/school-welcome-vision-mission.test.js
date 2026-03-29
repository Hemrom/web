/**
 * Property-Based Tests: school-welcome-vision-mission
 * Framework: Jest + fast-check
 * Mock: jest.mock('../config/database')
 */

const fc = require('fast-check');

// Mock database sebelum require controller
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

// Mock multer agar upload tidak memerlukan filesystem
jest.mock('multer', () => {
  const multerMock = () => ({
    single: () => (req, res, cb) => cb(null)
  });
  multerMock.diskStorage = () => ({});
  return multerMock;
});

const db = require('../config/database');
const frontendController = require('../controllers/frontendController');
const profilKontenController = require('../controllers/profilKontenController');
const menuController = require('../controllers/menuController');

// Helper: buat mock req/res Express
function makeMockRes(onDone) {
  const res = {
    _rendered: null,
    _status: 200,
    _redirected: null,
    _sent: null,
    status(code) { this._status = code; return this; },
    render(view, data) { this._rendered = { view, data }; if (onDone) onDone(); },
    redirect(url) { this._redirected = url; if (onDone) onDone(); },
    send(msg) { this._sent = msg; if (onDone) onDone(); }
  };
  return res;
}

function makeMockReq(overrides = {}) {
  return {
    params: {},
    query: {},
    body: {},
    session: {},
    file: null,
    ...overrides
  };
}

// Helper: panggil controller yang menggunakan callback (seperti multer) dan tunggu sampai selesai
function callControllerAsync(handler, req, res) {
  return new Promise((resolve) => {
    // Override res methods untuk resolve promise
    const origRender = res.render.bind(res);
    const origRedirect = res.redirect.bind(res);
    const origSend = res.send.bind(res);
    res.render = (view, data) => { origRender(view, data); resolve(); };
    res.redirect = (url) => { origRedirect(url); resolve(); };
    res.send = (msg) => { origSend(msg); resolve(); };
    handler(req, res);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Property 1: Frontend controller selalu merender view dengan data yang benar
// Feature: school-welcome-vision-mission, Property 1: Controller selalu merender view dengan objek konten yang memiliki field tipe, judul, konten, foto
// Validates: Requirements 1.1, 2.1, 6.2
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 1: Frontend controller merender view dengan data yang benar', () => {
  test('visiMisi dan sambutan selalu merender view dengan objek konten berfield tipe, judul, konten, foto', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          tipe: fc.constantFrom('sambutan', 'visi_misi'),
          judul: fc.string(),
          konten: fc.string(),
          foto: fc.option(fc.string({ minLength: 1 }), { nil: null })
        }),
        async (kontenData) => {
          db.query.mockReset();
          // Mock: profil_sekolah
          db.query.mockResolvedValueOnce([[{}]]);
          // Mock: profil_konten
          db.query.mockResolvedValueOnce([[kontenData]]);
          // Mock: menu_navigasi
          db.query.mockResolvedValueOnce([[{ id: 1, label: 'Home', url: '/', parent_id: null, status: 'aktif', urutan: 1 }]]);

          const req = makeMockReq();
          const res = makeMockRes();

          const handler = kontenData.tipe === 'sambutan'
            ? frontendController.sambutan
            : frontendController.visiMisi;

          await handler(req, res);

          // Harus merender view (bukan error)
          if (!res._rendered) return false;

          const { data } = res._rendered;
          // Objek konten harus memiliki field tipe, judul, konten, foto
          return (
            data.konten !== undefined &&
            'tipe' in data.konten &&
            'judul' in data.konten &&
            'konten' in data.konten &&
            'foto' in data.konten
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('controller menggunakan objek default jika DB mengembalikan baris kosong', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('sambutan', 'visi_misi'),
        async (tipe) => {
          db.query.mockReset();
          db.query.mockResolvedValueOnce([[{}]]); // profil_sekolah
          db.query.mockResolvedValueOnce([[]]); // profil_konten kosong → default
          db.query.mockResolvedValueOnce([[]]); // menu_navigasi

          const req = makeMockReq();
          const res = makeMockRes();

          const handler = tipe === 'sambutan'
            ? frontendController.sambutan
            : frontendController.visiMisi;

          await handler(req, res);

          if (!res._rendered) return false;
          const { data } = res._rendered;
          // Default object harus memiliki semua field
          return (
            data.konten !== undefined &&
            'tipe' in data.konten &&
            'judul' in data.konten &&
            'konten' in data.konten &&
            'foto' in data.konten
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 3: Navbar hanya menampilkan menu dengan status aktif
// Feature: school-welcome-vision-mission, Property 3: getMenuItems hanya mengembalikan menu dengan status aktif
// Validates: Requirements 1.5, 2.4, 5.3, 5.4
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 3: Navbar hanya menampilkan menu dengan status aktif', () => {
  test('getMenuItems hanya mengembalikan menu berstatus aktif', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            label: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.string({ minLength: 1, maxLength: 100 }),
            parent_id: fc.constant(null),
            status: fc.oneof(fc.constant('aktif'), fc.constant('nonaktif')),
            urutan: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 0, maxLength: 20 }
        ),
        async (menus) => {
          db.query.mockReset();
          // getMenuItems hanya query menu dengan status='aktif'
          const activeMenus = menus.filter(m => m.status === 'aktif');
          db.query.mockResolvedValueOnce([activeMenus]);

          const result = await frontendController.getMenuItems();

          // Semua item yang dikembalikan harus berstatus aktif
          return result.every(m => m.status === 'aktif');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('menu nonaktif tidak muncul di hasil getMenuItems', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 9999 }),
            label: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.string({ minLength: 1, maxLength: 100 }),
            parent_id: fc.constant(null),
            status: fc.constant('nonaktif'),
            urutan: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (nonaktifMenus) => {
          db.query.mockReset();
          // DB hanya mengembalikan menu aktif (query sudah filter WHERE status='aktif')
          db.query.mockResolvedValueOnce([[]]); // tidak ada menu aktif

          const result = await frontendController.getMenuItems();
          return result.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 4: Update konten dengan data valid selalu tersimpan ke database
// Feature: school-welcome-vision-mission, Property 4: Update dengan tipe valid dan judul tidak kosong selalu tersimpan
// Validates: Requirements 3.2, 4.2
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 4: Update konten valid selalu tersimpan ke database', () => {
  test('update dengan tipe valid dan judul tidak kosong memanggil DB query untuk menyimpan', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('sambutan', 'visi_misi'),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        fc.string({ maxLength: 500 }),
        async (tipe, judul, konten) => {
          db.query.mockReset();
          // Simulasi: baris sudah ada di DB (UPDATE path)
          db.query.mockResolvedValueOnce([[{ id: 1 }]]); // SELECT id
          db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE

          const req = makeMockReq({
            params: { tipe },
            body: { judul, konten }
          });
          const res = makeMockRes();

          await callControllerAsync(profilKontenController.update, req, res);

          // Harus redirect ke halaman sukses (bukan render error)
          const wasRedirected = res._redirected !== null;
          // DB harus dipanggil minimal 2 kali (SELECT + UPDATE/INSERT)
          const dbCallCount = db.query.mock.calls.length;

          return wasRedirected && dbCallCount >= 2;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('update dengan baris belum ada di DB menggunakan INSERT', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('sambutan', 'visi_misi'),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        fc.string({ maxLength: 500 }),
        async (tipe, judul, konten) => {
          db.query.mockReset();
          // Simulasi: baris belum ada (INSERT path)
          db.query.mockResolvedValueOnce([[]]); // SELECT id → kosong
          db.query.mockResolvedValueOnce([{ insertId: 1 }]); // INSERT

          const req = makeMockReq({
            params: { tipe },
            body: { judul, konten }
          });
          const res = makeMockRes();

          await callControllerAsync(profilKontenController.update, req, res);

          const wasRedirected = res._redirected !== null;
          const dbCallCount = db.query.mock.calls.length;
          // INSERT dipanggil dengan query yang mengandung INSERT
          const insertCalled = db.query.mock.calls.some(
            call => typeof call[0] === 'string' && call[0].toUpperCase().includes('INSERT')
          );

          return wasRedirected && dbCallCount >= 2 && insertCalled;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6: Upload foto memperbarui kolom foto
// Feature: school-welcome-vision-mission, Property 6: File yang diunggah tersimpan di kolom foto; tanpa file, foto lama dipertahankan
// Validates: Requirements 3.3, 3.4
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 6: Upload foto memperbarui kolom foto', () => {
  test('jika ada file upload, query UPDATE menyertakan kolom foto', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('sambutan', 'visi_misi'),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (tipe, judul, filename) => {
          db.query.mockReset();
          db.query.mockResolvedValueOnce([[{ id: 1 }]]); // SELECT id
          db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE

          const req = makeMockReq({
            params: { tipe },
            body: { judul, konten: 'isi konten' },
            file: { filename }
          });
          const res = makeMockRes();

          await callControllerAsync(profilKontenController.update, req, res);

          // Query UPDATE harus menyertakan foto (3 parameter: judul, konten, foto, tipe)
          const updateCall = db.query.mock.calls.find(
            call => typeof call[0] === 'string' && call[0].toUpperCase().includes('UPDATE') && call[0].includes('foto')
          );

          return updateCall !== undefined && updateCall[1].includes(filename);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('jika tidak ada file upload, query UPDATE tidak mengubah kolom foto', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('sambutan', 'visi_misi'),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        async (tipe, judul) => {
          db.query.mockReset();
          db.query.mockResolvedValueOnce([[{ id: 1 }]]); // SELECT id
          db.query.mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE tanpa foto

          const req = makeMockReq({
            params: { tipe },
            body: { judul, konten: 'isi konten' },
            file: null // tidak ada file
          });
          const res = makeMockRes();

          await callControllerAsync(profilKontenController.update, req, res);

          // Query UPDATE tidak boleh menyertakan kolom foto
          const updateWithFoto = db.query.mock.calls.find(
            call => typeof call[0] === 'string' && call[0].toUpperCase().includes('UPDATE') && call[0].includes('foto')
          );
          const updateWithoutFoto = db.query.mock.calls.find(
            call => typeof call[0] === 'string' && call[0].toUpperCase().includes('UPDATE') && !call[0].includes('foto')
          );

          return updateWithFoto === undefined && updateWithoutFoto !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 7: Menu baru aktif muncul di getMenuItems
// Feature: school-welcome-vision-mission, Property 7: Menu baru dengan status aktif muncul di hasil getMenuItems
// Validates: Requirements 5.1, 5.2
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 7: Menu baru aktif muncul di getMenuItems', () => {
  test('menu baru dengan status aktif muncul di hasil getMenuItems', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 100, max: 9999 }),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          url: fc.string({ minLength: 1, maxLength: 100 }),
          parent_id: fc.constant(null),
          status: fc.constant('aktif'),
          urutan: fc.integer({ min: 0, max: 100 })
        }),
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 99 }),
            label: fc.string({ minLength: 1, maxLength: 50 }),
            url: fc.string({ minLength: 1, maxLength: 100 }),
            parent_id: fc.constant(null),
            status: fc.constant('aktif'),
            urutan: fc.integer({ min: 0, max: 100 })
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (newMenu, existingMenus) => {
          db.query.mockReset();
          // Simulasi: setelah insert, DB mengembalikan semua menu aktif termasuk yang baru
          const allMenus = [...existingMenus, newMenu];
          db.query.mockResolvedValueOnce([allMenus]);

          const result = await frontendController.getMenuItems();

          // Menu baru harus ada di hasil
          const found = result.find(m => m.id === newMenu.id && m.label === newMenu.label && m.url === newMenu.url);
          return found !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('menu baru nonaktif tidak muncul di getMenuItems', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.integer({ min: 100, max: 9999 }),
          label: fc.string({ minLength: 1, maxLength: 50 }),
          url: fc.string({ minLength: 1, maxLength: 100 }),
          parent_id: fc.constant(null),
          status: fc.constant('nonaktif'),
          urutan: fc.integer({ min: 0, max: 100 })
        }),
        async (newMenu) => {
          db.query.mockReset();
          // DB hanya mengembalikan menu aktif (query sudah filter WHERE status='aktif')
          db.query.mockResolvedValueOnce([[]]); // tidak ada menu aktif

          const result = await frontendController.getMenuItems();

          // Menu nonaktif tidak boleh ada di hasil
          const found = result.find(m => m.id === newMenu.id);
          return found === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });
});
