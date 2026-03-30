/**
 * Simple in-memory cache dengan TTL
 * Tidak perlu Redis untuk skala sekolah
 */
const store = new Map();

const cache = {
  get(key) {
    const item = store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      store.delete(key);
      return null;
    }
    return item.value;
  },

  set(key, value, ttlSeconds = 300) {
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  },

  del(key) {
    store.delete(key);
  },

  // Hapus semua cache yang mengandung prefix
  delByPrefix(prefix) {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) store.delete(key);
    }
  },

  clear() {
    store.clear();
  }
};

module.exports = cache;
