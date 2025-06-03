const CACHE_NAME = 'sennin-tube-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/notosansjp/v39/-F63fjptAgt5VM-kVkqdyU8n3kw.ttf'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// アクティベーション時に古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// リクエスト時のキャッシュ戦略
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse =>
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          })
        ).catch(() => {
          return caches.match('/offline.html'); // オフライン時の代替ページがある場合
        })
      );
    })
  );
});
