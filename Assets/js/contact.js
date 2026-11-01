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
  $('#navTime').textContent=`Local time — ${time}`;$('#dTime').textContent=time;
}
tick(); setInterval(tick,1000);

/* nav */
const NAV=[['Home','index.html'],['Work','index.html#works'],['Services','index.html#services'],['Studio','index.html#about'],['Careers','index.html#careers'],['Contact','contact']];
function go(target){ if(target==='contact') scrollToId('top'); else location.href=target; }
$('#pnav').innerHTML=NAV.map(([l,t])=>`<li><button data-t="${t}" ${t==='contact'?'aria-current="page"':''}><span class="nl">${l}${l==='Services'?'<span class="car">▾</span>':''}</span></button></li>`).join('');
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
$('#navStart').addEventListener('click',()=>{closeNav();setTimeout(()=>scrollToId('form'),60);});
addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});

/* CTAs */
$('#ctaForm').innerHTML=pill('Send a message','dark','right','form');
$('#ctaMail').innerHTML=`<a class="pill" href="mailto:hello@Harshal.studio" data-arrow=""><span class="pill-s"><span class="pill-in pv-outline">hello@Harshal.studio</span></span></a>`;
$('#ctaFt').innerHTML=pill('Start a project','light','up-right','form');
$('#cSubmit').innerHTML=`<button class="pill" type="submit" id="cSend" data-arrow="up-right"><span class="pill-s"><span class="pill-in pv-dark wa"><span id="cSendT">Send request</span><span class="pill-b">${ic('up')}</span></span></span></button>`;
$('#cAgain').innerHTML=pill('Send another','dark','','again');
document.addEventListener('click',e=>{
  const b=e.target.closest('button.pill[data-act]'); if(!b||b.type==='submit')return;
  const a=b.dataset.act; if(a==='again') resetForm(); else if(a) scrollToId(a);
});

/* service options */
const SVC=['Software Development','Product Design','Quality Assurance','Consulting','Not sure yet'];
$('#opts').innerHTML=SVC.map(s=>`<button type="button" class="opt" aria-pressed="false">${s}</button>`).join('');
$$('.opt').forEach(o=>o.addEventListener('click',()=>o.setAttribute('aria-pressed',o.getAttribute('aria-pressed')==='true'?'false':'true')));

/* form (stub) */
const form=$('#cform');
function resetForm(){
  form.reset(); $$('.opt').forEach(o=>o.setAttribute('aria-pressed','false'));
  $('#cSendT').textContent='Send request';$('#cSend').disabled=false;
  $('#cok').hidden=true;$('#cwrap').hidden=false;
}
form.addEventListener('submit',e=>{
  e.preventDefault();$('#cSendT').textContent='Sending…';$('#cSend').disabled=true;
  setTimeout(()=>{$('#cwrap').hidden=true;$('#cok').hidden=false;},700);
});

/* details socials */
$('#dsoc').innerHTML=['X / Twitter','Behance','Dribbble','LinkedIn'].map(l=>`<a href="#"><span class="al">${l}</span></a>`).join('');
$$('#dsoc a').forEach(a=>{const s=$('.al',a);H(s,a,320,22,x=>{s.style.transform=`translateX(${4*x}px)`;s.style.opacity=.65+.35*x})});
a_prevent();
function a_prevent(){ $$('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault())); }

/* FAQ */
const FAQ=[
 ['How quickly will you reply?','Within one business day. If your request is urgent, say so in the message and email hello@Harshal.studio as well.'],
 ['What happens after I send a request?','We read it, reply with any questions or a call invite, and then share a scoped plan so you know what we would build, how, and when.'],
 ['Do you work with early-stage teams?','Yes. We partner with ambitious teams at any stage, from a first product to an established brand that needs to scale.'],
 ['Can you join a project already in progress?','Yes. Consulting and quality assurance engagements often start mid-project, and we can pick up design or development where it is.'],
 ['Where is the team based?','We are remote-first with a distributed team working across every time zone, so we can usually overlap with yours.']
];
$('#fqList').innerHTML=FAQ.map(([q,a],i)=>`
<li data-rv="24,1,200,24,${i*80}"><div class="fq">
 <h3 style="font-size:inherit;font-weight:inherit"><button class="fq-q" aria-expanded="false" aria-controls="fa${i}" id="fq${i}"><span class="ix">0${i+1}</span><span class="qt" style="flex:1;font-weight:500;letter-spacing:-.01em">${q}</span><span class="ab">${ic('plus')}</span></button></h3>
 <div class="fq-a" id="fa${i}" role="region" aria-labelledby="fq${i}"><div><p>${a}</p></div></div>
</div></li>`).join('');
$$('#fqList .fq').forEach(box=>{
  const btn=$('.fq-q',box);
  H(btn,null,240,26,x=>{btn.style.background=`rgba(241,240,238,${Math.min(Math.max(x,0),1)})`;});
  btn.addEventListener('click',()=>{
    const open=box.classList.toggle('open'); btn.setAttribute('aria-expanded',open);
  });
});

/* footer */
const COLS=[
 ['Company',[['About','index.html#about'],['Careers','index.html#careers'],['Partners','index.html#partners'],['Contact','#top']]],
 ['Services',[['Development','index.html#development'],['Design','index.html#design'],['Quality Assurance','index.html#qa'],['Consulting','index.html#consulting']]],
 ['Social',[['X / Twitter','#'],['Behance','#'],['Dribbble','#'],['LinkedIn','#']]]
];
$('#ftCols').innerHTML=`<div><span class="brand" style="font-size:1.125rem">${ic('logo')}Harshal</span><p class="ft-tag">An independent studio crafting brands, products, and the systems that connect them.</p></div>`+
 COLS.map(([h,ls])=>`<div><h4>${h}</h4><ul>${ls.map(([l,href])=>`<li><a href="${href}"><span class="al">${l}</span></a></li>`).join('')}</ul></div>`).join('');
$('#legal').innerHTML=[['Privacy','index.html#privacy'],['Terms','index.html#terms']].map(([l,h])=>`<li><a href="${h}"><span class="al">${l}</span></a></li>`).join('');
$$('#ftCols a').forEach(a=>{const s=$('.al',a);H(s,a,320,22,x=>{s.style.transform=`translateX(${4*x}px)`;s.style.opacity=.65+.35*x})});
$$('#legal a').forEach(a=>{const s=$('.al',a);H(s,a,320,22,x=>{s.style.transform=`translateX(${3*x}px)`;s.style.opacity=.7+.3*x})});
$$('#ftCols a[href="#top"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollToId('top');}));
$$('#ftCols a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));

hydrate(); wirePills();

/* init */
function initText(){
  $$('[data-ld],[data-ls],[data-lines]').forEach(initLines);
  $$('[data-rv]').forEach(initReveal);
  setReady();
}
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(initText);
