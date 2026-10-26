const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// High-speed In-Memory Cache
const fileCache = new Map();

function getCachedFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const mtime = stats.mtimeMs;
    const cached = fileCache.get(filePath);

    if (cached && cached.mtime === mtime) {
      return cached;
    }

    const rawData = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isCompressible = /^(text\/|application\/javascript|application\/json)/.test(contentType);

    let gzipped = null;
    if (isCompressible) {
      gzipped = zlib.gzipSync(rawData, { level: 6 });
    }

    const entry = {
      mtime,
      size: stats.size,
      etag: `W/"${stats.size}-${mtime}"`,
      raw: rawData,
      gzipped,
      contentType
    };

    fileCache.set(filePath, entry);
    return entry;
  } catch (err) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  const filePath = path.join(__dirname, reqPath);
  const file = getCachedFile(filePath);

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Topilmadi');
    return;
  }

  // HTTP 304 ETag Validation (Instant 0-byte roundtrip)
  if (req.headers['if-none-match'] === file.etag) {
    res.writeHead(304);
    res.end();
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canGzip = file.gzipped && acceptEncoding.includes('gzip');

  const headers = {
    'Content-Type': file.contentType,
    'ETag': file.etag,
    'Vary': 'Accept-Encoding'
  };

  // High performance cache headers
  if (reqPath.endsWith('.html')) {
    headers['Cache-Control'] = 'public, max-age=60, stale-while-revalidate=600';
  } else {
    headers['Cache-Control'] = 'public, max-age=86400, stale-while-revalidate=604800';
  }

  if (canGzip) {
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = file.gzipped.length;
    res.writeHead(200, headers);
    res.end(file.gzipped);
  } else {
    headers['Content-Length'] = file.raw.length;
    res.writeHead(200, headers);
    res.end(file.raw);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Ultra-fast cached server running at http://127.0.0.1:${PORT}/`);
});
