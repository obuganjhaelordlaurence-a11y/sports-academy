'use strict';
/* =========================================================
   Tri J Sports Training Academy — Standalone App
   All data stored in localStorage (no backend required)
   ========================================================= */

// ── DATA ──────────────────────────────────────────────────
const SPORTS = [
  {id:'boxing',      emoji:'🥊',name:'Boxing',      category:'combat',     difficulty:'Hard',   duration:'8–12 weeks', desc:'Master stance, footwork, combinations and ring strategy under world-class trainers.'},
  {id:'football',    emoji:'⚽',name:'Football',    category:'team',       difficulty:'Medium', duration:'6–10 weeks', desc:'Improve ball control, passing, tactical awareness and match-play fitness.'},
  {id:'swimming',    emoji:'🏊',name:'Swimming',    category:'water',      difficulty:'Medium', duration:'4–8 weeks',  desc:'Refine all four strokes, turns, starts and race-pace conditioning.'},
  {id:'weightlifting',emoji:'🏋️',name:'Weightlifting',category:'individual',difficulty:'Hard', duration:'10–16 weeks',desc:'Build strength, power and technique with Olympic lifting programming.'},
  {id:'tennis',      emoji:'🎾',name:'Tennis',      category:'individual', difficulty:'Medium', duration:'6–10 weeks', desc:'Develop serve mechanics, groundstrokes, net play and match tactics.'},
  {id:'basketball',  emoji:'🏀',name:'Basketball',  category:'team',       difficulty:'Medium', duration:'6–8 weeks',  desc:'Work on dribbling, shooting, court vision and team defensive systems.'},
  {id:'gymnastics',  emoji:'🤸',name:'Gymnastics',  category:'individual', difficulty:'Hard',   duration:'12–20 weeks',desc:'Train flexibility, strength, apparatus skills and competition routines.'},
  {id:'archery',     emoji:'🏹',name:'Archery',     category:'individual', difficulty:'Easy',   duration:'4–6 weeks',  desc:'Perfect form, breath control, aiming technique and mental focus.'},
  {id:'mma',         emoji:'🥋',name:'MMA',         category:'combat',     difficulty:'Hard',   duration:'12–16 weeks',desc:'Blend striking, grappling and wrestling into a complete fighting system.'},
  {id:'cycling',     emoji:'🚴',name:'Cycling',     category:'individual', difficulty:'Easy',   duration:'4–8 weeks',  desc:'Build endurance, climbing power and race-day pacing strategy.'},
  {id:'volleyball',  emoji:'🏐',name:'Volleyball',  category:'team',       difficulty:'Medium', duration:'6–8 weeks',  desc:'Sharpen serve, pass, set and spike with advanced team tactics.'},
  {id:'taekwondo',   emoji:'🦵',name:'Taekwondo',   category:'combat',     difficulty:'Medium', duration:'8–12 weeks', desc:'Learn kicks, forms (poomsae), sparring and Olympic-style competition.'},
];

const COACHES = [
  {id:1,name:'Carlos Mendoza',  flag:'🇲🇽',country:'Mexico',     sport:'Boxing',       title:'Former WBC Contender',        cost:120,rating:4.9,reviews:214,bio:'17 years of professional boxing. Trained Olympic-level fighters across Latin America.'},
  {id:2,name:'Sophie Laurent',  flag:'🇫🇷',country:'France',     sport:'Tennis',       title:'WTA Certified Coach',         cost:95, rating:4.8,reviews:178,bio:'Former WTA top-200 player. Renowned for serve reconstruction programmes.'},
  {id:3,name:'James Okafor',    flag:'🇳🇬',country:'Nigeria',    sport:'Football',     title:'UEFA Pro Licence',            cost:85, rating:4.7,reviews:301,bio:'Coached in Nigerian Premier League and European youth academies.'},
  {id:4,name:'Yuki Tanaka',     flag:'🇯🇵',country:'Japan',      sport:'Gymnastics',   title:'FIG Level 4 Coach',           cost:110,rating:4.9,reviews:143,bio:'Trained national-level gymnasts for 12 years. Expert in floor exercise and vault.'},
  {id:5,name:'Emma Schulz',     flag:'🇩🇪',country:'Germany',    sport:'Swimming',     title:'Olympic Pool Coach',          cost:100,rating:4.8,reviews:192,bio:'Former German national team swimmer. Specialises in butterfly and individual medley.'},
  {id:6,name:'Rafael Torres',   flag:'🇨🇴',country:'Colombia',   sport:'Cycling',      title:'UCI Level 2 Coach',           cost:75, rating:4.7,reviews:126,bio:'Competitive road and mountain cyclist. Specialises in altitude training adaptation.'},
  {id:7,name:'Park Ji-ho',      flag:'🇰🇷',country:'S. Korea',   sport:'Taekwondo',    title:'3rd Dan Black Belt, Olympian',cost:90, rating:5.0,reviews:89, bio:'Olympic Taekwondo athlete and certified ITF/WT coach.'},
  {id:8,name:'Aisha Kamara',    flag:'🇬🇭',country:'Ghana',      sport:'Basketball',   title:'FIBA Level 2 Coach',          cost:80, rating:4.6,reviews:157,bio:'Played professionally in Europe and Africa. Focuses on guard play and spacing.'},
  {id:9,name:'Dmitri Volkov',   flag:'🇷🇺',country:'Russia',     sport:'Weightlifting',title:'World Championships Bronze',  cost:130,rating:4.9,reviews:98, bio:'World-level competitive weightlifter with deep snatch and clean-and-jerk expertise.'},
  {id:10,name:'Maria Santos',   flag:'🇧🇷',country:'Brazil',     sport:'Volleyball',   title:'CBV Certified, Pro League Vet',cost:85,rating:4.8,reviews:211,bio:'Played in the Brazilian Superliga. Expert in libero play and team systems.'},
  {id:11,name:'Ben Harrington', flag:'🇦🇺',country:'Australia',  sport:'MMA',          title:'UFC-Trained Coach',           cost:140,rating:4.9,reviews:174,bio:'Licensed MMA coach with background in BJJ, Muay Thai and wrestling.'},
  {id:12,name:'Lea Hoffmann',   flag:'🇦🇹',country:'Austria',    sport:'Archery',      title:'World Archery Level 3',       cost:65, rating:4.7,reviews:72,  bio:'Recurve and compound specialist. Teaches form, shot cycle and mental preparation.'},
];

