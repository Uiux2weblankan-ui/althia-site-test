/* =====================================================================
   ALTHIA — v4 client change round (Oct 2026)
   Shared add-on script loaded on every page (after the page's own script).
   ===================================================================== */
(function(){
  'use strict';
  var WA_NUMBER = '94763306603';                 /* WhatsApp: +94 76 330 6603 */
  var APPLY_URL = 'https://apply.sliit.lk/';     /* SLIIT online application */

  var $ = function(s, c){ return (c||document).querySelector(s); };
  var $$ = function(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var ICO = {
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    li:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 16c.5-1.7 1.6-2.5 3-2.5s2.5.8 3 2.5M14.5 9.5h3.5M14.5 13h3.5"/></svg>',
    ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9.2 8.6c-.4 2.9 3.3 6.6 6.2 6.2l.6-1.6-1.9-.9-.9.8a4.2 4.2 0 0 1-2.1-2.1l.8-.9-.9-1.9z"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-6 16-3-7z"/></svg>'
  };
  window.V4 = window.V4 || {};

  /* ---------- modal ---------- */
  var modal = document.createElement('div');
  modal.className = 'v4-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-hidden','true');
  modal.innerHTML = '<div class="scrim"></div><div class="box"></div>';
  document.body.appendChild(modal);
  var box = $('.box', modal), lastFocus = null;
  function openModal(html, cls){
    lastFocus = document.activeElement;
    modal.className = 'v4-modal ' + (cls||'');
    box.innerHTML = '<button class="x" aria-label="Close">&times;</button>' + html;
    $('.x', box).addEventListener('click', closeModal);
    requestAnimationFrame(function(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); });
    document.body.classList.add('v4-lock');
    setTimeout(function(){ var x = $('.x', box); if(x) x.focus(); }, 60);
  }
  function closeModal(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('v4-lock');
    setTimeout(function(){ if(!modal.classList.contains('open')) box.innerHTML = ''; }, 320);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('.scrim', modal).addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* video: id = YouTube video ID (empty = "coming soon" panel) */
  function openVideo(id, title, thumb){
    id = ytId(id);
    var inner = id
      ? '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="' + esc(title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
      : '<div class="v4-vpend" style="background-image:url(\'' + esc(thumb||'') + '\')"><b>' + esc(title||'Video') + '</b><span>Video coming soon.</span></div>';
    openModal('<div class="v4-vframe">' + inner + '</div>', 'video');
  }
  function openImage(src, title){
    openModal('<img src="' + esc(src) + '" alt="' + esc(title) + '"><div class="cap">' + esc(title) + '</div>', 'image');
  }
  window.V4.openVideo = openVideo; window.V4.openImage = openImage;

  document.addEventListener('click', function(e){
    var v = e.target.closest('[data-v4-yt]');
    if(v){ e.preventDefault(); openVideo(v.getAttribute('data-v4-yt'), v.getAttribute('data-title'), v.getAttribute('data-thumb')); return; }
    var im = e.target.closest('[data-v4-img]');
    if(im){ e.preventDefault(); openImage(im.getAttribute('data-v4-img'), im.getAttribute('data-title')); return; }
    var p = e.target.closest('[data-v4-person]');
    if(p && !e.target.closest('a')){ e.preventDefault(); openPerson(p); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ') return;
    var p = e.target.closest && e.target.closest('[data-v4-person]');
    if(p && e.target === p){ e.preventDefault(); openPerson(p); }
  });

  /* people popup (faculty + management). Data lives in data-* attributes on the card. */
  function openPerson(card){
    var d = card.dataset, meta = '', acts = '';
    if(d.qual) meta += '<div><dt>Qualifications</dt><dd>' + esc(d.qual) + '</dd></div>';
    if(d.area) meta += '<div><dt>Specialisation</dt><dd>' + esc(d.area) + '</dd></div>';
    if(d.email) acts += '<a class="v4-btn line sm" href="mailto:' + esc(d.email) + '">' + ICO.mail + esc(d.email) + '</a>';
    if(d.linkedin) acts += '<a class="v4-btn line sm" href="' + esc(d.linkedin) + '" target="_blank" rel="noopener">' + ICO.li + 'LinkedIn</a>';
    if(d.profile) acts += '<a class="v4-btn fill sm" href="' + esc(d.profile) + '" target="_blank" rel="noopener">View SLIIT profile ' + ICO.ext + '</a>';
    openModal('<div class="v4-pm"><div class="side"><span>' + esc(d.initials) + '</span></div><div class="main"><h3>' + esc(d.name) + '</h3><div class="role">' + esc(d.role) + '</div>' +
      (d.bio ? '<p class="bio">' + esc(d.bio) + '</p>' : '') + (meta ? '<dl>' + meta + '</dl>' : '') + '<div class="acts">' + acts + '</div></div></div>', 'person');
  }

  /* ---------- filters: <div data-v4-filter="targetId"><button data-f="all|cat">… ; items carry data-cat="a b" ---------- */
  $$('[data-v4-filter]').forEach(function(group){
    var target = document.getElementById(group.getAttribute('data-v4-filter')); if(!target) return;
    var items = $$('[data-cat]', target), btns = $$('button[data-f]', group);
    var live = function(it){ return it.getAttribute('data-showcase') !== 'no'; };
    btns.forEach(function(b){
      var f = b.getAttribute('data-f');
      var n = items.filter(function(it){ return live(it) && (f === 'all' || it.getAttribute('data-cat').split(' ').indexOf(f) > -1); }).length;
      var s = document.createElement('span'); s.className = 'n'; s.textContent = n; b.appendChild(s);
      if(!n && f !== 'all') b.hidden = true;
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        items.forEach(function(it){ it.classList.toggle('v4-off', !(f === 'all' || it.getAttribute('data-cat').split(' ').indexOf(f) > -1)); });
      });
    });
  });

  /* ---------- countdowns: data-v4-countdown="ISO date" ---------- */
  var UNITS = '<div class="v4-unit"><b data-u="d">00</b><span>Days</span></div><div class="v4-unit"><b data-u="h">00</b><span>Hours</span></div><div class="v4-unit"><b data-u="m">00</b><span>Mins</span></div><div class="v4-unit"><b data-u="s">00</b><span>Secs</span></div>';
  function startCountdown(el){
    if(el._v4t) clearInterval(el._v4t);
    var end = new Date(el.getAttribute('data-v4-countdown')).getTime(); if(isNaN(end)) return;
    if(!$('[data-u="d"]', el)) el.innerHTML = UNITS;
    var u = {}; ['d','h','m','s'].forEach(function(k){ u[k] = $('[data-u="'+k+'"]', el); });
    var pad = function(n){ return (n < 10 ? '0' : '') + n; };
    function tick(){
      var diff = end - Date.now();
      if(diff <= 0){ el.innerHTML = '<div class="v4-cd-done">' + esc(el.getAttribute('data-done') || 'Happening now') + '</div>'; clearInterval(el._v4t); return; }
      u.d.textContent = pad(Math.floor(diff/864e5)); u.h.textContent = pad(Math.floor(diff%864e5/36e5));
      u.m.textContent = pad(Math.floor(diff%36e5/6e4)); u.s.textContent = pad(Math.floor(diff%6e4/1e3));
    }
    el._v4t = setInterval(tick, 1000); tick();
  }
  $$('[data-v4-countdown]').forEach(startCountdown);

  /* ---------- homepage: countdown event + video reviews from the CMS (content/home.json) ---------- */
  var cdSec = $('.v4-countdown'), vGrid = $('.v4-video-grid');
  if((cdSec || vGrid) && window.ALTHIA_CMS){
    ALTHIA_CMS.getJSON('home.json', function(d){
      if(!d) return;
      var ev = d.event;
      if(cdSec && ev){
        if(ev.show === false){ cdSec.hidden = true; }
        else {
          cdSec.hidden = false;
          var set = function(sel, v){ var n = $(sel, cdSec); if(n && v != null && v !== '') n.textContent = v; };
          set('.v4-cd-badge', ev.badge); set('.v4-cd-title', ev.title);
          set('.v4-cd-meta', [ev.date_label, ev.time_label, ev.venue].filter(Boolean).join(' · '));
          var a = $('a.v4-btn', cdSec);
          if(a){ if(ev.link) a.setAttribute('href', ev.link); if(ev.button_label) a.innerHTML = esc(ev.button_label) + ' <span>&rarr;</span>'; }
          var tm = $('[data-v4-countdown]', cdSec);
          if(tm && ev.start){ var iso = String(ev.start).length <= 16 ? String(ev.start).slice(0,16) + ':00+05:30' : ev.start; tm.setAttribute('data-v4-countdown', iso); if(ev.done_text) tm.setAttribute('data-done', ev.done_text); tm.innerHTML = UNITS; startCountdown(tm); }
        }
      }
      if(vGrid && Array.isArray(d.videos) && d.videos.length){
        vGrid.innerHTML = d.videos.filter(function(v){ return v && v.title; }).map(function(v, i){
          var th = v.thumbnail || '/assets/img/campus.jpg';
          return '<button class="v4-vcard' + (i === 0 ? ' big' : '') + ' rev show" data-v4-yt="' + esc(ytId(v.youtube)) + '" data-title="' + esc(v.title) + '" data-thumb="' + esc(th) + '"><img src="' + esc(th) + '" alt="" loading="lazy">' +
            (v.duration ? '<span class="dur">' + esc(v.duration) + '</span>' : '') + '<span class="v4-play"><i></i></span><span class="vc"><b>' + esc(v.title) + '</b><span>' + esc(v.subtitle || '') + '</span></span></button>';
        }).join('');
      }
    });
  }
  /* accepts a YouTube ID or any YouTube URL */
  function ytId(v){
    v = String(v || '').trim(); if(!v) return '';
    var m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : v;
  }
  window.V4.ytId = ytId;

  /* ---------- Netlify Forms: AJAX submit helper ---------- */
  function netlifySubmit(form){
    var body = new URLSearchParams(new FormData(form)).toString();
    return fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body})
      .then(function(r){ if(!r.ok) throw new Error('Form error ' + r.status); return r; });
  }
  window.V4.netlifySubmit = netlifySubmit;

  /* ---------- event registration (Netlify form "event-registration") ---------- */
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-v4-register]'); if(!b) return;
    e.preventDefault();
    var ev = b.getAttribute('data-v4-register'), when = b.getAttribute('data-when') || '';
    openModal('<div class="v4-reg"><span class="v4-eyebrow">Register</span><h3>' + esc(ev) + '</h3>' + (when ? '<p class="when">' + esc(when) + '</p>' : '') +
      '<form name="event-registration" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate>' +
      '<input type="hidden" name="form-name" value="event-registration"><input type="hidden" name="event" value="' + esc(ev) + '">' +
      '<p hidden><label>Leave this empty <input name="bot-field"></label></p>' +
      '<label>Full name<input name="name" required autocomplete="name"></label>' +
      '<div class="row"><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Mobile<input name="phone" type="tel" required autocomplete="tel" placeholder="07X XXX XXXX"></label></div>' +
      '<div class="row"><label>How many people?<select name="attendees"><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></label>' +
      '<label>I am a<select name="who"><option>Future student</option><option>Parent or guardian</option><option>Teacher or counsellor</option><option>Other</option></select></label></div>' +
      '<label>Anything we should know? <small>(optional)</small><textarea name="message" rows="3"></textarea></label>' +
      '<p class="err" hidden>Sorry, that didn\'t go through. Please try again, or WhatsApp us on +94 76 330 6603.</p>' +
      '<button type="submit" class="v4-btn fill">Register <span>&rarr;</span></button></form>' +
      '<div class="ok" hidden><b>You\'re registered!</b><p>We\'ve saved your place for <span></span>. We\'ll be in touch with the details.</p></div></div>', 'reg');
    var f = $('.v4-reg form', modal);
    f.addEventListener('submit', function(ev2){
      ev2.preventDefault();
      if(!f.checkValidity()){ f.reportValidity(); return; }
      var btn = $('button[type=submit]', f); btn.disabled = true; btn.textContent = 'Sending…'; $('.err', f).hidden = true;
      netlifySubmit(f).then(function(){
        var ok = $('.v4-reg .ok', modal); $('span', ok).textContent = ev; f.hidden = true; ok.hidden = false;
      }).catch(function(){ btn.disabled = false; btn.innerHTML = 'Register <span>&rarr;</span>'; $('.err', f).hidden = false; });
    });
  });

  /* ---------- homepage hero slider ---------- */
  var sl = $('#v4Slider');
  if(sl){
    var slides = $$('.slide', sl), dw = $('.v4-dots', sl), ct = $('.v4-count', sl), cur = 0, timer;
    var ms = parseInt(sl.getAttribute('data-interval') || '6500', 10); sl.style.setProperty('--slide-ms', ms + 'ms');
    var dots = slides.map(function(_, i){ var b = document.createElement('button'); b.setAttribute('aria-label','Slide ' + (i+1)); b.addEventListener('click', function(){ go(i, true); }); dw.appendChild(b); return b; });
    function go(i, user){
      slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('on'); void dots[cur].offsetWidth; dots[cur].classList.add('on');
      if(ct) ct.textContent = ('0'+(cur+1)).slice(-2) + ' / ' + ('0'+slides.length).slice(-2);
      if(user) restart();
    }
    function restart(){ clearInterval(timer); timer = setInterval(function(){ go(cur+1); }, ms); }
    $('.v4-prev', sl).addEventListener('click', function(){ go(cur-1, true); });
    $('.v4-next', sl).addEventListener('click', function(){ go(cur+1, true); });
    var sx = null;
    sl.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    sl.addEventListener('touchend', function(e){ if(sx === null) return; var dx = e.changedTouches[0].clientX - sx; if(Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), true); sx = null; });
    go(0); restart();
  }

  /* ---------- drag-to-scroll for testimonial tracks ---------- */
  $$('.v4-ttrack').forEach(function(tr){
    var down = false, sx, sl0;
    tr.addEventListener('pointerdown', function(e){ if(e.pointerType !== 'mouse') return; down = true; sx = e.pageX; sl0 = tr.scrollLeft; });
    window.addEventListener('pointerup', function(){ down = false; });
    tr.addEventListener('pointermove', function(e){ if(!down) return; e.preventDefault(); tr.scrollLeft = sl0 - (e.pageX - sx) * 1.3; });
  });

  /* ---------- reveal for new sections (pages use .rv/.in or .rev/.show) ---------- */
  var newRev = $$('.v4-rv');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in','show'); io.unobserve(e.target); } }); }, {threshold:.12});
    newRev.forEach(function(el){ io.observe(el); });
  } else newRev.forEach(function(el){ el.classList.add('in','show'); });

  /* ---------- floating WhatsApp + chatbot (placeholder assistant) ---------- */
  var fl = document.createElement('div'); fl.className = 'v4-floaters';
  fl.innerHTML = '<button class="v4-fab chat" id="v4ChatBtn" aria-label="Chat with us" aria-expanded="false" aria-controls="v4Chat">' + ICO.chat + '<span class="tip">Chat with us</span></button>' +
    '<a class="v4-fab wa" href="https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent("Hi ALTHIA, I'd like to know more about your programmes.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' + ICO.wa + '<span class="tip">WhatsApp us</span></a>';
  document.body.appendChild(fl);
  var chat = document.createElement('div'); chat.className = 'v4-chat'; chat.id = 'v4Chat'; chat.setAttribute('role','dialog'); chat.setAttribute('aria-label','ALTHIA chat assistant');
  chat.innerHTML = '<div class="hd"><div class="av"><img src="assets/img/althia-logo-white.svg" alt=""></div><div><b>ALTHIA Assistant</b><span>Typically replies instantly</span></div><button type="button" aria-label="Close chat">&times;</button></div>' +
    '<div class="bd"></div><form><input type="text" placeholder="Type your question…" aria-label="Your message" autocomplete="off"><button type="submit" aria-label="Send">' + ICO.send + '</button></form>' +
    '<div class="note">Automated assistant · For detailed help, chat on WhatsApp</div>';
  document.body.appendChild(chat);
  var bd = $('.bd', chat), input = $('input', chat), started = false, WA = 'https://wa.me/' + WA_NUMBER;
  var R = [
    {k:['nurs'], a:'Nursing at ALTHIA includes the HND in Nursing and the Higher Diploma in Nursing (Deakin), with clinical rotations at Hemas Hospitals. <a href="nursing.html">See Nursing</a>'},
    {k:['psych','counsel'], a:'Psychology degrees combine wellbeing labs, counselling practice and community projects. <a href="psychology.html">See Psychology</a>'},
    {k:['biomed','lab'], a:'Biomedical Science covers diagnostics, laboratory and research skills. <a href="biomedical-science.html">See Biomedical Science</a>'},
    {k:['health sci','sport','rehab'], a:'Health Science connects classroom learning with Hemas industry partners. <a href="health-science.html">See Health Science</a>'},
    {k:['short'], a:'We run short courses from Basic Life Support to Counselling Skills. <a href="short-courses.html">See short courses</a>'},
    {k:['programme','program','course','degree','study'], a:'We offer four fields: Biomedical Science, Health Science, Nursing and Psychology, plus short courses. <a href="programmes.html">Browse programmes</a>'},
    {k:['apply','admission','intake','enrol','register'], a:'Applications are made through SLIIT\'s online portal. <a href="' + APPLY_URL + '" target="_blank" rel="noopener">Apply now</a> or read the <a href="admissions.html">admissions guide</a>.'},
    {k:['fee','cost','price','scholar','pay','instal'], a:'Fees and scholarships vary by course. Our admissions team can send you the latest details. <a href="' + WA + '" target="_blank" rel="noopener">Chat on WhatsApp</a>'},
    {k:['open day','event'], a:'Our next Open Day is on 14 November 2026 at the Malabe campus. <a href="insights-detail.html?p=open-day-february-2027">See the details</a>'},
    {k:['where','location','address','campus','visit','map'], a:'We\'re at the SLIIT Malabe Campus, New Kandy Road, Malabe. <a href="campus-facilities.html">Explore the campus</a> or <a href="contact.html#visit">get directions</a>.'},
    {k:['contact','call','phone','email','talk','human','person'], a:'Call <a href="tel:+94117544801">+94 11 754 4801</a>, email <a href="mailto:reach@althia.lk">reach@althia.lk</a> or <a href="' + WA + '" target="_blank" rel="noopener">message us on WhatsApp</a>.'}
  ];
  function add(html, who){ var m = document.createElement('div'); m.className = 'v4-msg ' + who; m.innerHTML = html; bd.appendChild(m); bd.scrollTop = bd.scrollHeight; }
  function answer(t){ t = t.toLowerCase(); for(var i=0;i<R.length;i++) for(var j=0;j<R[i].k.length;j++) if(t.indexOf(R[i].k[j]) > -1) return R[i].a;
    return 'Thanks for your question! Our admissions team can help with that. <a href="' + WA + '" target="_blank" rel="noopener">Chat on WhatsApp</a> or <a href="contact.html#enquire">send us a message</a>.'; }
  function ask(t){ if(!t) return; add(esc(t), 'me'); setTimeout(function(){ add(answer(t), 'bot'); }, 450); }
  function start(){
    if(started) return; started = true;
    add('Hi there 👋 I\'m the ALTHIA assistant. What would you like to know?', 'bot');
    var q = document.createElement('div'); q.className = 'v4-quick';
    ['Programmes','Short courses','How to apply','Fees','Open Day','Talk to a person'].forEach(function(l){ var b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.addEventListener('click', function(){ ask(l); }); q.appendChild(b); });
    bd.appendChild(q);
  }
  var cb = $('#v4ChatBtn');
  cb.addEventListener('click', function(){ var o = chat.classList.toggle('open'); cb.setAttribute('aria-expanded', o); if(o){ start(); setTimeout(function(){ input.focus(); }, 200); } });
  $('.hd button', chat).addEventListener('click', function(){ chat.classList.remove('open'); cb.setAttribute('aria-expanded', false); });
  $('form', chat).addEventListener('submit', function(e){ e.preventDefault(); ask(input.value.trim()); input.value = ''; });

  /* ---------- carousels (article event/photo gallery): arrows, counter, swipe, thumbnails, keyboard ---------- */
  function initCarousel(car){
    if(car.dataset.ready) return; car.dataset.ready = '1';
    var tr = $('.tr', car), slides = $$('.slide', car), thumbs = $$('.th', car), n = slides.length, cur = 0;
    var wrap = car.closest('.v4-agal'), ct = wrap ? $('.ct', wrap) : null;
    var prev = $('.cprev', car), next = $('.cnext', car);
    var pad = function(x){ return (x < 10 ? '0' : '') + x; };
    if(n < 2){ prev.hidden = next.hidden = true; if(thumbs.length) $('.thumbs', car).hidden = true; }
    function go(i){
      cur = (i + n) % n;
      tr.style.transform = 'translate3d(' + (-cur * 100) + '%,0,0)';
      slides.forEach(function(sl, k){ sl.setAttribute('aria-hidden', k !== cur); $$('button', sl).forEach(function(b){ b.tabIndex = k === cur ? 0 : -1; }); });
      thumbs.forEach(function(t, k){ t.classList.toggle('on', k === cur); });
      if(thumbs[cur]){ var th = $('.thumbs', car), t = thumbs[cur]; th.scrollTo({left: t.offsetLeft - th.clientWidth/2 + t.clientWidth/2, behavior:'smooth'}); }
      if(ct) ct.textContent = pad(cur+1) + ' / ' + pad(n);
    }
    prev.addEventListener('click', function(){ go(cur-1); });
    next.addEventListener('click', function(){ go(cur+1); });
    thumbs.forEach(function(t){ t.addEventListener('click', function(){ go(+t.getAttribute('data-go')); }); });
    car.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ e.preventDefault(); go(cur+1); } if(e.key === 'ArrowLeft'){ e.preventDefault(); go(cur-1); } });
    /* swipe / drag */
    var vp = $('.vp', car), sx = null, sy = null, dx = 0, dragging = false;
    vp.addEventListener('pointerdown', function(e){ sx = e.clientX; sy = e.clientY; dx = 0; dragging = false; });
    vp.addEventListener('pointermove', function(e){
      if(sx === null) return; dx = e.clientX - sx;
      if(!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - sy)){ dragging = true; tr.classList.add('drag'); }
      if(dragging) tr.style.transform = 'translate3d(calc(' + (-cur * 100) + '% + ' + dx + 'px),0,0)';
    });
    function end(){
      if(sx === null) return; tr.classList.remove('drag');
      if(dragging && Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); else go(cur);
      if(dragging){ car.dataset.justDragged = '1'; setTimeout(function(){ delete car.dataset.justDragged; }, 50); }
      sx = null; dragging = false;
    }
    vp.addEventListener('pointerup', end); vp.addEventListener('pointerleave', end); vp.addEventListener('pointercancel', end);
    vp.addEventListener('click', function(e){ if(car.dataset.justDragged){ e.stopPropagation(); e.preventDefault(); } }, true);
    go(0);
  }
  window.V4.initCarousels = function(){ $$('[data-v4-carousel]').forEach(initCarousel); };
  window.V4.initCarousels();

  /* keep floaters clear of the homepage cookie bar */
  var ck = document.getElementById('cookieBar');
  if(ck && 'MutationObserver' in window){
    var sync = function(){ document.body.classList.toggle('v4-cookie', ck.classList.contains('show')); };
    new MutationObserver(sync).observe(ck, {attributes:true, attributeFilter:['class']}); sync();
  }
})();
