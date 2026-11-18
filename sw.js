const V='libreta-20261118083714';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','firebase-config.js'];
const BYPASS=['firestore.googleapis.com','identitytoolkit.googleapis.com','securetoken.googleapis.com','firebaseinstallations.googleapis.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(BYPASS.includes(u.hostname)||u.pathname.startsWith('/__/'))return;
  const same=u.origin===location.origin;
  if(same&&(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('firebase-config.js'))){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>{
    const net=fetch(r).then(x=>{if(x&&(x.status===200||x.type==='opaque')){const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));}return x;}).catch(()=>m);
    return m||net;
  }));
});
