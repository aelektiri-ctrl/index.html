// Service worker minimal : rend l'application installable.
// Aucune mise en cache, pour que les mises à jour du site restent immédiates.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
