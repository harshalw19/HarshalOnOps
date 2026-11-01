import Lenis from 'https://unpkg.com/lenis@1.3.23/dist/lenis.mjs';

    /* ================= basics ================= */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover:hover)').matches;
    // const ASSET = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/lumora-e8b711fc68';
    let setReady; const ready = new Promise(r => setReady = r);

    /* ---------- icons ---------- */
    const S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
    const ICON = {
      logo: '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 2c2.2 13.8 7.9 19.6 22 22-14.1 2.4-19.8 8.2-22 22-2.2-13.8-7.9-19.6-22-22 14.1-2.4 19.8-8.2 22-22Z"/></svg>',
      arrow: S + '<path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      up: S + '<path d="M7 17 17 7M8 7h9v9"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z"/></svg>',
      globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.25"/><path d="M12 2.75c2.6 2.3 4 5.8 4 9.25s-1.4 6.95-4 9.25c-2.6-2.3-4-5.8-4-9.25s1.4-6.95 4-9.25zM2.75 12h18.5"/></svg>',
      github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.02 3.63 1.43.1-.73.39-1.23.7-1.51-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.03.75 2.08v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 3.2a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.7v11.8H3.4V9Zm5.9 0h3.5v1.6h.1c.49-.92 1.68-1.9 3.46-1.9 3.7 0 4.38 2.43 4.38 5.6v6.5h-3.7V15c0-1.38-.03-3.15-1.92-3.15-1.92 0-2.21 1.5-2.21 3.05v5.9H9.3V9Z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none"/></svg>',
      medium: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 5.2 8.6 4l5.2 10.8L19 4l3 .8v14.4l-3 .8V8.2l-5.4 11.2h-1.3L6.8 8.1v10.8L2 17.7V5.2Z"/></svg>',
      xBrand: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.48L5.5 22H2.36l7.25-8.29L1.8 2h6.4l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.28 3.88H5.42L17.8 20Z"/></svg>',
      x: S + '<path d="M4 4l16 16M20 4 4 20"/></svg>',
      dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>',
      grid: S + '<path d="M4 6h16M4 12h16M4 18h16"/></svg>',
      expand: S + '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></svg>',
      minimize: S + '<path d="M8 3v5H3m13-5v5h5M3 16h5v5m13-5h-5v5"/></svg>'
    };
    const TOOL_ICONS = {
      Kubernetes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8 19.9 7.4v9.2L12 21.2l-7.9-4.6V7.4L12 2.8Z"/><circle cx="12" cy="12" r="2.2"/><path d="M12 5v4.8m6.1-.3-4.2 2.4m-3.8 0-4.2-2.4m6.1 5.3v4.2m-5.3-7.2 3.4 1.9m6.1-1.9-3.4 1.9"/></svg>',
      AWS: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 15.3h13a3.1 3.1 0 0 0 .2-6.2 6.3 6.3 0 0 0-11.9-.5 3.4 3.4 0 0 0-1.3 6.7Z"/><path d="M7.1 18.1c3.1 1.6 6.9 1.7 10.1.1m-2.2-.1 2.4.1-.8 2"/></svg>',
      GCP: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.1 18.2h9.1a4 4 0 0 0 .3-8 5.6 5.6 0 0 0-10.7-.7 4.4 4.4 0 0 0 1.3 8.7Z"/><path d="M12.4 10.3h4.2v4.1"/></svg>',
      Terraform: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2.8 7.5 4.3v8.7L12 20.2l-7.5-4.4V7.1L12 2.8Z"/><path d="m8.6 9 3.4 2 3.4-2M12 11v4.2"/></svg>',
      Prometheus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8c1.2 3.6-2.8 5.3-.4 8.1 1.2-1.1 1.7-2.4 1.5-3.7 3.2 2.5 5 5.1 4.3 8.2A5.5 5.5 0 0 1 12 20a5.5 5.5 0 0 1-5.4-4.6c-.5-2.7 1-5 3.3-7.2-.1 2.2.5 3.4 1.3 4.1 1.8-2.7-1-5.6.8-9.5Z"/><path d="M10 16.3a2 2 0 1 0 4 0c0-.8-.7-1.7-1.9-2.7-.3 1-1.1 1.7-2.1 2.7Z"/></svg>',
      Jenkins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 8.3a5 5 0 0 1 10 0v5.1a5 5 0 0 1-10 0V8.3Z"/><path d="M9.3 10.4h.1m5.2 0h.1M9.4 14c1.7 1.1 3.5 1.1 5.2 0m-7.2-3.5-2-.9m11.2.9 2-.9M9 18l-1.2 2m7.2-2 1.2 2"/></svg>',
      Python: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.2H8.5a3 3 0 0 0-3 3v3.2h6.2a2.3 2.3 0 0 1 2.3 2.3v.8"/><path d="M12 20.8h3.5a3 3 0 0 0 3-3v-3.2h-6.2a2.3 2.3 0 0 1-2.3-2.3v-.8"/><path d="M8.5 3.2v2m7 13.6v2"/><circle cx="9" cy="7" r=".5" fill="currentColor"/><circle cx="15" cy="17" r=".5" fill="currentColor"/></svg>'
    };
    const ic = (n, style = '') => `<i data-i="${n}" ${style ? `style="${style}"` : ''}>${ICON[n]}</i>`;
    function hydrate(root = document) { $$('i[data-i]', root).forEach(e => { if (!e.firstChild) e.innerHTML = ICON[e.dataset.i] || ''; }); }

    /* ================= Lenis + scroll lock ================= */
    window.scrollTo(0, 0);
    const lenis = new Lenis({ smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf);
    function stopScroll() { lenis.stop(); const s = document.documentElement.style; s.position = 'relative'; s.overflow = 'hidden'; s.height = '100%' }
    function startScroll() { lenis.start(); const s = document.documentElement.style; s.removeProperty('position'); s.removeProperty('overflow'); s.removeProperty('height') }
    function scrollToId(id) {
      const el = document.getElementById(id); if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      lenis.scrollTo(top, { duration: 1.2 });
    }

    /* ================= adaptive grid ================= */
    function applyAdaptiveGrid() {
      const FONT_BASE = 16, baseWidth = 1920, coef = 0.6666;
      const w = window.innerWidth;
      const widthReduction = ((baseWidth - w) / baseWidth) * 100;
      const size = FONT_BASE - (FONT_BASE * (widthReduction * coef)) / 100;
      if (size > FONT_BASE) document.documentElement.style.fontSize = size + 'px';
      else document.documentElement.style.removeProperty('font-size');
    }
    applyAdaptiveGrid(); addEventListener('resize', applyAdaptiveGrid);

    /* ================= spring helper ================= */
    function spring(t, f, x0, fn, done) {
      let x = x0, v = 0, target = x0, raf = 0, last = 0;
      function step(now) {
        if (!last) last = now;
        const dt = Math.min((now - last) / 1000, 1 / 30); last = now;
        const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
        for (let i = 0; i < n; i++) { const a = t * (target - x) - f * v; v += a * h; x += v * h; }
        if (Math.abs(target - x) < .001 && Math.abs(v) < .001) { x = target; v = 0; fn(x); raf = 0; last = 0; done && done(x); return; }
        fn(x); raf = requestAnimationFrame(step);
      }
      return {
        to(n) { target = n; if (!raf) { last = 0; raf = requestAnimationFrame(step); } },
        set(n) { x = n; v = 0; target = n; fn(x); },
        get x() { return x; }
      };
    }
    /* hover spring: trigger -> animates fn(x) between 0 and 1 */
    function H(el, trig, t, f, fn) {
      if (!canHover || !el) return;
      const sp = spring(t, f, 0, fn); const tr = trig || el;
      tr.addEventListener('mouseenter', () => sp.to(1));
      tr.addEventListener('mouseleave', () => sp.to(0));
    }

    /* ================= reveal (data-rv="y,scale,tension,friction,delay,opacity") ================= */
    function whenVisible(el, cb, th = .15) {
      const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { io.disconnect(); ready.then(cb); } }); }, { threshold: th });
      io.observe(el);
    }
    function initReveal(el) {
      const [y = 0, s = 1, t = 200, f = 24, d = 0, o = 1] = el.dataset.rv.split(',').map(Number);
      const apply = x => { const k = Math.min(Math.max(x, 0), 1.2); el.style.opacity = o * Math.min(Math.max(x, 0), 1); el.style.transform = `translateY(${y * (1 - k)}px) scale(${s + (1 - s) * k})`; };
      if (reduced) { el.style.opacity = o; return; }
      apply(0);
      const sp = spring(t, f, 0, apply, () => { el.style.transform = ''; });
      whenVisible(el, () => setTimeout(() => sp.to(1), d), .05);
    }

    /* ================= text splitting ================= */
    function measureLines(el, text) {
      el.innerHTML = text.split(/\s+/).map(w => `<span style="display:inline-block">${w}</span>`).join(' ');
      const lines = []; let top = null, cur = [];
      [...el.children].forEach(s => { const t = s.offsetTop; if (top === null || Math.abs(t - top) < 4) { cur.push(s.textContent); if (top === null) top = t; } else { lines.push(cur.join(' ')); cur = [s.textContent]; top = t; } });
      lines.push(cur.join(' ')); return lines;
    }
    function initLines(el) {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      const lines = el.dataset.lines ? el.dataset.lines.split('|') : measureLines(el, text);
      el.setAttribute('aria-label', text);
      const stag = +(el.dataset.ls || 0), base = +(el.dataset.ld || 0);
      el.innerHTML = lines.map((l, i) => `<span class="ln" aria-hidden="true"><span class="li" style="transition-delay:${base + i * stag}ms">${l}</span></span>`).join('');
      if (reduced) { el.classList.add('in'); return; }
      whenVisible(el, () => el.classList.add('in'), .1);
    }
    function initWords(el) {
      const label = el.textContent.trim().replace(/\s+/g, ' '); el.setAttribute('aria-label', label);
      let i = 0; const out = document.createDocumentFragment();
      const wrapWords = (txt, parent) => { txt.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { parent.appendChild(document.createTextNode(' ')); return; } const s = document.createElement('span'); s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.style.transitionDelay = (i++ * 35) + 'ms'; s.textContent = p; parent.appendChild(s); }); };
      [...el.childNodes].forEach(n => { if (n.nodeType === 3) wrapWords(n.textContent, out); else { const c = n.cloneNode(false); wrapWords(n.textContent, c); out.appendChild(c); } });
      el.innerHTML = ''; el.appendChild(out);
      if (reduced) { el.classList.add('in'); return; }
      whenVisible(el, () => el.classList.add('in'), .1);
    }

    /* ================= pill button ================= */
    function pill(text, variant, arrow, act) {
      const wa = !!arrow;
      return `<button class="pill" data-act="${act || ''}" data-arrow="${arrow || ''}"><span class="pill-s"><span class="pill-in pv-${variant}${wa ? ' wa' : ''}">${text}${wa ? `<span class="pill-b">${ic(arrow === 'up-right' ? 'up' : 'arrow')}</span>` : ''}</span></span></button>`;
    }
    function wirePills(root = document) {
      $$('.pill', root).forEach(b => {
        if (b.dataset.w) return; b.dataset.w = 1;
        const s = $('.pill-s', b); H(s, b, 320, 18, x => { s.style.transform = `scale(${1 + .04 * x})` });
        const ico = $('.pill-b i', b);
        if (ico) { const up = b.dataset.arrow === 'up-right'; H(ico, b, 320, 18, x => { ico.style.transform = up ? `translate(${2 * x}px,${-2 * x}px)` : `translate(${3 * x}px,0)` }); }
      });
    }

    /* ================= clock ================= */
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    function tick() {
      const d = new Date(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0'); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
      const time = `${h}:${m}${ap}`; const date = `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
      $('#clkT').textContent = time; $('#clkD').textContent = date; $('#navTime').textContent = `Local time — ${time}`;
    }
    tick(); setInterval(tick, 1000);

    /* ================= nav data / routing ================= */
    const NAV = [['Home', 'home'], ['Work', 'works'], ['Services', 'services'], ['Blog', 'blog'], ['Contact', 'contact']];
    function navigate(id) {
      if (id === 'blog') { window.location.href = 'blog.html'; return; }
      if (id === 'contact') openModal(); else scrollToId(id);
    }

    /* header nav */
    $('#pnav').innerHTML = NAV.map(([l, id], i) => `<li><button data-id="${id}" ${i === 0 ? 'aria-current="page"' : ''}><span class="nl">${l}${l === 'Services' ? '<span class="car">▾</span>' : ''}</span></button></li>`).join('');
    $$('#pnav button').forEach(b => {
      const lab = $('.nl', b); H(lab, b, 320, 22, x => { lab.style.transform = `translateY(${-2 * x}px)`; lab.style.opacity = .8 + .2 * x });
      b.addEventListener('click', () => navigate(b.dataset.id));
    });
    const bi = $('#brandIn'); H(bi, $('#brandBtn'), 320, 18, x => { bi.style.transform = `scale(${1 + .04 * x})` });
    $('#brandBtn').addEventListener('click', () => scrollToId('home'));
    const mi = $('#menuIn'); H(mi, $('#menuBtn'), 320, 18, x => { mi.style.transform = `scale(${1 + .05 * x})` });

    /* ================= hero CTAs / hero card / partners ================= */
    $('#ctaTalk').innerHTML = '<a class="pill" href="contact.html" data-arrow="right"><span class="pill-s"><span class="pill-in pv-dark wa">Let\'s Talk<span class="pill-b">' + ic('arrow') + '</span></span></span></a>';
    $('#ctaWork').innerHTML = pill('View Work', 'outline', '', 'works');
    // $('#ctaAbout').innerHTML = pill('About Us', 'outline', 'right', 'about');
    $('#ctaFt').innerHTML = pill('Start a project', 'light', 'up-right', 'modal');
    $('#mSubmit').innerHTML = `<button class="pill" type="submit" id="mSend" data-arrow="up-right"><span class="pill-s"><span class="pill-in pv-dark wa"><span id="mSendT">Send request</span><span class="pill-b">${ic('up')}</span></span></span></button>`;
    $('#mDone').innerHTML = pill('Close', 'dark', '', 'close');

    /* ================= demo AI chat ================= */
    const aiChat = $('.ai-chat'), aiChatExpand = $('#aiChatExpand');
    const aiMessages = $('#aiMessages'), aiForm = $('#aiChatForm'), aiInput = $('#aiChatInput');
    const aiControls = [aiInput, ...$$('.ai-chat-form button, .ai-suggestions button')];
    const aiMobile = matchMedia('(max-width:639px)');
    let aiChatPlaceholder = null;
    let aiBusy = false, aiExpanded = false;
    function updateAiExpandIcon() {
      aiChatExpand.innerHTML = ic(aiExpanded ? 'minimize' : aiMobile.matches ? 'up' : 'expand');
    }
    function setAiExpanded(expanded) {
      aiExpanded = expanded;
      if (expanded) {
        aiChatPlaceholder = document.createComment('AI chat position');
        aiChat.before(aiChatPlaceholder);
        document.body.appendChild(aiChat);
      } else if (aiChatPlaceholder) {
        aiChatPlaceholder.before(aiChat);
        aiChatPlaceholder.remove();
        aiChatPlaceholder = null;
      }
      aiChat.classList.toggle('is-maximized', expanded);
      document.body.classList.toggle('ai-chat-open', expanded);
      aiChatExpand.setAttribute('aria-expanded', String(expanded));
      aiChatExpand.setAttribute('aria-label', expanded ? 'Minimize chat' : 'Maximize chat');
      updateAiExpandIcon();
      if (expanded) {
        aiChat.setAttribute('role', 'dialog');
        aiChat.setAttribute('aria-modal', 'true');
        stopScroll();
        aiInput.focus({ preventScroll: true });
      } else {
        aiChat.removeAttribute('role');
        aiChat.removeAttribute('aria-modal');
        startScroll();
        aiChatExpand.focus({ preventScroll: true });
      }
    }
    updateAiExpandIcon();
    aiMobile.addEventListener('change', updateAiExpandIcon);
    aiChatExpand.addEventListener('click', () => setAiExpanded(!aiExpanded));
    function aiReply(question) {
      const q = question.toLowerCase();
      if (/contact|hire|work together|project|reach/.test(q)) return 'You can get in touch through the Let’s Talk button or the Contact page. Share a little about your project and Harshal can take it from there.';
      if (/where|location|based/.test(q)) return 'Harshal is based in Nagpur, Maharashtra, India.';
      if (/experience|years|career/.test(q)) return 'Harshal has 2+ years of DevOps experience, working as a Software Engineer (DevOps) at Tenarai since September 2024 and previously as a DevOps Engineer Intern at Softtronix from December 2023 to May 2024.';
      if (/project|portfolio/.test(q)) return 'The featured projects are a MERN microservices marketplace on AWS EKS and a highly available three-tier Java application on AWS.';
      if (/skill|service|design|develop|build|work|do you|technolog|stack/.test(q)) return 'Harshal works with Kubernetes (GKE and EKS), Docker, AWS, GCP, Terraform, Jenkins, Argo CD, Prometheus, Grafana, Python, and Shell, among other tools.';
      if (/who|about|harshal/.test(q)) return 'Harshal Warukar is a Site Reliability and DevOps Engineer focused on cloud infrastructure, Kubernetes operations, automation, CI/CD, and observability.';
      return 'I’m a demo assistant, so I can answer based on the information on this page. Try asking about Harshal’s work, services, experience, or how to get in touch.';
    }
    function appendAiMessage(text, type) {
      const message = document.createElement('div');
      message.className = `ai-message ai-message-${type}`;
      message.textContent = text;
      aiMessages.appendChild(message);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      return message;
    }
    function askAi(question) {
      const text = question.trim();
      if (!text || aiBusy) return;
      aiBusy = true;
      appendAiMessage(text, 'user');
      const thinking = appendAiMessage('Thinking…', 'bot ai-message-thinking');
      aiControls.forEach(control => { control.disabled = true; });
      setTimeout(() => {
        thinking.remove();
        appendAiMessage(aiReply(text), 'bot');
        aiBusy = false;
        aiControls.forEach(control => { control.disabled = false; });
        aiInput.focus();
      }, 450);
    }
    aiForm.addEventListener('submit', e => {
      e.preventDefault();
      const question = aiInput.value;
      if (!question.trim() || aiBusy) return;
      aiInput.value = '';
      askAi(question);
    });
    $$('.ai-suggestions button').forEach(button => button.addEventListener('click', () => askAi(button.dataset.question)));

    $('#partners').innerHTML = ['Kubernetes', 'AWS', 'GCP', 'Terraform', 'Prometheus', 'Jenkins', 'Python'].map(n => `<li><span class="p"><i class="tool-icon" aria-hidden="true">${TOOL_ICONS[n]}</i><span>${n}</span></span></li>`).join('');
    $$('#partners .p').forEach(p => H(p, null, 320, 20, x => { p.style.transform = `translateY(${-2 * x}px)`; p.style.opacity = .7 + .3 * x }));

    /* ================= about socials ================= */
    // socials opening on new page, aria-label for accessibility, hover scale effect
    $('#socials').innerHTML =
      `<a class="soc" target="_blank" href="https://github.com/harshalw19" aria-label="GitHub"><span class="si">${ic('github')}</span></a>` +
      `<a class="soc" target="_blank" href="https://www.linkedin.com/in/harshalwarukar" aria-label="LinkedIn"><span class="si">${ic('linkedin')}</span></a>` +
      `<a class="soc" target="_blank" href="https://www.instagram.com/harshalwarukarknow" aria-label="Instagram"><span class="si">${ic('instagram')}</span></a>` +
      `<a class="soc" target="_blank" href="https://medium.com/@harshalwarukarknow" aria-label="Medium"><span class="si">${ic('medium')}</span></a>` +
      `<a class="soc" target="_blank" href="https://x.com/harshalw19" aria-label="X (formerly Twitter)"><span class="si">${ic('xBrand')}</span></a>`;
    $$('#socials .soc').forEach(a => { const s = $('.si', a); s.style.display = 'inline-flex'; H(s, a, 320, 16, x => { s.style.transform = `scale(${1 + .18 * x})` }) });

    /* ================= create band ================= */
    const CB = [['Build', 'light'], ['Reliable', 'accent'], ['', 'dark'], ['Systems', 'ghost']];
    $('#cb').innerHTML = CB.map(([w, v], i) => `<li data-rv="28,1,200,22,${i * 120}"><div class="cb-t ${v}">${v === 'dark' ? ic('arrow') : w}</div></li>`).join('');
    $$('#cb .cb-t').forEach(t => H(t, null, 300, 18, x => { t.style.transform = `scale(${1 + .03 * x})` }));

    /* ================= portfolio ================= */
    const WORK = [
      ['MERN Microservices Marketplace', 'AWS EKS', 'GitOps & Observability', 'A cloud-native marketplace deployed to EKS with autoscaling, namespace-based multi-tenancy, Terraform infrastructure, and Jenkins/Argo CD delivery.', ['Kubernetes', 'Terraform', 'Argo CD', 'Prometheus'], 'https://github.com/harshalw19/bidauc-backend-mircoservices'],
      ['AWS Three-Tier Java Application', 'Cloud Infrastructure', 'High Availability', 'A highly available Java application using EC2, private-subnet RDS, an Application Load Balancer, Route 53, and Auto Scaling.', ['AWS', 'VPC', 'RDS', 'CloudWatch'], 'https://github.com/harshalw19/vprofile-project']
    ];
    $('#pfGrid').innerHTML = WORK.map(([n, c, y, d, tags, repo], i) => `
<li data-rv="48,1,180,26,${i * 90}"><div class="pf-a">
 <article class="card">
  <div class="meta"><span>${c} — ${y}</span><a class="bdg" href="${repo}" target="_blank" rel="noopener noreferrer" aria-label="${n} on GitHub">${ic('github')}</a></div>
  <div class="mk" aria-hidden="true"><div>${ic('logo')}<sup>®</sup></div></div>
  <div class="bt"><h3>${n}</h3><p>${d}</p><div class="tags">${tags.map(t => `<span class="chip">${t}</span>`).join('')}</div></div>
 </article></div></li>`).join('');
    $$('#pfGrid .pf-a').forEach(a => {
      const card = $('.card', a), bdg = $('.bdg', a);
      H(card, a, 260, 22, x => { card.style.transform = `translateY(${-8 * x}px) scale(${1 + .012 * x})` });
      H(bdg, bdg, 280, 18, x => { bdg.style.transform = `scale(${1 + .08 * x})` });
    });

    /* ================= services ================= */
    const SV = [['Cloud Engineering', 'Operate and troubleshoot production workloads on AWS and GCP'], ['Infrastructure as Code', 'Provision repeatable cloud infrastructure with Terraform, CloudFormation, Pulumi, and Ansible.'], ['CI/CD & Automation', 'Build delivery pipelines and operational tooling with Jenkins, GitHub Actions, Python, and Shell.'],['Observability & Monitoring', 'Implement Prometheus, Grafana, CloudWatch, and ELK for metrics, logging, and alerting.'], ['AI Engineering and Automation', 'Leverage AI for DevOps automation, observability, and cloud-native application development.']];
    $('#svList').innerHTML = SV.map(([t, d], i) => `
<li data-rv="24,1,200,24,${i * 80}"><a class="sv-a" href="#services" aria-label="${t}">
 <div class="row"><span class="ix">0${i + 1}</span><h3>${t}</h3><p>${d}</p><span class="ab">${ic('up')}</span></div>
</a></li>`).join('');
    $$('#svList .sv-a').forEach(a => {
      a.addEventListener('click', e => e.preventDefault());
      const row = $('.row', a), ab = $('.ab', a);
      H(row, a, 240, 26, x => { row.style.background = `rgba(241,240,238,${Math.min(Math.max(x, 0), 1)})`; row.style.paddingLeft = (1.5 + .5 * x) + 'rem'; row.style.paddingRight = (1.5 - .25 * x) + 'rem' });
      H(ab, a, 300, 18, x => { ab.style.transform = `translateX(${5 * x}px)` });
    });

    /* ================= stats ================= */
    const STATS = [[2, '+', 'Years of DevOps experience'], [40, '%', 'Less alert noise'], [30, '%', 'Faster release cycle'], [2, '', 'Cloud platforms: AWS & GCP']];
    $('#stGrid').innerHTML = STATS.map(([v, s, l], i) => `<li data-rv="20,1,200,24,${i * 90}"><div class="st-n"><span class="num" data-v="${v}">0</span>${s}</div><div class="st-l">${l}</div></li>`).join('');
    const nums = $$('#stGrid .num'); let statT = 0;
    function statUpdate() {
      statT = 0; const vh = innerHeight;
      nums.forEach(n => { const r = n.getBoundingClientRect(); const p = Math.min(Math.max((vh - r.top) / (vh / 2 + r.height / 2), 0), 1); n.textContent = Math.round(p * (+n.dataset.v)); });
    }
    function statSched() { if (!statT) statT = setTimeout(statUpdate, 30); }
    addEventListener('scroll', statSched, { passive: true }); lenis.on('scroll', statSched); statUpdate();

    /* ================= footer ================= */
    const COLS = [
      ['Profile', [['About', '#about'], ['Projects', '#works'], ['Technical strengths', '#services'], ['Contact', 'mailto:harshalwarukar12@gmail.com']]],
      ['Experience & Education', [['Tenarai · Sep 2024–Present', '#about'], ['Softtronix · Dec 2023–May 2024', '#about'], ['B.Tech · SB Jain Institute · 2025', '#about'], ['AZ-900 · Google Generative AI Leader', '#services']]],
      ['Contact', [['Email', 'mailto:harshalwarukar12@gmail.com'], ['Phone', 'tel:+919766629195'], ['LinkedIn', '#'], ['GitHub', '#']]]
    ];
    $('#ftCols').innerHTML = `<div><span class="brand" style="font-size:1.125rem">${ic('logo')}Harshal</span><p class="ft-tag">Site Reliability and DevOps Engineer building dependable cloud platforms through automation and observability.</p></div>` +
      COLS.map(([h, ls]) => `<div><h4>${h}</h4><ul>${ls.map(([l, href]) => `<li><a href="${href}"><span class="al">${l}</span></a></li>`).join('')}</ul></div>`).join('');
    $('#legal').innerHTML = [['Privacy', '#privacy'], ['Terms', '#terms']].map(([l, h]) => `<li><a href="${h}"><span class="al">${l}</span></a></li>`).join('');
    $$('#ftCols a').forEach(a => { const s = $('.al', a); H(s, a, 320, 22, x => { s.style.transform = `translateX(${4 * x}px)`; s.style.opacity = .65 + .35 * x }) });
    $$('#legal a').forEach(a => { const s = $('.al', a); H(s, a, 320, 22, x => { s.style.transform = `translateX(${3 * x}px)`; s.style.opacity = .7 + .3 * x }) });
    /* in-page anchors */
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      e.preventDefault(); const id = a.getAttribute('href').slice(1);
      if (id === 'contact' && a.closest('.ft')) { scrollToId('contact'); return; }
      if (id) scrollToId(id);
    });

    /* ================= nav overlay ================= */
    const nav = $('#nav'); let navOpen = false;
    $('#navList').innerHTML = NAV.map(([l], i) => `<li><button class="nv" data-i="${i}" style="transition-delay:${i * 45 + 80}ms"><span class="n">0${i + 1}</span><span class="l">${l}</span></button></li>`).join('');
    const navSp = spring(280, 32, 0, x => { nav.style.opacity = Math.min(Math.max(x, 0), 1) }, x => { if (x === 0) { nav.style.display = 'none'; } });
    function openNav() {
      if (navOpen) return; navOpen = true; stopScroll(); nav.style.display = 'flex'; navSp.to(1);
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.nv').forEach(b => b.classList.add('in'))));
      $('#navClose').focus({ preventScroll: true });
    }
    function closeNav() {
      if (!navOpen) return; navOpen = false; $$('.nv').forEach(b => b.classList.remove('in')); navSp.to(0); startScroll();
    }
    $('#menuBtn').addEventListener('click', openNav);
    $('#navClose').addEventListener('click', closeNav);
    $$('.nv').forEach(b => b.addEventListener('click', () => { const id = NAV[+b.dataset.i][1]; closeNav(); setTimeout(() => navigate(id), 60); }));
    $('#navStart').addEventListener('click', () => { closeNav(); setTimeout(openModal, 60); });

    /* ================= request modal ================= */
    const modal = $('#modal'), mPanel = $('#mPanel'); let modalOpen = false, mClosing = false;
    const mSp = spring(260, 30, 0, x => {
      const k = Math.min(Math.max(x, 0), 1);
      modal.style.opacity = k;
      mPanel.style.opacity = k;
      mPanel.style.transform = `translateY(${(mClosing ? 18 : 28) * (1 - x)}px)`;
    }, x => { if (x === 0) { modal.hidden = true; } });
    function openModal() {
      if (modalOpen) return; modalOpen = true; mClosing = false; stopScroll(); modal.hidden = false;
      $('#mFormWrap').hidden = false; $('#mok').hidden = true; mSp.to(1);
      setTimeout(() => { const f = $('input[name=name]'); f && f.focus({ preventScroll: true }); }, 200);
    }
    function closeModal() {
      if (!modalOpen) return; modalOpen = false; mClosing = true; mSp.to(0); startScroll();
      setTimeout(() => { $('#mform').reset(); $('#mFormWrap').hidden = false; $('#mok').hidden = true; $('#mSendT').textContent = 'Send request'; $('#mSend').disabled = false; }, 300);
    }
    $('#mClose').addEventListener('click', closeModal);
    modal.addEventListener('click', closeModal);
    mPanel.addEventListener('click', e => e.stopPropagation());
    $('#mform').addEventListener('submit', e => {
      e.preventDefault(); $('#mSendT').textContent = 'Sending…'; $('#mSend').disabled = true;
      setTimeout(() => { $('#mFormWrap').hidden = true; $('#mok').hidden = false; }, 700);
    });
    addEventListener('keydown', e => { if (e.key === 'Escape') { if (aiExpanded) setAiExpanded(false); else if (modalOpen) closeModal(); else if (navOpen) closeNav(); } });

    /* ================= generic pill actions ================= */
    document.addEventListener('click', e => {
      const b = e.target.closest('.pill[data-act]'); if (!b || b.type === 'submit') return;
      const a = b.dataset.act; if (!a) return;
      if (a === 'modal') openModal(); else if (a === 'close') closeModal(); else scrollToId(a);
    });

    /* ================= hydrate + wire ================= */
    hydrate(); wirePills();

    /* ================= LiquidReveal ================= */
    (function () {
      const box = $('#lr'), cv = $('canvas', box);
      if (reduced) { cv.remove(); return; }
      const ctx = cv.getContext('2d'); const cover = document.createElement('canvas'), brush = document.createElement('canvas');
      const cctx = cover.getContext('2d'), bctx = brush.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2), BR = 143, decay = .016, radius = BR * dpr;
      let W = 0, H_ = 0, loaded = false, last = null, idle = 0, raf = 0; const points = [];
      const img = new Image(); img.decoding = 'async';
      // img.onload=()=>{loaded=true;measure()}; img.src=ASSET+'/hero/before.jpg';
      img.onload = () => { loaded = true; measure() }; img.src = 'before1.jpeg';
      function measure() {
        const r = box.getBoundingClientRect(); W = cv.width = Math.max(1, Math.round(r.width * dpr)); H_ = cv.height = Math.max(1, Math.round(r.height * dpr));
        cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px';
        cover.width = W; cover.height = H_;
        brush.width = brush.height = Math.ceil(radius * 2);
        if (loaded) { const s = Math.max(W / img.naturalWidth, H_ / img.naturalHeight); const dw = img.naturalWidth * s, dh = img.naturalHeight * s; cctx.clearRect(0, 0, W, H_); cctx.drawImage(img, (W - dw) / 2, (H_ - dh) / 2, dw, dh); }
      }
      new ResizeObserver(measure).observe(box);
      function stamp(p) {
        const d = brush.width, c = d / 2; bctx.globalCompositeOperation = 'source-over'; bctx.clearRect(0, 0, d, d);
        const g = bctx.createRadialGradient(c, c, 0, c, c, c); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.55, 'rgba(255,255,255,.82)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        bctx.fillStyle = g; bctx.fillRect(0, 0, d, d);
        bctx.globalCompositeOperation = 'source-in'; bctx.drawImage(cover, p.x - c, p.y - c, d, d, 0, 0, d, d);
        ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(brush, p.x - c, p.y - c);
      }
      function frame() {
        raf = 0; const drawing = points.length > 0;
        if (drawing) idle = 0; else { idle++; if (idle > 120) { ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H_); return; } }
        const fade = drawing ? decay : Math.min(decay + idle * .004, .5);
        ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H_);
        ctx.globalCompositeOperation = 'source-over';
        if (drawing) { points.forEach(stamp); points.length = 0; }
        raf = requestAnimationFrame(frame);
      }
      window.addEventListener('pointermove', e => {
        if (!loaded) return;
        const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
        if (x < -radius || y < -radius || x > W + radius || y > H_ + radius) { last = null; return; }
        if (last) { const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy), step = Math.max(radius * .3, 1), n = Math.min(Math.ceil(dist / step), 60); for (let i = 1; i <= n; i++) points.push({ x: last.x + dx * i / n, y: last.y + dy * i / n }); }
        else points.push({ x, y });
        last = { x, y }; idle = 0; if (!raf) raf = requestAnimationFrame(frame);
      }, { passive: true });
    })();

    /* ================= text + reveals init ================= */
    function initText() {
      $$('[data-ld],[data-ls],[data-lines]').forEach(initLines);
      initWords($('#abH2'));
      $$('[data-rv]').forEach(initReveal);
    }
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(initText);

    /* ================= loader ================= */
    (function () {
      const loader = $('#loader'), fill = $('#ldFill'), num = $('#ldNum'), content = $('#ldC');
      const loaderSeenKey = 'harshal-home-loader-seen';
      let hasSeenLoader = false;
      try {
        hasSeenLoader = localStorage.getItem(loaderSeenKey) === 'true';
        if (!hasSeenLoader) localStorage.setItem(loaderSeenKey, 'true');
      } catch (error) {
        // Continue with the loader if browser storage is unavailable.
      }
      if (hasSeenLoader) {
        setReady();
        loader.remove();
        return;
      }
      stopScroll();
      const FILL_MS = 1300; const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const t0 = performance.now();
      const exitSp = spring(220, 30, 0, x => { loader.style.transform = `translateY(${-100 * x}%)`; }, x => { if (x === 1) { setReady(); startScroll(); loader.remove(); } });
      const fadeSp = spring(260, 26, 0, x => { const k = Math.min(Math.max(x, 0), 1); content.style.opacity = 1 - k; content.style.transform = `translateY(${-12 * k}px)`; });
      function loop(now) {
        const t = Math.min((now - t0) / FILL_MS, 1); const p = Math.round(ease(t) * 100);
        fill.style.width = p + '%'; num.textContent = String(p).padStart(3, '0');
        if (t < 1) requestAnimationFrame(loop); else { exitSp.to(1); fadeSp.to(1); }
      }
      requestAnimationFrame(loop);
    })();
