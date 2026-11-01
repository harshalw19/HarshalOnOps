const CURRENT="blog.html";

import Lenis from 'https://unpkg.com/lenis@1.3.23/dist/lenis.mjs';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover=matchMedia('(hover:hover)').matches;
let setReady; const ready=new Promise(r=>setReady=r);

/* icons */
const S='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const ICON={
 logo:'<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z"/></svg>',
 arrow:S+'<path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 up:S+'<path d="M7 17 17 7M8 7h9v9"/></svg>',
 plus:S+'<path d="M12 5v14M5 12h14"/></svg>',
 x:S+'<path d="M4 4l16 16M20 4 4 20"/></svg>',
 grid:S+'<path d="M4 6h16M4 12h16M4 18h16"/></svg>'
};
const ic=n=>`<i data-i="${n}">${ICON[n]}</i>`;
function hydrate(root=document){ $$('i[data-i]',root).forEach(e=>{ if(!e.firstChild) e.innerHTML=ICON[e.dataset.i]||''; }); }

/* lenis + lock */
window.scrollTo(0,0);
const lenis=new Lenis({smoothWheel:true});
(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());
function stopScroll(){lenis.stop();const s=document.documentElement.style;s.position='relative';s.overflow='hidden';s.height='100%'}
function startScroll(){lenis.start();const s=document.documentElement.style;s.removeProperty('position');s.removeProperty('overflow');s.removeProperty('height')}
function scrollToId(id){ const el=document.getElementById(id); if(!el) return; lenis.scrollTo(el.getBoundingClientRect().top+window.pageYOffset,{duration:1.2}); }

/* adaptive grid */
function applyAdaptiveGrid(){
  const FONT_BASE=16,baseWidth=1920,coef=0.6666,w=window.innerWidth;
  const size=FONT_BASE-(FONT_BASE*(((baseWidth-w)/baseWidth)*100*coef))/100;
  if(size>FONT_BASE) document.documentElement.style.fontSize=size+'px'; else document.documentElement.style.removeProperty('font-size');
}
applyAdaptiveGrid(); addEventListener('resize',applyAdaptiveGrid);

/* spring */
function spring(t,f,x0,fn,done){
  let x=x0,v=0,target=x0,raf=0,last=0;
  function step(now){
    if(!last) last=now;
    const dt=Math.min((now-last)/1000,1/30); last=now;
    const n=Math.max(1,Math.ceil(dt*240)),h=dt/n;
    for(let i=0;i<n;i++){ const a=t*(target-x)-f*v; v+=a*h; x+=v*h; }
    if(Math.abs(target-x)<.001&&Math.abs(v)<.001){ x=target;v=0;fn(x);raf=0;last=0;done&&done(x);return; }
    fn(x); raf=requestAnimationFrame(step);
  }
  return { to(n){target=n;if(!raf){last=0;raf=requestAnimationFrame(step);}}, set(n){x=n;v=0;target=n;fn(x)}, get x(){return x} };
}
function H(el,trig,t,f,fn){
  if(!canHover||!el) return;
  const sp=spring(t,f,0,fn),tr=trig||el;
  tr.addEventListener('mouseenter',()=>sp.to(1)); tr.addEventListener('mouseleave',()=>sp.to(0));
}

