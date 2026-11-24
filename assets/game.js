(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const store={get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// permata melayang
if(!RM){const g=document.createElement('div');g.id='gems';for(let i=0;i<16;i++){const e=document.createElement('i');if(i%4===0)e.className='y';e.style.left=(Math.random()*100)+'vw';e.style.animationDuration=(16+Math.random()*18)+'s';e.style.animationDelay=(-Math.random()*30)+'s';g.appendChild(e);}document.body.prepend(g);}

// efek
function fx(text,x,y){const d=document.createElement('div');d.className='fx';d.textContent=text;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1000);}
function confetti(n=70){if(RM)return;const cs=['#4ade80','#15803d','#ffc400','#ffffff','#14532d'];for(let i=0;i<n;i++){const c=document.createElement('i');c.className='confetti';c.style.left=Math.random()*100+'vw';c.style.background=cs[i%cs.length];c.style.animationDuration=(1.6+Math.random()*1.6)+'s';c.style.animationDelay=(Math.random()*.4)+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),3600);}}
function stamp(html){const s=document.createElement('div');s.className='stampx';s.innerHTML='<div>'+html+'</div>';document.body.appendChild(s);setTimeout(()=>s.remove(),2300);}
window.GAME={fx,confetti,stamp};

// muncul saat digulir
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.bar i[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=((el.dataset.d||0)*0.08)+'s';io.observe(el);});

// hitung mundur
const ck=document.querySelector('[data-deadline]');
if(ck){const end=new Date(ck.dataset.deadline).getTime();const f=n=>String(n).padStart(2,'0');
  const tick=()=>{let s=Math.max(0,Math.floor((end-Date.now())/1000));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;
    ck.querySelector('[data-u=d]').textContent=f(d);ck.querySelector('[data-u=h]').textContent=f(h);ck.querySelector('[data-u=m]').textContent=f(m);ck.querySelector('[data-u=s]').textContent=f(s);
    if(end<=Date.now()){ck.querySelector('.cl').textContent='WAKTU HABIS';}};tick();setInterval(tick,1000);}

// salin tautan
document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',async ev=>{
  try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Tersalin!';}catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Ctrl+C';}
  fx('+ tautan',ev.clientX,ev.clientY-10);setTimeout(()=>b.textContent='Salin',1800);}));

// daftar isi aktif
const toc=document.querySelectorAll('.toc a');
if(toc.length){const secs=[...toc].map(a=>document.querySelector(a.getAttribute('href')));
  const on=()=>{let k=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<160)k=i;});toc.forEach((a,i)=>a.classList.toggle('on',i===k));};addEventListener('scroll',on,{passive:true});on();}

// checklist misi per level
const q=document.querySelector('.quest');
if(q){const key='ap17-'+q.dataset.level;const st=store.get(key)||{};const boxes=[...q.querySelectorAll('input[type=checkbox]')];
  const xpB=q.querySelector('.xp .bar i'),xpT=q.querySelector('.xp b');let wasDone=boxes.every(b=>st[b.name]);
  const upd=(fromUser,ev)=>{const n=boxes.filter(b=>b.checked).length;const p=Math.round(n/boxes.length*100);xpB.style.width=p+'%';xpT.textContent=(n*20)+' XP';
    boxes.forEach(b=>st[b.name]=b.checked);store.set(key,st);const done=n===boxes.length;
    if(done&&!wasDone&&fromUser){confetti();stamp('MISI<br>SELESAI!');}wasDone=done;};
  boxes.forEach(b=>{b.checked=!!st[b.name];b.addEventListener('change',ev=>{if(b.checked){const r=b.parentElement.getBoundingClientRect();fx('+20 XP',r.right-40,r.top);}upd(true,ev);});});
  const mark=name=>{const b=boxes.find(x=>x.name===name);if(b&&!b.checked){b.checked=true;const r=b.parentElement.getBoundingClientRect();fx('+20 XP',r.right-40,r.top);upd(true);}};
  document.querySelectorAll('[data-quest]').forEach(a=>a.addEventListener('click',()=>mark(a.dataset.quest)));
  const v=document.querySelector('video');if(v)v.addEventListener('timeupdate',()=>{if(v.duration&&v.currentTime/v.duration>.85)mark('video');});
  upd(false);}

// status level di beranda
document.querySelectorAll('.lvl[data-level]').forEach(c=>{const st=store.get('ap17-'+c.dataset.level)||{};const n=Object.values(st).filter(Boolean).length;if(n>=5)c.classList.add('isdone');const p=c.querySelector('[data-prog]');if(p)p.textContent=n?(n*20)+' XP':'Mulai';});

// tab aktif terlihat di HP
const on=document.querySelector('.tab.on');if(on)on.scrollIntoView({block:'nearest',inline:'center'});
})();
