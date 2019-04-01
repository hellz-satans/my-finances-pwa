var VERSION = '0.0.1';

self.addEventListener("install", function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function() {
  console.log("Installing web app");
  return caches.open(VERSION).then(function(cache) {
    return cache.addAll([ "/", "/my-finances-pwa", "/my-finances-pwa/", "offline.html" ]);
  });
};

self.addEventListener("fetch", function(event) {
  event.respondWith(
    checkResponse(event.request)
      .catch(function() {
        return returnFromCache(event.request);
      })
  );
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request) {
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function(request) {
  return caches.open(VERSION).then(function (cache) {
    return fetch(request).then(function (response) {
      console.log(response.url + " was cached");
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request) {
  return caches.open(VERSION).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status == 404) {
        return cache.match("offline.html");
      } else {
        return matching;
      }
    });
  });
};

// delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== VERSION) {
          return caches.delete(key);
        }
      }));
    })
  );
});
