/* =========================================================
   Tri J Sports Training Hub — app.js  (Backend-Connected)
   Updated: Uses Express + SQLite backend API
   Replace your old app.js with this file.
   ========================================================= */

'use strict';

// ── API base URL — change this if your server runs on a different port
const API = '/api';

/* ─────────────────────────────────────────────
   DATA (still used for UI rendering — coaches/sports come from backend too,
   but we keep these for fast local rendering of cards/modals)
───────────────────────────────────────────── */
const SPORTS = [
  { id:'boxing',      emoji:'🥊', name:'Boxing',      category:'combat',     difficulty:'Hard',   duration:'8–12 weeks', desc:'Master stance, footwork, combinations and ring strategy under world-class trainers.' },
  { id:'football',    emoji:'⚽', name:'Football',    category:'team',       difficulty:'Medium', duration:'6–10 weeks', desc:'Improve ball control, passing, tactical awareness and match-play fitness.' },
  { id:'swimming',    emoji:'🏊', name:'Swimming',    category:'water',      difficulty:'Medium', duration:'4–8 weeks',  desc:'Refine all four strokes, turns, starts and race-pace conditioning.' },
  { id:'weightlifting',emoji:'🏋️',name:'Weightlifting',category:'individual',difficulty:'Hard',   duration:'10–16 weeks',desc:'Build strength, power and technique with Olympic lifting programming.' },
  { id:'tennis',      emoji:'🎾', name:'Tennis',      category:'individual', difficulty:'Medium', duration:'6–10 weeks', desc:'Develop serve mechanics, groundstrokes, net play and match tactics.' },
  { id:'basketball',  emoji:'🏀', name:'Basketball',  category:'team',       difficulty:'Medium', duration:'6–8 weeks',  desc:'Work on dribbling, shooting, court vision and team defensive systems.' },
  { id:'gymnastics',  emoji:'🤸', name:'Gymnastics',  category:'individual', difficulty:'Hard',   duration:'12–20 weeks',desc:'Train flexibility, strength, apparatus skills and competition routines.' },
  { id:'archery',     emoji:'🏹', name:'Archery',     category:'individual', difficulty:'Easy',   duration:'4–6 weeks',  desc:'Perfect form, breath control, aiming technique and mental focus.' },
  { id:'mma',         emoji:'🥋', name:'MMA',         category:'combat',     difficulty:'Hard',   duration:'12–16 weeks',desc:'Blend striking, grappling and wrestling into a complete fighting system.' },
  { id:'cycling',     emoji:'🚴', name:'Cycling',     category:'individual', difficulty:'Easy',   duration:'4–8 weeks',  desc:'Build endurance, climbing power and race-day pacing strategy.' },
  { id:'volleyball',  emoji:'🏐', name:'Volleyball',  category:'team',       difficulty:'Medium', duration:'6–8 weeks',  desc:'Sharpen serve, pass, set and spike with advanced team tactics.' },
  { id:'taekwondo',   emoji:'🦵', name:'Taekwondo',   category:'combat',     difficulty:'Medium', duration:'8–12 weeks', desc:'Learn kicks, forms (poomsae), sparring and Olympic-style competition.' },
];

const COACHES = [
  { id:1, name:'Carlos Mendoza',   flag:'🇲🇽', country:'Mexico',      sport:'Boxing',       title:'Former WBC Contender',          cost:120, costLabel:'$120 / session', duration:'8 wks',  difficulty:'Hard',   rating:4.9, reviews:214, bio:'17 years of professional boxing. Trained Olympic-level fighters across Latin America. Specialises in southpaw technique and defensive boxing.' },
  { id:2, name:'Sophie Laurent',   flag:'🇫🇷', country:'France',      sport:'Tennis',       title:'WTA Certified Coach',           cost:95,  costLabel:'$95 / session',  duration:'6 wks',  difficulty:'Medium', rating:4.8, reviews:178, bio:'Former WTA top-200 player. Now coaches junior and adult athletes on clay and hard courts. Renowned for serve reconstruction programmes.' },
  { id:3, name:'James Okafor',     flag:'🇳🇬', country:'Nigeria',     sport:'Football',     title:'UEFA Pro Licence',              cost:85,  costLabel:'$85 / session',  duration:'6 wks',  difficulty:'Medium', rating:4.7, reviews:301, bio:'Coached in the Nigerian Premier League and European youth academies. Focuses on positional play and high-press tactical systems.' },
  { id:4, name:'Yuki Tanaka',      flag:'🇯🇵', country:'Japan',       sport:'Gymnastics',   title:'FIG Level 4 Coach',             cost:110, costLabel:'$110 / session', duration:'12 wks', difficulty:'Hard',   rating:4.9, reviews:143, bio:'Trained national-level gymnasts for 12 years. Expert in floor exercise and vault. Known for injury-safe progressive skill building.' },
  { id:5, name:'Emma Schulz',      flag:'🇩🇪', country:'Germany',     sport:'Swimming',     title:'Olympic Pool Coach',            cost:100, costLabel:'$100 / session', duration:'8 wks',  difficulty:'Medium', rating:4.8, reviews:192, bio:'Former German national team swimmer. Specialises in butterfly and individual medley technique with elite periodisation planning.' },
  { id:6, name:'Rafael Torres',    flag:'🇨🇴', country:'Colombia',    sport:'Cycling',      title:'UCI Level 2 Coach',             cost:75,  costLabel:'$75 / session',  duration:'6 wks',  difficulty:'Easy',   rating:4.7, reviews:126, bio:'Competitive road and mountain cyclist with 10 years of coaching. Specialises in altitude training adaptation and power output.' },
  { id:7, name:'Park Ji-ho',       flag:'🇰🇷', country:'South Korea', sport:'Taekwondo',    title:'3rd Dan Black Belt, Olympian',  cost:90,  costLabel:'$90 / session',  duration:'8 wks',  difficulty:'Medium', rating:5.0, reviews:89,  bio:'Olympic Taekwondo athlete and certified ITF/WT coach. Trains competitors from beginner to national team level.' },
  { id:8, name:'Aisha Kamara',     flag:'🇬🇭', country:'Ghana',       sport:'Basketball',   title:'FIBA Level 2 Coach',            cost:80,  costLabel:'$80 / session',  duration:'6 wks',  difficulty:'Medium', rating:4.6, reviews:157, bio:'Played professionally in Europe and Africa. Focuses on guard play, offensive spacing and defensive intensity at the team level.' },
  { id:9, name:'Dmitri Volkov',    flag:'🇷🇺', country:'Russia',      sport:'Weightlifting',title:'World Championships Bronze',    cost:130, costLabel:'$130 / session', duration:'12 wks', difficulty:'Hard',   rating:4.9, reviews:98,  bio:'World-level competitive weightlifter with deep expertise in snatch and clean-and-jerk mechanics for all body types and skill levels.' },
  { id:10,name:'Maria Santos',     flag:'🇧🇷', country:'Brazil',      sport:'Volleyball',   title:'CBV Certified, Pro League Vet', cost:85,  costLabel:'$85 / session',  duration:'6 wks',  difficulty:'Medium', rating:4.8, reviews:211, bio:'Played in the Brazilian Superliga. Expert in libero play, team serve-receive systems and individual skill acceleration.' },
  { id:11,name:'Ben Harrington',   flag:'🇦🇺', country:'Australia',   sport:'MMA',          title:'UFC-Trained Coach',             cost:140, costLabel:'$140 / session', duration:'12 wks', difficulty:'Hard',   rating:4.9, reviews:174, bio:'Licensed MMA coach with background in BJJ, Muay Thai and wrestling. Builds complete fighters from the ground up safely and progressively.' },
  { id:12,name:'Lea Hoffmann',     flag:'🇦🇹', country:'Austria',     sport:'Archery',      title:'World Archery Level 3',         cost:65,  costLabel:'$65 / session',  duration:'4 wks',  difficulty:'Easy',   rating:4.7, reviews:72,  bio:'Recurve and compound specialist. Teaches correct form, shot cycle, mental preparation and equipment tuning for competition.' },
];

