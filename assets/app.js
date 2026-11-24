(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const COLS=['#ffc83d','#2f6bff','#e8553a','#4ade80','#6d4aff','#d63a83','#0e8f86'];
const STAR=c=>`<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 1.8l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.4 1.4-6.8L2.2 8.9l6.9-.8z" fill="${c}" stroke="#1d1b2e" stroke-width="1.8" stroke-linejoin="round"/></svg>`;

// bintang keluar dari tombol
function stars(x,y,n=10){if(RM)return;for(let i=0;i<n;i++){const s=document.createElement('div');s.className='star';s.innerHTML=STAR(COLS[i%COLS.length]);
  const a=Math.PI*2*i/n+Math.random()*.5,d=60+Math.random()*70;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.setProperty('--rot',(Math.random()*360-180)+'deg');
  const z=.7+Math.random()*.8;s.style.width=s.style.height=(18*z)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),850);}}
function fx(t,x,y){const d=document.createElement('div');d.className='fx';d.textContent=t;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000);}
function confetti(n=80){if(RM)return;for(let i=0;i<n;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'vw';c.style.background=COLS[i%COLS.length];c.style.animationDuration=(1.6+Math.random()*1.6)+'s';c.style.animationDelay=(Math.random()*.4)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3600);}}
function stamp(h){const s=document.createElement('div');s.className='stampx';s.innerHTML='<div>'+h+'</div>';document.body.appendChild(s);setTimeout(()=>s.remove(),2300);}
document.addEventListener('click',e=>{const b=e.target.closest('.btn,.lvl,.lvp');if(!b||b.classList.contains('start'))return;stars(e.clientX,e.clientY);
  if(b.tagName==='A'&&!b.target&&!b.hasAttribute('download')&&b.origin===location.origin&&!RM&&!e.metaKey&&!e.ctrlKey){e.preventDefault();setTimeout(()=>location.href=b.href,280);}});

// muncul saat digulir
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.meter i[data-w]').forEach(m=>m.style.width=m.dataset.w+'%');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>{el.style.transitionDelay=((el.dataset.d||0)*0.08)+'s';io.observe(el);});

// hitung mundur
document.querySelectorAll('[data-deadline]').forEach(ck=>{const end=new Date(ck.dataset.deadline).getTime(),f=n=>String(n).padStart(2,'0');
  const tick=()=>{let s=Math.max(0,Math.floor((end-Date.now())/1000));const v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
    for(const k in v){const el=ck.querySelector(`[data-u=${k}]`);if(el)el.textContent=f(v[k]);}};tick();setInterval(tick,1000);});

// salin tautan
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async ev=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Tersalin!';}catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Ctrl+C';}
  stars(ev.clientX,ev.clientY,8);setTimeout(()=>b.textContent='Salin',1800);}));

// daftar isi aktif
const toc=[...document.querySelectorAll('.toc a')];
if(toc.length){const secs=toc.map(a=>document.querySelector(a.getAttribute('href')));const on=()=>{let k=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<170)k=i;});toc.forEach((a,i)=>a.classList.toggle('on',i===k));};addEventListener('scroll',on,{passive:true});on();}

// menu level: tutup saat klik di luar
document.addEventListener('click',e=>{document.querySelectorAll('details.lvmenu[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open');});});