const PACKAGES = [
  {id:'starter',name:'Starter',  sessions:4, desc:'4 sessions · 1×/week',  mul:1},
  {id:'athlete',name:'Athlete',  sessions:8, desc:'8 sessions · 2×/week',  mul:1.8},
  {id:'elite',  name:'Elite Pro',sessions:16,desc:'16 sessions · 4×/week', mul:3.2},
];

const INSIGHTS = [
  {sport:'Boxing',    flag:'🇺🇸',country:'USA',     fact:'The United States leads global boxing with the most world champions across all divisions since 1900.'},
  {sport:'Football',  flag:'🇧🇷',country:'Brazil',  fact:'Brazil is the most successful national team in FIFA World Cup history with 5 championship titles.'},
  {sport:'Swimming',  flag:'🇺🇸',country:'USA',     fact:'The United States dominates Olympic swimming with over 500 gold medals across all games.'},
  {sport:'Tennis',    flag:'🇷🇸',country:'Serbia',  fact:'Serbia produced Novak Djokovic, holder of the most Grand Slam titles in men\'s tennis history.'},
  {sport:'Basketball',flag:'🇺🇸',country:'USA',     fact:'The NBA\'s global reach makes the USA the undisputed powerhouse, with 18 Olympic gold medals.'},
  {sport:'Gymnastics',flag:'🇺🇸',country:'USA',     fact:'The USA leads modern Olympic gymnastics, producing legends like Simone Biles and Nadia Comaneci.'},
  {sport:'Archery',   flag:'🇰🇷',country:'S. Korea',fact:'South Korea is the world\'s most dominant archery nation with the most Olympic golds since 1984.'},
  {sport:'MMA',       flag:'🇺🇸',country:'USA / Brazil',fact:'MMA is co-dominated by Brazilian Jiu-Jitsu traditions and American wrestling-based fighters in the UFC.'},
  {sport:'Cycling',   flag:'🇫🇷',country:'France',  fact:'France hosts the Tour de France — cycling\'s most prestigious race — drawing 12 million spectators annually.'},
];

const AWARDS_DATA = [
  {icon:'🥇',title:'Olympic Champion',athlete:'Marco Reyes',desc:'Won gold in the 67kg Boxing category at the Pan-Pacific Games 2024.',date:'Nov 2024'},
  {icon:'🏆',title:'National Champion',athlete:'Sofia Chen',desc:'Crowned National Gymnastics Champion 3 consecutive years in the senior category.',date:'Sep 2024'},
  {icon:'⭐',title:'Rising Star Award',athlete:'Lena Park',desc:'Youngest swimmer to achieve sub-1:00 in the 100m butterfly at regional championships.',date:'Aug 2024'},
  {icon:'🎖️',title:'Excellence Award',athlete:'James Okonkwo',desc:'Achieved 100% attendance over 12 months while setting 3 academy football records.',date:'Jul 2024'},
  {icon:'🏅',title:'Coach of the Year',athlete:'Emma Schulz',desc:'Guided 14 of her 16 athletes to national-level competition qualifying standards.',date:'Dec 2024'},
  {icon:'🌟',title:'Most Improved',athlete:'Dario Vega',desc:'Improved MMA fight score by 42% over a single 12-week training block with Ben Harrington.',date:'Oct 2024'},
];

const PERF_DATA = [
  {name:'Marco R.',   sport:'Boxing',       coach:'Carlos Mendoza', sessions:12, attendance:92, perf:'Excellent'},
  {name:'Sofia C.',   sport:'Gymnastics',   coach:'Yuki Tanaka',    sessions:18, attendance:100,perf:'Excellent'},
  {name:'Lena P.',    sport:'Swimming',     coach:'Emma Schulz',    sessions:8,  attendance:88, perf:'Good'},
  {name:'James O.',   sport:'Football',     coach:'James Okafor',   sessions:16, attendance:100,perf:'Excellent'},
  {name:'Dario V.',   sport:'MMA',          coach:'Ben Harrington', sessions:14, attendance:79, perf:'Improving'},
  {name:'Kenji T.',   sport:'Tennis',       coach:'Sophie Laurent', sessions:10, attendance:85, perf:'Good'},
  {name:'Camila S.',  sport:'Volleyball',   coach:'Maria Santos',   sessions:9,  attendance:94, perf:'Excellent'},
  {name:'Park H.',    sport:'Taekwondo',    coach:'Park Ji-ho',     sessions:20, attendance:100,perf:'Excellent'},
];

// ── LOCAL STORAGE HELPERS ─────────────────────────────────
const LS = {
  get:(k,d=[])=>{ try{return JSON.parse(localStorage.getItem(k))||d}catch{return d} },
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
};

// ── STATE ─────────────────────────────────────────────────
let currentUser = LS.get('trij_user', null);
let currentBooking = null;
let selectedPkg = null;
let users = LS.get('trij_users', [{name:'Demo Athlete',email:'athlete@trij.com',password:'train123',country:'Philippines'}]);
let receipts = LS.get('trij_receipts',[]);
let athletes = LS.get('trij_athletes',[]);
let schedules = LS.get('trij_schedules',[]);
let assignments = LS.get('trij_assignments',[]);

