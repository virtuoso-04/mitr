import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged, getIdToken, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getAnalytics, isSupported as analyticsIsSupported } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js';
import { animate, stagger, spring } from 'https://cdn.jsdelivr.net/npm/motion@10.16.4/dist/motion.mjs';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs';

// Backend API base selection with URL override and persistence
const apiParam = new URLSearchParams(window.location.search).get('api');
const savedApi = localStorage.getItem('mindspace-api');
const defaultBackend = apiParam || savedApi || 'http://localhost:8080';
if (apiParam) localStorage.setItem('mindspace-api', apiParam);

const state = {
  persona: 'arjuna',
  messages: [],
  backend: defaultBackend,
  idToken: null,
};

const motionOk = () => !document.documentElement.classList.contains('reduce-motion') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderMarkdown(md){
  try{
    const html = marked.parse(md, { breaks:true, gfm:true });
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p','strong','em','a','ul','ol','li','code','pre','br'], ALLOWED_ATTR: ['href','target','rel'] });
  }catch{ return DOMPurify.sanitize(md); }
}

// Firebase web app config (provided)
const firebaseConfig = {
  apiKey: 'AIzaSyDr_73QnOn7QzmNmqamN5lOfZPbAbBSkN0',
  authDomain: 'mitr10.firebaseapp.com',
  projectId: 'mitr10',
  storageBucket: 'mitr10.firebasestorage.app',
  messagingSenderId: '767728674063',
  appId: '1:767728674063:web:591684ab7f3e50efb74a7a',
  measurementId: 'G-RSD74TP40D'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Analytics when supported (requires localhost/https)
(async () => {
  try {
    if (await analyticsIsSupported()) {
      getAnalytics(app);
    }
  } catch (e) {
    console.warn('Analytics not supported in this context');
  }
})();

const authStatus = document.getElementById('auth-status');
const setAuthStatus = (msg) => {
  authStatus.textContent = `${msg} | API: ${state.backend}`;
};
const provider = new GoogleAuthProvider();
const btnGoogle = document.getElementById('btn-google');
const btnSignout = document.getElementById('btn-signout');

btnGoogle?.addEventListener('click', async ()=>{
  try { await signInWithPopup(auth, provider); } catch (e) { console.warn(e); }
});
btnSignout?.addEventListener('click', async ()=>{
  try { await signOut(auth); } catch (e) { console.warn(e); }
});

signInAnonymously(auth).catch(()=>{});
onAuthStateChanged(auth, async (user)=>{
  if(user){
    state.idToken = await getIdToken(user, true);
    setAuthStatus('Signed in');
    if (btnGoogle) btnGoogle.hidden = true;
    if (btnSignout) btnSignout.hidden = false;
  } else {
    state.idToken = null;
    setAuthStatus('Not signed in');
    if (btnGoogle) btnGoogle.hidden = false;
    if (btnSignout) btnSignout.hidden = true;
  }
});

const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const crisisEl = document.getElementById('crisis');
const emergencyDlg = document.getElementById('emergency');

function addMessage(role, text){
  const li = document.createElement('li');
  li.className = `msg ${role==='user'?'user':'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (role === 'assistant') {
    bubble.innerHTML = renderMarkdown(text);
  } else {
    bubble.textContent = text;
  }
  li.appendChild(bubble);
  messagesEl.appendChild(li);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  if (motionOk()) {
    const dx = role==='user' ? 12 : -12;
    animate(bubble, { opacity: [0, 1], x: [dx, 0] }, { duration: 0.45, easing: spring({ stiffness: 220, damping: 22 }) });
  }
}

function selectPersona(key){
  state.persona = key;
  document.querySelectorAll('.persona').forEach(b=>{
    b.classList.toggle('active', b.dataset.persona===key);
  });
}

document.querySelectorAll('.persona').forEach(b=>{
  b.addEventListener('click', ()=> selectPersona(b.dataset.persona));
});

// Send on Enter, newline with Shift+Enter
input.addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && !e.shiftKey){
    e.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  input.value = '';
  state.messages.push({ role:'user', content:text });
  addMessage('user', text);

  addMessage('assistant', '…');

  try {
    const res = await fetch(`${state.backend}/api/chat`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        ...(state.idToken ? { 'Authorization': `Bearer ${state.idToken}` } : {}),
      },
      body: JSON.stringify({ persona: state.persona, messages: state.messages })
    });
    const data = await res.json();
    // replace last placeholder bubble content with sanitized markdown
    const lastBubble = messagesEl.lastChild?.querySelector('.bubble');
    if(lastBubble) lastBubble.innerHTML = renderMarkdown(data.text || 'Sorry, something went wrong.');
    state.messages.push({ role:'assistant', content:data.text });

    if(data.crisis?.triggered){
      crisisEl.textContent = 'Safety note: ' + (data.crisis.reasons.map(r=>r.type).join(', '));
      crisisEl.classList.remove('hidden');
      try{ emergencyDlg?.showModal(); }catch{}
    }
  } catch (err) {
  const lastBubbleErr = messagesEl.lastChild?.querySelector('.bubble');
  if(lastBubbleErr) lastBubbleErr.textContent = 'Error contacting server.';
    console.error(err);
  }
});

// Nav + Router
const viewChat = document.getElementById('view-chat');
const viewTools = document.getElementById('view-tools');
const viewWrap = document.getElementById('view-wrap');
const viewCommunity = document.getElementById('view-community');
const navChat = document.getElementById('nav-chat');
const navTools = document.getElementById('nav-tools');
const navWrap = document.getElementById('nav-wrap');
const navCommunity = document.getElementById('nav-community');

function showView(key){
  const map = { chat:viewChat, tools:viewTools, wrap:viewWrap, community:viewCommunity };
  Object.values(map).forEach(v=> v.classList.add('hidden'));
  document.querySelectorAll('nav a').forEach(a=> a.classList.remove('active'));
  const view = map[key] || viewChat;
  view.classList.remove('hidden');
  const navMap = { chat:navChat, tools:navTools, wrap:navWrap, community:navCommunity };
  (navMap[key] || navChat).classList.add('active');
  if (motionOk()) animate(view, { opacity:[0,1], y:[8,0] }, { duration:.3, easing:'ease-out' });
  // View-specific renders
  if (key==='wrap') { renderWrap(); maybeNudgeFromChallenges(); }
  if (key==='community') { renderCommunity(); }
}

function route(){
  const h = (location.hash || '#chat').replace('#','');
  showView(h);
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

// Simple 4-7-8 Breathing
const breathBtn = document.getElementById('start-breath');
const breathStep = document.getElementById('breath-step');
let breathTimer;
breathBtn.addEventListener('click', ()=>{
  const circle = document.querySelector('.breath-circle');
  const steps = [
    { label:'Inhale (4)', ms:4000, anim:'breatheIn' },
    { label:'Hold (7)', ms:7000, anim:null },
    { label:'Exhale (8)', ms:8000, anim:'breatheOut' },
  ];
  let i = 0;
  clearTimeout(breathTimer);
  const tick = () => {
    const s = steps[i % steps.length];
    breathStep.textContent = s.label;
    if (s.anim) {
      circle.style.animation = `${s.anim} ${s.ms}ms linear forwards`;
    } else {
      circle.style.animation = 'none';
    }
    i++;
    breathTimer = setTimeout(tick, s.ms);
  };
  tick();
});

// Journaling
const journal = document.getElementById('journal');
const saveJournal = document.getElementById('save-journal');
const journalStatus = document.getElementById('journal-status');
const journalCount = document.getElementById('journal-count');

journal.addEventListener('input', ()=>{
  const max = 1000;
  const val = journal.value.slice(0, max);
  if (val !== journal.value) journal.value = val;
  journalCount.textContent = `${val.length}/${max}`;
});

saveJournal.addEventListener('click', async ()=>{
  const key = 'mindspace-journal';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push({ ts: Date.now(), text: journal.value });
  localStorage.setItem(key, JSON.stringify(list));
  // Also try persisting server-side if signed in
  try{
    await fetch(`${state.backend}/api/journal`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        ...(state.idToken ? { 'Authorization': `Bearer ${state.idToken}` } : {}),
      },
      body: JSON.stringify({ text: list[list.length-1].text })
    });
  }catch(e){ console.warn('Journal save (server) failed'); }
  journal.value = '';
  journalStatus.textContent = 'Saved';
  setTimeout(()=> journalStatus.textContent='', 1500);
});

// Mood buttons
document.querySelectorAll('.mood-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.mood-btn').forEach(b=>b.setAttribute('aria-checked','false'));
    btn.setAttribute('aria-checked','true');
    const key = 'mindspace-mood';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ ts: Date.now(), mood: Number(btn.dataset.mood) });
    localStorage.setItem(key, JSON.stringify(list));
  });
});

// Settings dialog
const dlg = document.getElementById('settings-dialog');
const openSettings = document.getElementById('open-settings');
const saveSettings = document.getElementById('save-settings');
const selTextSize = document.getElementById('text-size');
const chkContrast = document.getElementById('high-contrast');
const chkMotion = document.getElementById('reduce-motion');

const PREF_KEY = 'mindspace-prefs';
function loadPrefs(){
  try { return JSON.parse(localStorage.getItem(PREF_KEY) || '{}'); } catch { return {}; }
}
function applyPrefs(p){
  const html = document.documentElement;
  html.style.fontSize = `${(p.textScale || 1) * 100}%`;
  html.classList.toggle('high-contrast', !!p.highContrast);
  html.classList.toggle('reduce-motion', !!p.reduceMotion);
}
function savePrefs(p){ localStorage.setItem(PREF_KEY, JSON.stringify(p)); }

openSettings.addEventListener('click', ()=>{
  const p = loadPrefs();
  selTextSize.value = String(p.textScale || 1);
  chkContrast.checked = !!p.highContrast;
  chkMotion.checked = !!p.reduceMotion;
  dlg.showModal();
  if (motionOk()) {
    const card = dlg.querySelector('.card');
    if (card) animate(card, { opacity:[0,1], scale:[0.96,1] }, { duration:.25, easing:'ease-out' });
  }
});
saveSettings.addEventListener('click', (e)=>{
  e.preventDefault();
  const p = {
    textScale: Number(selTextSize.value),
    highContrast: chkContrast.checked,
    reduceMotion: chkMotion.checked,
  };
  applyPrefs(p);
  savePrefs(p);
  dlg.close();
});
applyPrefs(loadPrefs());

// Wellness Wrap rendering
function renderWrap(){
  const moods = JSON.parse(localStorage.getItem('mindspace-mood') || '[]');
  const journals = JSON.parse(localStorage.getItem('mindspace-journal') || '[]');
  // Simple score: average mood scaled to 100 with journaling bonus
  const recent = moods.slice(-10);
  const moodAvg = recent.length ? (recent.reduce((s,m)=>s+m.mood,0)/recent.length) : 3;
  const score = Math.round((moodAvg/5)*80 + Math.min(journals.length,10)*2);
  const scoreEl = document.getElementById('wrap-score');
  if(scoreEl) scoreEl.textContent = String(score);
  // Metrics
  document.getElementById('metric-checkins').textContent = String(moods.length);
  document.getElementById('metric-journal').textContent = String(journals.length);
  document.getElementById('metric-streak').textContent = String(calcStreak(moods));
  // Trend sparkline
  drawTrend(moods);
  // Challenges
  renderChallenges();
}

function calcStreak(events){
  if(!events.length) return 0;
  const days = new Set(events.map(e=> new Date(e.ts).toDateString()));
  let streak = 0; let d = new Date();
  for(;;){
    const key = d.toDateString();
    if(days.has(key)){ streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function drawTrend(moods){
  const c = document.getElementById('trend-canvas'); if(!c) return;
  const ctx = c.getContext('2d');
  const w = c.width = c.clientWidth; const h = c.height;
  ctx.clearRect(0,0,w,h);
  // Last 7 days, default mood 3
  const today = new Date();
  const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const key = d.toDateString();
    const entries = moods.filter(m=> new Date(m.ts).toDateString()===key);
    const v = entries.length ? entries.reduce((s,m)=>s+m.mood,0)/entries.length : 3;
    data.push(v);
  }
  // Draw baseline
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1; ctx.beginPath();
  ctx.moveTo(0,h-20); ctx.lineTo(w,h-20); ctx.stroke();
  // Sparkline
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath();
  data.forEach((v,idx)=>{
    const x = (w/(data.length-1))*idx;
    const y = h - (v/5)*(h-24) - 12; // padding
    if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  // Dots
  ctx.fillStyle = '#22d3ee';
  data.forEach((v,idx)=>{
    const x = (w/(data.length-1))*idx;
    const y = h - (v/5)*(h-24) - 12;
    ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
  });

  // If Chart.js present, render a nicer overlay chart (optional)
  if (window.Chart && c){
    const id = '__trendChart';
    if (c[id]) { c[id].destroy(); }
    c[id] = new window.Chart(c, {
      type:'line', data:{ labels: data.map((_,i)=>`D-${6-i}`), datasets:[{ data: data, borderColor:'#22d3ee', pointRadius:2, tension:.3, fill:false }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } }
    });
  }
}

function renderChallenges(){
  const el = document.getElementById('challenge-list'); if(!el) return;
  const challenges = [
    { id:'c1', text:'3-minute breathing practice' },
    { id:'c2', text:'Write 2 lines of gratitude' },
    { id:'c3', text:'Take a 5-minute stretch break' },
  ];
  const done = JSON.parse(localStorage.getItem('mindspace-challenges') || '{}');
  el.innerHTML = '';
  challenges.forEach(c=>{
    const li = document.createElement('li');
    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=!!done[c.id];
    cb.addEventListener('change',()=>{
      done[c.id] = cb.checked; localStorage.setItem('mindspace-challenges', JSON.stringify(done));
    });
    const span = document.createElement('span'); span.textContent = c.text;
    li.appendChild(cb); li.appendChild(span); el.appendChild(li);
  });
}

function maybeNudgeFromChallenges(){
  const done = JSON.parse(localStorage.getItem('mindspace-challenges') || '{}');
  const pending = Object.values(done).filter(v=>!v).length;
  if(pending>0){
    addMessage('assistant', `Want a little nudge? You have ${pending} daily challenge${pending>1?'s':''} waiting. Try one now—I can guide you.`);
  }
}

// Community (cloud-backed with local fallback)
async function renderCommunity(){
  const list = document.getElementById('community-list'); if(!list) return;
  list.innerHTML = '<li class="muted">Loading…</li>';
  try{
    const res = await fetch(`${state.backend}/api/community?limit=50`);
    if(!res.ok) throw new Error('Bad response');
    const data = await res.json();
    list.innerHTML = '';
    (data.items||[]).forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `<div>${p.text}</div><div class=\"meta\">${new Date(p.ts).toLocaleString()}</div>`;
      list.appendChild(li);
    });
    if(!data.items || data.items.length===0){
      list.innerHTML = '<li class="muted">No posts yet. Share something supportive.</li>';
    }
    if (motionOk()) animate([...list.children], { opacity:[0,1], y:[6,0] }, { delay: stagger(0.03), duration:.35, easing:'ease-out' });
  }catch(e){
    const posts = JSON.parse(localStorage.getItem('mindspace-community') || '[]').reverse();
    list.innerHTML = '';
    posts.forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `<div>${p.text}</div><div class=\"meta\">${new Date(p.ts).toLocaleString()}</div>`;
      list.appendChild(li);
    });
    if(posts.length===0){
      list.innerHTML = '<li class="muted">No posts yet. Share something supportive.</li>';
    }
    if (motionOk()) animate([...list.children], { opacity:[0,1], y:[6,0] }, { delay: stagger(0.03), duration:.35, easing:'ease-out' });
  }
}
const postBtn = document.getElementById('post-button');
const postText = document.getElementById('post-text');
postBtn?.addEventListener('click', async ()=>{
  const text = (postText?.value||'').trim(); if(!text) return;
  try{
    const res = await fetch(`${state.backend}/api/community`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        ...(state.idToken ? { 'Authorization': `Bearer ${state.idToken}` } : {}),
      },
      body: JSON.stringify({ text })
    });
    if(!res.ok) throw new Error('Post failed');
    postText.value = '';
    await renderCommunity();
  }catch(e){
    const key = 'mindspace-community';
    const posts = JSON.parse(localStorage.getItem(key) || '[]');
    posts.push({ ts: Date.now(), text });
    localStorage.setItem(key, JSON.stringify(posts));
    postText.value = '';
    renderCommunity();
  }
});