// checklist misi
const q=document.querySelector('.quest');
if(q){const key='ap17-'+q.dataset.level,st=S.get(key)||{},boxes=[...q.querySelectorAll('input[type=checkbox]')];const bar=q.querySelector('.prog .meter i'),tx=q.querySelector('.prog b');let was=boxes.every(b=>st[b.name]);
  const upd=user=>{const n=boxes.filter(b=>b.checked).length;bar.style.width=(n/boxes.length*100)+'%';tx.textContent=(n*20)+' XP';boxes.forEach(b=>st[b.name]=b.checked);S.set(key,st);const done=n===boxes.length;if(done&&!was&&user){confetti();stamp('Misi<br>selesai!');}was=done;};
  const pop=b=>{const r=b.parentElement.getBoundingClientRect();fx('+20 XP',r.right-50,r.top);stars(r.left+22,r.top+r.height/2,6);};
  boxes.forEach(b=>{b.checked=!!st[b.name];b.addEventListener('change',()=>{if(b.checked)pop(b);upd(true);});});
  const mark=n=>{const b=boxes.find(x=>x.name===n);if(b&&!b.checked){b.checked=true;pop(b);upd(true);}};
  document.querySelectorAll('[data-quest]').forEach(a=>a.addEventListener('click',()=>mark(a.dataset.quest)));
  const v=document.querySelector('video');if(v)v.addEventListener('timeupdate',()=>{if(v.duration&&v.currentTime/v.duration>.85)mark('video');});
  upd(false);}
document.querySelectorAll('.lvl[data-level]').forEach(c=>{const st=S.get('ap17-'+c.dataset.level)||{},n=Object.values(st).filter(Boolean).length,p=c.querySelector('[data-prog]');if(p)p.textContent=n>=5?'Selesai ✓':n?(n*20)+' XP':'Mulai ▶';if(n>=5)c.classList.add('isdone');});
const replay=document.querySelector('[data-replay]');if(replay)replay.addEventListener('click',e=>{e.preventDefault();try{sessionStorage.removeItem('ap17-gate')}catch(x){}location.reload();});

