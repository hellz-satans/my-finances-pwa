var VERSION = '0.0.4';

self.addEventListener("install", function(ev) {
  console.log("install:", ev);
  ev.waitUntil(preLoad());
});

var preLoad = function() {
  console.log("[preload] Installing web app");
  return caches.open(VERSION).then(function(cache) {
    return cache.addAll([ "/my-finances-pwa/", "/my-finances-pwa/offline.html" ]);
  });
};

self.addEventListener("fetch", function(ev) {
  console.log("fetch:", JSON.stringify(ev));
  ev.respondWith(
    checkResponse(ev.request)
      .catch(function() {
        return returnFromCache(ev.request);
      })
  );
  ev.waitUntil(addToCache(ev.request))
    .catch(function(err) {
      console.error("Could not add to cache");
    });
});

var checkResponse = function(request) {
  console.log("checkResponse:", JSON.stringify(request));
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
  console.log("addToCache:", JSON.stringify(request));
  return caches.open(VERSION).then(function (cache) {
    return fetch(request)
      .then(function (response) {
        console.log(response.url + " was cached");
        return cache.put(request, response);
      })
      .catch(function(err) {
        console.error("Could not cache " + request.url, err);
      });
  })
  .catch(function(err) {
    console.error("Could not open cache.", err);
  });
};

var returnFromCache = function(request) {
  console.log("returnFromCache:", request);
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