const PACKAGES = [
  { id:'starter', name:'Starter',   sessions:4,  desc:'4 sessions · 1×/week',  priceMultiplier:1   },
  { id:'athlete', name:'Athlete',   sessions:8,  desc:'8 sessions · 2×/week',  priceMultiplier:1.8 },
  { id:'elite',   name:'Elite Pro', sessions:16, desc:'16 sessions · 4×/week', priceMultiplier:3.2 },
];

/* ─────────────────────────────────────────────
   API SERVICE LAYER  ← replaces old DB object
   All data is now saved to the real backend/database
───────────────────────────────────────────── */
const API_SERVICE = {

  // Register a new user
  async register(name, email, password, country) {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, country }),
    });
    return res.json(); // { message, user } or { error }
  },

  // Log in a user
  async login(email, password) {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json(); // { message, user } or { error }
  },

  // Save a booking to the database
  async saveBooking(bookingData) {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return res.json();
  },

  // Get all bookings for a user from the database
  async getBookings(email) {
    const res = await fetch(`${API}/bookings/${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.bookings || [];
  },

  // Save a receipt to the database
  async saveReceipt(receiptData) {
    const res = await fetch(`${API}/receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receiptData),
    });
    return res.json();
  },

  // Get all receipts for a user from the database
  async getReceipts(email) {
    const res = await fetch(`${API}/receipts/${encodeURIComponent(email)}`);
    const data = await res.json();
    return data.receipts || [];
  },
};

/* ─────────────────────────────────────────────
   APP STATE
───────────────────────────────────────────── */
const state = {
  currentSection: 'home',
  currentFilter: 'all',
  coachQuery: '',
  user: null,
  bookingDraft: null,
  receipts: [],
  portalTab: 'overview',
  authTab: 'login',
  toastTimer: null,
};

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  bindNav();
  bindDrawer();
  bindFilterBtns();
  bindCoachSearch();
  bindSportModalClose();
  bindCoachModalClose();
  bindBookSportChange();

  // Check for session saved in sessionStorage (tab session only)
  const sessionData = sessionStorage.getItem('trij_active_session');
  if (sessionData) {
    state.user = JSON.parse(sessionData);
    loadUserReceipts(state.user.email);
  }

  renderHomeSports();
  renderSportsHub();
  renderCoaches();
  populateBookSport();
  setMinDate();
});

// Load receipts from the real database
async function loadUserReceipts(email) {
  try {
    state.receipts = await API_SERVICE.getReceipts(email);
    refreshDashStats();
    renderUpcoming();
    renderReceipts();
  } catch (err) {
    console.error('Could not load receipts:', err);
  }
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
function bindNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.section);
    });
  });
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeDrawer();
      navigateTo(link.dataset.section);
    });
  });
}

function navigateTo(section) {
  if (state.currentSection === section) return;
  const prev = document.getElementById('section-' + state.currentSection);
  if (prev) prev.classList.remove('active');
  const next = document.getElementById('section-' + section);
  if (next) next.classList.add('active');
  state.currentSection = section;
  document.querySelectorAll('.nav-link, .drawer-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === section);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (section === 'portal') refreshPortalView();
}

/* ─────────────────────────────────────────────
   HAMBURGER / DRAWER
───────────────────────────────────────────── */
function bindDrawer() {
  const hamburger = document.getElementById('hamburger');
  const drawerClose = document.getElementById('drawerClose');
  const overlay = document.getElementById('drawerOverlay');
  hamburger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}

function openDrawer() {
  document.getElementById('navDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   HOME — SPORTS PREVIEW
───────────────────────────────────────────── */
function renderHomeSports() {
  const grid = document.getElementById('homesSportsGrid');
  if (!grid) return;
  const preview = SPORTS.slice(0, 6);
  grid.innerHTML = preview.map(s => sportCardHTML(s)).join('');
  grid.querySelectorAll('.sport-card').forEach(card => {
    card.addEventListener('click', () => openSportModal(card.dataset.id));
  });
}

function sportCardHTML(s) {
  return `
    <div class="sport-card" data-id="${s.id}">
      <div class="sc-emoji">${s.emoji}</div>
      <div class="sc-name">${s.name}</div>
      <div class="sc-meta">
        <span class="sc-tag ${s.category}">${s.category}</span>
        <span class="sc-diff">${s.difficulty}</span>
      </div>
      <div class="sc-duration">⏱ ${s.duration}</div>
    </div>`;
}

/* ─────────────────────────────────────────────
   SPORTS HUB
───────────────────────────────────────────── */
function bindFilterBtns() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentFilter = btn.dataset.filter;
      renderSportsHub();
    });
  });
}

function renderSportsHub() {
  const grid = document.getElementById('sportsHubGrid');
  if (!grid) return;
  const filtered = state.currentFilter === 'all'
    ? SPORTS
    : SPORTS.filter(s => s.category === state.currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><span class="es-icon">🏟️</span>No sports in this category.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => `
    <div class="sport-hub-card" data-id="${s.id}">
      <div class="shc-top">
        <span class="shc-emoji">${s.emoji}</span>
        <span class="sc-tag ${s.category}">${s.category}</span>
      </div>
      <div class="shc-name">${s.name}</div>
      <div class="shc-desc">${s.desc}</div>
      <div class="shc-meta">
        <span>⏱ ${s.duration}</span>
        <span class="shc-diff diff-${s.difficulty.toLowerCase()}">${s.difficulty}</span>
      </div>
      <button class="shc-btn">View Details →</button>
    </div>`).join('');

  grid.querySelectorAll('.sport-hub-card').forEach(card => {
    card.querySelector('.shc-btn').addEventListener('click', () => openSportModal(card.dataset.id));
  });
}

/* ─────────────────────────────────────────────
   SPORT MODAL
───────────────────────────────────────────── */
function bindSportModalClose() {
  const overlay = document.getElementById('sportModal');
  const closeBtn = document.getElementById('sportModalClose');
  closeBtn.addEventListener('click', closeSportModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSportModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSportModal(); });
}

