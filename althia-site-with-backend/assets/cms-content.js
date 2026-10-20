/* =====================================================================
   ALTHIA — CMS content loader (Decap CMS on Netlify)
   Pages keep their original inline data as a fallback. When the site is
   served over http(s), the editable JSON in /content/ replaces it.
   ===================================================================== */
(function(){
  'use strict';
  var TIMEOUT = 4000;

  function getJSON(file, done){
    if(location.protocol === 'file:'){ done(null); return; }
    var finished = false;
    var t = setTimeout(function(){ if(!finished){ finished = true; done(null); } }, TIMEOUT);
    fetch('/content/' + file + '?v=' + Date.now(), {cache:'no-store'})
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(d){ if(!finished){ finished = true; clearTimeout(t); done(d); } })
      .catch(function(){ if(!finished){ finished = true; clearTimeout(t); done(null); } });
  }

  function slug(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function list(v){ return Array.isArray(v) ? v.map(function(x){ return typeof x === 'object' && x !== null ? (x.value || x.name || x.text || '') : String(x); }).filter(Boolean) : []; }

  /* CMS post -> the shape the Insights pages already render */
  function adaptPost(p){
    var o = { id: p.id || slug(p.title), type: p.type || 'news', area: p.area || 'all', date: p.date, title: p.title || '', excerpt: p.excerpt || '' };
    if(p.featured) o.feat = true;
    var img = p.image || '';
    if(img){ if(window.IMG && !IMG[img]) IMG[img] = img; o.img = img; } else { o.img = 'lawn'; }
    if(o.type === 'news') o.author = p.author || 'ALTHIA';
    if(o.type === 'event'){ o.time = p.time || ''; o.venue = p.venue || ''; o.mode = p.mode || ''; o.fee = p.fee || ''; }
    if(o.type === 'research'){ o.by = list(p.by); if(!o.by.length) o.by = ['ALTHIA faculty']; o.journal = p.journal || ''; o.keywords = list(p.keywords); o.findings = list(p.findings); }
    o.body = (p.body || []).map(function(b){
      switch(b.type){
        case 'heading': return ['h2', b.text || ''];
        case 'quote':   return ['q', b.text || '', b.cite || ''];
        case 'list':    return ['ul', list(b.items)];
        default:        return ['p', b.text || ''];
      }
    });
    if(!o.body.length && o.type !== 'research') o.body = [['p', o.excerpt]];
    return o;
  }

  window.ALTHIA_CMS = {
    getJSON: getJSON,
    /* Insights list + article pages */
    loadInsights: function(render){
      var ran = false;
      function go(){ if(ran) return; ran = true; try { render(); } finally { if(window.V4 && V4.initCarousels) V4.initCarousels(); } }
      getJSON('insights.json', function(d){
        if(d && Array.isArray(d.posts) && d.posts.length){
          try {
            var posts = d.posts.filter(function(p){ return p && p.title && p.date; }).map(adaptPost);
            if(posts.length){
              window.POSTS = posts;
              if(window.ARTICLE_GALLERY){
                window.ARTICLE_GALLERY = {};
                d.posts.forEach(function(p){
                  var g = (p.gallery || []).filter(function(x){ return x && x.image; });
                  if(!g.length) return;
                  var id = p.id || slug(p.title);
                  ARTICLE_GALLERY[id] = g.map(function(x){ return x.image; });
                  g.forEach(function(x){ if(x.caption) GALLERY_CAPTIONS[x.image] = x.caption; });
                });
              }
            }
          } catch(e){ console.warn('[ALTHIA] CMS content could not be used, showing built-in content.', e); }
        }
        go();
      });
    }
  };
})();