// ── NAVIGATION ────────────────────────────────────────────
function navigateTo(section) {
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-link,.drawer-link').forEach(l=>{
    l.classList.toggle('active', l.dataset.section===section || l.getAttribute('onclick')?.includes(`'${section}'`));
  });
  const el = document.getElementById(`section-${section}`);
  if(el){ el.classList.add('active'); window.scrollTo(0,0); }
  if(section==='hub') renderHub();
  if(section==='coaches') renderCoaches();
  if(section==='awards') { renderAwards(); renderPerfTable(); }
  if(section==='portal') renderPortal();
  if(section==='admin') renderAdmin();
}

function closeDrawer(){
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('show');
}

document.getElementById('hamburger').onclick = ()=>{
  document.getElementById('navDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('show');
};
document.getElementById('drawerClose').onclick = closeDrawer;
document.getElementById('drawerOverlay').onclick = closeDrawer;

// ── TOAST ─────────────────────────────────────────────────
function showToast(msg, dur=3000){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), dur);
}

// ── MODAL ─────────────────────────────────────────────────
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.getElementById('sportModal').addEventListener('click',e=>{
  if(e.target===e.currentTarget) closeModal('sportModal');
});

// ── HOME RENDER ───────────────────────────────────────────
function renderHomeSports(){
  const grid = document.getElementById('homesSportsGrid');
  if(!grid) return;
  grid.innerHTML = SPORTS.slice(0,6).map(s=>`
    <div class="sport-card" onclick="openSportModal('${s.id}')">
      <span class="sc-emoji">${s.emoji}</span>
      <div class="sc-name">${s.name}</div>
      <div class="sc-cat">${s.category}</div>
      <span class="sc-diff diff-${s.difficulty.toLowerCase()}">${s.difficulty}</span>
    </div>`).join('');
}

// ── HUB RENDER ────────────────────────────────────────────
let currentFilter = 'all';
function renderHub(){
  const grid = document.getElementById('sportsHubGrid');
  if(!grid) return;
  const list = currentFilter==='all' ? SPORTS : SPORTS.filter(s=>s.category===currentFilter);
  grid.innerHTML = list.map(s=>`
    <div class="hub-card">
      <div class="hub-card-header">
        <span class="hub-emoji">${s.emoji}</span>
        <div><div class="hub-name">${s.name}</div><div class="hub-cat">${s.category}</div></div>
      </div>
      <div class="hub-body">
        <div class="hub-desc">${s.desc}</div>
        <div class="hub-meta">
          <span class="hub-tag tag-dur">⏱ ${s.duration}</span>
          <span class="hub-tag tag-lvl">${s.difficulty}</span>
        </div>
      </div>
      <button class="hub-cta" onclick="openSportModal('${s.id}')">View Details & Book →</button>
    </div>`).join('');
  renderInsights();
}

function filterSports(filter, btn){
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderHub();
}

function renderInsights(){
  const grid = document.getElementById('insightsGrid');
  if(!grid) return;
  grid.innerHTML = INSIGHTS.map(i=>`
    <div class="insight-card">
      <span class="insight-flag">${i.flag}</span>
      <div class="insight-sport">${i.sport}</div>
      <div class="insight-country">🌍 Leading Country: <strong>${i.country}</strong></div>
      <div class="insight-fact">${i.fact}</div>
    </div>`).join('');
}

// ── SPORT MODAL ───────────────────────────────────────────
function openSportModal(id){
  const s = SPORTS.find(x=>x.id===id);
  if(!s) return;
  const coaches = COACHES.filter(c=>c.sport.toLowerCase()===s.name.toLowerCase());
  document.getElementById('sportModalContent').innerHTML = `
    <div class="modal-hero">
      <span class="modal-hero-emoji">${s.emoji}</span>
      <div class="modal-hero-name">${s.name}</div>
      <div class="modal-hero-sub">${s.category} · ${s.difficulty}</div>
    </div>
    <div class="modal-body">
      <div class="modal-label">About This Program</div>
      <div class="modal-val">${s.desc}</div>
      <div class="modal-tags">
        <span class="hub-tag tag-dur">⏱ ${s.duration}</span>
        <span class="hub-tag tag-lvl">${s.difficulty}</span>
      </div>
      <div class="modal-label">Available Coaches</div>
      ${coaches.length ? coaches.map(c=>`
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:10px;background:var(--terra-bg);border-radius:var(--radius-sm)">
          <span style="font-size:1.5rem">${c.flag}</span>
          <div><strong style="color:var(--dark);font-size:.9rem">${c.name}</strong><br>
          <span style="font-size:.75rem;color:var(--text-muted)">${c.title} · $${c.cost}/session</span></div>
          <span style="margin-left:auto;font-size:.85rem;color:var(--terra-cream)">★ ${c.rating}</span>
        </div>`).join('') : '<p style="color:var(--text-muted);font-size:.85rem">Coming soon</p>'}
      <button class="modal-cta" onclick="closeModal('sportModal');navigateTo('portal')">Book This Sport →</button>
    </div>`;
  openModal('sportModal');
}

// ── COACHES RENDER ────────────────────────────────────────
function renderCoaches(list=COACHES){
  const grid = document.getElementById('coachesGrid');
  if(!grid) return;
  grid.innerHTML = list.map(c=>`
    <div class="coach-card">
      <div class="coach-top">
        <div class="coach-avatar">${c.flag}</div>
        <div class="coach-info">
          <div class="coach-name">${c.name}</div>
          <div class="coach-country">${c.country}</div>
          <span class="coach-sport-tag">${c.sport}</span>
        </div>
      </div>
      <div class="coach-body">
        <div class="coach-title">${c.title}</div>
        <div class="coach-bio">${c.bio}</div>
        <div class="coach-stats-row">
          <span class="coach-rating"><span>★</span> ${c.rating}</span>
          <span class="coach-reviews">(${c.reviews} reviews)</span>
          <span class="coach-cost">$${c.cost}<span style="font-size:.65rem;font-family:var(--font-body);color:var(--text-muted)">/session</span></span>
        </div>
        <button class="coach-btn" onclick="bookCoach(${c.id})">Book Session →</button>
      </div>
    </div>`).join('');
}

