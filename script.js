// Krakozyabra-free helpers
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

// Korean headline: letter-by-letter drop
(function(){
  const h=$('#krTitle'); let i=0;
  const wrapChars=(node)=>{
    [...node.childNodes].forEach(n=>{
      if(n.nodeType===3){
        const f=document.createDocumentFragment();
        [...n.textContent].forEach(c=>{
          const s=document.createElement('span');
          s.textContent=c===' '?'\u00A0':c; s.style.animationDelay=(0.15+i++*0.05)+'s'; f.appendChild(s);
        });
        n.replaceWith(f);
      } else if(n.nodeType===1 && n.tagName!=='BR') wrapChars(n);
    });
  };
  wrapChars(h);
})();

// Typing effect
(function(){
  const roles=['Iqtisodiyot talabasi','Ingliz tili o‘rganuvchi','Mobile Legends o‘yinchisi','Maqsad sari harakatdagi inson'];
  const el=$('#typed'); let r=0,c=0,del=false;
  (function tick(){
    const w=roles[r];
    el.textContent=w.slice(0,c);
    if(!del&&c===w.length){del=true;return setTimeout(tick,1500)}
    if(del&&c===0){del=false;r=(r+1)%roles.length}
    c+=del?-1:1; setTimeout(tick,del?35:70);
  })();
})();

// Infinity particles: they can never touch the cursor
(function(){
  const cv=$('#bg'),ctx=cv.getContext('2d');
  let W,H,P=[],m={x:-999,y:-999};
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;
    const n=Math.min(130,Math.floor(W*H/12000));
    P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+.6,c:Math.random()>.5?0:1}))}
  addEventListener('resize',size); size();
  addEventListener('pointermove',e=>{m.x=e.clientX;m.y=e.clientY});
  addEventListener('pointerleave',()=>{m.x=m.y=-999});
  function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
  function frame(){
    ctx.clearRect(0,0,W,H);
    const cols=[css('--eye'),css('--purple')];
    for(const p of P){
      const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);
      if(d<130){const f=(130-d)/130;p.x+=dx/d*f*6;p.y+=dy/d*f*6}
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    }
    for(let i=0;i<P.length;i++){
      const a=P[i];
      ctx.fillStyle=cols[a.c];ctx.globalAlpha=.8;
      ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,7);ctx.fill();
      for(let j=i+1;j<P.length;j++){
        const b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<110){ctx.globalAlpha=(1-d/110)*.35;ctx.strokeStyle=cols[a.c];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      }
    }
    ctx.globalAlpha=1;
    if(!reduce)requestAnimationFrame(frame);
  }
  frame();
  if(reduce)addEventListener('resize',frame);
})();

// Scroll reveal + SAT ring counter
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('in'); io.unobserve(e.target);
}),{threshold:.15});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});

const ring=$('#ring');
new IntersectionObserver((es,o)=>{
  if(!es[0].isIntersecting)return; o.disconnect();
  const v=+ring.dataset.val,mx=+ring.dataset.max;
  ring.querySelector('.pr').style.strokeDashoffset=326.7*(1-v/mx);
  const t0=performance.now();
  (function n(t){const k=Math.min(1,(t-t0)/1800);$('#satNum').textContent=Math.round(v*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(n)})(t0);
},{threshold:.5}).observe(ring);

// 3D tilt on cards (only on mouse devices)
if(matchMedia('(hover:hover)').matches){
  $$('.tilt').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(700px) rotateX(${-y*8}deg) rotateY(${x*8}deg) translateY(-4px)`;
    });
    c.addEventListener('pointerleave',()=>c.style.transform='');
  });
}

// Nav: mobile menu, active link, theme
const links=$('#links');
$('#burger').onclick=()=>links.classList.toggle('open');
links.addEventListener('click',e=>{if(e.target.tagName==='A')links.classList.remove('open')});
const secs=$$('section[id]');
addEventListener('scroll',()=>{
  const y=scrollY+120; let cur='';
  secs.forEach(s=>{if(s.offsetTop<=y)cur=s.id});
  $$('.links a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur));
},{passive:true});
$('#theme').onclick=()=>{
  const d=document.documentElement;
  const dark=getComputedStyle(d).getPropertyValue('--bg').trim()==='#07081a';
  d.dataset.theme=dark?'light':'dark';
};

// Copy game ID
$('#copy').onclick=async()=>{
  const t=$('#toast');
  try{await navigator.clipboard.writeText('1705070626 (18225)');t.textContent='Nusxalandi!'}
  catch(e){t.textContent='ID: 1705070626 (18225)'}
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);
};