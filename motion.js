/* Meal POPs motion: smooth reveals plus a little pop.
   Add to any page with: <script src="/motion.js" defer></script>
   Turns itself off for visitors who ask their device for reduced motion. */
(function () {
  if (window.__mpMotion) return; window.__mpMotion = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document.documentElement;

  var POP = 'cubic-bezier(.25,1.12,.5,1)', EASE = 'cubic-bezier(.16,1,.3,1)';
  var css = [
    'html{scroll-behavior:smooth}',
    /* page enter and leave */
    'html.mp-m body{animation:mpIn .8s ' + EASE + ' backwards}',
    'html.mp-m.mp-leave body{opacity:0;transition:opacity .28s ease}',
    '@keyframes mpIn{from{opacity:0;translate:0 6px}to{opacity:1;translate:0 0}}',
    /* scroll reveals: smooth fade up, or poppy scale in */
    'html.mp-m .mp-r{opacity:0;translate:0 18px;transition:opacity 1s ' + EASE + ',translate 1.1s ' + EASE + ';transition-delay:var(--d,0s)}',
    'html.mp-m .mp-p{opacity:0;scale:.97;translate:0 20px;transition:opacity .9s ' + EASE + ',scale 1.1s ' + POP + ',translate 1.1s ' + EASE + ',box-shadow .25s ease;transition-delay:var(--d,0s)}',
    'html.mp-m .mp-r.mp-on,html.mp-m .mp-p.mp-on{opacity:1;translate:0 0;scale:1}',
    /* header slides down */
    'html.mp-m .mp-hd{animation:mpDown .9s ' + EASE + ' both}',
    '@keyframes mpDown{from{opacity:0;translate:0 -12px}to{opacity:1;translate:0 0}}',
    /* buttons and cards: lift on hover, squish on press */
    '.mp-btn{transition:translate .45s ' + EASE + ',scale .3s ' + EASE + ',box-shadow .45s ' + EASE + ',filter .3s ease}',
    '.mp-btn:hover{translate:0 -2px;box-shadow:0 10px 24px -12px rgba(29,27,22,.35);filter:brightness(1.03)}',
    '.mp-btn:active{scale:.98;translate:0 0;box-shadow:none;transition-duration:.15s}',
    '.mp-card{transition:translate .6s ' + EASE + ',box-shadow .6s ' + EASE + '}',
    '.mp-card:hover{translate:0 -4px;box-shadow:0 20px 40px -22px rgba(29,27,22,.35)}',
    'a.mp-card:active{scale:.99}',
    '.mp-tile{transition:scale .6s ' + EASE + ',box-shadow .6s ' + EASE + '}',
    '.mp-tile:hover{scale:1.03;box-shadow:0 12px 24px -14px rgba(29,27,22,.35)}',
    /* arrow icons slide on hover */
    '.mp-btn svg,.mp-card svg{transition:translate .45s ' + EASE + '}',
    '.mp-btn:hover svg:last-child,.mp-card:hover svg:last-child{translate:3px 0}',
    /* text links: underline grows in */
    '.mp-ul{background-image:linear-gradient(currentColor,currentColor);background-repeat:no-repeat;background-position:0 100%;background-size:0 2px;transition:background-size .5s ' + EASE + ',color .2s ease;padding-bottom:2px}',
    '.mp-ul:hover{background-size:100% 2px}',
    /* hero decorations float */
    '.mp-float{animation:mpFloat 9s ease-in-out infinite}',
    '.mp-bob{animation:mpBob 8s ease-in-out infinite;animation-delay:var(--bd,0s)}',
    '@keyframes mpFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}',
    '@keyframes mpBob{0%,100%{scale:1}50%{scale:1.04}}',
    '.mp-wig{transition:rotate .7s ' + EASE + ',scale .7s ' + EASE + '}',
    '.mp-wig:hover{rotate:2deg;scale:1.03}',
    /* forms */
    'input,textarea,select{transition:box-shadow .35s ease,border-color .35s ease}',
    'input:focus,textarea:focus,select:focus{box-shadow:0 0 0 4px rgba(217,58,31,.18)}',
    'button{transition:scale .3s ' + EASE + ',filter .3s ease,translate .45s ' + EASE + '}',
    'button:hover:not(:disabled){filter:brightness(1.04);translate:0 -1px}',
    'button:active:not(:disabled){scale:.98;translate:0 0}',
    '.mp-msgpop{animation:mpMsg .6s ' + EASE + '}',
    '.mp-shake{animation:mpShake .6s ' + EASE + '}',
    '@keyframes mpMsg{from{opacity:0;scale:.98;translate:0 -4px}to{opacity:1;scale:1;translate:0 0}}',
    '@keyframes mpShake{0%,100%{translate:0}25%{translate:-4px}55%{translate:3px}80%{translate:-1px}}',
    /* directory search results pop back in */
    '.mp-again{animation:mpAgain .6s ' + EASE + ' both}',
    '@keyframes mpAgain{from{opacity:0;scale:.97}to{opacity:1;scale:1}}',
    /* top bar stays on screen and turns into a floating glass pill */
    'html{scroll-padding-top:112px}',
    'header.mp-sticky{position:sticky!important;top:0;z-index:60;border:1px solid transparent;transition:top .6s ' + EASE + ',margin .6s ' + EASE + ',height .6s ' + EASE + ',padding .6s ' + EASE + ',border-radius .6s ' + EASE + ',background-color .6s ease,box-shadow .6s ease,border-color .6s ease,backdrop-filter .6s ease,-webkit-backdrop-filter .6s ease}',
    'header.mp-sticky.mp-stuck{top:12px;margin:0 32px 24px;height:72px!important;padding-left:28px!important;padding-right:28px!important;border-radius:999px;background-color:rgba(255,246,234,.72);-webkit-backdrop-filter:blur(18px) saturate(1.6);backdrop-filter:blur(18px) saturate(1.6);box-shadow:0 14px 36px -18px rgba(29,27,22,.38);border-color:rgba(29,27,22,.08)}',
    'header.mp-sticky.mp-small.mp-stuck{top:8px;margin:0 10px 12px;height:60px!important;padding-left:16px!important;padding-right:12px!important}',
    '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){header.mp-sticky.mp-stuck{background-color:rgba(255,246,234,.96)}}',
    /* reduced motion: keep it calm */
    '@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'mp-motion-css'; st.textContent = css;
  (document.head || doc).appendChild(st);
  function stickyBar() {
    var h = document.querySelector('body > div > header, body > main > header'); if (!h) return;
    var root = h.parentElement;
    if (window.CSS && CSS.supports && CSS.supports('overflow', 'clip')) {
      if (getComputedStyle(root).overflow !== 'visible') root.style.overflow = 'clip';
    } else return;
    h.classList.add('mp-sticky'); if (h.offsetHeight < 90) h.classList.add('mp-small');
    var stuck = false, ticking = false;
    function check() {
      ticking = false; var y = window.scrollY || doc.scrollTop;
      if (!stuck && y > 40) { stuck = true; h.classList.add('mp-stuck'); }
      else if (stuck && y < 12) { stuck = false; h.classList.remove('mp-stuck'); }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    check();
  }
  if (document.readyState !== 'loading') stickyBar(); else document.addEventListener('DOMContentLoaded', stickyBar);
  if (reduce) return;
  doc.classList.add('mp-m');

  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function sty(el, k) { return (el.getAttribute('style') || '').indexOf(k) > -1; }
  function bg(el) { var c = getComputedStyle(el).backgroundColor; return c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)'; }
  function rad(el) { return parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0; }
  function kids(el) { return [].slice.call(el.children).filter(function (c) { return !/^(SCRIPT|STYLE|BR)$/.test(c.tagName); }); }

  ready(function () {
    var body = document.body;
    var root = kids(body).filter(function (c) { return c.tagName === 'DIV' || c.tagName === 'MAIN'; })[0] || body;
    var blocks = kids(root);
    if (blocks.length === 1 && kids(blocks[0]).length > 1) blocks = kids(blocks[0]);
    var reveal = [];

    function add(el, cls, d) { if (!el || el.classList.contains('mp-r') || el.classList.contains('mp-p')) return; el.classList.add(cls); el.style.setProperty('--d', (d || 0) + 's'); reveal.push(el); }

    /* Is this element a grid or row of cards? */
    function isGroup(el) {
      var cs = getComputedStyle(el), k = kids(el);
      if (k.length < 2) return false;
      if (cs.display.indexOf('grid') > -1) return true;
      return cs.display.indexOf('flex') > -1 && cs.flexDirection.indexOf('row') === 0 && k.filter(function (c) { return bg(c) && rad(c) >= 12; }).length >= 2;
    }
    function isCard(el) { return bg(el) && rad(el) >= 14 && el.offsetHeight > 60; }

    /* Walk a section: headings fade up, groups of cards pop in one after another */
    function walk(el, depth, base) {
      kids(el).forEach(function (c, i) {
        if (c.tagName === 'HEADER' || c.tagName === 'ASIDE') return;
        if (isGroup(c) && kids(c).filter(isCard).length >= 2) {
          kids(c).forEach(function (card, j) { add(card, isCard(card) ? 'mp-p' : 'mp-r', base + Math.min(j, 8) * 0.09); });
        } else if (depth < 2 && kids(c).length > 1 && c.offsetHeight > 400 && !isCard(c)) {
          walk(c, depth + 1, base);
        } else {
          add(c, isCard(c) ? 'mp-p' : 'mp-r', base + Math.min(i, 4) * 0.08);
        }
      });
    }

    blocks.forEach(function (b, i) {
      if (b.tagName === 'HEADER' || (i === 0 && b.offsetHeight < 140)) { b.classList.add('mp-hd'); return; }
      if (b.tagName === 'ASIDE') { b.classList.add('mp-hd'); return; }
      if (b.tagName === 'FOOTER') { add(b, 'mp-r', 0); return; }
      walk(b, 0, i <= 1 ? 0.15 : 0);
      if (!kids(b).length) add(b, 'mp-r', 0);
    });

    /* Hero touches: floating phone, bobbing circles, wiggly voucher */
    var hero = blocks.filter(function (b) { return b.tagName !== 'HEADER' && b.offsetHeight >= 140; })[0];
    [].slice.call(document.querySelectorAll('[style*="rotate("]')).forEach(function (el) {
      if (hero && hero.contains(el)) { if (el.offsetHeight > 300) el.classList.add('mp-float'); else el.classList.add('mp-wig'); }
    });
    var n = 0;
    [].slice.call(document.querySelectorAll('div[style*="border-radius: 50%"]')).forEach(function (el) {
      if (getComputedStyle(el).position === 'absolute' && !el.children.length && el.offsetWidth >= 30) { el.classList.add('mp-bob'); el.style.setProperty('--bd', (n++ * 0.8) + 's'); }
    });

    /* Buttons, cards, logo tiles, text links */
    [].slice.call(document.querySelectorAll('a')).forEach(function (a) {
      if (bg(a) && rad(a) >= 8) { a.classList.add(a.offsetHeight > 90 ? 'mp-card' : 'mp-btn'); }
      else if (sty(a, 'border') || a.querySelector('svg') || a.closest('header') === null && a.offsetHeight > 40) { a.classList.add('mp-btn'); }
      else if (a.textContent.trim()) { a.classList.add('mp-ul'); }
    });
    [].slice.call(document.querySelectorAll('.lg')).forEach(function (l) { if (l.parentElement) l.parentElement.classList.add('mp-tile'); });
    [].slice.call(document.querySelectorAll('.mp-p')).forEach(function (el) {
      if (el.tagName !== 'A' && !el.classList.contains('mp-tile') && !el.querySelector('input')) el.classList.add('mp-card');
    });

    /* Show things as they scroll into view */
    function show(el) {
      if (el.__mps) return; el.__mps = 1;
      el.classList.add('mp-on');
      setTimeout(function () { el.classList.remove('mp-r', 'mp-p', 'mp-on'); el.style.removeProperty('--d'); }, 2000);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      reveal.forEach(function (el) { io.observe(el); });
    } else { reveal.forEach(show); }
    /* Safety net: never leave anything hidden */
    setTimeout(function () { reveal.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) show(el); }); }, 2500);
    window.addEventListener('beforeprint', function () { reveal.forEach(show); });

    /* Admin messages pop in, errors give a little shake */
    var msg = document.getElementById('mp-msg');
    if (msg && 'MutationObserver' in window) {
      var last = '';
      new MutationObserver(function () {
        var t = msg.textContent.trim(); if (!t || t === last || getComputedStyle(msg).display === 'none') return; last = t;
        var c = getComputedStyle(msg).color.match(/\d+/g) || [0, 0, 0], err = +c[0] > +c[1] + 40;
        msg.classList.remove('mp-msgpop', 'mp-shake'); void msg.offsetWidth; msg.classList.add('mp-msgpop');
        if (err) { var form = msg.parentElement; form.classList.remove('mp-shake'); void form.offsetWidth; form.classList.add('mp-shake'); }
      }).observe(msg, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    /* Directory search: matching restaurants pop back in */
    var search = document.getElementById('mp-search');
    if (search) search.addEventListener('input', function () {
      [].slice.call(document.querySelectorAll('[data-name]')).forEach(function (el, i) {
        if (el.style.display === 'none' || i > 60) return;
        el.classList.remove('mp-again'); void el.offsetWidth; el.style.animationDelay = Math.min(i, 12) * 0.025 + 's'; el.classList.add('mp-again');
      });
    });

    /* Smooth fade between pages on this site */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]'); if (!a || e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return;
      if (a.id === 'mp-forgot' || a.getAttribute('href').charAt(0) === '#') return;
      e.preventDefault(); doc.classList.add('mp-leave');
      setTimeout(function () { location.href = u.href; }, 260);
    });
    window.addEventListener('pageshow', function () { doc.classList.remove('mp-leave'); });
  });
})();
