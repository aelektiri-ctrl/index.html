/* Res-CUE : compatibilité anciens navigateurs (Xiaomi, Samsung, Android anciens) + installation de l'application */
(function () {
  'use strict';
  /* 1) « inset » n'existe pas sur les anciens navigateurs : on le traduit en top / right / bottom / left */
  var ok = false;
  try { ok = !!(window.CSS && CSS.supports && CSS.supports('inset', '0')); } catch (e) {}
  if (!ok) {
    var split = function (v) { var out = [], d = 0, cur = ''; for (var i = 0; i < v.length; i++) { var c = v[i]; if (c === '(') d++; if (c === ')') d--; if (c === ' ' && d === 0) { if (cur) out.push(cur); cur = ''; } else cur += c; } if (cur) out.push(cur); return out; };
    var conv = function (css) {
      return css.replace(/(^|[;{\s])inset\s*:\s*([^;}!]+)(!important)?/g, function (m, pre, val, imp) {
        var p = split(val.trim()), t = p[0], r = p[1] || t, b = p[2] || t, l = p[3] || r; imp = imp || '';
        return pre + 'top:' + t + imp + ';right:' + r + imp + ';bottom:' + b + imp + ';left:' + l + imp;
      });
    };
    var fixStyle = function (el) { if (el.__rcfx) return; el.__rcfx = 1; var t = el.textContent; if (t && t.indexOf('inset') > -1) { var n = conv(t); if (n !== t) el.textContent = n; } };
    var fixAttr = function (el) { var s = el.getAttribute && el.getAttribute('style'); if (!s || s.indexOf('inset') < 0) return; var n = conv(';' + s).slice(1); if (n !== s) el.setAttribute('style', n); };
    var fixLink = function (ln) {
      if (ln.__rcfx || !/stylesheet/.test(ln.rel || '')) return; ln.__rcfx = 1;
      if (ln.href.indexOf(location.origin) !== 0) return;
      var x = new XMLHttpRequest(); x.open('GET', ln.href); x.onload = function () { if (x.status === 200 && x.responseText.indexOf('inset') > -1) { var s = document.createElement('style'); s.__rcfx = 1; s.textContent = conv(x.responseText); ln.parentNode && ln.parentNode.insertBefore(s, ln.nextSibling); } }; x.send();
    };
    var scan = function (root) {
      if (root.nodeType !== 1) return;
      if (root.tagName === 'STYLE') fixStyle(root); else if (root.tagName === 'LINK') fixLink(root); else fixAttr(root);
      var a = root.querySelectorAll ? root.querySelectorAll('style,link,[style]') : [];
      for (var i = 0; i < a.length; i++) { var n = a[i]; if (n.tagName === 'STYLE') fixStyle(n); else if (n.tagName === 'LINK') fixLink(n); else fixAttr(n); }
    };
    try {
      new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var m = ms[i]; if (m.type === 'attributes') fixAttr(m.target); else for (var j = 0; j < m.addedNodes.length; j++) scan(m.addedNodes[j]); } })
        .observe(document.documentElement, {childList: true, subtree: true, attributes: true, attributeFilter: ['style']});
    } catch (e) {}
    scan(document.documentElement);
    document.addEventListener('DOMContentLoaded', function () { scan(document.documentElement); });
  }
  /* 2) hauteur réelle de l'écran (barres du navigateur) */
  var vh = function () { document.documentElement.style.setProperty('--vh', window.innerHeight + 'px'); };
  vh(); window.addEventListener('resize', vh);

  /* 3) Installation de l'application */
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone) return;
  var ua = navigator.userAgent, ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var deferred = null, shown = false;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; show(); });
  window.addEventListener('appinstalled', function () { try { localStorage.setItem('rcInst', 'ok'); } catch (e) {} hide(); });
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var hide = function () { ['rcInst', 'rcInstH'].forEach(function (i) { var b = document.getElementById(i); if (b) b.parentNode.removeChild(b); }); };
  function howTo() {
    if (ios) return 'Touche <b>Partager ⎋</b> en bas de Safari, puis <b>« Sur l’écran d’accueil »</b>.';
    if (/SamsungBrowser/.test(ua)) return 'Touche le menu <b>≡</b> en bas, puis <b>« Ajouter page à »</b> › <b>« Écran d’accueil »</b>.';
    if (/MiuiBrowser|XiaoMi/i.test(ua)) return 'Touche le menu <b>⋮</b> ou <b>≡</b>, puis <b>« Ajouter à l’écran d’accueil »</b>. Pour une installation complète, ouvre plutôt le lien dans <b>Google Chrome</b>.';
    if (/Firefox/.test(ua)) return 'Touche le menu <b>⋮</b>, puis <b>« Installer »</b> ou <b>« Ajouter à l’écran d’accueil »</b>.';
    return 'Touche le menu <b>⋮</b> en haut à droite, puis <b>« Installer l’application »</b> ou <b>« Ajouter à l’écran d’accueil »</b>.';
  }
  function show() {
    if (shown || get('rcInst') === 'ok') return;
    var later = +(get('rcInstLater') || 0); if (Date.now() - later < 864e5) return;
    if (!document.body || document.getElementById('gate6') || !get('rc')) { setTimeout(show, 2500); return; }
    shown = true;
    var d = document.createElement('div'); d.id = 'rcInst';
    d.setAttribute('style', 'position:fixed;right:10px;top:calc(112px + env(safe-area-inset-top));z-index:6;display:flex;align-items:center;background:#39d98a;color:#04140c;border-radius:999px;box-shadow:0 4px 14px rgba(0,0,0,.45);font:700 13px system-ui,sans-serif');
    d.innerHTML = '<button id="rcInstGo" style="border:0;background:none;color:#04140c;font:800 13px system-ui,sans-serif;padding:8px 4px 8px 12px">📲 Installer l’appli</button><button id="rcInstX" aria-label="Plus tard" style="border:0;background:none;color:#04140c;font-size:13px;padding:8px 10px 8px 6px;opacity:.7">✕</button>';
    document.body.appendChild(d);
    document.getElementById('rcInstGo').onclick = function () {
      if (deferred) { deferred.prompt(); deferred.userChoice.then(function (c) { if (c && c.outcome === 'accepted') { try { localStorage.setItem('rcInst', 'ok'); } catch (e) {} hide(); } deferred = null; }); return; }
      var h = document.getElementById('rcInstH'); if (h) { h.parentNode.removeChild(h); return; }
      h = document.createElement('div'); h.id = 'rcInstH';
      h.setAttribute('style', 'position:fixed;right:10px;left:22%;top:calc(152px + env(safe-area-inset-top));z-index:6;background:#fff;color:#0b0f14;border-radius:14px;padding:10px 12px;font:500 13px/1.35 system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.45)');
      h.innerHTML = howTo(); document.body.appendChild(h); setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 9000);
    };
    document.getElementById('rcInstX').onclick = function () { try { localStorage.setItem('rcInstLater', String(Date.now())); } catch (e) {} hide(); };
  }
  /* navigateurs sans installation automatique : on montre la marche à suivre */
  setTimeout(function () { if (!deferred) show(); }, 6000);
  window.rcInstall = function () { shown = false; try { localStorage.removeItem('rcInstLater'); } catch (e) {} show(); };
})();
