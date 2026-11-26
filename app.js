// Northgate Studios website. Prices, names and images come live from Tebex (Headless API);
// data.js adds the detail for each script, config.js the store settings.
// Checkout: sign in with Cfx.re, then the Tebex checkout.
(() => {
'use strict';
const C = window.NG_CONFIG, D = window.NG_DATA;
const API = 'https://headless.tebex.io/api';
const DISCORD = C.discord;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const okIdent = s => typeof s === 'string' && /^[A-Za-z0-9-]{6,80}$/.test(s);
const money = n => Number(n) === 0 ? 'Free' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: C.currency }).format(n);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
};

// ------------------------------------------------------------------ icons
const P = {
  gauge: '<path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.4"/>',
  garage: '<path d="M3 10 12 4l9 6v10H3z"/><path d="M7 20v-6h10v6M7 17h10"/>',
  car: '<path d="M5 16V12l2-5h10l2 5v4"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="16" r="1.2"/><circle cx="16.5" cy="16" r="1.2"/>',
  shield: '<path d="M12 3 20 6v6c0 5-3.6 8-8 9-4.4-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  badge: '<path d="M12 2 15 5h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4z"/><path d="m12 8 1.2 2.6 2.8.3-2.1 1.9.6 2.8L12 14.2 9.5 15.6l.6-2.8L8 10.9l2.8-.3z"/>',
  mask: '<path d="M3 7c3-2 15-2 18 0 0 7-3 11-9 11S3 14 3 7z"/><path d="M7 10.5c1-.8 2.5-.8 3.5 0M13.5 10.5c1-.8 2.5-.8 3.5 0"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L12 19a2.1 2.1 0 1 1-3-3l7.7-7.7a4 4 0 0 0-2-2z"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  dot: '<circle cx="12" cy="12" r="3.5"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  warn: '<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18v.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
  gift: '<path d="M3 9h18v4H3zM5 13h14v8H5zM12 9v12"/><path d="M12 9C10 5 6 5 7 8c.5 1.5 5 1 5 1s4.5.5 5-1c1-3-3-3-5 1z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  bag: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  gauge2: '<circle cx="12" cy="12" r="9"/><path d="M12 12 16 8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  chev: '<path d="m9 6 6 6-6 6"/>', chevl: '<path d="m15 6-6 6 6 6"/>',
  crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="1.5"/><rect x="17" y="13" width="4" height="7" rx="1.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.5M4 12h.5M4 18h.5"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', play: '<path d="M7 4v16l13-8z"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.5"/>',
};
const ic = (n, s = 18, w = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.dot}</svg>`;

// ------------------------------------------------------------------ data
let products = [], byId = {}, ready = false;
// Tebex is reachable from this browser (some ad blockers and Edge "Strict" tracking prevention block it)
let live = false;
const STORE = 'https://northgate-studios.tebex.store';
function timed(url, ms) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { signal: ctl.signal, credentials: 'omit' }).finally(() => clearTimeout(t));
}
async function catalogue() {
  // 1) live prices straight from Tebex
  try {
    const r = await timed(`${API}/accounts/${C.token}/categories?includePackages=1`, 6000);
    if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.data)) { live = true; return j; } }
  } catch (e) { /* blocked or offline: use the copy on this site */ }
  // 2) the copy kept on this site (refreshed automatically from Tebex), so the store never breaks
  const r = await timed('store.json?v=' + Math.floor(Date.now() / 6e5), 8000);
  if (!r.ok) throw new Error('store ' + r.status);
  return r.json();
}
async function load() {
  const j = await catalogue();
  products = (j.data || []).flatMap(c => (c.packages || []).map(p => ({ ...p, catName: c.name, d: D.products[p.id] || {} })));
  const order = Object.keys(D.products).map(Number);
  products.sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99));
  byId = Object.fromEntries(products.map(p => [p.id, p]));
  const B = C.bundle || {};
  pack = B.id ? byId[B.id] || null : null;
  if (pack) {
    products = products.filter(p => p.id !== pack.id);
    pack.d = { covers: ['assets/covers/pack.jpg', 'assets/covers/pack-sq.jpg'], poster: 'assets/posters/pack.jpg', icon: 'layers', frameworks: ['QBCore', 'Qbox', 'ESX'], ...pack.d, bundle: true };
  }
  packItems = (B.ids || []).map(id => byId[id]).filter(Boolean);
}
// The Complete Pack, and the scripts inside it
let pack = null, packItems = [];
const packFull = () => packItems.reduce((s, p) => s + Number(p.total_price || 0), 0);
const packSave = () => pack ? packFull() - Number(pack.total_price) : 0;
const inPack = id => !!pack && packItems.some(p => p.id === id);
// When a script has an update date
const fmtDate = s => new Date(s + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const lastUpdate = p => { const c = (D.changelog || []).find(x => x[1] === p.id); return (c && c[0]) || p.d.updated || ''; };
// Wide pictures kept on the site (Tebex images are portrait for the Tebex store cards)
const imgs = p => { if (p.d && p.d.covers && p.d.covers.length) return p.d.covers; const m = (p.media || []).map(x => x.url || x).filter(Boolean); return m.length ? m : [p.image].filter(Boolean); };
const title = p => p.name.replace(/^Northgate\s+/i, '');
const tagline = p => C.taglines[p.id] || p.d.headline || '';
const free = p => Number(p.total_price) === 0;
const catLabel = k => (C.groups[k] || {}).label || 'Scripts';
const groupOf = p => p.d.cat || Object.keys(C.groups).find(k => C.groups[k].ids.includes(p.id)) || 'server';
const settingsCount = p => (p.d.settings || {}).count || 0;

function clean(html) {
  const doc = new DOMParser().parseFromString(`<div>${html || ''}</div>`, 'text/html');
  const ok = new Set(['P', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'I', 'BR', 'A', 'H2', 'H3', 'H4', 'SPAN', 'DIV', 'U']);
  doc.body.querySelectorAll('*').forEach(el => {
    if (!ok.has(el.tagName)) { el.replaceWith(...el.childNodes); return; }
    [...el.attributes].forEach(a => { if (!(el.tagName === 'A' && a.name === 'href' && /^https?:/i.test(a.value))) el.removeAttribute(a.name); });
    if (el.tagName === 'A') { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
  });
  return doc.body.firstChild.innerHTML;
}

// ------------------------------------------------------------------ basket
let bag = ls.get('ng_bag', []).filter(id => typeof id === 'number');
function saveBag() { ls.set('ng_bag', bag); $('#bagCount').textContent = bag.length; $('#bagBtn').classList.toggle('has', bag.length > 0); renderBag(); syncButtons(); }
function add(id, open = true) {
  if (pack && bag.includes(pack.id) && inPack(id)) { toast(`${byId[id].name} is already in your Complete Pack`); if (open) openBag(true); return; }
  if (pack && id === pack.id) bag = bag.filter(x => !inPack(x));
  if (!bag.includes(id)) bag.push(id);
  saveBag();
  const b = $('#bagBtn'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  toast(`${byId[id] ? byId[id].name : 'Script'} added to your basket`);
  if (open) openBag(true);
}
function remove(id) { bag = bag.filter(x => x !== id); saveBag(); }
function addAll() { packItems.forEach(p => { if (!bag.includes(p.id)) bag.push(p.id); }); saveBag(); toast('All ' + packItems.length + ' scripts added to your cart'); openBag(true); }
function swapToPack() { bag = bag.filter(x => !inPack(x)); bag.push(pack.id); saveBag(); toast(`Swapped to the Complete Pack. You save ${money(packSave())}`); }
function openBag(on) { document.body.classList.toggle('bag', on); $('#drawer').setAttribute('aria-hidden', on ? 'false' : 'true'); if (on) $('#closeBag').focus(); }
const addLabel = (id, label) => bag.includes(id) ? `${ic('check', 16, 2.4)} In cart` : (label || 'Add to cart');
function syncButtons() { $$('[data-add]').forEach(b => { if (!b.dataset.keep) b.innerHTML = addLabel(+b.dataset.add, b.dataset.label); }); }
function renderBag() {
  const items = bag.map(id => byId[id]).filter(Boolean);
  const packed = items.filter(p => inPack(p.id)), packedSum = packed.reduce((s, p) => s + Number(p.total_price || 0), 0);
  const swap = pack && !bag.includes(pack.id) && packed.length >= 3 && packedSum > Number(pack.total_price) ? packedSum - Number(pack.total_price) : 0;
  const total = items.reduce((s, p) => s + Number(p.total_price || 0), 0);
  const sugg = products.filter(p => !bag.includes(p.id) && items.some(i => (i.d.links || []).some(l => l[0] === p.id))).slice(0, 2);
  $('#bagItems').innerHTML = items.length ? items.map(p => `
    <div class="item"><img src="${esc(imgs(p)[0])}" alt=""><div><b>${esc(p.name)}</b><span>${money(p.total_price)}, ${p.d.bundle ? packItems.length + ' scripts' : 'version ' + esc(p.d.version || '1.0.0')}</span></div>
    <button class="txtbtn" data-rm="${p.id}" aria-label="Remove ${esc(p.name)}">Remove</button></div>`).join('')
    + (swap ? `<div class="swap">${ic('gift', 22, 1.8)}<div><b>Save ${money(swap)} with the Complete Pack</b><span>All ${packItems.length} paid scripts for ${money(pack.total_price)}, less than what's in your cart now.</span></div><button class="btn p sm" data-swap="1">Swap</button></div>` : '')
    + (sugg.length ? `<div class="sugg"><h4>Works well with what you picked</h4>${sugg.map(p => `
    <div class="item"><img src="${esc(imgs(p)[0])}" alt=""><div><b>${esc(p.name)}</b><span>${money(p.total_price)}</span></div><button class="txtbtn mint" data-add="${p.id}" data-keep="1">Add</button></div>`).join('')}</div>` : '')
    : `<div class="empty">${ic('bag', 34, 1.4)}<p>Your basket is empty.</p><a class="btn sm" href="#store">Browse the scripts</a></div>`;
  if (items.length && !live) {
    // This browser blocks the Tebex API (ad blocker / strict tracking prevention): finish on our Tebex store instead
    $('#bagFoot').innerHTML = `
    <div class="tot"><span>Total</span><b>${money(total)}</b></div>
    ${items.length === 1 ? `<button class="btn p wide" id="checkout">${ic('lock', 16, 2)} Check out securely</button>` : `
    <p class="small">Add each script to your basket on our Tebex store, then check out there:</p>
    ${items.map(p => `<a class="btn wide sm" target="_blank" rel="noopener noreferrer" href="${STORE}/checkout/packages/add/${p.id}/single">${ic('bag', 14, 2)} Add ${esc(title(p))}</a>`).join('')}
    <a class="btn p wide" href="${STORE}/checkout/basket" target="_blank" rel="noopener noreferrer">${ic('lock', 16, 2)} Check out on Tebex</a>`}
    <ol class="how"><li>Pay on Tebex by card, PayPal and more. Tebex asks you to sign in with Cfx.re.</li><li>Download from the Cfx.re Portal, under Granted Assets.</li></ol>`;
    return;
  }
  $('#bagFoot').innerHTML = items.length ? `
    <div class="tot"><span>Total</span><b>${money(total)}</b></div>
    <button class="btn p wide" id="checkout">${ic('lock', 16, 2)} Check out securely</button>
    <ol class="how"><li>Sign in with Cfx.re so the scripts go to the right account.</li><li>Pay on Tebex by card, PayPal and more.</li><li>Download from the Cfx.re Portal, under Granted Assets.</li></ol>` : '';
}

