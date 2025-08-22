let fileMap = {};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("message", (event) => {
  if (event.data.type === "load-zip") {
    fileMap = event.data.files;
  }
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  if (url.startsWith("zip:///")) {
    const path = url.replace("zip:///", "");
    const blobUrl = fileMap[path];
    if (blobUrl) {
      event.respondWith(fetch(blobUrl));
    }
  }
});