function openSportModal(id) {
  const sport = SPORTS.find(s => s.id === id);
  if (!sport) return;
  const coaches = COACHES.filter(c => c.sport === sport.name);
  const content = document.getElementById('sportModalContent');

  content.innerHTML = `
    <div class="modal-sport-header">
      <span class="modal-sport-emoji">${sport.emoji}</span>
      <div>
        <h2 class="modal-sport-name">${sport.name}</h2>
        <span class="sc-tag ${sport.category}">${sport.category}</span>
      </div>
    </div>
    <p class="modal-sport-desc">${sport.desc}</p>
    <div class="modal-sport-meta">
      <div class="msm-item"><span class="msm-label">Duration</span><span class="msm-val">⏱ ${sport.duration}</span></div>
      <div class="msm-item"><span class="msm-label">Difficulty</span><span class="msm-val diff-${sport.difficulty.toLowerCase()}">${sport.difficulty}</span></div>
      <div class="msm-item"><span class="msm-label">Coaches</span><span class="msm-val">${coaches.length} available</span></div>
    </div>
    ${coaches.length > 0 ? `
    <h3 class="modal-coaches-title">Available Coaches</h3>
    <div class="modal-coaches-list">
      ${coaches.map(c => `
        <div class="modal-coach-item" onclick="closeSportModal();navigateTo('coaches')">
          <span class="mci-flag">${c.flag}</span>
          <div class="mci-info">
            <strong>${c.name}</strong>
            <span>${c.country} · ${c.costLabel}</span>
          </div>
          <span class="mci-rating">⭐ ${c.rating}</span>
        </div>`).join('')}
    </div>` : '<p class="modal-sport-desc">Coaches coming soon.</p>'}
    <button class="btn-primary full-btn mt-16" onclick="closeSportModal();if(state.user){navigateTo('portal');setTimeout(()=>switchPortalTab('book'),100);}else{navigateTo('portal');}">
      Book This Sport →
    </button>`;

  document.getElementById('sportModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSportModal() {
  document.getElementById('sportModal').classList.remove('open');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────
   COACHES
───────────────────────────────────────────── */
function bindCoachSearch() {
  const input = document.getElementById('coachSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    state.coachQuery = input.value.trim().toLowerCase();
    renderCoaches();
  });
}

function renderCoaches() {
  const grid = document.getElementById('coachesGrid');
  if (!grid) return;
  const q = state.coachQuery;
  const filtered = q
    ? COACHES.filter(c => c.name.toLowerCase().includes(q) || c.sport.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    : COACHES;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="es-icon">👤</span>No coaches found.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(c => `
    <div class="coach-card" data-id="${c.id}">
      <div class="cc-top">
        <span class="cc-flag">${c.flag}</span>
        <div class="cc-meta-top">
          <span class="cc-country">${c.country}</span>
          <span class="cc-rating">⭐ ${c.rating} <em>(${c.reviews})</em></span>
        </div>
      </div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-title">${c.title}</div>
      <div class="cc-sport-tag">${c.sport}</div>
      <div class="cc-details">
        <span>💰 ${c.costLabel}</span>
        <span>⏱ ${c.duration}</span>
        <span class="diff-${c.difficulty.toLowerCase()}">${c.difficulty}</span>
      </div>
      <button class="cc-btn">View Profile →</button>
    </div>`).join('');

  grid.querySelectorAll('.coach-card').forEach(card => {
    card.querySelector('.cc-btn').addEventListener('click', () => openCoachModal(+card.dataset.id));
  });
}

/* ─────────────────────────────────────────────
   COACH MODAL
───────────────────────────────────────────── */
function bindCoachModalClose() {
  const overlay = document.getElementById('coachModal');
  const closeBtn = document.getElementById('coachModalClose');
  closeBtn.addEventListener('click', closeCoachModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCoachModal(); });
}

function openCoachModal(id) {
  const c = COACHES.find(x => x.id === id);
  if (!c) return;
  const sport = SPORTS.find(s => s.name === c.sport);
  const content = document.getElementById('coachModalContent');
  const stars = '★'.repeat(Math.floor(c.rating)) + (c.rating % 1 >= 0.5 ? '½' : '');

  content.innerHTML = `
    <div class="modal-coach-header">
      <span class="modal-coach-flag">${c.flag}</span>
      <div>
        <h2 class="modal-coach-name">${c.name}</h2>
        <div class="modal-coach-title">${c.title}</div>
        <div class="modal-coach-loc">${c.country} · ${c.sport} ${sport ? sport.emoji : ''}</div>
      </div>
    </div>
    <div class="modal-coach-rating">
      <span class="mcr-stars">${stars}</span>
      <span class="mcr-score">${c.rating}</span>
      <span class="mcr-reviews">(${c.reviews} reviews)</span>
    </div>
    <p class="modal-coach-bio">${c.bio}</p>
    <div class="modal-coach-meta">
      <div class="mcm-item"><span class="mcm-label">Cost</span><span class="mcm-val">${c.costLabel}</span></div>
      <div class="mcm-item"><span class="mcm-label">Program</span><span class="mcm-val">⏱ ${c.duration}</span></div>
      <div class="mcm-item"><span class="mcm-label">Intensity</span><span class="mcm-val diff-${c.difficulty.toLowerCase()}">${c.difficulty}</span></div>
    </div>
    <button class="btn-primary full-btn mt-16" onclick="closeCoachModal();bookWithCoach(${c.id})">
      Book with ${c.name.split(' ')[0]} →
    </button>`;

  document.getElementById('coachModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCoachModal() {
  document.getElementById('coachModal').classList.remove('open');
  document.body.style.overflow = '';
}

function bookWithCoach(coachId) {
  if (!state.user) {
    navigateTo('portal');
    showToast('Please sign in first to book a session.');
    return;
  }
  const c = COACHES.find(x => x.id === coachId);
  if (!c) return;
  navigateTo('portal');
  setTimeout(() => {
    switchPortalTab('book');
    const sportSel = document.getElementById('bookSport');
    if (sportSel) {
      sportSel.value = c.sport;
      populateBookCoach(c.sport, coachId);
    }
  }, 150);
}

/* ─────────────────────────────────────────────
   AUTH — LOGIN / REGISTER  ← now uses real backend API
───────────────────────────────────────────── */
function switchAuthTab(tab) {
  state.authTab = tab;
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('loginForm').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? '' : 'none';
  clearAuthErrors();
}

function clearAuthErrors() {
  const le = document.getElementById('loginError');
  const re = document.getElementById('regError');
  if (le) le.textContent = '';
  if (re) re.textContent = '';
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const err   = document.getElementById('loginError');

  if (!email || !pass) { err.textContent = 'Please fill in all fields.'; return; }

  try {
    const result = await API_SERVICE.login(email, pass);

    if (result.error) {
      err.textContent = result.error;
      return;
    }

    loginSuccess(result.user);
  } catch (e) {
    err.textContent = 'Cannot connect to server. Make sure the backend is running.';
  }
}

async function handleRegister() {
  const name    = document.getElementById('regName').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPass').value;
  const country = document.getElementById('regCountry').value;
  const err     = document.getElementById('regError');

  if (!name || !email || !pass || !country) { err.textContent = 'Please fill in all fields.'; return; }
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Please enter a valid email.'; return; }

  try {
    const result = await API_SERVICE.register(name, email, pass, country);

    if (result.error) {
      err.textContent = result.error;
      return;
    }

    loginSuccess(result.user);
    showToast(`Welcome to Tri J, ${name}! 🎉`);
  } catch (e) {
    err.textContent = 'Cannot connect to server. Make sure the backend is running.';
  }
}

function loginSuccess(user) {
  state.user = user;
  // Use sessionStorage (tab-scoped, more secure than localStorage)
  sessionStorage.setItem('trij_active_session', JSON.stringify(user));
  state.bookingDraft = null;
  loadUserReceipts(user.email);
  refreshPortalView();
}

function handleLogout() {
  state.user = null;
  state.receipts = [];
  state.bookingDraft = null;
  sessionStorage.removeItem('trij_active_session');
  refreshPortalView();
  showToast("You've been signed out.");
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  clearAuthErrors();
}

function refreshPortalView() {
  if (state.user) {
    document.getElementById('portalAuth').style.display = 'none';
    document.getElementById('portalDashboard').style.display = '';
    document.getElementById('portalWelcome').textContent = `Welcome back, ${state.user.name.split(' ')[0]}!`;
    document.getElementById('portalEmail').textContent = state.user.email;
    refreshDashStats();
    renderUpcoming();
    renderReceipts();
    switchPortalTab(state.portalTab || 'overview');
  } else {
    document.getElementById('portalAuth').style.display = '';
    document.getElementById('portalDashboard').style.display = 'none';
    switchAuthTab(state.authTab || 'login');
  }
}

/* ─────────────────────────────────────────────
   PORTAL TABS
───────────────────────────────────────────── */
function switchPortalTab(tab) {
  state.portalTab = tab;
  document.querySelectorAll('.p-tab').forEach(t => t.classList.toggle('active', t.dataset.ptab === tab));
  document.querySelectorAll('.ptab-content').forEach(c => c.classList.toggle('active', c.id === 'ptab-' + tab));
}

/* ─────────────────────────────────────────────
   BOOKING UTILITIES
───────────────────────────────────────────── */
function populateBookSport() {
  const sel = document.getElementById('bookSport');
  if (!sel) return;
  sel.innerHTML = `<option value="">Select a sport…</option>` +
    SPORTS.map(s => `<option value="${s.name}">${s.emoji} ${s.name}</option>`).join('');
  sel.addEventListener('change', () => populateBookCoach(sel.value));
}

function bindBookSportChange() { /* handled in populateBookSport */ }

function populateBookCoach(sportName, preselectId = null) {
  const sel = document.getElementById('bookCoach');
  if (!sel) return;
  const coaches = COACHES.filter(c => c.sport === sportName);
  if (coaches.length === 0) {
    sel.innerHTML = `<option value="">No coaches for this sport yet</option>`;
  } else {
    sel.innerHTML = `<option value="">Select a coach…</option>` +
      coaches.map(c => `<option value="${c.id}" data-cost="${c.cost}">${c.flag} ${c.name} — ${c.costLabel}</option>`).join('');
    if (preselectId) sel.value = String(preselectId);
  }
  populatePackages(sportName);
  updateBookingSummary();
  sel.addEventListener('change', updateBookingSummary);
}

function populatePackages(sportName) {
  const container = document.getElementById('packageOptions');
  if (!container) return;
  container.innerHTML = PACKAGES.map((pkg, i) => `
    <div class="package-opt${i === 0 ? ' selected' : ''}" data-pkg="${pkg.id}" onclick="selectPackage('${pkg.id}')">
      <div>
        <div class="pkg-name">${pkg.name}</div>
        <div class="pkg-detail">${pkg.desc}</div>
      </div>
      <div class="pkg-price" id="pkg-price-${pkg.id}">—</div>
    </div>`).join('');
  updatePackagePrices();
}

function selectPackage(pkgId) {
  document.querySelectorAll('.package-opt').forEach(el => {
    el.classList.toggle('selected', el.dataset.pkg === pkgId);
  });
  updateBookingSummary();
}

function updatePackagePrices() {
  const coachSel = document.getElementById('bookCoach');
  if (!coachSel) return;
  const opt = coachSel.options[coachSel.selectedIndex];
  const baseRate = opt && opt.dataset.cost ? +opt.dataset.cost : 0;
  PACKAGES.forEach(pkg => {
    const el = document.getElementById('pkg-price-' + pkg.id);
    if (el) {
      const price = baseRate > 0 ? Math.round(baseRate * pkg.priceMultiplier) : '—';
      el.textContent = baseRate > 0 ? `$${price}` : '—';
    }
  });
}

function updateBookingSummary() {
  updatePackagePrices();
  const summary = document.getElementById('bookingSummary');
  if (!summary) return;

  const sportSel  = document.getElementById('bookSport');
  const coachSel  = document.getElementById('bookCoach');
  const dateSel   = document.getElementById('bookDate');
  const timeSel   = document.getElementById('bookTime');
  const selPkg    = document.querySelector('.package-opt.selected');

  const sport    = sportSel ? sportSel.value : '';
  const coachOpt = coachSel ? coachSel.options[coachSel.selectedIndex] : null;
  const coach    = coachOpt && coachOpt.value ? coachOpt.text : '';
  const baseRate = coachOpt && coachOpt.dataset.cost ? +coachOpt.dataset.cost : 0;
  const date     = dateSel ? dateSel.value : '';
  const time     = timeSel ? timeSel.value : '';
  const pkgId    = selPkg ? selPkg.dataset.pkg : 'starter';
  const pkg      = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];
  const total    = baseRate > 0 ? Math.round(baseRate * pkg.priceMultiplier) : 0;

  if (!sport || !coachOpt || !coachOpt.value) {
    summary.innerHTML = '';
    return;
  }

  const coachObj = COACHES.find(c => c.id === +coachOpt.value);
  summary.innerHTML = `
    <div class="bs-row"><span>Sport</span><span>${sport}</span></div>
    <div class="bs-row"><span>Coach</span><span>${coachObj ? coachObj.name : coach}</span></div>
    <div class="bs-row"><span>Package</span><span>${pkg.name} (${pkg.sessions} sessions)</span></div>
    ${date ? `<div class="bs-row"><span>Start Date</span><span>${formatDate(date)}</span></div>` : ''}
    ${time ? `<div class="bs-row"><span>Time</span><span>${time}</span></div>` : ''}
    <div class="bs-row bs-total"><span>Total</span><span>$${total}</span></div>`;

  state.bookingDraft = {
    sport, coachId: +(coachOpt.value), coachName: coachObj ? coachObj.name : '',
    coachFlag: coachObj ? coachObj.flag : '',
    date, time, package: pkg, total,
  };
}

function proceedToPayment() {
  if (!state.bookingDraft || !state.bookingDraft.sport) {
    showToast('Please select a sport and coach first.');
    return;
  }
  if (!state.bookingDraft.date) {
    showToast('Please choose a session date.');
    return;
  }
  if (!state.bookingDraft.coachId) {
    showToast('Please select a coach.');
    return;
  }

  const card = document.getElementById('paymentSummaryCard');
  const d = state.bookingDraft;
  card.innerHTML = `
    <div class="receipt-row"><span>Sport</span><span>${d.sport}</span></div>
    <div class="receipt-row"><span>Coach</span><span>${d.coachFlag} ${d.coachName}</span></div>
    <div class="receipt-row"><span>Package</span><span>${d.package.name} (${d.package.sessions} sessions)</span></div>
    <div class="receipt-row"><span>Date</span><span>${formatDate(d.date)}</span></div>
    <div class="receipt-row"><span>Time</span><span>${d.time}</span></div>
    <div class="receipt-row bs-total" style="border-top:1px solid rgba(201,113,74,.15);margin-top:6px;padding-top:8px">
      <span style="font-weight:700">Total</span>
      <span style="color:var(--red-mid);font-weight:700;font-size:1rem">$${d.total}</span>
    </div>`;

  document.getElementById('paymentForm').style.display = '';
  document.getElementById('paymentSuccess').style.display = 'none';
  switchPortalTab('payment');
}

/* ─────────────────────────────────────────────
   PAYMENT PROCESSING  ← now saves to real database
───────────────────────────────────────────── */

// Track selected payment method
state.paymentMethod = 'visa';

function selectPaymentMethod(method) {
  state.paymentMethod = method;

  // Update button active states
  document.querySelectorAll('.pm-option').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.method === method);
  });

  // Show/hide the right form fields
  const isCard = method === 'visa' || method === 'mastercard';
  document.getElementById('cardFields').style.display    = isCard    ? '' : 'none';
  document.getElementById('gcashFields').style.display   = method === 'gcash'    ? '' : 'none';
  document.getElementById('paymayaFields').style.display = method === 'paymaya'  ? '' : 'none';

  document.getElementById('payError').textContent = '';
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.match(/.{1,4}/g)?.join(' ') || v;
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