function filterCoaches(){
  const q = document.getElementById('coachSearch').value.toLowerCase();
  const f = q ? COACHES.filter(c=>c.name.toLowerCase().includes(q)||c.sport.toLowerCase().includes(q)||c.country.toLowerCase().includes(q)) : COACHES;
  renderCoaches(f);
}

function bookCoach(id){
  if(!currentUser){ showToast('Please sign in to book a session'); navigateTo('portal'); return; }
  const c = COACHES.find(x=>x.id===id);
  if(!c) return;
  navigateTo('portal');
  setTimeout(()=>{
    switchPortalTab('book');
    const sel = document.getElementById('bookSport');
    if(sel){ sel.value = SPORTS.find(s=>s.name===c.sport)?.id || ''; updateCoachList(); }
    setTimeout(()=>{ const cs = document.getElementById('bookCoach'); if(cs) cs.value=c.name; updateBookingSummary(); }, 100);
  }, 200);
}

// ── AWARDS & PERF ─────────────────────────────────────────
function renderAwards(){
  document.getElementById('awardsGrid').innerHTML = AWARDS_DATA.map(a=>`
    <div class="award-card">
      <span class="award-icon">${a.icon}</span>
      <div>
        <div class="award-title">${a.title}</div>
        <div class="award-athlete">${a.athlete}</div>
        <div class="award-desc">${a.desc}</div>
        <div class="award-date">📅 ${a.date}</div>
      </div>
    </div>`).join('');
}

function renderPerfTable(){
  const tb = document.getElementById('perfTbody');
  if(!tb) return;
  const rows = [...PERF_DATA, ...athletes.map(a=>({
    name:a.name, sport:a.sport, coach: assignments.find(x=>x.athlete===a.name)?.coach||'—',
    sessions: Math.floor(Math.random()*10)+2, attendance: Math.floor(Math.random()*30)+70, perf:'Improving'
  }))];
  tb.innerHTML = rows.map(r=>`
    <tr>
      <td><strong>${r.name}</strong></td>
      <td>${r.sport}</td>
      <td>${r.coach}</td>
      <td style="font-weight:700;color:var(--dark)">${r.sessions}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="attend-bar-wrap"><div class="attend-bar" style="width:${r.attendance}%"></div></div>
          <span style="font-size:.78rem">${r.attendance}%</span>
        </div>
      </td>
      <td><span class="perf-badge perf-${r.perf.toLowerCase()}">${r.perf}</span></td>
    </tr>`).join('');
}

// ── ADMIN ─────────────────────────────────────────────────
function checkAdminPass(){
  const p = document.getElementById('adminPassInput').value;
  if(p==='admin123'){
    document.getElementById('adminGate').style.display='none';
    document.getElementById('adminDashboard').style.display='block';
    renderAdminContent();
  } else showToast('❌ Incorrect admin password');
}

function renderAdmin(){
  if(document.getElementById('adminDashboard').style.display==='block') renderAdminContent();
}

function renderAdminContent(){
  populateSportDropdown('ath-sport');
  populateSportDropdown('sched-sport');
  renderAthletesTable();
  renderSchedulesList();
  renderAssignments();
  renderAdminPayments();
  renderReports();
}

function populateSportDropdown(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = '<option value="">Select sport</option>'+SPORTS.map(s=>`<option value="${s.name}">${s.emoji} ${s.name}</option>`).join('');
}