/* reveal */
function whenVisible(el,cb,th=.15){
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){io.disconnect();ready.then(cb);}})},{threshold:th});
  io.observe(el);
}
function initReveal(el){
  const [y=0,s=1,t=200,f=24,d=0,o=1]=el.dataset.rv.split(',').map(Number);
  const apply=x=>{const k=Math.min(Math.max(x,0),1.2);el.style.opacity=o*Math.min(Math.max(x,0),1);el.style.transform=`translateY(${y*(1-k)}px) scale(${s+(1-s)*k})`};
  if(reduced){el.style.opacity=o;return;}
  apply(0);
  const sp=spring(t,f,0,apply,()=>{el.style.transform=''});
  whenVisible(el,()=>setTimeout(()=>sp.to(1),d),.05);
}
function measureLines(el,text){
  el.innerHTML=text.split(/\s+/).map(w=>`<span style="display:inline-block">${w}</span>`).join(' ');
  const lines=[];let top=null,cur=[];
  [...el.children].forEach(s=>{const t=s.offsetTop;if(top===null||Math.abs(t-top)<4){cur.push(s.textContent);if(top===null)top=t;}else{lines.push(cur.join(' '));cur=[s.textContent];top=t;}});
  lines.push(cur.join(' ')); return lines;
}
function initLines(el){
  const text=el.textContent.trim().replace(/\s+/g,' ');
  const lines=el.dataset.lines?el.dataset.lines.split('|'):measureLines(el,text);
  el.setAttribute('aria-label',text);
  const stag=+(el.dataset.ls||0),base=+(el.dataset.ld||0);
  el.innerHTML=lines.map((l,i)=>`<span class="ln" aria-hidden="true"><span class="li" style="transition-delay:${base+i*stag}ms">${l}</span></span>`).join('');
  if(reduced){el.classList.add('in');return;}
  whenVisible(el,()=>el.classList.add('in'),.1);
}

/* pill */
function pill(text,variant,arrow,act,extra=''){
  const wa=!!arrow;
  return `<button class="pill" ${extra} data-act="${act||''}" data-arrow="${arrow||''}"><span class="pill-s"><span class="pill-in pv-${variant}${wa?' wa':''}"><span class="pt">${text}</span>${wa?`<span class="pill-b">${ic(arrow==='up-right'?'up':'arrow')}</span>`:''}</span></span></button>`;
}
function wirePills(root=document){
  $$('.pill',root).forEach(b=>{
    if(b.dataset.w) return; b.dataset.w=1;
    const s=$('.pill-s',b); H(s,b,320,18,x=>{s.style.transform=`scale(${1+.04*x})`});
    const ico=$('.pill-b i',b);
    if(ico){const up=b.dataset.arrow==='up-right';H(ico,b,320,18,x=>{ico.style.transform=up?`translate(${2*x}px,${-2*x}px)`:`translate(${3*x}px,0)`});}
  });
}