function formatPhone(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 11);
  if (v.length > 7) v = v.substring(0,4) + ' ' + v.substring(4,7) + ' ' + v.substring(7);
  else if (v.length > 4) v = v.substring(0,4) + ' ' + v.substring(4);
  input.value = v;
}

async function processPayment() {
  const err    = document.getElementById('payError');
  const method = state.paymentMethod || 'visa';
  err.textContent = '';

  if (!state.bookingDraft) { err.textContent = 'No booking found. Please go to Book Session.'; return; }

  let cardLast4 = '0000';

  if (method === 'visa' || method === 'mastercard') {
    const name = document.getElementById('cardName').value.trim();
    const num  = document.getElementById('cardNum').value.replace(/\s/g, '');
    const exp  = document.getElementById('cardExp').value;
    const cvv  = document.getElementById('cardCvv').value;
    if (!name)             { err.textContent = 'Please enter cardholder name.'; return; }
    if (num.length !== 16) { err.textContent = 'Please enter a valid 16-digit card number.'; return; }
    if (!/^\d{2}\/\d{2}$/.test(exp)) { err.textContent = 'Please enter expiry as MM/YY.'; return; }
    if (cvv.length < 3)    { err.textContent = 'Please enter a valid CVV.'; return; }
    cardLast4 = num.slice(-4);

  } else if (method === 'gcash') {
    const phone = document.getElementById('gcashPhone').value.replace(/\s/g, '');
    const ref   = document.getElementById('gcashRef').value.trim();
    if (phone.length < 11) { err.textContent = 'Please enter your 11-digit GCash number.'; return; }
    if (!ref)              { err.textContent = 'Please enter your GCash reference number.'; return; }
    cardLast4 = phone.slice(-4);

  } else if (method === 'paymaya') {
    const phone = document.getElementById('paymayaPhone').value.replace(/\s/g, '');
    const ref   = document.getElementById('paymayaRef').value.trim();
    if (phone.length < 11) { err.textContent = 'Please enter your 11-digit PayMaya number.'; return; }
    if (!ref)              { err.textContent = 'Please enter your PayMaya reference number.'; return; }
    cardLast4 = phone.slice(-4);
  }

  const receiptId = 'FRZ-' + Date.now().toString(36).toUpperCase();
  const now = new Date();

  try {
    // 1. Save booking to database
    const bookingResult = await API_SERVICE.saveBooking({
      user_email:    state.user.email,
      sport:         state.bookingDraft.sport,
      coach:         state.bookingDraft.coachName,
      date:          state.bookingDraft.date,
      time:          state.bookingDraft.time,
      package_name:  state.bookingDraft.package.name,
      package_price: state.bookingDraft.total,
    });

    // 2. Save receipt to database
    await API_SERVICE.saveReceipt({
      user_email:   state.user.email,
      booking_id:   bookingResult.booking_id || null,
      sport:        state.bookingDraft.sport,
      coach:        state.bookingDraft.coachName,
      package_name: state.bookingDraft.package.name,
      amount:       state.bookingDraft.total,
      card_last4:   cardLast4,
      date:         now.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' }),
    });

    // 3. Reload receipts from database to stay in sync
    state.receipts = await API_SERVICE.getReceipts(state.user.email);

  } catch (e) {
    err.textContent = 'Server error saving your booking. Please try again.';
    return;
  }

  // Show success screen
  document.getElementById('paymentForm').style.display = 'none';
  document.getElementById('paymentSuccess').style.display = '';
  document.getElementById('successMsg').textContent =
    `Receipt ${receiptId} · $${state.bookingDraft.total} paid · ${state.bookingDraft.package.sessions} sessions booked with ${state.bookingDraft.coachName}.`;

  state.bookingDraft = null;
  resetBookingForm();
  refreshDashStats();
  renderReceipts();
  renderUpcoming();

  ['cardName','cardNum','cardExp','cardCvv','gcashPhone','gcashRef','paymayaPhone','paymayaRef'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset to default card method
  selectPaymentMethod('visa');

  showToast(`✅ Payment saved to database! Receipt ${receiptId}`);
}

function resetBookingForm() {
  const sportSel = document.getElementById('bookSport');
  if (sportSel) sportSel.value = '';
  const coachSel = document.getElementById('bookCoach');
  if (coachSel) coachSel.innerHTML = `<option value="">Select a coach…</option>`;
  const dateSel = document.getElementById('bookDate');
  if (dateSel) dateSel.value = '';
  const timeSel = document.getElementById('bookTime');
  if (timeSel) timeSel.selectedIndex = 0;
  const summary = document.getElementById('bookingSummary');
  if (summary) summary.innerHTML = '';
  const pkg = document.getElementById('packageOptions');
  if (pkg) pkg.innerHTML = '';
}

/* ─────────────────────────────────────────────
   RECEIPTS VIEW  ← reads from database (state.receipts)
───────────────────────────────────────────── */
function renderReceipts() {
  const list = document.getElementById('receiptsList');
  if (!list) return;
  if (state.receipts.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="es-icon">🧾</span>No receipts yet. Book your first session!</div>`;
    return;
  }
  list.innerHTML = state.receipts.map(r => `
    <div class="receipt-card">
      <div class="receipt-header">
        <span class="receipt-id">Receipt #${r.id}</span>
        <span class="receipt-status">✅ Paid</span>
      </div>
      <div class="receipt-body">
        <div class="receipt-row"><span>Sport</span><span>${r.sport || '—'}</span></div>
        <div class="receipt-row"><span>Coach</span><span>${r.coach || '—'}</span></div>
        <div class="receipt-row"><span>Package</span><span>${r.package_name || '—'}</span></div>
        <div class="receipt-row"><span>Session Date</span><span>${r.date || '—'}</span></div>
        <div class="receipt-row"><span>Card</span><span>•••• ${r.card_last4 || '????'}</span></div>
      </div>
      <div class="receipt-total-row">
        <span>Total Paid</span>
        <span>$${r.amount}</span>
      </div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────
   DASHBOARD METRICS
───────────────────────────────────────────── */
function refreshDashStats() {
  const sessionsEl = document.getElementById('sessionsCount');
  const spentEl    = document.getElementById('totalSpent');
  const streakEl   = document.getElementById('streakDays');
  if (!sessionsEl) return;

  const totalSpent = state.receipts.reduce((acc, r) => acc + (r.amount || 0), 0);
  sessionsEl.textContent = state.receipts.length;
  spentEl.textContent    = `$${totalSpent}`;
  streakEl.textContent   = state.receipts.length > 0 ? Math.min(state.receipts.length * 3, 21) : 0;
}

function renderUpcoming() {
  const list = document.getElementById('upcomingList');
  if (!list) return;
  if (state.receipts.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="es-icon">📅</span>No upcoming sessions. Book one now!</div>`;
    return;
  }
  const upcoming = state.receipts.slice(0, 3);
  list.innerHTML = upcoming.map(r => {
    const s = SPORTS.find(sp => sp.name === r.sport);
    return `
      <div class="session-item">
        <span class="si-icon">${s ? s.emoji : '🏅'}</span>
        <div class="si-info">
          <div class="si-sport">${r.sport || '—'}</div>
          <div class="si-date">${r.date || '—'}</div>
          <div class="si-coach">${r.coach || '—'}</div>
        </div>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function setMinDate() {
  const el = document.getElementById('bookDate');
  if (!el) return;
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  el.min = `${yyyy}-${mm}-${dd}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PH', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ─────────────────────────────────────────────
   STYLES INJECTION (unchanged from original)
───────────────────────────────────────────── */
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .sports-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 0 16px; }
    .sport-card { background: var(--white); border-radius: var(--radius); padding: 18px 14px; text-align: center; cursor: pointer; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.15); transition: transform .2s, box-shadow .2s; }
    .sport-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .sc-emoji { font-size: 2.2rem; margin-bottom: 8px; display: block; }
    .sc-name  { font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 1px; color: var(--dark); margin-bottom: 6px; }
    .sc-meta  { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 4px; }
    .sc-tag   { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 2px 8px; border-radius: 99px; }
    .sc-tag.combat     { background: rgba(178,34,34,.12); color: var(--red-mid); }
    .sc-tag.team       { background: rgba(201,113,74,.15); color: var(--terracotta); }
    .sc-tag.individual { background: rgba(139,0,0,.1); color: var(--red-deep); }
    .sc-tag.water      { background: rgba(100,150,200,.15); color: #2255aa; }
    .sc-diff  { font-size: .65rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .sc-duration { font-size: .72rem; color: var(--text-muted); }
    .sports-hub-grid { display: grid; grid-template-columns: 1fr; gap: 14px; padding: 0 16px 40px; }
    .sport-hub-card { background: var(--white); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.15); transition: transform .2s, box-shadow .2s; }
    .sport-hub-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
    .shc-top  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .shc-emoji{ font-size: 2rem; }
    .shc-name { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 1px; color: var(--dark); margin-bottom: 6px; }
    .shc-desc { font-size: .88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px; }
    .shc-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: .8rem; color: var(--text-muted); }
    .shc-diff { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: .72rem; }
    .shc-btn  { background: var(--red-mid); color: var(--white); border: none; padding: 9px 20px; border-radius: var(--radius-sm); font-family: var(--font-condensed); font-weight: 700; font-size: .85rem; letter-spacing: 1px; text-transform: uppercase; transition: background .2s; width: 100%; }
    .shc-btn:hover { background: var(--red-deep); }
    .diff-easy   { color: #2e7d32; }
    .diff-medium { color: var(--terracotta); }
    .diff-hard   { color: var(--red-mid); }
    .coaches-grid { display: grid; grid-template-columns: 1fr; gap: 14px; padding: 0 16px 40px; }
    .coach-card { background: var(--white); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.15); transition: transform .2s; }
    .coach-card:hover { transform: translateY(-3px); }
    .cc-top         { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .cc-flag        { font-size: 2.2rem; }
    .cc-meta-top    { text-align: right; }
    .cc-country     { display: block; font-size: .72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
    .cc-rating      { font-size: .82rem; font-weight: 600; color: var(--dark); }
    .cc-rating em   { color: var(--text-muted); font-style: normal; }
    .cc-name        { font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 1px; color: var(--dark); margin-bottom: 2px; }
    .cc-title       { font-size: .78rem; color: var(--text-muted); margin-bottom: 6px; }
    .cc-sport-tag   { display: inline-block; font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 2px 10px; border-radius: 99px; background: rgba(178,34,34,.1); color: var(--red-mid); margin-bottom: 10px; }
    .cc-details     { display: flex; gap: 10px; flex-wrap: wrap; font-size: .78rem; color: var(--text-muted); margin-bottom: 14px; }
    .cc-btn         { background: transparent; border: 1.5px solid var(--red-mid); color: var(--red-mid); padding: 8px 18px; border-radius: var(--radius-sm); font-family: var(--font-condensed); font-weight: 700; font-size: .82rem; letter-spacing: 1px; text-transform: uppercase; transition: all .2s; width: 100%; }
    .cc-btn:hover   { background: var(--red-mid); color: var(--white); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 0; pointer-events: none; transition: opacity .25s; }
    .modal-overlay.open { opacity: 1; pointer-events: all; }
    .modal-box { background: var(--white); border-radius: var(--radius); width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; padding: 24px 20px; box-shadow: 0 20px 60px rgba(0,0,0,.4); transform: scale(.95); transition: transform .25s; }
    .modal-overlay.open .modal-box { transform: scale(1); }
    .modal-close { position: absolute; top: 14px; right: 14px; background: var(--terra-mist); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1rem; color: var(--dark); display: flex; align-items: center; justify-content: center; transition: background .2s; }
    .modal-close:hover { background: var(--red-mid); color: var(--white); }
    .modal-sport-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .modal-sport-emoji  { font-size: 3rem; }
    .modal-sport-name   { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 2px; color: var(--dark); }
    .modal-sport-desc   { font-size: .92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
    .modal-sport-meta   { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
    .msm-item           { background: var(--terra-bg); border-radius: var(--radius-sm); padding: 10px; text-align: center; }
    .msm-label          { display: block; font-size: .65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
    .msm-val            { font-weight: 700; font-size: .88rem; color: var(--dark); }
    .modal-coaches-title{ font-family: var(--font-condensed); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: .9rem; color: var(--dark); margin-bottom: 10px; }
    .modal-coaches-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .modal-coach-item   { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--terra-bg); border-radius: var(--radius-sm); cursor: pointer; transition: background .2s; }
    .modal-coach-item:hover { background: var(--terra-mist); }
    .mci-flag           { font-size: 1.6rem; }
    .mci-info           { flex: 1; }
    .mci-info strong    { display: block; font-size: .88rem; color: var(--dark); }
    .mci-info span      { font-size: .75rem; color: var(--text-muted); }
    .mci-rating         { font-size: .82rem; font-weight: 600; }
    .modal-coach-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
    .modal-coach-flag   { font-size: 3rem; }
    .modal-coach-name   { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 2px; color: var(--dark); }
    .modal-coach-title  { font-size: .82rem; color: var(--terracotta); font-weight: 600; }
    .modal-coach-loc    { font-size: .78rem; color: var(--text-muted); margin-top: 2px; }
    .modal-coach-rating { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .mcr-stars          { color: #f5a623; font-size: 1rem; }
    .mcr-score          { font-weight: 700; font-size: 1rem; color: var(--dark); }
    .mcr-reviews        { font-size: .78rem; color: var(--text-muted); }
    .modal-coach-bio    { font-size: .9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
    .modal-coach-meta   { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
    .mcm-item           { background: var(--terra-bg); border-radius: var(--radius-sm); padding: 10px; text-align: center; }
    .mcm-label          { display: block; font-size: .65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 4px; }
    .mcm-val            { font-weight: 700; font-size: .88rem; color: var(--dark); }
    .features-strip { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 20px 16px; background: var(--white); border-top: 1px solid rgba(201,113,74,.1); border-bottom: 1px solid rgba(201,113,74,.1); }
    .feature-item { display: flex; align-items: flex-start; gap: 10px; }
    .fi-icon      { font-size: 1.6rem; flex-shrink: 0; }
    .feature-item strong { display: block; font-size: .88rem; font-weight: 700; color: var(--dark); margin-bottom: 2px; }
    .feature-item p { font-size: .75rem; color: var(--text-muted); margin: 0; }
    .testimonials-block { padding: 32px 16px 40px; background: linear-gradient(135deg, var(--dark) 0%, var(--dark-2) 100%); }
    .testimonials-track { display: flex; flex-direction: column; gap: 14px; }
    .testimonial-card { background: rgba(255,255,255,.06); border: 1px solid rgba(232,168,130,.15); border-radius: var(--radius); padding: 20px; color: rgba(255,255,255,.85); font-size: .9rem; line-height: 1.6; }
    .t-author { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
    .t-avatar { font-size: 1.4rem; }
    .t-author strong { color: var(--terra-pale); font-size: .88rem; }
    .t-author em { color: rgba(255,255,255,.5); font-size: .78rem; display: block; }
    .t-stars { color: #f5a623; margin-top: 6px; font-size: .9rem; }
    .section-block { padding: 32px 16px 16px; }
    .section-header { text-align: center; margin-bottom: 20px; }
    .section-title { font-family: var(--font-display); font-size: clamp(1.6rem, 5vw, 2.4rem); letter-spacing: 2px; color: var(--dark); }
    .section-title .accent { color: var(--red-mid); }
    .section-sub { font-size: .9rem; color: var(--text-muted); margin-top: 6px; }
    .center-btn { text-align: center; margin-top: 20px; }
    .page-header { text-align: center; padding: 32px 16px 20px; }
    .page-title { font-family: var(--font-display); font-size: clamp(2rem, 8vw, 3.5rem); letter-spacing: 3px; color: var(--dark); }
    .page-title .accent { color: var(--red-mid); }
    .page-sub { font-size: .92rem; color: var(--text-muted); margin-top: 8px; }
    .coach-filter-bar { padding: 0 16px 16px; }
    .coach-search { width: 100%; padding: 11px 16px; border: 1.5px solid rgba(201,113,74,.3); border-radius: var(--radius-sm); font-size: .92rem; color: var(--dark); background: var(--white); outline: none; transition: border-color .2s; }
    .coach-search:focus { border-color: var(--red-mid); }
    .filter-bar { display: flex; gap: 8px; padding: 0 16px 16px; overflow-x: auto; scrollbar-width: none; }
    .filter-bar::-webkit-scrollbar { display: none; }
    .filter-btn { flex-shrink: 0; padding: 7px 16px; border-radius: 99px; border: 1.5px solid rgba(201,113,74,.3); background: var(--white); font-family: var(--font-condensed); font-size: .82rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); transition: all .2s; }
    .filter-btn.active, .filter-btn:hover { background: var(--red-mid); border-color: var(--red-mid); color: var(--white); }
    .btn-primary { background: linear-gradient(135deg, var(--red-mid), var(--red-vivid)); color: var(--white); padding: 11px 26px; border-radius: var(--radius-sm); font-family: var(--font-condensed); font-weight: 700; font-size: .9rem; letter-spacing: 1.5px; text-transform: uppercase; border: none; transition: opacity .2s, transform .15s; display: inline-block; }
    .btn-primary:hover  { opacity: .88; transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary.full-btn { width: 100%; display: block; text-align: center; }
    .btn-ghost { background: transparent; border: 1.5px solid rgba(255,255,255,.4); color: rgba(255,255,255,.85); padding: 10px 24px; border-radius: var(--radius-sm); font-family: var(--font-condensed); font-weight: 700; font-size: .9rem; letter-spacing: 1.5px; text-transform: uppercase; transition: all .2s; }
    .btn-ghost:hover { border-color: var(--terra-pale); color: var(--terra-pale); }
    .btn-ghost.small-btn { padding: 7px 16px; font-size: .78rem; }
    .form-group { margin-bottom: 14px; }
    .form-group label { display: block; font-size: .78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 6px; }
    .form-input { width: 100%; padding: 10px 14px; border: 1.5px solid rgba(201,113,74,.3); border-radius: var(--radius-sm); font-size: .92rem; color: var(--dark); background: var(--white); outline: none; transition: border-color .2s; -webkit-appearance: none; }
    .form-input:focus { border-color: var(--red-mid); }
    .form-error { color: var(--red-mid); font-size: .82rem; margin-bottom: 10px; min-height: 18px; }
    .auth-card { background: var(--white); border-radius: var(--radius); padding: 24px 20px; margin: 0 16px 40px; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.15); max-width: 480px; margin-left: auto; margin-right: auto; }
    .auth-tabs { display: flex; gap: 0; margin-bottom: 20px; background: var(--terra-bg); border-radius: var(--radius-sm); padding: 3px; }
    .auth-tab { flex: 1; padding: 8px; border-radius: calc(var(--radius-sm) - 2px); font-family: var(--font-condensed); font-weight: 700; font-size: .85rem; letter-spacing: 1px; text-transform: uppercase; background: transparent; color: var(--text-muted); transition: all .2s; border: none; }
    .auth-tab.active { background: var(--white); color: var(--red-mid); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .auth-hint { font-size: .78rem; color: var(--text-muted); text-align: center; margin-top: 10px; }
    .portal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 20px 16px 12px; }
    .portal-welcome { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 2px; color: var(--dark); }
    .portal-email { font-size: .78rem; color: var(--text-muted); margin-top: 2px; }
    .portal-tabs { display: flex; gap: 0; padding: 0 16px; border-bottom: 2px solid rgba(201,113,74,.15); overflow-x: auto; scrollbar-width: none; }
    .portal-tabs::-webkit-scrollbar { display: none; }
    .mt-16 { margin-top: 16px; }
    .receipt-card { background: var(--white); border-radius: var(--radius); padding: 16px; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.15); margin-bottom: 12px; }
    .receipt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .receipt-id { font-family: var(--font-condensed); font-weight: 700; letter-spacing: 1px; font-size: .85rem; color: var(--dark); }
    .receipt-status { font-size: .75rem; font-weight: 700; color: #2e7d32; background: rgba(46,125,50,.1); padding: 3px 10px; border-radius: 99px; }
    .receipt-body { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .receipt-row { display: flex; justify-content: space-between; font-size: .82rem; color: var(--text-muted); }
    .receipt-total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: .95rem; color: var(--dark); border-top: 1px solid rgba(201,113,74,.15); padding-top: 8px; }
    .bs-row { display: flex; justify-content: space-between; font-size: .85rem; padding: 5px 0; border-bottom: 1px solid rgba(201,113,74,.08); color: var(--text-muted); }
    .bs-total { font-weight: 700; color: var(--dark); font-size: .95rem; border-bottom: none; }
    .booking-summary { background: var(--terra-bg); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px; }
    .package-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 0; }
    .package-opt { display: flex; align-items: center; justify-content: space-between; border: 1.5px solid rgba(201,113,74,.2); border-radius: var(--radius-sm); padding: 10px 14px; cursor: pointer; transition: all .2s; background: var(--white); }
    .package-opt.selected { border-color: var(--red-mid); background: rgba(201,113,74,.06); }
    .pkg-name { font-weight: 700; font-size: .88rem; color: var(--dark); }
    .pkg-detail { font-size: .75rem; color: var(--text-muted); }
    .pkg-price { font-weight: 700; font-size: .95rem; color: var(--red-mid); }
    .payment-summary-card { background: var(--terra-bg); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px; }
    .pay-hint { font-size: .88rem; color: var(--text-muted); }
    .payment-methods { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
    .pm-badge { font-size: .75rem; padding: 4px 10px; background: var(--terra-bg); border: 1px solid rgba(201,113,74,.2); border-radius: var(--radius-sm); color: var(--text-muted); }
    .payment-success { text-align: center; padding: 30px 16px; }
    .success-icon { font-size: 3rem; margin-bottom: 10px; }
    .payment-success h3 { font-family: var(--font-display); font-size: 1.6rem; letter-spacing: 2px; color: var(--dark); margin-bottom: 8px; }
    .payment-success p { font-size: .88rem; color: var(--text-muted); margin-bottom: 16px; }
    .dash-stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; padding: 16px; }
    .dash-stat { background: var(--white); border-radius: var(--radius-sm); padding: 14px 10px; text-align: center; box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.1); display: flex; flex-direction: column; gap: 4px; }
    .ds-icon { font-size: 1.4rem; }
    .ds-num  { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 1px; color: var(--dark); }
    .ds-label{ font-size: .68rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
    .upcoming-sessions { padding: 0 16px 16px; }
    .dash-section-title { font-family: var(--font-condensed); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-size: .9rem; color: var(--dark); margin-bottom: 10px; margin-top: 4px; }
    .session-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--white); border-radius: var(--radius-sm); box-shadow: var(--shadow); border: 1px solid rgba(201,113,74,.1); margin-bottom: 8px; }
    .si-icon { font-size: 1.8rem; }
    .si-sport { font-weight: 700; font-size: .9rem; color: var(--dark); }
    .si-date  { font-size: .78rem; color: var(--text-muted); }
    .si-coach { font-size: .78rem; color: var(--terracotta); }
    .quick-actions { padding: 0 16px 24px; }
    .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .qa-btn { padding: 12px 8px; background: var(--white); border: 1.5px solid rgba(201,113,74,.2); border-radius: var(--radius-sm); font-size: .82rem; font-weight: 600; color: var(--dark); text-align: center; transition: all .2s; }
    .qa-btn:hover { border-color: var(--red-mid); background: rgba(201,113,74,.05); }
    .ptab-content { display: none; }
    .ptab-content.active { display: block; }
    .p-tab { padding: 10px 16px; background: transparent; border: none; font-family: var(--font-condensed); font-weight: 700; font-size: .85rem; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .2s; flex-shrink: 0; }
    .p-tab.active { color: var(--red-mid); border-bottom-color: var(--red-mid); }
    .card-row { display: flex; gap: 12px; }
    .form-group.half { flex: 1; }
    .empty-state { text-align: center; padding: 32px 16px; color: var(--text-muted); }
    .es-icon { font-size: 2.4rem; display: block; margin-bottom: 8px; }
    .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--dark); color: var(--white); padding: 10px 20px; border-radius: var(--radius-sm); font-size: .88rem; font-weight: 600; opacity: 0; transition: opacity .3s, transform .3s; z-index: 9999; pointer-events: none; white-space: nowrap; max-width: 90vw; text-align: center; }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    @media (min-width: 600px) {
      .sports-grid          { grid-template-columns: repeat(3, 1fr); }
      .sports-hub-grid      { grid-template-columns: repeat(2, 1fr); }
      .coaches-grid         { grid-template-columns: repeat(2, 1fr); }
      .features-strip       { grid-template-columns: repeat(4, 1fr); }
      .testimonials-track   { flex-direction: row; }
      .testimonial-card     { flex: 1; }
    }
    @media (min-width: 900px) {
      .sports-hub-grid  { grid-template-columns: repeat(3, 1fr); }
      .coaches-grid     { grid-template-columns: repeat(3, 1fr); }
      .sports-grid      { grid-template-columns: repeat(3, 1fr); }
    }
  `;
  document.head.appendChild(style);
})();