// ===== gerbang intro =====
const gate=document.getElementById('gate');
if(gate&&!document.documentElement.classList.contains('nogate')){
  const app=document.getElementById('app');app.setAttribute('aria-hidden','true');
  const btn=gate.querySelector('.start');btn.focus({preventScroll:true});
  const done=()=>{gate.remove();app.classList.remove('reveal');app.style.clipPath='';app.removeAttribute('aria-hidden');const ov=document.getElementById('starov');if(ov)ov.remove();try{sessionStorage.setItem('ap17-gate','1')}catch(e){}window.scrollTo(0,0);};
  btn.addEventListener('click',e=>{const r=btn.getBoundingClientRect();stars(r.left+r.width/2,r.top+r.height/2,16);btn.disabled=true;
    if(RM){gate.style.transition='opacity .4s';gate.style.opacity=0;setTimeout(done,400);return;}
    run();});
  const ease={io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,i:t=>t*t*t,o:t=>1-Math.pow(1-t,3),back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);}};
  const anim=(dur,fn)=>new Promise(res=>{const t0=performance.now();const step=now=>{const p=Math.min(1,(now-t0)/dur);fn(p);p<1?requestAnimationFrame(step):res();};requestAnimationFrame(step);});
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  function spiralPath(cx,cy,R,turns,seed,j){let d='',th=0,max=turns*Math.PI*2,rnd=seed;const rand=()=>{rnd=(rnd*9301+49297)%233280;return rnd/233280;};
    for(let i=0;i<=420;i++){th=i/420*max;const r=R*(1-th/max)+Math.sin(th*5+seed)*j*(1-th/max)+(rand()-.5)*j*.6;d+=(i?'L':'M')+(cx+Math.cos(th)*r).toFixed(1)+' '+(cy+Math.sin(th)*r).toFixed(1);}return d;}
  function starPts(cx,cy,R,rot){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+rot+i*Math.PI/5,r=i%2?R*.47:R;p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}return p;}
  async function run(){
    const W=innerWidth,H=innerHeight,cx=W/2,cy=H/2,R=Math.hypot(W,H)*.62;
    const NS='http://www.w3.org/2000/svg',sv=document.createElementNS(NS,'svg');sv.id='spiral';sv.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const g=document.createElementNS(NS,'g');g.style.transformOrigin=`${cx}px ${cy}px`;sv.appendChild(g);
    const mk=(d,c,w)=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke',c);p.setAttribute('stroke-width',w);p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');g.appendChild(p);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;return [p,L];};
    const s1=mk(spiralPath(cx,cy,R,5,3,14),'#1d1b2e',7),s2=mk(spiralPath(cx+3,cy-2,R*.98,5,11,18),'#e8553a',3.5),s3=mk(spiralPath(cx-2,cy+3,R*.95,5,23,20),'#2f6bff',2.5);
    gate.appendChild(sv);const gin=gate.querySelector('.gin');gate.querySelectorAll('.tw').forEach(t=>{t.style.animation='none';t.style.transition='opacity .3s';t.style.opacity=0;});
    await Promise.all([
      anim(1100,p=>{const e=ease.o(p);[s1,s2,s3].forEach(([el,L])=>el.style.strokeDashoffset=L*(1-e));g.style.transform=`rotate(${-120*p}deg)`;}),
      (async()=>{await wait(250);await anim(1250,p=>{const e=ease.i(p);gin.style.transform=`rotate(${900*e}deg) scale(${1-e*.985})`;gin.style.opacity=1-ease.i(Math.max(0,(p-.6)/.4));gin.style.filter=`blur(${e*3}px)`;});})()
    ]);
    await anim(450,p=>{const e=ease.i(p);g.style.transform=`rotate(${-120-200*e}deg) scale(${1-e})`;sv.style.opacity=1-e;gate.style.background=`rgb(${251+4*e},${248+7*e},${241+14*e})`;});
    gate.style.backgroundImage='none';sv.remove();gin.remove();
    await wait(180);
    // bintang berisi halaman baru
    app.classList.add('reveal');app.removeAttribute('aria-hidden');
    const ov=document.createElementNS(NS,'svg');ov.id='starov';ov.setAttribute('viewBox',`0 0 ${W} ${H}`);ov.innerHTML=`<path id="so1" fill="none" stroke="#1d1b2e" stroke-width="12" stroke-linejoin="round"/><path id="so2" fill="#ffc83d" stroke="#ffc83d" stroke-width="6" stroke-linejoin="round"/><g id="eyes"><ellipse id="e1" fill="#1d1b2e"/><ellipse id="e2" fill="#1d1b2e"/><circle id="g1" fill="#fff"/><circle id="g2" fill="#fff"/></g>`;
    document.body.appendChild(ov);
    const setStar=(Rs,rot,eyeO)=>{const pts=starPts(cx,cy,Rs,rot);app.style.clipPath='polygon('+pts.map(p=>p[0].toFixed(1)+'px '+p[1].toFixed(1)+'px').join(',')+')';
      const d='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';ov.querySelector('#so1').setAttribute('d',d);ov.querySelector('#so2').setAttribute('d',d);
      const ex=Rs*.15,ey=Rs*.02,rx=Rs*.065,ry=Rs*.15;[['e1',-1],['e2',1]].forEach(([id,s])=>{const e=ov.querySelector('#'+id);e.setAttribute('cx',cx+s*ex);e.setAttribute('cy',cy+ey);e.setAttribute('rx',rx);e.setAttribute('ry',ry);});
      [['g1',-1],['g2',1]].forEach(([id,s])=>{const c=ov.querySelector('#'+id);c.setAttribute('cx',cx+s*ex+rx*.25);c.setAttribute('cy',cy+ey-ry*.45);c.setAttribute('r',rx*.38);});
      ov.querySelector('#eyes').style.opacity=eyeO;ov.querySelector('#so2').setAttribute('fill-opacity',(eyeO*.93).toFixed(3));};
    await anim(650,p=>{const e=ease.back(p);setStar(120*e,Math.sin(p*Math.PI*2)*.12,1);});
    await anim(700,p=>{setStar(120+Math.sin(p*Math.PI*2)*8,Math.sin(p*Math.PI*4)*.08,1);});
    const Rmax=Math.hypot(W,H)/2/.47*1.08;
    await anim(1150,p=>{const e=ease.io(p);setStar(120+(Rmax-120)*e,.35*e,Math.max(0,1-p*3));ov.style.opacity=p<.85?1:1-(p-.85)/.15;});
    done();}
}
})();
