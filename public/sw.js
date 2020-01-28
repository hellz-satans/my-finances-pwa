var VERSION = '0.1.0';

self.addEventListener("install", function(ev) {
  ev.waitUntil(preLoad());
});

var preLoad = function() {
  return caches.open(VERSION).then(function(cache) {
    return cache.addAll([ "/my-finances-pwa/", "/my-finances-pwa/offline.html" ]);
  });
};

self.addEventListener("fetch", function(ev) {
  console.log("fetch:", JSON.stringify(ev));

  caches.match(event.request)
    .then((response) => {
      if (response)
        return response

      return fetch(event.request)
        .then((resp) => {
          return caches.open(VERSION).then((cache) => {
            cache.put(ev.request, resp.clone())
            return resp
          })
        })
    })
});

// delete old caches
self.addEventListener('activate', function(ev) {
  console.log("activate:", ev);
  ev.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== VERSION) {
          return caches.delete(key);
        }
      }));
    })
  );
});