/* clock */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function tick(){
  const d=new Date();let h=d.getHours();const m=String(d.getMinutes()).padStart(2,'0');const ap=h>=12?'pm':'am';h=h%12||12;
  const time=`${h}:${m}${ap}`;
  $('#clkT').textContent=time;$('#clkD').textContent=`${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  $('#navTime').textContent=`Local time — ${time}`;
}
tick(); setInterval(tick,1000);

/* nav */
const NAV=[['Home','index.html'],['Work','index.html#works'],['Services','index.html#services'],['Studio','index.html#about'],['Careers','index.html#careers'],['Blog','blog.html'],['Contact','contact.html']];
function go(target){ if(target===CURRENT) scrollToId('top'); else location.href=target; }
$('#pnav').innerHTML=NAV.map(([l,t])=>`<li><button data-t="${t}" ${t==='blog.html'?'aria-current="page"':''}><span class="nl">${l}${l==='Services'?'<span class="car">▾</span>':''}</span></button></li>`).join('');
$$('#pnav button').forEach(b=>{
  const lab=$('.nl',b); H(lab,b,320,22,x=>{lab.style.transform=`translateY(${-2*x}px)`;lab.style.opacity=.8+.2*x});
  b.addEventListener('click',()=>go(b.dataset.t));
});
const bi=$('#brandIn'); H(bi,$('#brandBtn'),320,18,x=>{bi.style.transform=`scale(${1+.04*x})`});
const mi=$('#menuIn'); H(mi,$('#menuBtn'),320,18,x=>{mi.style.transform=`scale(${1+.05*x})`});

const nav=$('#nav');let navOpen=false;
$('#navList').innerHTML=NAV.map(([l],i)=>`<li><button class="nv" data-i="${i}" style="transition-delay:${i*45+80}ms"><span class="n">0${i+1}</span><span class="l">${l}</span></button></li>`).join('');
const navSp=spring(280,32,0,x=>{nav.style.opacity=Math.min(Math.max(x,0),1)},x=>{if(x===0)nav.style.display='none'});
function openNav(){ if(navOpen)return;navOpen=true;stopScroll();nav.style.display='flex';navSp.to(1);requestAnimationFrame(()=>requestAnimationFrame(()=>$$('.nv').forEach(b=>b.classList.add('in'))));$('#navClose').focus({preventScroll:true}); }
function closeNav(){ if(!navOpen)return;navOpen=false;$$('.nv').forEach(b=>b.classList.remove('in'));navSp.to(0);startScroll(); }
$('#menuBtn').addEventListener('click',openNav);
$('#navClose').addEventListener('click',closeNav);
$$('.nv').forEach(b=>b.addEventListener('click',()=>{const t=NAV[+b.dataset.i][1];closeNav();setTimeout(()=>go(t),60);}));
$('#navStart').addEventListener('click',()=>{closeNav();setTimeout(()=>{location.href='contact.html#form'},60);});
addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});



/* footer CTA + generic pill actions */
$('#ctaFt').innerHTML=pill('Start a project','light','up-right','href:contact.html#form');
document.addEventListener('click',e=>{
  const b=e.target.closest('button.pill[data-act]'); if(!b) return;
  const a=b.dataset.act; if(a.startsWith('href:')) location.href=a.slice(5); else if(a) scrollToId(a);
});
$$('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));


const POSTS=[{"i": 1, "slug": "blog-1.html", "cat": "DevOps", "title": "Ship on Fridays: designing a CI/CD pipeline you can trust", "excerpt": "Fear of Friday deploys is a signal about your pipeline, not your calendar. Here is how to make every change small, tested and reversible.", "date": "14 March, 2025", "read": "8 min read", "tags": ["CI/CD", "Release engineering", "Kubernetes"]}, {"i": 2, "slug": "blog-2.html", "cat": "System Design", "title": "Designing a rate limiter: token buckets, Redis and failure modes", "excerpt": "From fixed windows to token buckets, how to protect an API without punishing legitimate bursts, and what happens when the limiter itself fails.", "date": "28 February, 2025", "read": "9 min read", "tags": ["Rate limiting", "Redis", "API design"]}, {"i": 3, "slug": "blog-3.html", "cat": "DevOps", "title": "Terraform state without the tears: backends, locking and blast radius", "excerpt": "State is the most sensitive file in your infrastructure code. How to store it safely, split it sensibly and recover when it drifts.", "date": "11 February, 2025", "read": "7 min read", "tags": ["Terraform", "AWS", "Infrastructure as Code"]}, {"i": 4, "slug": "blog-4.html", "cat": "System Design", "title": "Message queues vs event streams: choosing between RabbitMQ, SQS and Kafka", "excerpt": "Queues hand work to one consumer; streams keep a replayable log. Understanding the difference saves you from the wrong tool and a painful migration.", "date": "27 January, 2025", "read": "8 min read", "tags": ["Messaging", "RabbitMQ", "Kafka"]}, {"i": 5, "slug": "blog-5.html", "cat": "DevOps", "title": "Observability that pages you for the right reasons: SLOs and burn-rate alerts", "excerpt": "Stop alerting on CPU spikes. Define what good looks like for users, track an error budget and page only when it is burning too fast.", "date": "9 January, 2025", "read": "9 min read", "tags": ["Observability", "Prometheus", "SRE"]}, {"i": 6, "slug": "blog-6.html", "cat": "System Design", "title": "Caching strategies: cache-aside, write-through and the hard part", "excerpt": "Caching is easy to add and hard to get right. Patterns, invalidation and how to survive a cache stampede.", "date": "18 December, 2024", "read": "7 min read", "tags": ["Caching", "Redis", "Scalability"]}];
const CATS=['All','DevOps','System Design'];
let cat='All';
$('#flt').innerHTML=CATS.map(c=>`<button type="button" aria-pressed="${c==='All'}" data-c="${c}">${c}</button>`).join('');
const vis=p=>`<div class="bv ${p.cat==='DevOps'?'dev':'sys'}"><span class="tg">${p.cat}</span>${ic('logo')}</div>`;
function featHTML(p){
  return `<a class="feat" href="${p.slug}" aria-label="${p.title}"><article class="fc">
   <div class="fl"><div>
     <div class="fm">Featured — ${p.cat}</div>
     <h2>${p.title}</h2><p>${p.excerpt}</p>
     <div class="tags">${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>
   </div>
   <div class="fb"><span>${p.date} · ${p.read}</span><span class="bdg">${ic('up')}</span></div></div>
   <div class="fv" aria-hidden="true">${ic('logo')}</div>
  </article></a>`;
}
function cardHTML(p,i){
  return `<li data-rv="32,1,180,26,${i*90}"><a class="bc" href="${p.slug}" aria-label="${p.title}"><article class="bcard">
   ${vis(p)}
   <div class="bt"><div class="mt"><span>${p.cat}</span><span>${p.read}</span></div>
   <h3>${p.title}</h3><p>${p.excerpt}</p>
   <div class="bf"><span>${p.date}</span><span class="ab">${ic('up')}</span></div></div>
  </article></a></li>`;
}
function wireCards(root){
  $$('.feat,.bc',root).forEach(a=>{
    const card=$('.fc,.bcard',a), bd=$('.bdg,.ab',a);
    H(card,a,260,22,x=>{card.style.transform=`translateY(${-8*x}px) scale(${1+.012*x})`});
    H(bd,a,280,18,x=>{bd.style.transform=`rotate(${45*x}deg) scale(${1+.08*x})`});
  });
}
const fw=$('#featWrap'),grid=$('#bgrid');
function render(first){
  const all=cat==='All';
  const list=all?POSTS.slice(1):POSTS.filter(p=>p.cat===cat);
  fw.innerHTML=all?featHTML(POSTS[0]):''; fw.style.display=all?'':'none';
  grid.innerHTML=list.map(cardHTML).join('');
  hydrate(fw); hydrate(grid); wireCards(fw); wireCards(grid);
  if(!first){
    $$('[data-rv]',grid).forEach(initReveal);
    if(all){ fw.style.opacity=0; spring(180,26,0,x=>{fw.style.opacity=Math.min(Math.max(x,0),1);fw.style.transform=`translateY(${24*(1-x)}px)`},()=>{fw.style.transform=''}).to(1); }
  }
}
render(true);
$$('#flt button').forEach(b=>b.addEventListener('click',()=>{
  if(cat===b.dataset.c) return; cat=b.dataset.c;
  $$('#flt button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  render(false);
}));

/* footer */
const COLS=[
 ['Company',[['About','index.html#about'],['Careers','index.html#careers'],['Blog','blog.html'],['Contact','contact.html']]],
 ['Services',[['Development','index.html#development'],['Design','index.html#design'],['Quality Assurance','index.html#qa'],['Consulting','index.html#consulting']]],
 ['Social',[['X / Twitter','#'],['Behance','#'],['Dribbble','#'],['LinkedIn','#']]]
];
$('#ftCols').innerHTML=`<div><span class="brand" style="font-size:1.125rem">${ic('logo')}Lumora</span><p class="ft-tag">An independent studio crafting brands, products, and the systems that connect them.</p></div>`+
 COLS.map(([h,ls])=>`<div><h4>${h}</h4><ul>${ls.map(([l,href])=>`<li><a href="${href}"><span class="al">${l}</span></a></li>`).join('')}</ul></div>`).join('');
$('#legal').innerHTML=[['Privacy','index.html#privacy'],['Terms','index.html#terms']].map(([l,h])=>`<li><a href="${h}"><span class="al">${l}</span></a></li>`).join('');
$$('#ftCols a').forEach(a=>{const s=$('.al',a);H(s,a,320,22,x=>{s.style.transform=`translateX(${4*x}px)`;s.style.opacity=.65+.35*x})});
$$('#legal a').forEach(a=>{const s=$('.al',a);H(s,a,320,22,x=>{s.style.transform=`translateX(${3*x}px)`;s.style.opacity=.7+.3*x})});
$$('#ftCols a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

hydrate(); wirePills();

/* init */
function initText(){
  $$('[data-ld],[data-ls],[data-lines]').forEach(initLines);
  $$('[data-rv]').forEach(initReveal);
  setReady();
}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(initText);
