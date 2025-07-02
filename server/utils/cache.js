const cache = new Map();

function getFromCache(key) {
    const cached = cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > 10 * 60 * 1000) {
        cache.delete(key); // expired
        return null;
    }

    return cached.value;
}

function setInCache(key, value) {
    cache.set(key, {
        value,
        timestamp: Date.now(),
    });
}

module.exports = { getFromCache, setInCache };