function switchAdminTab(tab, btn){
  document.querySelectorAll('.a-tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.querySelectorAll('.atab-content').forEach(c=>c.classList.remove('active'));
  const el = document.getElementById(`atab-${tab}`);
  if(el) el.classList.add('active');
  if(tab==='schedules') renderSchedulesList();
  if(tab==='coachAssign') renderAssignments();
  if(tab==='payments') renderAdminPayments();
  if(tab==='reports') renderReports();
}

function addAthlete(){
  const name=document.getElementById('ath-name').value.trim();
  const sport=document.getElementById('ath-sport').value;
  const email=document.getElementById('ath-email').value.trim();
  const country=document.getElementById('ath-country').value.trim();
  const err=document.getElementById('ath-error');
  if(!name||!sport||!email){ err.textContent='Please fill all fields.'; return; }
  if(athletes.find(a=>a.email===email)){ err.textContent='Email already exists.'; return; }
  err.textContent='';
  athletes.push({id:Date.now(),name,sport,email,country});
  LS.set('trij_athletes',athletes);
  renderAthletesTable();
  ['ath-name','ath-email','ath-country'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('ath-sport').value='';
  showToast(`✅ ${name} added successfully`);
  populateAssignDropdowns();
}

function renderAthletesTable(){
  const tb = document.getElementById('athletes-tbody');
  if(!tb) return;
  if(!athletes.length){ tb.innerHTML='<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:20px">No athletes added yet</td></tr>'; return; }
  tb.innerHTML = athletes.map((a,i)=>`
    <tr>
      <td>${i+1}</td>
      <td><strong>${a.name}</strong></td>
      <td>${a.sport}</td>
      <td>${a.email}</td>
      <td>${a.country}</td>
      <td>
        <button class="tbl-action-btn btn-edit" onclick="editAthlete(${a.id})">Edit</button>
        <button class="tbl-action-btn btn-delete" onclick="deleteAthlete(${a.id})">Delete</button>
      </td>
    </tr>`).join('');
}

function editAthlete(id){
  const a = athletes.find(x=>x.id===id);
  if(!a) return;
  const newName = prompt('Edit athlete name:', a.name);
  if(newName&&newName.trim()){ a.name=newName.trim(); LS.set('trij_athletes',athletes); renderAthletesTable(); showToast('✅ Athlete updated'); }
}

function deleteAthlete(id){
  if(!confirm('Delete this athlete?')) return;
  athletes = athletes.filter(a=>a.id!==id);
  LS.set('trij_athletes',athletes);
  renderAthletesTable();
  showToast('🗑️ Athlete deleted');
}

function addSchedule(){
  const title=document.getElementById('sched-title').value.trim();
  const sport=document.getElementById('sched-sport').value;
  const date=document.getElementById('sched-date').value;
  const time=document.getElementById('sched-time').value;
  const loc=document.getElementById('sched-loc').value.trim();
  if(!title||!sport||!date||!loc){ showToast('Please fill all schedule fields'); return; }
  schedules.push({id:Date.now(),title,sport,date,time,location:loc});
  LS.set('trij_schedules',schedules);
  renderSchedulesList();
  ['sched-title','sched-date','sched-loc'].forEach(id=>document.getElementById(id).value='');
  showToast('📅 Schedule created!');
}

function renderSchedulesList(){
  const el = document.getElementById('schedulesList');
  if(!el) return;
  if(!schedules.length){ el.innerHTML='<div class="empty-state"><span class="es-icon">📅</span>No schedules yet</div>'; return; }
  const sorted = [...schedules].sort((a,b)=>new Date(a.date)-new Date(b.date));
  el.innerHTML = sorted.map(s=>`
    <div class="schedule-item">
      <div class="sched-info">
        <div class="sched-title">${s.title}</div>
        <div class="sched-meta">${s.sport} · ${s.date} · ${s.time} · 📍 ${s.location}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <span class="sched-badge">${s.sport}</span>
        <button class="tbl-action-btn btn-delete" onclick="deleteSchedule(${s.id})">Delete</button>
      </div>
    </div>`).join('');
}

function deleteSchedule(id){
  schedules = schedules.filter(s=>s.id!==id);
  LS.set('trij_schedules',schedules);
  renderSchedulesList();
  showToast('🗑️ Schedule deleted');
}

function populateAssignDropdowns(){
  const asel=document.getElementById('assign-athlete');
  const csel=document.getElementById('assign-coach');
  if(asel) asel.innerHTML='<option value="">Select athlete</option>'+athletes.map(a=>`<option value="${a.name}">${a.name} (${a.sport})</option>`).join('');
  if(csel) csel.innerHTML='<option value="">Select coach</option>'+COACHES.map(c=>`<option value="${c.name}">${c.flag} ${c.name} – ${c.sport}</option>`).join('');
}

function renderAssignments(){
  populateAssignDropdowns();
  const tb=document.getElementById('assignments-tbody');
  if(!tb) return;
  const all = athletes.map(a=>({...a, coach: assignments.find(x=>x.athlete===a.name)?.coach||'—'}));
  if(!all.length){ tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px">No athletes to assign</td></tr>'; return; }
  tb.innerHTML = all.map(a=>`
    <tr>
      <td><strong>${a.name}</strong></td>
      <td>${a.sport}</td>
      <td style="color:var(--terracotta)">${a.coach}</td>
      <td>${a.country}</td>
    </tr>`).join('');
}

function assignCoach(){
  const athlete=document.getElementById('assign-athlete').value;
  const coach=document.getElementById('assign-coach').value;
  if(!athlete||!coach){ showToast('Please select both athlete and coach'); return; }
  const existing = assignments.findIndex(x=>x.athlete===athlete);
  if(existing>=0) assignments[existing].coach=coach;
  else assignments.push({athlete,coach});
  LS.set('trij_assignments',assignments);
  renderAssignments();
  showToast(`✅ ${coach} assigned to ${athlete}`);
}

function renderAdminPayments(){
  const tb=document.getElementById('admin-payments-tbody');
  if(!tb) return;
  const allR = LS.get('trij_receipts',[]);
  if(!allR.length){ tb.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:20px">No payments yet</td></tr>'; return; }
  tb.innerHTML = allR.map(r=>`
    <tr>
      <td>#${r.id}</td>
      <td>${r.user_email}</td>
      <td>${r.sport}</td>
      <td>${r.package_name}</td>
      <td style="font-weight:700;color:var(--red-mid)">$${r.amount}</td>
      <td>****${r.card_last4}</td>
      <td>${r.date}</td>
    </tr>`).join('');
  const total = allR.reduce((s,r)=>s+Number(r.amount),0);
  const el=document.getElementById('adminPaySummary');
  if(el) el.innerHTML=`<div class="report-card"><div class="report-title">Payment Summary</div>
    <div class="report-stat-row"><span>Total Transactions</span><strong>${allR.length}</strong></div>
    <div class="report-stat-row"><span>Total Revenue</span><strong style="color:var(--red-mid)">$${total.toFixed(2)}</strong></div>
    <div class="report-stat-row"><span>Avg Transaction</span><strong>$${allR.length?((total/allR.length).toFixed(2)):0}</strong></div>
  </div>`;
}

function renderReports(){
  const el=document.getElementById('reportsContainer');
  if(!el) return;
  const allR=LS.get('trij_receipts',[]);
  const total=allR.reduce((s,r)=>s+Number(r.amount),0);
  const sportCounts={};
  allR.forEach(r=>{ sportCounts[r.sport]=(sportCounts[r.sport]||0)+1; });
  const topSport = Object.keys(sportCounts).sort((a,b)=>sportCounts[b]-sportCounts[a])[0]||'—';
  el.innerHTML = `
    <div class="report-card">
      <div class="report-title">📊 Overall Performance Report</div>
      <div class="report-stat-row"><span>Total Registered Athletes</span><strong>${athletes.length}</strong></div>
      <div class="report-stat-row"><span>Total Sessions Booked</span><strong>${allR.length}</strong></div>
      <div class="report-stat-row"><span>Total Revenue Collected</span><strong>$${total.toFixed(2)}</strong></div>
      <div class="report-stat-row"><span>Most Booked Sport</span><strong>${topSport}</strong></div>
      <div class="report-stat-row"><span>Active Coaches</span><strong>${COACHES.length}</strong></div>
      <div class="report-stat-row"><span>Total Schedules Created</span><strong>${schedules.length}</strong></div>
    </div>
    <div class="report-card">
      <div class="report-title">🏃 Athlete Engagement</div>
      <div class="report-stat-row"><span>Avg Attendance Rate</span><strong>91.2%</strong></div>
      <div class="report-stat-row"><span>Athletes with Excellent Rating</span><strong>${PERF_DATA.filter(p=>p.perf==='Excellent').length}</strong></div>
      <div class="report-stat-row"><span>Coach-Athlete Assignments</span><strong>${assignments.length}</strong></div>
    </div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn-primary" onclick="window.print()">🖨️ Print Report</button>
    </div>`;
}

// ── PORTAL AUTH ───────────────────────────────────────────
function switchAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active', (tab==='login'?t.textContent.includes('Sign'):t.textContent.includes('Reg'))));
  document.getElementById('loginForm').style.display = tab==='login'?'block':'none';
  document.getElementById('registerForm').style.display = tab==='register'?'block':'none';
}

function handleLogin(){
  const email=document.getElementById('loginEmail').value.trim();
  const pass=document.getElementById('loginPass').value;
  const err=document.getElementById('loginError');
  const u = users.find(x=>x.email===email&&x.password===pass);
  if(!u){ err.textContent='Invalid email or password.'; return; }
  err.textContent='';
  currentUser=u;
  LS.set('trij_user',u);
  showToast(`✅ Welcome back, ${u.name}!`);
  renderPortal();
}

function handleRegister(){
  const name=document.getElementById('regName').value.trim();
  const email=document.getElementById('regEmail').value.trim();
  const pass=document.getElementById('regPass').value;
  const country=document.getElementById('regCountry').value;
  const err=document.getElementById('regError');
  if(!name||!email||!pass||!country){ err.textContent='Please fill all fields.'; return; }
  if(users.find(u=>u.email===email)){ err.textContent='Email already registered.'; return; }
  err.textContent='';
  const u={name,email,password:pass,country};
  users.push(u); LS.set('trij_users',users);
  currentUser=u; LS.set('trij_user',u);
  showToast(`✅ Welcome, ${name}!`);
  renderPortal();
}

function handleLogout(){
  currentUser=null; currentBooking=null;
  localStorage.removeItem('trij_user');
  showToast('👋 Signed out successfully');
  renderPortal();
}

function renderPortal(){
  const auth = document.getElementById('portalAuth');
  const dash = document.getElementById('portalDashboard');
  if(!currentUser){ auth.style.display='block'; dash.style.display='none'; return; }
  auth.style.display='none'; dash.style.display='block';
  document.getElementById('portalWelcome').textContent=`Welcome, ${currentUser.name}!`;
  document.getElementById('portalEmail').textContent=currentUser.email;
  populateBookingSports();
  renderOverview();
  renderReceipts();
  renderProfile();
}

// ── PORTAL TABS ───────────────────────────────────────────
function switchPortalTab(tab){
  document.querySelectorAll('.p-tab').forEach((t,i)=>{
    const tabs=['overview','book','payment','receipts','profile'];
    t.classList.toggle('active', tabs[i]===tab);
  });
  document.querySelectorAll('.ptab-content').forEach(c=>c.classList.remove('active'));
  const el=document.getElementById(`ptab-${tab}`);
  if(el) el.classList.add('active');
  if(tab==='receipts') renderReceipts();
  if(tab==='overview') renderOverview();
  if(tab==='profile') renderProfile();
}

function renderOverview(){
  if(!currentUser) return;
  const myR = LS.get('trij_receipts',[]).filter(r=>r.user_email===currentUser.email);
  document.getElementById('sessionsCount').textContent = myR.length;
  const total = myR.reduce((s,r)=>s+Number(r.amount),0);
  document.getElementById('totalSpent').textContent = `$${total.toFixed(0)}`;
  document.getElementById('streakDays').textContent = Math.min(myR.length*3, 30);
  const ul = document.getElementById('upcomingList');
  const myBookings = LS.get('trij_bookings',[]).filter(b=>b.user_email===currentUser.email);
  if(!myBookings.length){
    ul.innerHTML='<div class="empty-state"><span class="es-icon">📅</span>No sessions booked yet. <a href="#" onclick="switchPortalTab(\'book\');return false" style="color:var(--red-mid);font-weight:600">Book one now →</a></div>';
    return;
  }
  ul.innerHTML = myBookings.slice(-3).reverse().map(b=>{
    const sp = SPORTS.find(s=>s.id===b.sport_id)||{emoji:'🏅',name:b.sport};
    return `<div class="session-item">
      <span class="si-icon">${sp.emoji}</span>
      <div>
        <div class="si-sport">${sp.name}</div>
        <div class="si-date">${b.date} at ${b.time}</div>
        <div class="si-coach">Coach: ${b.coach}</div>
      </div>
    </div>`;
  }).join('');
}

// ── BOOKING ───────────────────────────────────────────────
function populateBookingSports(){
  const sel=document.getElementById('bookSport');
  if(!sel) return;
  sel.innerHTML = SPORTS.map(s=>`<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('');
  updateCoachList();
}

function updateCoachList(){
  const sportId = document.getElementById('bookSport')?.value;
  const sp = SPORTS.find(s=>s.id===sportId);
  const coaches = sp ? COACHES.filter(c=>c.sport===sp.name) : [];
  const sel=document.getElementById('bookCoach');
  if(sel) sel.innerHTML = coaches.map(c=>`<option value="${c.name}">${c.flag} ${c.name} – $${c.cost}/session</option>`).join('');
  renderPackageOptions(sportId);
  updateBookingSummary();
}

function renderPackageOptions(sportId){
  const sp=SPORTS.find(s=>s.id===sportId);
  const coaches=sp?COACHES.filter(c=>c.sport===sp.name):[];
  const coachName=document.getElementById('bookCoach')?.value;
  const coach=coaches.find(c=>c.name===coachName)||coaches[0];
  if(!coach) return;
  selectedPkg=PACKAGES[0];
  document.getElementById('packageOptions').innerHTML = PACKAGES.map((p,i)=>`
    <div class="package-opt ${i===0?'selected':''}" onclick="selectPkg('${p.id}',this,${coach.cost})">
      <div><div class="pkg-name">${p.name}</div><div class="pkg-detail">${p.desc}</div></div>
      <span class="pkg-price">$${(coach.cost*p.mul).toFixed(0)}</span>
    </div>`).join('');
  updateBookingSummary();
}

function selectPkg(id, el, baseCost){
  document.querySelectorAll('.package-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  selectedPkg = PACKAGES.find(p=>p.id===id);
  updateBookingSummary();
}

function updateBookingSummary(){
  const sportId=document.getElementById('bookSport')?.value;
  const sp=SPORTS.find(s=>s.id===sportId);
  const coachName=document.getElementById('bookCoach')?.value;
  const coach=COACHES.find(c=>c.name===coachName);
  const date=document.getElementById('bookDate')?.value;
  const time=document.getElementById('bookTime')?.value;
  const bs=document.getElementById('bookingSummary');
  if(!sp||!coach||!date||!selectedPkg||!bs){ if(bs) bs.style.display='none'; return; }
  const total=(coach.cost*selectedPkg.mul).toFixed(2);
  bs.style.display='block';
  bs.innerHTML=`
    <div class="bs-row"><span>Sport</span><span>${sp.emoji} ${sp.name}</span></div>
    <div class="bs-row"><span>Coach</span><span>${coach.flag} ${coach.name}</span></div>
    <div class="bs-row"><span>Date</span><span>${date} at ${time}</span></div>
    <div class="bs-row"><span>Package</span><span>${selectedPkg.name} (${selectedPkg.sessions} sessions)</span></div>
    <div class="bs-row bs-total"><span>Total</span><span>$${total}</span></div>`;
}

function proceedToPayment(){
  if(!currentUser){ showToast('Please sign in first'); return; }
  const sportId=document.getElementById('bookSport')?.value;
  const sp=SPORTS.find(s=>s.id===sportId);
  const coachName=document.getElementById('bookCoach')?.value;
  const coach=COACHES.find(c=>c.name===coachName);
  const date=document.getElementById('bookDate')?.value;
  const time=document.getElementById('bookTime')?.value;
  if(!sp||!coach||!date){ showToast('Please complete all booking fields'); return; }
  if(!selectedPkg){ showToast('Please select a package'); return; }
  const total=(coach.cost*selectedPkg.mul).toFixed(2);
  currentBooking={sport:sp.name, sport_id:sp.id, coach:coach.name, date, time, package_name:selectedPkg.name, sessions:selectedPkg.sessions, amount:total};
  const psc=document.getElementById('paymentSummaryCard');
  psc.innerHTML=`
    <div style="font-family:var(--font-condensed);font-size:.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px">Booking Summary</div>
    <div class="bs-row" style="color:var(--text)"><span>Sport</span><strong>${sp.emoji} ${sp.name}</strong></div>
    <div class="bs-row" style="color:var(--text)"><span>Coach</span><strong>${coach.flag} ${coach.name}</strong></div>
    <div class="bs-row" style="color:var(--text)"><span>Date</span><strong>${date} · ${time}</strong></div>
    <div class="bs-row" style="color:var(--text)"><span>Package</span><strong>${selectedPkg.name}</strong></div>
    <div class="bs-row" style="color:var(--text);border-top:1px solid rgba(201,113,74,.2);padding-top:8px;margin-top:4px"><span>Total</span><strong style="color:var(--red-mid);font-size:1rem">$${total}</strong></div>`;
  document.getElementById('paymentForm').style.display='block';
  document.getElementById('paymentSuccess').style.display='none';
  switchPortalTab('payment');
}

// ── PAYMENT ───────────────────────────────────────────────
function formatCard(el){
  let v=el.value.replace(/\D/g,'').substring(0,16);
  el.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function formatExpiry(el){
  let v=el.value.replace(/\D/g,'');
  if(v.length>=2) v=v.substring(0,2)+'/'+v.substring(2,4);
  el.value=v;
}

function processPayment(){
  if(!currentBooking){ showToast('No booking found'); return; }
  const name=document.getElementById('cardName').value.trim();
  const num=document.getElementById('cardNum').value.replace(/\s/g,'');
  const exp=document.getElementById('cardExp').value;
  const cvv=document.getElementById('cardCvv').value;
  const err=document.getElementById('payError');
  if(!name){ err.textContent='Please enter cardholder name.'; return; }
  if(num.length<16){ err.textContent='Please enter a valid 16-digit card number.'; return; }
  if(!exp.includes('/')||exp.length<5){ err.textContent='Please enter a valid expiry date (MM/YY).'; return; }
  if(cvv.length<3){ err.textContent='Please enter a valid CVV.'; return; }
  err.textContent='';

  // Save booking
  const allBookings=LS.get('trij_bookings',[]);
  const bookingId=Date.now();
  allBookings.push({id:bookingId, user_email:currentUser.email, sport_id:currentBooking.sport_id, sport:currentBooking.sport, coach:currentBooking.coach, date:currentBooking.date, time:currentBooking.time, package_name:currentBooking.package_name});
  LS.set('trij_bookings',allBookings);

  // Save receipt
  const allR=LS.get('trij_receipts',[]);
  const receipt={
    id: allR.length+1,
    user_email:currentUser.email,
    booking_id:bookingId,
    sport:currentBooking.sport,
    coach:currentBooking.coach,
    package_name:currentBooking.package_name,
    sessions:currentBooking.sessions,
    amount:currentBooking.amount,
    card_last4:num.slice(-4),
    date:new Date().toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})
  };
  allR.push(receipt); LS.set('trij_receipts',allR);

  document.getElementById('paymentForm').style.display='none';
  document.getElementById('paymentSuccess').style.display='block';
  document.getElementById('successMsg').textContent=`Payment of $${currentBooking.amount} confirmed for ${currentBooking.sport} – ${currentBooking.package_name}. Receipt #${receipt.id} saved.`;
  showToast(`✅ Payment of $${currentBooking.amount} confirmed!`);
  currentBooking=null;
  renderOverview();
}

// ── RECEIPTS ─────────────────────────────────────────────
function renderReceipts(){
  if(!currentUser) return;
  const allR=LS.get('trij_receipts',[]).filter(r=>r.user_email===currentUser.email);
  const el=document.getElementById('receiptsList');
  if(!el) return;
  if(!allR.length){
    el.innerHTML='<div class="empty-state"><span class="es-icon">🧾</span>No receipts yet. Book a session to get started!</div>';
    return;
  }
  el.innerHTML = [...allR].reverse().map(r=>`
    <div class="receipt-card" id="receipt-${r.id}">
      <div class="receipt-header">
        <span class="receipt-id">Receipt #${r.id}</span>
        <span class="receipt-status">✅ Paid</span>
      </div>
      <div class="receipt-body">
        <div class="receipt-row"><span>Sport</span><span>${r.sport}</span></div>
        <div class="receipt-row"><span>Coach</span><span>${r.coach}</span></div>
        <div class="receipt-row"><span>Package</span><span>${r.package_name} (${r.sessions||'—'} sessions)</span></div>
        <div class="receipt-row"><span>Card Used</span><span>****${r.card_last4}</span></div>
        <div class="receipt-row"><span>Date</span><span>${r.date}</span></div>
      </div>
      <div class="receipt-total-row"><span>Total Paid</span><span>$${r.amount}</span></div>
      <button class="receipt-print-btn" onclick="printReceipt(${r.id})">🖨️ Print / Download Receipt</button>
    </div>`).join('');
}

function printReceipt(id){
  const allR=LS.get('trij_receipts',[]);
  const r=allR.find(x=>x.id===id);
  if(!r) return;
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>Receipt #${r.id}</title>
  <style>body{font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto}
  h1{color:#B22222;font-size:24px;margin-bottom:4px}.sub{color:#888;font-size:12px;margin-bottom:24px}
  .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #eee;font-size:14px}
  .total{display:flex;justify-content:space-between;padding:12px 0;font-size:18px;font-weight:bold;color:#B22222}
  .badge{background:#e8f5e9;color:#2e7d32;padding:4px 12px;border-radius:99px;font-size:12px}
  @media print{button{display:none}}</style></head>
  <body><h1>⚡ Tri J Academy</h1><div class="sub">Official Payment Receipt</div>
  <div class="row"><span>Receipt #</span><span>${r.id}</span></div>
  <div class="row"><span>Athlete</span><span>${r.user_email}</span></div>
  <div class="row"><span>Sport</span><span>${r.sport}</span></div>
  <div class="row"><span>Coach</span><span>${r.coach}</span></div>
  <div class="row"><span>Package</span><span>${r.package_name}</span></div>
  <div class="row"><span>Card Used</span><span>****${r.card_last4}</span></div>
  <div class="row"><span>Date</span><span>${r.date}</span></div>
  <div class="total"><span>TOTAL PAID</span><span>$${r.amount}</span></div>
  <div style="text-align:center;margin-top:20px"><span class="badge">✅ PAYMENT CONFIRMED</span></div>
  <p style="text-align:center;color:#888;font-size:11px;margin-top:20px">© 2025 Tri J Sports Training Academy · Thank you for training with us!</p>
  <button onclick="window.print()" style="display:block;width:100%;margin-top:16px;padding:10px;background:#B22222;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">🖨️ Print Receipt</button>
  </body></html>`);
  win.document.close();
}

// ── PROFILE ───────────────────────────────────────────────
function renderProfile(){
  if(!currentUser) return;
  const el=document.getElementById('profileContent');
  if(!el) return;
  const myR=LS.get('trij_receipts',[]).filter(r=>r.user_email===currentUser.email);
  const sports=[...new Set(myR.map(r=>r.sport))];
  el.innerHTML=`
    <div style="background:var(--white);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);border:1px solid rgba(201,113,74,.15);margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--red-vivid),var(--terracotta));display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:700;color:white;flex-shrink:0">${currentUser.name.charAt(0).toUpperCase()}</div>
        <div>
          <div style="font-family:var(--font-display);font-size:1.4rem;letter-spacing:2px;color:var(--dark)">${currentUser.name}</div>
          <div style="font-size:.78rem;color:var(--text-muted)">${currentUser.email}</div>
          <div style="font-size:.78rem;color:var(--terracotta);margin-top:2px">🌍 ${currentUser.country||'—'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div style="text-align:center;padding:12px;background:var(--terra-bg);border-radius:var(--radius-sm)">
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--red-mid)">${myR.length}</div>
          <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted)">Sessions Booked</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--terra-bg);border-radius:var(--radius-sm)">
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--red-mid)">$${myR.reduce((s,r)=>s+Number(r.amount),0).toFixed(0)}</div>
          <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted)">Total Invested</div>
        </div>
      </div>
    </div>
    ${sports.length?`<div style="background:var(--white);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);border:1px solid rgba(201,113,74,.15)">
      <div class="dash-section-title">Sports Trained</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${sports.map(s=>{const sp=SPORTS.find(x=>x.name===s);return `<span style="padding:5px 12px;background:rgba(201,113,74,.12);border-radius:99px;font-size:.8rem;color:var(--dark)">${sp?sp.emoji:''} ${s}</span>`;}).join('')}</div>
    </div>`:''}`;
}

// ── INIT ──────────────────────────────────────────────────
renderHomeSports();
renderHub();
renderCoaches();

// Seed demo data
if(!LS.get('trij_users',null)){
  LS.set('trij_users',[{name:'Demo Athlete',email:'athlete@trij.com',password:'train123',country:'Philippines'}]);
}

// Check if user was logged in
if(currentUser){
  const userEl=document.getElementById('portalWelcome');
  if(userEl) userEl.textContent=`Welcome, ${currentUser.name}!`;
}