// ------------------------------------------------------------------ checkout through Tebex
const here = () => location.origin + location.pathname;
async function api(path, opts) {
  const r = await fetch(API + path, Object.assign({ credentials: 'omit', headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }, opts));
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.detail || j.message || j.title || ('Tebex error ' + r.status));
  return j;
}
const busy = t => { $('#overlayText').textContent = t; $('#overlay').classList.add('on'); };
const idle = () => $('#overlay').classList.remove('on');
// ------------------------------------------------------------------ Cfx.re account (a Tebex basket you signed in to)
// Signing in creates a Tebex basket and sends you to Cfx.re. When you come back we read your Cfx.re name from it,
// and checkout reuses that basket so you don't sign in twice.
let account = ls.get('ng_account', null);
if (!account || !okIdent(account.ident) || typeof account.username !== 'string') account = null;
function accountUI() {
  const b = $('#loginBtn'); if (!b) return;
  if (account && account.username) {
    b.classList.add('in');
    b.innerHTML = `<i>${esc(account.username[0].toUpperCase())}</i><span>${esc(account.username)}</span>${ic('chev', 12, 2.4)}`;
    b.setAttribute('aria-label', 'Signed in as ' + account.username);
  } else {
    b.classList.remove('in');
    b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span>Log in with Cfx.re</span>`;
    b.setAttribute('aria-label', 'Log in with Cfx.re');
  }
  const m = $('#acctMenu'); if (m) m.classList.add('hide');
}
async function login(next) {
  if (!live) { toast('Your browser is blocking sign-in here. You can still buy: checkout takes you to our Tebex store.', true); return; }
  busy('Taking you to sign in with Cfx.re…');
  try {
    const b = await api(`/accounts/${C.token}/baskets`, { method: 'POST', body: JSON.stringify({ complete_url: here() + '#thanks', cancel_url: here() + '#store', complete_auto_redirect: true }) });
    const ident = b.data.ident;
    ls.set('ng_login', { ident, next: next || location.hash || '#home', at: Date.now() });
    const auth = await api(`/accounts/${C.token}/baskets/${ident}/auth?returnUrl=${encodeURIComponent(here() + '?nglogin=' + ident)}`);
    const list = Array.isArray(auth) ? auth : (auth.data || []);
    const cfx = list.find(a => /fivem|cfx/i.test(a.name)) || list[0];
    if (!cfx || !cfx.url) throw new Error('no sign-in link');
    goSafe(cfx.url);
  } catch (e) { idle(); ls.del('ng_login'); toast('Sign in couldn\'t start: ' + e.message, true); }
}
async function loginReturn() {
  const ident = new URLSearchParams(location.search).get('nglogin');
  if (!ident) return false;
  if (!okIdent(ident)) { history.replaceState(null, '', here() + '#home'); return false; }
  const pend = ls.get('ng_login', null);
  ls.del('ng_login');
  history.replaceState(null, '', here() + ((pend && pend.next) || '#home'));
  if (!pend || pend.ident !== ident) return false;
  try {
    const b = await api(`/accounts/${C.token}/baskets/${ident}`);
    const name = b.data && b.data.username;
    if (!name) throw new Error('not signed in');
    account = { ident, username: name, at: Date.now() };
    ls.set('ng_account', account);
    accountUI(); toast(`Signed in as ${name}`);
  } catch (e) { toast('Sign in didn\'t finish. Please try again.', true); }
  return false;
}
function logout() { account = null; ls.del('ng_account'); accountUI(); toast('Signed out'); }
// A basket we can still use: signed in, not paid for yet
async function usableBasket() {
  if (!account || !account.ident) return null;
  try {
    const b = await api(`/accounts/${C.token}/baskets/${account.ident}`);
    const d = b.data || {};
    if (!d.username || d.complete) return null;
    // Empty it, so it holds exactly what's in the cart now
    for (const p of d.packages || []) {
      try { await api(`/baskets/${account.ident}/packages/remove`, { method: 'POST', body: JSON.stringify({ package_id: p.id }) }); } catch (e) {}
    }
    return account.ident;
  } catch (e) { return null; }
}

// Only ever send people to Cfx.re or Tebex pages from data that came back from the Tebex API
function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' && /(^|\.)(tebex\.io|tebex\.store|cfx\.re)$/i.test(x.hostname) ? x.href : null; }
  catch (e) { return null; }
}
const goSafe = u => { const ok = safeUrl(u); if (!ok) throw new Error('unexpected link'); location.href = ok; };
// Browser blocks the Tebex API: finish on our Tebex store (normal page loads are never blocked)
function storeCheckout(ids) {
  busy('Taking you to our secure Tebex store…');
  location.href = ids.length === 1 ? `${STORE}/checkout/packages/add/${encodeURIComponent(ids[0])}/single` : STORE;
}
async function checkout() {
  const ids = bag.filter(id => byId[id]);
  if (!ids.length) return;
  if (!live) return storeCheckout(ids);
  busy('Getting your basket ready…');
  const ready = await usableBasket();
  if (ready) return finish(ready, ids);
  try {
    const b = await api(`/accounts/${C.token}/baskets`, { method: 'POST', body: JSON.stringify({ complete_url: here() + '#thanks', cancel_url: here() + '#store', complete_auto_redirect: true }) });
    const ident = b.data.ident;
    ls.set('ng_checkout', { ident, ids, at: Date.now() });
    const auth = await api(`/accounts/${C.token}/baskets/${ident}/auth?returnUrl=${encodeURIComponent(here() + '?ngbasket=' + ident)}`);
    const list = Array.isArray(auth) ? auth : (auth.data || []);
    const cfx = list.find(a => /fivem|cfx/i.test(a.name)) || list[0];
    if (!cfx || !cfx.url) return finish(ident, ids);
    busy('Taking you to sign in with Cfx.re…');
    goSafe(cfx.url);
  } catch (e) {
    idle();
    if (e instanceof TypeError) { live = false; return storeCheckout(ids); }   // network blocked mid-way
    toast('Checkout couldn\'t start: ' + e.message, true);
  }
}
async function finish(ident, ids) {
  busy('Adding your scripts…');
  try {
    for (const id of ids) {
      try { await api(`/baskets/${ident}/packages`, { method: 'POST', body: JSON.stringify({ package_id: id, quantity: 1 }) }); }
      catch (e) { if (!/already/i.test(e.message)) throw e; }
    }
    const b = await api(`/accounts/${C.token}/baskets/${ident}`);
    if (b.data && b.data.username) { account = { ident, username: b.data.username, at: Date.now() }; ls.set('ng_account', account); }
    const url = b.data && b.data.links && b.data.links.checkout;
    if (!url) throw new Error('no checkout link');
    busy('Taking you to secure checkout…');
    goSafe(url);
  } catch (e) {
    idle(); ls.del('ng_checkout');
    toast('Checkout failed: ' + e.message + '. Please try again.', true);
    history.replaceState(null, '', here() + '#store');
  }
}
function resume() {
  const ident = new URLSearchParams(location.search).get('ngbasket');
  if (!ident) return false;
  if (!okIdent(ident)) { history.replaceState(null, '', here() + '#store'); return false; }
  const pend = ls.get('ng_checkout', null);
  if (!pend || pend.ident !== ident || Date.now() - pend.at > 3600e3) { history.replaceState(null, '', here() + '#store'); return false; }
  finish(ident, pend.ids);
  return true;
}

// ------------------------------------------------------------------ the city behind the big screen
// A night-time city drawn on a canvas: three rows of buildings with lit windows, a road with traffic,
// and now and then a police car's lights. Pauses when off screen; drawn once if reduced motion is on.
function city(canvas) {
  const x = canvas.getContext('2d');
  const tall = +(canvas.dataset.tall || 1);
  let W = 0, H = 0, layers = [], cars = [], t = 0, raf = 0, visible = true, siren = -99;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function build() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = Math.max(1, r.width * dpr); H = canvas.height = Math.max(1, r.height * dpr);
    const horizon = H * 0.78;
    layers = [[0.42, '#0d1830', 0.25], [0.3, '#0a1426', 0.5], [0.2, '#070f1e', 0.85]].map(([hMax, col, lit], li) => {
      const bs = []; let px = -20;
      while (px < W + 20) {
        const w = rnd(W * 0.03, W * 0.08), h = rnd(H * 0.12, H * hMax) * (1 + li * 0.12) * tall;
        const win = [];
        const cw = Math.max(3, w / 9), ch = cw * 1.3;
        for (let wy = horizon - h + ch; wy < horizon - ch; wy += ch * 1.9) for (let wx = px + cw; wx < px + w - cw; wx += cw * 1.9)
          if (Math.random() < lit * 0.45) win.push([wx, wy, cw, ch, Math.random() < 0.82 ? 'rgba(255,190,100,' : 'rgba(190,225,255,', rnd(0.25, 0.85), Math.random() < 0.03]);
        bs.push({ x: px, w, h, win, ant: Math.random() < 0.12 });
        px += w + rnd(0, W * 0.012);
      }
      return { col, bs, horizon };
    });
    cars = Array.from({ length: 14 }, () => ({ x: rnd(0, W), lane: Math.random() < 0.5 ? 0 : 1, v: rnd(1.2, 2.6) * (W / 1400) }));
  }
  function frame() {
    t++;
    const horizon = H * 0.78;
    const g = x.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, '#050b18'); g.addColorStop(0.55, '#0c1a33'); g.addColorStop(1, '#1d2c45');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const glow = x.createRadialGradient(W * 0.5, horizon, 0, W * 0.5, horizon, W * 0.6);
    glow.addColorStop(0, 'rgba(255,170,80,.18)'); glow.addColorStop(1, 'rgba(255,170,80,0)');
    x.fillStyle = glow; x.fillRect(0, 0, W, H);
    layers.forEach((L, li) => {
      for (const b of L.bs) {
        x.fillStyle = L.col; x.fillRect(b.x, L.horizon - b.h, b.w, b.h + 2);
        if (b.ant) { x.fillRect(b.x + b.w / 2 - 1, L.horizon - b.h - H * 0.04, 2, H * 0.04); x.fillStyle = (t >> 5) % 2 ? 'rgba(255,77,94,.9)' : 'rgba(255,77,94,.25)'; x.fillRect(b.x + b.w / 2 - 2, L.horizon - b.h - H * 0.04 - 3, 4, 4); }
        for (const w of b.win) {
          const a = w[6] && (t + w[0]) % 180 < 40 ? w[5] * 0.2 : w[5] * (0.55 + li * 0.2);
          x.fillStyle = w[4] + a + ')'; x.fillRect(w[0], w[1], w[2], w[3]);
        }
      }
    });
    // road
    x.fillStyle = '#05080f'; x.fillRect(0, horizon, W, H - horizon);
    x.fillStyle = 'rgba(255,200,120,.08)'; x.fillRect(0, horizon, W, 2);
    for (let i = 0; i < W; i += W / 18) { x.fillStyle = 'rgba(255,220,160,.12)'; x.fillRect((i + t * 1.2) % W, horizon + (H - horizon) * 0.5, W / 40, 2); }
    for (const c of cars) {
      c.x += c.lane ? -c.v : c.v;
      if (c.x > W + 60) c.x = -60; if (c.x < -60) c.x = W + 60;
      const y = horizon + (H - horizon) * (c.lane ? 0.32 : 0.7);
      const tail = x.createLinearGradient(c.x, 0, c.x + (c.lane ? 50 : -50), 0);
      tail.addColorStop(0, c.lane ? 'rgba(255,245,220,.9)' : 'rgba(255,70,70,.85)'); tail.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = tail; x.fillRect(Math.min(c.x, c.x + (c.lane ? 50 : -50)), y - 1.5, 50, 3);
    }
    // a police car passes every so often
    if (t - siren > 900 && Math.random() < 0.004) siren = t;
    const st = t - siren;
    if (st < 420) {
      const px = W * (st / 420) * 1.2 - W * 0.1, py = horizon + (H - horizon) * 0.7;
      const on = (t >> 3) % 2;
      [[on ? '255,77,94' : '77,141,255', -14], [on ? '77,141,255' : '255,77,94', 14]].forEach(([col, dx]) => {
        const r = x.createRadialGradient(px + dx, py - 6, 0, px + dx, py - 6, W * 0.09);
        r.addColorStop(0, `rgba(${col},.55)`); r.addColorStop(1, `rgba(${col},0)`);
        x.fillStyle = r; x.fillRect(px + dx - W * 0.09, py - 6 - W * 0.09, W * 0.18, W * 0.18);
      });
    }
    if (!reduced && visible) raf = requestAnimationFrame(frame);
  }
  build(); frame();
  const ro = new ResizeObserver(() => { build(); if (reduced || !visible) frame(); }); ro.observe(canvas);
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; cancelAnimationFrame(raf); if (visible) frame(); }); io.observe(canvas);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
}

// ------------------------------------------------------------------ cities and posters
let cleanup = [];
function mountScreens() {
  cleanup.forEach(f => f()); cleanup = [];
  $$('canvas.city').forEach(cv => cleanup.push(city(cv)));
}
const poster = p => p.d.poster || imgs(p)[0];

// ------------------------------------------------------------------ shared bits
const addBtn = (p, cls = 'btn', label) => `<button class="${cls}" data-add="${p.id}"${label ? ` data-label="${esc(label)}"` : ''}>${addLabel(p.id, label)}</button>`;
const price = p => `<span class="price${free(p) ? ' free' : ''}">${money(p.total_price)}</span>`;
// A product card: wide picture, tags, name and price, add to cart
const cover = p => imgs(p)[0];
const tags = p => ['Escrow', ...(p.d.frameworks || [])].slice(0, 4);
const card = p => `
  <article class="card" data-group="${groupOf(p)}">
    <a class="im${vidOf(p.id) ? ' hasv' : ''}" href="#product-${p.id}" aria-label="${esc(p.name)}"><img loading="lazy" src="${esc(cover(p))}" alt="">${vidOf(p.id) && !reduced ? `<video muted loop playsinline preload="none" data-hover poster="${esc(posterOf(vidOf(p.id)))}"><source src="${esc(vidOf(p.id))}" type="video/mp4"></video><span class="play">${ic('play', 12, 2.4)} Video</span>` : ''}${p.d.badge === 'New' ? '<span class="flag">Updated</span>' : ''}${free(p) ? '<span class="flag free">Free</span>' : ''}</a>
    <div class="bd">
      <div class="tags">${tags(p).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="nm"><h3><a href="#product-${p.id}">${esc(p.name)}</a></h3>${price(p)}</div>
      <p>${esc(p.d.intro || tagline(p))}</p>
      ${lastUpdate(p) ? `<span class="upd">${ic('refresh', 13, 2.2)} Updated ${fmtDate(lastUpdate(p))}${p.d.version ? ` · v${esc(p.d.version)}` : ''}</span>` : ''}
      <div class="row">${addBtn(p, 'btn p sm grow', free(p) ? 'Get it free' : `${ic('bag', 16, 2)} Add to cart`)}<a class="btn sq sm" href="#product-${p.id}" aria-label="About ${esc(p.name)}">${ic('info', 16, 2)}</a></div>
    </div>
  </article>`;
const eyebrow = (t, i = 'star') => `<span class="eyebrow">${ic(i, 14, 2.2)} ${t}</span>`;
const head = (h, p, right = '') => `<div class="shead"><div><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>${right}</div>`;
const chead = (eb, h, p) => `<div class="chead">${eb}<h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>`;
const cta = () => `<section class="wrap"><div class="cta">
  <div><h2>Join the <em>Northgate</em> Discord</h2><p>Setup help, release notes and first looks at what's coming. Ask anything before you buy.</p></div>
  <a class="btn p" href="${DISCORD}" target="_blank" rel="noopener noreferrer">${ic('chat', 18, 2)} Join the Discord</a></div></section>`;

// ------------------------------------------------------------------ home
const orderList = () => { const o = (C.hotbar || []).map(id => byId[id]).filter(Boolean); return o.length === products.length ? o : products; };
let shelf = '';
function shelfHtml() { const l = shelf ? orderList().filter(p => groupOf(p) === shelf) : orderList(); return l.map(card).join(''); }
const CAT_ICON = { jobs: 'badge', crime: 'mask', vehicles: 'car', server: 'settings' };
const T = id => (C.tiles || {})[id] || (byId[id] ? cover(byId[id]) : '');
const vidOf = id => (C.videos || {})[id];
const posterOf = v => v.replace(/\.(mp4|webm)$/i, '.jpg');
// A looping gameplay video when one is set (and motion is allowed), otherwise the picture
const media = (src, video) => video && !reduced
  ? `<video autoplay muted loop playsinline preload="metadata" poster="${esc(src)}"><source src="${esc(video)}" type="video/${/\.webm$/i.test(video) ? 'webm' : 'mp4'}"></video>`
  : `<img src="${esc(src)}" alt="" loading="lazy">`;
// A full-width section where a big screenshot fades out behind the text
function spot(p, word, side, eb, h, extra) {
  if (!p) return '';
  const vid = (C.videos || {})[p.id], scene = (C.scenes || {})[p.id];
  return `<section class="spot ${side}${vid ? ' hasvid' : ''}">
    ${scene && !vid ? `<div class="scene" aria-hidden="true"><img src="${esc(scene)}" alt="" loading="lazy"></div>` : ''}
    <div class="sbg" aria-hidden="true">${media(vid ? posterOf(vid) : T(p.id), vid)}</div>
    <div class="outline" aria-hidden="true">${word}</div>
    <div class="wrap"><div class="stx">${eb}<h2>${h}</h2><p class="lede">${esc(p.d.intro || '')}</p>
      <div class="chipsx">${(p.d.highlights || []).slice(0, 3).map(x => `<span>${ic('check', 14, 2.6)} ${esc(x[0])}</span>`).join('')}</div>
      ${extra || ''}
      <div class="btns">${addBtn(p, 'btn p lg', `${ic('bag', 18, 2)} Add to cart · ${money(p.total_price)}`)}<a class="btn lg" href="#product-${p.id}">See everything ${ic('arrow', 16, 2.2)}</a></div>
    </div></div>
  </section>`;
}
// The Complete Pack band: three tablets fanned out on one side, the price and what's inside on the other
function packBand() {
  if (!packItems.length) return '';
  const full = packFull(), save = packSave();
  const btn = pack ? addBtn(pack, 'btn p lg', `${ic('bag', 18, 2)} Add the Complete Pack`) : `<button class="btn p lg" data-addall="1">${ic('bag', 18, 2)} Add all ${packItems.length} to cart</button>`;
  return `<section class="packb" id="s-pack">
    <div class="wrap pin">
      <div class="pfan" aria-hidden="true"><div class="glow"></div>
        <img class="f f1" src="${esc(T(7822918))}" alt="" loading="lazy"><img class="f f2" src="${esc(T(7822917))}" alt="" loading="lazy"><img class="f f0" src="${esc(T(7822914))}" alt="" loading="lazy">
      </div>
      <div class="ptx">
        ${eyebrow(pack ? `Complete Pack · save ${money(save)}` : 'Complete Pack', 'gift')}
        <h2>Every Northgate script, <em>one checkout</em></h2>
        <p class="lede">All ${packItems.length} paid scripts, built to work together. Robbery alarms reach your police, bought cars land in your garage, and staff can manage all of it from one panel.</p>
        <ul class="pinc">${packItems.map(p => `<li><a href="#product-${p.id}">${ic(p.d.icon, 18, 1.9)}<span>${esc(title(p))}</span></a></li>`).join('')}</ul>
        <div class="pbuy">
          <div class="pp">${pack ? `<s>${money(full)}</s><b>${money(pack.total_price)}</b><span class="save">${Math.round(save / full * 100)}% off</span>` : `<b>${money(full)}</b><span class="dim">for all ${packItems.length}</span>`}</div>
          <div class="btns">${btn}${pack ? `<a class="btn lg" href="#product-${pack.id}">What's inside</a>` : ''}</div>
        </div>
      </div>
    </div>
  </section>`;
}
function viewPack() {
  const full = packFull();
  return `<div class="wrap phead">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><a href="#store">Scripts</a><span>/</span><b>Complete Pack</b></nav>
  </div>${packBand()}
  <div class="wrap pbody">
    <div class="pstats"><div><b>${packItems.length}</b><span>paid scripts</span></div><div><b>${money(packSave())}</b><span>less than buying each</span></div><div><b>${packItems.reduce((s, p) => s + settingsCount(p), 0)}</b><span>in-game settings</span></div><div><b>Free</b><span>updates for life</span></div></div>
    <section class="psec"><h2 class="disp">What's inside</h2>
      <p class="lede">Each script arrives in your Cfx.re account on its own, exactly as if you bought it separately, so you can update each one when you like. Bought one already? Ask us on Discord before buying the pack.</p>
      <div class="grid">${packItems.map(p => card(p)).join('')}</div>
    </section>
    <p class="small">Bought separately these cost ${money(full)}.</p>
  </div>${cta()}`;
}
function viewHome() {
  const totalSettings = products.reduce((s, p) => s + settingsCount(p), 0);
  const hud = products.find(free);
  const list = orderList();
  const newest = byId[(C.newest || {}).id] || list[0];
  return `
  <section class="hero">
    ${C.heroVideo && !reduced ? `<div class="hvid" aria-hidden="true">${media((C.tiles || {})[7822914] || '', C.heroVideo)}</div>` : ''}
    <div class="wrap hin">
      <div class="htxt">
        <a class="pillnew" href="#product-${newest.id}"><b>New</b> Police 1.1 with a full MDT tablet ${ic('chev', 14, 2.4)}</a>
        <h1>Premium FiveM Scripts for QBCore, Qbox &amp; ESX <em>by Northgate</em></h1>
        <p class="lede">Police, robberies, housing, mechanics and more. Set up in game, checked on the server, and updated for free through your Cfx.re account.</p>
        <div class="btns"><a class="btn p lg" href="#home" data-jump="favs">Check the scripts ${ic('arrow', 18, 2.2)}</a>${hud ? `<a class="btn lg" href="#product-${hud.id}">Free HUD</a>` : ''}</div>
      </div>
      ${C.heroVideo && !reduced ? '' : `<div class="hart" aria-hidden="true">
        <div class="glow"></div>
        <img class="s s1" src="${esc(T(7822918))}" alt=""><img class="s s2" src="${esc(T(7822917))}" alt=""><img class="s s0" src="${esc(T(7822914))}" alt="">
      </div>`}
    </div>
    <div class="wrap feats">
      <div>${ic('crown', 26, 1.8)}<span><b>Premium scripts</b>Designed for serious roleplay servers and built to last.</span></div>
      <div>${ic('layers', 26, 1.8)}<span><b>Frameworks</b>QBCore, Qbox and ESX detected automatically. No editing to switch.</span></div>
      <div>${ic('headset', 26, 1.8)}<span><b>Real support</b>Help on Discord from the people who wrote the code.</span></div>
      <div>${ic('settings', 26, 1.8)}<span><b>${totalSettings} settings</b>Owners change everything in game. No config files.</span></div>
    </div>
  </section>
  <div class="gline"></div>

  <section class="sec" id="s-favs">
    <div class="wrap">${chead(eyebrow('Community favourites'), 'Top <em>FiveM Scripts</em> by Northgate', `Every Northgate script for QBCore, Qbox and ESX, with free updates and instant delivery through your Cfx.re portal.`)}
      <div class="fw"><span>QBCore</span><span>Qbox</span><span>ESX</span><span>Standalone</span></div>
    </div>
    <div class="carousel">
      <button class="cbtn l" data-car="-1" aria-label="Previous scripts">${ic('chevl', 20, 2.4)}</button>
      <div class="track" id="track">${list.map(card).join('')}</div>
      <button class="cbtn r" data-car="1" aria-label="Next scripts">${ic('chev', 20, 2.4)}</button>
    </div>
  </section>

  ${spot(byId[7822914], 'POLICE', 'r', eyebrow('Flagship · Police 1.1', 'badge'), 'A full <em>MDT tablet</em> for your police department')}
  ${spot(byId[7822915], 'HEISTS', 'l', eyebrow('8 minigames', 'mask'), 'Robberies that take <em>real skill</em>')}
  ${spot(byId[7822918], 'HOUSING', 'r', eyebrow('20 interiors · no MLOs', 'home'), 'Homes, furniture and a <em>real estate job</em>')}

  ${packBand()}

  <section class="sec wrap">
    ${chead(eyebrow('Browse by type', 'grid'), 'Find what your <em>server</em> needs', '')}
    <div class="cats">${Object.entries(C.groups).map(([k, v]) => `<a class="cat" href="#store-${k}"><span class="ib">${ic(CAT_ICON[k] || 'dot', 20, 2)}</span><h3>${esc(v.label)}</h3><p>${esc(C.groupText[k] || '')}</p><span class="more">Explore ${ic('arrow', 15, 2.2)}</span></a>`).join('')}</div>
  </section>

  ${hud ? `<section class="sec split wrap">
    <div>${eyebrow('Start for free · £0', 'gift')}
      <h2><em>Free FiveM HUD</em> from the people who made it</h2>
      <p class="lede">${esc(hud.d.intro)}</p>
      <div class="btns">${addBtn(hud, 'btn p lg', 'Get it free')}<a class="btn lg" href="#product-${hud.id}">What it does</a></div>
      <div class="trio"><div><b>Delivered through Cfx.re</b><span>Claim it at £0 and download it from Granted Assets.</span></div><div><b>Open configuration</b><span>Escrow protects the core, the config stays open.</span></div><div><b>Free updates</b><span>Same docs and updates as the paid scripts.</span></div></div>
    </div>
    <a class="splitpic" href="#product-${hud.id}"><img src="${esc(cover(hud))}" alt="${esc(hud.name)}"></a>
  </section>` : ''}

  <section class="sec wrap">
    <div class="feature">
      <div class="fpic"><img id="fimg" src="${esc((C.tiles || {})[list[0].id] || cover(list[0]))}" alt=""></div>
      <div class="flist">${eyebrow('Every script', 'list')}
        <h2>Everything your <em>city</em> runs on</h2>
        <p class="lede">Each script works alone. Run more than one and they talk to each other: robbery alarms reach the police, bought cars go to your garage, workshop vans come with keys.</p>
        <ol>${list.map((p, i) => `<li><a href="#product-${p.id}" data-pic="${esc((C.tiles || {})[p.id] || cover(p))}"${i ? '' : ' class="on"'}><span class="n">${String(i + 1).padStart(2, '0')}</span><b>${esc(title(p))}</b><span class="t">${esc(tagline(p))}</span>${ic('arrow', 16, 2)}</a></li>`).join('')}</ol>
      </div>
    </div>
  </section>

  <section class="sec wrap">
    ${chead(eyebrow('How it works', 'bolt'), 'From checkout to <em>in game</em>', 'About ten minutes, start to finish.')}
    <ol class="steps">
      <li><span class="ib">${ic('bag', 20, 2)}</span><h3>Pick your scripts</h3><p>Add what you want to the cart. The HUD is free.</p></li>
      <li><span class="ib">${ic('lock', 20, 2)}</span><h3>Sign in and pay</h3><p>Log in with Cfx.re, then pay on Tebex by card, PayPal and more.</p></li>
      <li><span class="ib">${ic('download', 20, 2)}</span><h3>Download</h3><p>Your scripts appear in the Cfx.re Portal under Granted Assets.</p></li>
      <li><span class="ib">${ic('play', 20, 2)}</span><h3>Play</h3><p>Drop in resources, add one line to server.cfg, set the rest up in game.</p></li>
    </ol>
  </section>

  <section class="sec wrap">
    ${chead(eyebrow('Roadmap', 'map'), 'What we\'re building <em>next</em>', 'Ideas come from server owners on Discord.')}
    ${roadmap()}
  </section>

  <section class="sec wrap">
    ${chead(eyebrow('FAQ', 'help'), 'Questions before you <em>buy</em>', '')}
    <div class="faq two">${FAQ.slice(0, 8).map(faqItem).join('')}</div>
  </section>
  ${cta()}`;
}

function roadmap(all) {
  const done = products.filter(p => p.d.badge === 'New').map(p => ['Released', p.name, p.d.headline]);
  const list = all ? [...D.roadmap, ...done] : D.roadmap;
  const cls = s => s === 'In progress' ? 'prog' : s === 'Released' ? 'done' : 'plan';
  return `<div class="road">${list.map(r => `<div class="r ${cls(r[0])}"><span class="st">${esc(r[0])}</span><h3>${esc(r[1])}</h3><p>${esc(r[2])}</p></div>`).join('')}</div>`;
}

// ------------------------------------------------------------------ compatibility matrix
const COMPAT_ROWS = {
  Framework: ['QBCore', 'Qbox', 'ESX', 'Standalone'],
  Inventory: ['ox_inventory', 'qb-inventory', 'qs-inventory', 'ps-inventory', 'lj-inventory'],
  Banking: ['Renewed-Banking', 'qb-banking', 'qb-management', 'esx_addonaccount'],
  Keys: ['qbx_vehiclekeys', 'qb-vehiclekeys', 'wasabi_carlock', 'MrNewbVehicleKeys', 'Northgate Keys'],
  Fuel: ['ox_fuel', 'LegacyFuel', 'cdn-fuel', 'ps-fuel', 'lc_fuel'],
  Clothing: ['illenium-appearance', 'fivem-appearance', 'qb-clothing', 'esx_skin'],
  Dispatch: ['Northgate Police', 'ps-dispatch', 'cd_dispatch'],
  Target: ['ox_target', 'qb-target'],
};
function has(p, group, val) {
  if (group === 'Framework') return (p.d.frameworks || []).includes(val);
  return Object.values(p.d.compat || {}).flat().join(' | ').toLowerCase().includes(val.toLowerCase());
}
const yes = '<span class="yes" title="Supported">●</span>', no = '<span class="no" title="Not supported">–</span>';
function matrix(groups) {
  const gs = groups || Object.keys(COMPAT_ROWS);
  if (gs.length === 1) {
    const cols = COMPAT_ROWS[gs[0]];
    return `<div class="matrix"><table><thead><tr><th>Script</th>${cols.map(c => `<th>${esc(c)}</th>`).join('')}<th>Settings</th><th>Version</th></tr></thead><tbody>
      ${products.map(p => `<tr><td><a href="#product-${p.id}">${esc(title(p))}</a></td>${cols.map(c => `<td>${has(p, gs[0], c) ? yes : no}</td>`).join('')}<td>${settingsCount(p) || '–'}</td><td>${esc(p.d.version || '')}</td></tr>`).join('')}
    </tbody></table></div>`;
  }
  return `<div class="matrix"><table><thead><tr><th>Works with</th>${products.map(p => `<th><a href="#product-${p.id}">${esc(title(p))}</a></th>`).join('')}</tr></thead><tbody>
    ${gs.map(g => `<tr class="grp"><td colspan="${products.length + 1}">${esc(g)}</td></tr>` + COMPAT_ROWS[g].map(v => `<tr><td>${esc(v)}</td>${products.map(p => `<td>${has(p, g, v) ? yes : no}</td>`).join('')}</tr>`).join('')).join('')}
  </tbody></table></div>`;
}

// ------------------------------------------------------------------ store
const S = {};
function viewStore(group) {
  const g = C.groups[group];
  const q = (S.q || '').toLowerCase();
  let list = g ? products.filter(p => groupOf(p) === group) : products.slice();
  if (q) list = list.filter(p => (p.name + ' ' + tagline(p) + ' ' + (p.d.intro || '')).toLowerCase().includes(q));
  if (S.sort === 'low') list.sort((a, b) => a.total_price - b.total_price);
  if (S.sort === 'high') list.sort((a, b) => b.total_price - a.total_price);
  if (S.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  return `<div class="wrap page">
    <h1 class="disp">${g ? esc(g.label) : 'All scripts'}</h1>
    <p class="lede">${g ? esc(C.groupText[group] || '') : `${products.length} scripts for QBCore, Qbox and ESX. Every one is set up in game and checked on the server.`}</p>
    <div class="toolbar">
      <nav class="chips" aria-label="Categories"><a class="chip${!g ? ' on' : ''}" href="#store">All <small>${products.length}</small></a>
      ${Object.entries(C.groups).map(([k, v]) => `<a class="chip${group === k ? ' on' : ''}" href="#store-${k}">${esc(v.label)} <small>${products.filter(p => groupOf(p) === k).length}</small></a>`).join('')}</nav>
      <span class="sp"></span>
      <input id="storeQ" type="search" placeholder="Filter scripts" value="${esc(S.q || '')}" aria-label="Filter scripts">
      <select id="storeSort" aria-label="Sort"><option value="">Featured</option><option value="low"${S.sort === 'low' ? ' selected' : ''}>Price, low to high</option><option value="high"${S.sort === 'high' ? ' selected' : ''}>Price, high to low</option><option value="name"${S.sort === 'name' ? ' selected' : ''}>Name</option></select>
    </div>
    ${!g && !q && packItems.length ? `${pack ? `<a class="packstrip" href="#product-${pack.id}">` : '<button class="packstrip" data-addall="1">'}${ic('gift', 22, 1.8)}<span><b>Complete Pack</b> All ${packItems.length} paid scripts${pack ? ` for ${money(pack.total_price)}, save ${money(packSave())}` : ', added to your cart in one click'}</span>${ic('arrow', 16, 2.2)}${pack ? '</a>' : '</button>'}` : ''}
    <div class="grid">${list.map(p => card(p)).join('') || '<div class="empty">No scripts match that. Try a shorter word.</div>'}</div>
  </div>${cta()}`;
}

// ------------------------------------------------------------------ product page
function code(label, txt) {
  return `<div class="codeb"><div class="hd"><span>${esc(label)}</span><button class="txtbtn" data-copy="${esc(txt)}">Copy</button></div><pre>${esc(txt)}</pre></div>`;
}
const shotsOf = id => { const s = (C.shots || {})[id]; return s ? Array.from({ length: s[1] }, (_, i) => `assets/shots/${s[0]}-${i + 1}.jpg`) : []; };
function viewProduct(id) {
  const p = byId[id];
  if (!p) return `<div class="wrap page"><h1 class="disp">Script not found</h1><p class="lede">That link doesn't match a script in the store. <a class="mint" href="#store">See all scripts</a></p></div>`;
  const d = p.d, pics = imgs(p);
  const secs = [['features', 'Features'], ['commands', 'Commands'], ['settings', 'Settings'], ['compat', 'Compatibility'], ['install', 'Install'], (D.changelog || []).some(c => c[1] === p.id) ? ['changes', 'Updates'] : null, d.dev ? ['dev', 'For developers'] : null, d.security ? ['security', 'Security'] : null, ['faq', 'FAQ']].filter(Boolean);
  const related = (d.links || []).map(l => [byId[l[0]], l[1]]).filter(x => x[0]);
  return `
  <div class="wrap phead">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><a href="#store-${groupOf(p)}">${esc(catLabel(groupOf(p)))}</a><span>/</span><b>${esc(title(p))}</b></nav>
    <div class="ptop">
      <div class="pgal">
        ${vidOf(p.id) ? `<div class="main vid"><video autoplay muted loop playsinline controls preload="metadata" poster="${esc(posterOf(vidOf(p.id)))}"><source src="${esc(vidOf(p.id))}" type="video/mp4"></video></div>` : ''}
        <button class="${vidOf(p.id) ? '' : 'main'}" data-zoom="${esc(cover(p))}" aria-label="View picture larger"><img src="${esc(cover(p))}" alt="${esc(p.name)}"></button>
        ${(C.tiles || {})[p.id] ? `<button data-zoom="${esc(C.tiles[p.id])}" aria-label="View in-game screenshot"><img src="${esc(C.tiles[p.id])}" alt="${esc(p.name)} in game"></button>` : ''}
        ${shotsOf(p.id).length ? `<div class="shots">${shotsOf(p.id).map((s, i) => `<button data-zoom="${esc(s)}" aria-label="Screenshot ${i + 1}"><img src="${esc(s)}" alt="${esc(p.name)} screenshot ${i + 1}" loading="lazy"></button>`).join('')}</div>` : ''}
      </div>
      <div class="pinfo">
        <div class="tags">${tags(p).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <h1>${esc(p.name)}</h1><p class="hl">${esc(d.headline || '')}</p>
        <p class="lede">${esc(d.intro || '')}</p>
        <div class="buybox">
          <div class="pr">${price(p)}<small>${free(p) ? 'Free forever, with free updates' : 'One payment, no subscription' + (Number(p.sales_tax) > 0 ? `. Includes ${money(p.sales_tax)} VAT` : '')}</small></div>
          <div class="btns">${addBtn(p, 'btn p lg', `${ic('bag', 18, 2)} Add to cart`)}<button class="btn lg" data-buy="${p.id}">Buy now</button></div>
        </div>
        <dl class="meta"><div><dt>Version</dt><dd>${esc(d.version || '–')}</dd></div><div><dt>Frameworks</dt><dd>${esc((d.frameworks || []).join(', '))}</dd></div><div><dt>In-game settings</dt><dd>${settingsCount(p) || '–'}</dd></div><div><dt>Last updated</dt><dd>${lastUpdate(p) ? fmtDate(lastUpdate(p)) : '–'}</dd></div><div><dt>Delivery</dt><dd>Instant, Cfx.re</dd></div></dl>
        ${inPack(p.id) ? `<a class="packnote" href="#product-${pack.id}">${ic('gift', 18, 1.9)}<span>Also in the <b>Complete Pack</b>: all ${packItems.length} paid scripts for ${money(pack.total_price)}</span>${ic('chev', 14, 2.4)}</a>` : ''}
      </div>
    </div>
  </div>
  <div class="wrap pbody">
    ${d.stats ? `<div class="pstats">${d.stats.map(s => `<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>` : ''}
    <section class="psec"><h2 class="disp">What makes it different</h2>
      <div class="hgrid">${(d.highlights || []).map(h => `<div><h3>${esc(h[0])}</h3><p>${esc(h[1])}</p></div>`).join('')}</div>
    </section>
  </div>
  <nav class="subnav" aria-label="On this page"><div class="wrap">${secs.map(s => `<a href="#product-${p.id}" data-jump="${s[0]}">${esc(s[1])}</a>`).join('')}<span class="sp"></span><span class="snp">${price(p)}${addBtn(p, 'btn p sm')}</span></div></nav>
  <div class="wrap pbody">
    <section class="psec" id="s-features"><h2 class="disp">Everything it does</h2>
      <div class="fgroups">${(d.features || []).map(f => `<div class="fgroup"><h3>${esc(f[0])}</h3><ul>${f[1].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
    </section>
    <section class="psec" id="s-commands"><h2 class="disp">Commands and keys</h2>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>Command</th><th>Default key</th><th>What it does</th></tr></thead><tbody>
        ${(d.commands || []).map(c => `<tr><td><code>${esc(c[0])}</code></td><td>${c[1] ? `<kbd>${esc(c[1])}</kbd>` : '<span class="dim">None</span>'}</td><td>${esc(c[2])}</td></tr>`).join('')}
      </tbody></table></div><p class="small">Players can change keys in GTA Settings, Key Bindings, FiveM.</p>
    </section>
    <section class="psec" id="s-settings"><h2 class="disp">Change it in game</h2>
      <div class="setbox"><div class="big"><b>${settingsCount(p) || '–'}</b><span>settings in the owner menu</span><p>Open it with <code>/${esc((d.settings || {}).cmd || 'settings')}</code>. Every setting shows its default, has a reset button and is checked on the server.</p></div>
        <div><h3>Some of what you can change</h3><ul class="ticks">${((d.settings || {}).examples || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        ${code('server.cfg: owner access for every Northgate script', D.ownerAce)}</div></div>
    </section>
    <section class="psec" id="s-compat"><h2 class="disp">Works with your setup</h2>
      <div class="compat">${Object.entries(d.compat || {}).map(([k, v]) => `<div><h3>${esc(k)}</h3><p>${v.map(x => `<span class="pill${/northgate/i.test(x) ? ' m' : ''}">${esc(x)}</span>`).join('')}</p></div>`).join('')}</div>
      ${d.requires ? `<div class="req"><h3>You'll need</h3><ul>${d.requires.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
    </section>
    <section class="psec" id="s-install"><h2 class="disp">Install</h2>
      <ol class="olist">${(d.install || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${code('server.cfg', `ensure oxmysql\nensure qbx_core     # or qb-core / es_extended\nensure ${d.resource || 'ng_script'}`)}
    </section>
    ${(D.changelog || []).some(c => c[1] === p.id) ? `<section class="psec" id="s-changes"><h2 class="disp">Updates</h2>${changes(D.changelog.filter(c => c[1] === p.id), false)}<p class="small"><a class="mint" href="#changelog">Every update to every script</a></p></section>` : ''}
    ${d.dev ? `<section class="psec" id="s-dev"><h2 class="disp">Exports for your scripts</h2><div class="${d.dev.server && d.dev.client ? 'two' : ''}">${d.dev.server ? code('Server', d.dev.server) : ''}${d.dev.client ? code('Client', d.dev.client) : ''}</div></section>` : ''}
    ${d.security ? `<section class="psec" id="s-security"><h2 class="disp">Checked on the server</h2><ul class="ticks cols">${d.security.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>` : ''}
    <section class="psec" id="s-faq"><h2 class="disp">Questions about ${esc(title(p))}</h2><div class="faq">${(d.faq || []).map(faqItem).join('')}${FAQ.slice(0, 3).map(faqItem).join('')}</div></section>
    <section class="psec"><h2 class="disp">Pairs well with</h2>
      <div class="grid three">${(related.length ? related.map(r => r[0]) : products.filter(x => x.id !== p.id).slice(0, 3)).slice(0, 3).map(x => card(x)).join('')}</div>
    </section>
  </div>${cta()}`;
}

// ------------------------------------------------------------------ other pages
const FAQ = [
  ['How do I get my scripts after buying?', 'At checkout you sign in with Cfx.re. Straight after payment the scripts appear in the Cfx.re Portal under Granted Assets, ready to download.'],
  ['Which frameworks are supported?', 'QBCore, Qbox and ESX, detected automatically. The HUD and Staff Panel also run standalone, and the Staff Panel supports ox_core and ND_Core.'],
  ['Do I need to edit config files?', 'No. Owners change settings in game, and locations are placed in game by walking to them. config.lua is still there if you prefer it.'],
  ['Are updates free?', 'Yes. Updates arrive through your Cfx.re account at no extra cost.'],
  ['Are the scripts encrypted?', 'The core is protected with FiveM Escrow. Config, language files and the framework bridge are open so you can adjust them.'],
  ['Can I use them on more than one server?', 'Escrowed assets run on servers using a license key from the Cfx.re account that owns them. Ask us on Discord about your setup.'],
  ['Do I need MLOs?', 'No. Everything works on the base map. Housing and Robberies use GTA\'s own interiors.'],
  ['Will it work with my inventory or banking script?', 'The popular ones are supported out of the box. See the compatibility chart, or ask us before buying.'],
  ['How do I get help?', 'Join our Discord and open a ticket. We help with setup, bugs and questions.'],
  ['Can I get a refund?', 'Scripts are digital and delivered instantly, so purchases are generally final. Payments are run by Tebex. If something isn\'t right, talk to us on Discord first and we\'ll sort it.'],
];
const faqItem = ([q, a]) => `<details><summary>${esc(q)}</summary><p>${a.includes('<') ? a : esc(a)}</p></details>`;

const viewCompat = () => `<div class="wrap page"><h1 class="disp">Compatibility</h1>
  <p class="lede">What each script works with out of the box. Anything missing can usually be added in the open bridge files. Not sure? Ask us on Discord.</p>
  <h2 class="disp sm">By framework</h2>${matrix(['Framework'])}
  <h2 class="disp sm">Everything else</h2>${matrix()}</div>${cta()}`;

function viewDocs() {
  const nav = [['start', 'Getting started'], ['owner', 'Owner access'], ['order', 'Start order'], ['portal', 'Downloading'], ...products.map(p => ['p' + p.id, title(p)]), ['trouble', 'Troubleshooting']];
  return `<div class="wrap page"><h1 class="disp">Docs and install</h1>
    <p class="lede">How to install and set up each script. The full guide also comes inside each download as README.md.</p>
    <div class="doclayout"><nav class="toc" aria-label="Docs">${nav.map(n => `<a href="#docs" data-jump="${n[0]}">${esc(n[1])}</a>`).join('')}</nav>
    <div class="doc">
      <h2 id="s-start">Getting started</h2>
      <p>Every Northgate script works the same way: put the folder in <code>resources</code>, add <code>ensure</code> after your framework, start the server, then set everything up in game. Database tables are created for you.</p>
      <h2 id="s-owner">Owner access</h2>
      <p>One line in <code>server.cfg</code> lets you open the in-game settings of every Northgate script:</p>${code('server.cfg', D.ownerAce)}
      <p class="note">To find your Discord ID, turn on Developer Mode in Discord, then right-click your name and choose Copy User ID. The server console can always open the settings too.</p>
      <h2 id="s-order">Start order</h2>
      <p>Start your framework, database and inventory first, then the Northgate scripts. Scripts that use each other go after the one they use, for example Robberies after Police.</p>
      ${code('server.cfg', 'ensure oxmysql\nensure ox_lib\nensure qbx_core        # or qb-core / es_extended\nensure ox_inventory\n\nensure ng_hud\nensure ng_admin\nensure ng_keys\nensure ng_garages\nensure ng_vehicleshop\nensure ng_police\nensure ng_robberies\nensure ng_mechanic\nensure ng_housing')}
      <h2 id="s-portal">Downloading your scripts</h2>
      <ol><li>Go to <a class="mint" href="https://portal.cfx.re/assets/granted-assets" target="_blank" rel="noopener noreferrer">the Cfx.re Portal, Granted Assets</a>.</li><li>Download the latest version of each script.</li><li>Your server must use a license key from the <b>same Cfx.re account</b>, otherwise the protected files won't load.</li></ol>
      ${products.map(p => `<h2 id="s-p${p.id}">${esc(p.name)}</h2>
        <p>${esc(p.d.intro || '')}</p><h3>Install</h3><ol>${(p.d.install || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol>
        ${p.d.requires ? `<h3>Requirements</h3><ul>${p.d.requires.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
        <h3>Commands</h3><ul>${(p.d.commands || []).map(c => `<li><code>${esc(c[0])}</code>${c[1] ? ` (<kbd>${esc(c[1])}</kbd>)` : ''}: ${esc(c[2])}</li>`).join('')}</ul>
        <p><a class="mint" href="#product-${p.id}">Everything about ${esc(title(p))}</a></p>`).join('')}
      <h2 id="s-trouble">Troubleshooting</h2>${TROUBLE.map(t => `<h3>${esc(t[0])}</h3><p>${t[1]}</p>`).join('')}
    </div></div></div>`;
}
const TROUBLE = [
  ['"You lack the required entitlement", or the script won\'t start', 'Your server\'s license key must come from the same Cfx.re account that bought the script. Check the key in your server settings or txAdmin, and that the script is under Granted Assets for that account.'],
  ['Nothing happens in game', 'Make sure the script starts <b>after</b> your framework, oxmysql and inventory in <code>server.cfg</code>, and look for red errors in the server console when it starts.'],
  ['I can\'t open the settings menu', 'Add the <code>northgate.owner</code> ace for your Discord ID (see Owner access), restart, and try again. The server console can also run <code>&lt;resource&gt;_settings</code>.'],
  ['Locations are in the wrong place on my map', 'Use the script\'s admin menu (for example /policeadmin, /mechanicadmin or /garageadmin) to walk to each spot and set it. Custom MLOs often sit on top of the default spots.'],
  ['Two scripts are doing the same thing', 'Stop the old script (for example qb-garages, qb-vehicleshop, qb-hud or another keys script). Only one of each should run.'],
  ['The Luxury Autos interior is missing', 'It needs game build 2699 or newer: add <code>sv_enforceGameBuild 2699</code> to server.cfg.'],
];

const viewSupport = () => `<div class="wrap page"><h1 class="disp">Support</h1>
  <p class="lede">Help with setup, bugs and questions comes from the people who wrote the scripts. The fastest way is a ticket on our Discord.</p>
  <div class="facts three">
    <div>${ic('chat', 26)}<h3>Open a ticket</h3><p>Join the Discord and open a ticket. Tell us the script, your framework and any console errors.</p><a class="btn p sm" href="${DISCORD}" target="_blank" rel="noopener noreferrer">Open Discord</a></div>
    <div>${ic('bag', 26)}<h3>Find your purchase</h3><p>Everything you've bought is in the Cfx.re Portal under Granted Assets, on the account you signed in with at checkout.</p><a class="btn ghost sm" href="https://portal.cfx.re/assets/granted-assets" target="_blank" rel="noopener noreferrer">Open the Cfx.re Portal</a></div>
    <div>${ic('settings', 26)}<h3>Read the docs</h3><p>Install steps, start order, commands and owner access for every script, in one place.</p><a class="btn ghost sm" href="#docs">Open the docs</a></div>
  </div>
  <h2 class="disp sm">Common problems</h2><div class="faq">${TROUBLE.map(faqItem).join('')}</div>
  <h2 class="disp sm">What to send us</h2>
  <ul class="ticks cols"><li>Which script, and its version (in fxmanifest.lua)</li><li>Your framework and inventory</li><li>Any red errors from the server or F8 console</li><li>What you expected, and what happened instead</li></ul>
  </div>`;
// Release notes, grouped by day
function changes(list, named = true) {
  const days = [...new Set(list.map(c => c[0]))];
  return `<div class="clog">${days.map(day => `<div class="cday"><h3><time datetime="${day}">${fmtDate(day)}</time></h3>${list.filter(c => c[0] === day).map(([, id, v, notes]) => {
    const p = byId[id];
    return `<article class="crel">${named && p ? `<a class="cn" href="#product-${id}">${ic(p.d.icon, 18, 1.9)} ${esc(title(p))}</a>` : ''}<span class="cv">v${esc(v)}</span><ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></article>`;
  }).join('')}</div>`).join('')}</div>`;
}
const CL = {};
function viewChangelog() {
  const list = (D.changelog || []).filter(c => !CL.id || c[1] === CL.id);
  const ids = [...new Set((D.changelog || []).map(c => c[1]))].filter(id => byId[id]);
  return `<div class="wrap page"><h1 class="disp">Updates</h1>
    <p class="lede">Every change to every script, newest first. Updates are free: download the latest version from the Cfx.re Portal, under Granted Assets.</p>
    <nav class="chips" aria-label="Filter by script"><a class="chip${!CL.id ? ' on' : ''}" href="#changelog" data-cl="0">All scripts</a>${ids.map(id => `<a class="chip${CL.id === id ? ' on' : ''}" href="#changelog" data-cl="${id}">${esc(title(byId[id]))}</a>`).join('')}</nav>
    ${changes(list)}
    <div class="vers"><h2 class="disp sm">Latest versions</h2><div class="tblwrap"><table class="tbl"><thead><tr><th>Script</th><th>Version</th><th>Updated</th></tr></thead><tbody>${products.map(p => `<tr><td><a href="#product-${p.id}">${esc(p.name)}</a></td><td><code>${esc(p.d.version || '')}</code></td><td>${lastUpdate(p) ? fmtDate(lastUpdate(p)) : '–'}</td></tr>`).join('')}</tbody></table></div></div>
  </div>${cta()}`;
}
const viewRoadmap = () => `<div class="wrap page"><h1 class="disp">Roadmap</h1>
  <p class="lede">Released, in progress and planned. Plans change based on what server owners ask for, so tell us on Discord.</p>${roadmap(true)}</div>${cta()}`;
const viewFaq = () => `<div class="wrap page"><h1 class="disp">Questions</h1><p class="lede">Can't find your answer? Ask us on Discord.</p><div class="faq">${FAQ.map(faqItem).join('')}</div></div>${cta()}`;
const viewTerms = () => `<div class="wrap page"><h1 class="disp">Terms of sale</h1>
  <div class="doc" style="max-width:760px">
    <h3>Who you're buying from</h3><p>Scripts are sold by Northgate Studios. Payment, billing and refunds are handled by Tebex Limited, our payment provider, under their own checkout terms.</p>
    <h3>What you get</h3><p>A licence to use the script on servers running a license key from the Cfx.re account you signed in with at checkout, delivered through the Cfx.re Portal. Free updates for that script are included.</p>
    <h3>What you can't do</h3><p>Resell, share, re-upload or leak the scripts or their protected files, or try to remove the FiveM Escrow protection. You can edit the open files (config, language files, bridge) for your own servers.</p>
    <h3>Refunds</h3><p>Scripts are digital and delivered instantly, so purchases are generally final. If a script doesn't work as described and we can't fix it, contact us on Discord and we'll work it out with you.</p>
    <h3>Not affiliated</h3><p>Northgate Studios is not affiliated with or endorsed by Rockstar Games, Take-Two Interactive or Cfx.re.</p>
  </div></div>`;
const viewThanks = () => `<div class="wrap page thanks"><h1 class="disp">Thank you</h1>
  <p class="lede">Your scripts are on their way to your Cfx.re account. Download them from the Cfx.re Portal under Granted Assets, then follow the install steps in the docs.</p>
  <div class="btns"><a class="btn p" href="https://portal.cfx.re/assets/granted-assets" target="_blank" rel="noopener noreferrer">Open my assets</a><a class="btn ghost" href="#docs">Install guide</a><a class="btn ghost" href="${DISCORD}" target="_blank" rel="noopener noreferrer">Get support</a></div></div>`;

// ------------------------------------------------------------------ search
function openSearch(on) {
  document.body.classList.toggle('searching', on);
  $('#search').setAttribute('aria-hidden', on ? 'false' : 'true');
  if (on) { $('#q').value = ''; renderSearch(''); $('#q').focus(); }
}
function renderSearch(q) {
  q = q.trim().toLowerCase();
  const hits = products.map(p => {
    const hay = [p.name, tagline(p), p.d.intro, ...(p.d.highlights || []).flat(), ...(p.d.features || []).flatMap(f => f[1]), ...(p.d.commands || []).map(c => c[0] + ' ' + c[2])].join(' \n ');
    if (!q) return [p, ''];
    const i = hay.toLowerCase().indexOf(q);
    if (i < 0) return null;
    const s = Math.max(0, i - 40), snip = hay.slice(s, i + q.length + 60).replace(/\n/g, '');
    return [p, (s ? '…' : '') + esc(snip).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), m => `<mark>${m}</mark>`) + '…'];
  }).filter(Boolean);
  $('#qres').innerHTML = hits.length ? hits.map(([p, s]) => `<a href="#product-${p.id}">${ic(p.d.icon, 22)}<span><b>${esc(p.name)}</b><span>${s || esc(tagline(p))}</span></span></a>`).join('') : `<div class="empty">Nothing found for "${esc(q)}". Try a command like /duty, or a word like "invoice".</div>`;
}

// ------------------------------------------------------------------ image viewer
function zoom(src) {
  const z = $('#zoom'); $('img', z).src = src; z.classList.add('on'); z.setAttribute('aria-hidden', 'false'); $('button', z).focus();
}
function unzoom() { const z = $('#zoom'); z.classList.remove('on'); z.setAttribute('aria-hidden', 'true'); }

// ------------------------------------------------------------------ router
function route() {
  const h = (location.hash || '#home').slice(1) || 'home';
  document.body.classList.remove('menuopen');
  openBag(false); openSearch(false); unzoom();
  $$('.links a[data-r]').forEach(a => a.classList.toggle('on', h.startsWith(a.dataset.r) || (a.dataset.r === 'store' && h.startsWith('product'))));
  let html, t = 'Northgate Studios | Premium FiveM scripts';
  if (h === 'thanks') { bag = []; saveBag(); ls.del('ng_checkout'); if (account) { account.ident = null; ls.set('ng_account', account); } html = viewThanks(); t = 'Thank you | Northgate Studios'; }
  else if (pack && h === 'product-' + pack.id) { html = viewPack(); t = 'Complete Pack | Northgate Studios'; }
  else if (h === 'changelog') { html = viewChangelog(); t = 'Updates | Northgate Studios'; }
  else if (h.startsWith('product-')) { const p = byId[+h.slice(8)]; html = viewProduct(+h.slice(8)); t = (p ? p.name : 'Script') + ' | Northgate Studios'; }
  else if (h.startsWith('store')) { html = viewStore(h.split('-')[1]); t = 'Scripts | Northgate Studios'; }
  else if (h === 'compatibility') { html = viewCompat(); t = 'Compatibility | Northgate Studios'; }
  else if (h === 'docs') { html = viewDocs(); t = 'Docs | Northgate Studios'; }
  else if (h === 'support') { html = viewSupport(); t = 'Support | Northgate Studios'; }
  else if (h === 'roadmap') { html = viewRoadmap(); t = 'Roadmap | Northgate Studios'; }
  else if (h === 'faq') { html = viewFaq(); t = 'Questions | Northgate Studios'; }
  else if (h === 'terms') { html = viewTerms(); t = 'Terms | Northgate Studios'; }
  else html = viewHome();
  document.title = t;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  mountScreens();
  spy();
  navTop();
  if (!reduced) motion();
}

function spy() {
  const links = $$('.subnav a[data-jump]');
  if (!links.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', 's-' + a.dataset.jump === e.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
  $$('.psec[id]').forEach(s => io.observe(s));
}

// ------------------------------------------------------------------ events
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-buy],[data-rm],[data-zoom],[data-jump],[data-copy],[data-shelf],[data-car],[data-addall],[data-swap],[data-cl],#checkout');
  if (!t) return;
  if (t.dataset.add) { e.preventDefault(); add(+t.dataset.add, !t.dataset.keep); }
  else if (t.dataset.buy) { e.preventDefault(); if (!bag.includes(+t.dataset.buy)) add(+t.dataset.buy, false); checkout(); }
  else if (t.dataset.rm) remove(+t.dataset.rm);
  else if (t.dataset.zoom) { e.preventDefault(); zoom(t.dataset.zoom); }
  else if (t.dataset.jump) { e.preventDefault(); const el = $('#s-' + t.dataset.jump); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
  else if (t.dataset.copy) { e.preventDefault(); (navigator.clipboard ? navigator.clipboard.writeText(t.dataset.copy) : Promise.reject()).then(() => toast('Copied')).catch(() => toast('Select the text to copy it')); }
  else if (t.dataset.shelf !== undefined) { e.preventDefault(); shelf = t.dataset.shelf; $('#shelf').innerHTML = shelfHtml(); $$('[data-shelf]').forEach(b => b.classList.toggle('on', b.dataset.shelf === shelf)); syncButtons(); }
  else if (t.dataset.car) { const tr = $('#track'); tr.scrollBy({ left: +t.dataset.car * tr.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' }); }
  else if (t.dataset.addall) { e.preventDefault(); addAll(); }
  else if (t.dataset.swap) { e.preventDefault(); swapToPack(); }
  else if (t.dataset.cl !== undefined) { e.preventDefault(); CL.id = +t.dataset.cl; const y = scrollY; app.innerHTML = viewChangelog(); scrollTo(0, y); }
  else if (t.id === 'checkout') checkout();
});
// Account button: sign in, or open the account menu
document.addEventListener('click', e => {
  const b = e.target.closest('#loginBtn'), m = $('#acctMenu');
  if (b) { e.preventDefault(); if (account && account.username) m.classList.toggle('hide'); else login(); return; }
  if (e.target.closest('#logoutBtn')) { e.preventDefault(); logout(); return; }
  if (m && !e.target.closest('#acctMenu')) m.classList.add('hide');
});
// The numbered list changes the big picture beside it
document.addEventListener('mouseover', e => { const l = e.target.closest && e.target.closest('[data-pic]'); if (!l) return; const im = $('#fimg'); if (im && im.getAttribute('src') !== l.dataset.pic) im.src = l.dataset.pic; $$('[data-pic]').forEach(x => x.classList.toggle('on', x === l)); });
document.addEventListener('input', e => {
  if (e.target.id === 'q') renderSearch(e.target.value);
  if (e.target.id === 'storeQ') { S.q = e.target.value; const pos = e.target.selectionStart; route2(); const n = $('#storeQ'); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener('change', e => { if (e.target.id === 'storeSort') { S.sort = e.target.value; route2(); } });
function route2() { const y = scrollY; const h = (location.hash || '#home').slice(1); app.innerHTML = viewStore(h.split('-')[1]); scrollTo(0, y); }
$('#bagBtn').onclick = () => openBag(true);
$('#closeBag').onclick = () => openBag(false);
$('#searchBtn').onclick = () => openSearch(true);
$('#shade').onclick = () => { openBag(false); openSearch(false); };
$('#search').onclick = e => { if (e.target.id === 'search') openSearch(false); };
$('#zoom').onclick = e => { if (e.target.tagName !== 'IMG') unzoom(); };
$('#menuBtn').onclick = () => document.body.classList.toggle('menuopen');
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { openBag(false); openSearch(false); unzoom(); }
  if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(true); }
  if (e.key === 'Enter' && document.activeElement.id === 'q') { const a = $('#qres a'); if (a) location.hash = a.getAttribute('href'); }
});
window.addEventListener('hashchange', () => ready && route());
// The nav is see-through over the city at the top of the home page
// Cards: play the gameplay clip while the pointer is over the picture
document.addEventListener('mouseover', e => { const im = e.target.closest('.im.hasv'); if (!im) return; const v = im.querySelector('video'); if (v && v.paused) { v.play().catch(() => {}); im.classList.add('on'); } });
document.addEventListener('mouseout', e => { const im = e.target.closest('.im.hasv'); if (!im || im.contains(e.relatedTarget)) return; const v = im.querySelector('video'); if (v) { v.pause(); im.classList.remove('on'); } });
function navTop() { document.body.classList.toggle('top', scrollY < 10); }
addEventListener('scroll', navTop, { passive: true });
// Scroll motion: the hero tablets straighten and spread apart, spotlight pictures drift past the text
let sraf = 0;
function motion() {
  sraf = 0;
  const hart = $('.hart'), H = innerHeight;
  if (hart) hart.style.setProperty('--sp', Math.min(1, Math.max(0, scrollY / (H * 0.8))).toFixed(3));
  $$('.spot,.packb').forEach(s => { const r = s.getBoundingClientRect(); if (r.bottom < 0 || r.top > H) return; s.style.setProperty('--pp', Math.min(1, Math.max(0, (H - r.top) / (H + r.height))).toFixed(3)); });
}
if (!reduced) { addEventListener('scroll', () => { if (!sraf) sraf = requestAnimationFrame(motion); }, { passive: true }); addEventListener('resize', motion); }
$('#yr').textContent = new Date().getFullYear();

let tt;
function toast(msg, bad) {
  const t = $('#toast'); t.textContent = msg; t.classList.toggle('bad', !!bad); t.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), bad ? 6000 : 2400);
}

app.innerHTML = '<div class="wrap page loading"><div class="spin"></div><p>Loading the store…</p></div>';
load().then(() => {
  ready = true;
  bag = bag.filter(id => byId[id]);
  saveBag();
  $('#footScripts').innerHTML = products.map(p => `<a href="#product-${p.id}">${esc(title(p))}</a>`).join('');
  accountUI();
  loginReturn();
  if (!resume()) route();
}).catch(err => {
  app.innerHTML = `<div class="wrap page loading"><p>The store couldn't load (${esc(err.message)}). Refresh the page, or reach us on <a class="mint" href="${DISCORD}">Discord</a>.</p></div>`;
});
})();
