const API_KEY = 'AIzaSyCz7f0X_giaGyC9u1EfGZPBuAC9nXiL5Mo'; // ★自分のAPIキーに置き換えてください
let nextPageToken = '';
let currentQuery = '';
const videoContainer = document.getElementById('video-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// 検索フォーム送信時
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  currentQuery = searchInput.value.trim();
  videoContainer.innerHTML = '';
  nextPageToken = '';
  if (currentQuery) {
    fetchVideos(currentQuery);
  }
});

// YouTube APIから動画取得
async function fetchVideos(query) {
  const endpoint = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: 10,
    pageToken: nextPageToken
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`);
    const data = await response.json();
    nextPageToken = data.nextPageToken || '';
    renderVideos(data.items);
  } catch (error) {
    console.error('動画取得エラー:', error);
    videoContainer.innerHTML += `<p class="error">動画の取得に失敗しました。</p>`;
  }
}

// 動画リストをHTMLにレンダリング
function renderVideos(items) {
  items.forEach(item => {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const thumbnail = item.snippet.thumbnails.medium.url;

    const videoElem = document.createElement('div');
    videoElem.className = 'video-item';
    videoElem.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
        <img src="${thumbnail}" alt="${title}" />
        <p>${title}</p>
      </a>
    `;
    videoContainer.appendChild(videoElem);
  });
}

// 無限スクロール実装
window.addEventListener('scroll', () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 200;
  if (scrollPosition >= threshold && currentQuery) {
    fetchVideos(currentQuery);
  }
});

// Service Worker 登録（PWA）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker 登録成功:', reg.scope))
      .catch(err => console.warn('❌ Service Worker 登録失敗:', err));
  });
}
