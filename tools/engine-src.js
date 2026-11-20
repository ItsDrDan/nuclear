/* ============================== NUCLEAR DATA ============================== */
const SYM=('n H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
const ENAME=('neutron hydrogen helium lithium beryllium boron carbon nitrogen oxygen fluorine neon sodium magnesium aluminum silicon phosphorus sulfur chlorine argon potassium calcium scandium titanium vanadium chromium manganese iron cobalt nickel copper zinc gallium germanium arsenic selenium bromine krypton rubidium strontium yttrium zirconium niobium molybdenum technetium ruthenium rhodium palladium silver cadmium indium tin antimony tellurium iodine xenon cesium barium lanthanum cerium praseodymium neodymium promethium samarium europium gadolinium terbium dysprosium holmium erbium thulium ytterbium lutetium hafnium tantalum tungsten rhenium osmium iridium platinum gold mercury thallium lead bismuth polonium astatine radon francium radium actinium thorium protactinium uranium neptunium plutonium americium curium berkelium californium einsteinium fermium mendelevium nobelium lawrencium rutherfordium dubnium seaborgium bohrium hassium meitnerium darmstadtium roentgenium copernicium nihonium flerovium moscovium livermorium tennessine oganesson').split(' ');
/* a nuclide or particle: {A, Z, s, m (metastable), part} */
const N=(A,Z,m)=>({A,Z,s:SYM[Z],m:!!m});
const PART={
 alpha:{A:4,Z:2,s:'He',part:'alpha'},beta:{A:0,Z:-1,s:'e',part:'beta'},positron:{A:0,Z:1,s:'e',part:'positron'},
 gamma:{A:0,Z:0,s:'γ',part:'gamma'},neutron:{A:1,Z:0,s:'n',part:'neutron'},proton:{A:1,Z:1,s:'H',part:'proton'}};
const PNAME={alpha:'alpha particle',beta:'beta particle',positron:'positron',gamma:'gamma ray',neutron:'neutron',proton:'proton'};
const MODE_NAME={alpha:'alpha decay',beta:'beta decay',positron:'positron emission',ec:'electron capture',gamma:'gamma emission'};
const nname=x=>x.part?PNAME[x.part]:`${ENAME[x.Z]}-${x.A}${x.m?'m':''}`;
const nshort=x=>x.part?PNAME[x.part]:`${x.s}-${x.A}${x.m?'m':''}`;
/* what a decay does to a parent: product nuclide + the particle and the side it is written on */
function decayOf(p,mode){
 if(mode==='alpha')return {prod:N(p.A-4,p.Z-2),part:PART.alpha,side:'R'};
 if(mode==='beta')return {prod:N(p.A,p.Z+1),part:PART.beta,side:'R'};
 if(mode==='positron')return {prod:N(p.A,p.Z-1),part:PART.positron,side:'R'};
 if(mode==='ec')return {prod:N(p.A,p.Z-1),part:PART.beta,side:'L'};
 if(mode==='gamma')return {prod:N(p.A,p.Z),part:PART.gamma,side:'R'};
 throw 'mode '+mode}
/* real decays (parent A, Z, metastable?) */
const DECAYS={
 alpha:[[238,92],[234,92],[230,90],[226,88],[222,86],[218,84],[210,84],[214,84],[239,94],[244,94],[241,95],[232,90],[235,92],[237,93],[147,62],[212,84],[220,86],[224,88],[228,90]],
 beta:[[14,6],[3,1],[32,15],[131,53],[60,27],[90,38],[137,55],[42,19],[99,43],[129,52],[210,82],[214,82],[210,83],[234,90],[234,91],[239,93],[99,42],[59,26],[24,11],[198,79],[90,39],[35,16],[45,20],[133,54],[85,36],[214,83],[228,88],[89,38],[82,35],[47,20]],
 positron:[[11,6],[13,7],[15,8],[18,9],[22,11],[68,31],[82,37],[38,19],[64,29],[19,10],[30,15],[26,13]],
 ec:[[125,53],[123,53],[51,24],[7,4],[67,31],[201,81],[55,26],[111,49],[57,27],[37,18],[41,20],[40,19]],
 gamma:[[99,43,1],[137,56,1],[81,36,1],[131,54,1],[117,50,1]]};
/* bombardment / transmutation: each term [coef, A, Z, part?] */
const BOMB=[
 {L:[[1,10,5],[1,4,2,'alpha']],R:[[1,13,7],[1,1,0,'neutron']],note:'Boron-10 hit by an alpha particle makes radioactive nitrogen-13 (lecture slide 23).'},
 {L:[[1,58,28],[1,1,1,'proton']],R:[[1,55,27],[1,4,2,'alpha']],note:'Nickel-58 hit by a proton (lecture slide 24).'},
 {L:[[1,98,43],[2,1,0,'neutron']],R:[[1,96,41],[1,4,2,'alpha']],note:'Two neutrons count as 2 × 1 = 2 on top (lecture study check).'},
 {L:[[1,14,7],[1,4,2,'alpha']],R:[[1,17,8],[1,1,1,'proton']],note:'Rutherford’s 1919 reaction: the first element changed on purpose.'},
 {L:[[1,9,4],[1,4,2,'alpha']],R:[[1,12,6],[1,1,0,'neutron']],note:'Chadwick used this reaction to discover the neutron (1932).'},
 {L:[[1,27,13],[1,4,2,'alpha']],R:[[1,30,15],[1,1,0,'neutron']],note:'Irène and Frédéric Joliot-Curie made the first artificial radioisotope this way.'},
 {L:[[1,14,7],[1,1,0,'neutron']],R:[[1,14,6],[1,1,1,'proton']],note:'Cosmic-ray neutrons make carbon-14 in the upper atmosphere; this is why living things contain C-14.'},
 {L:[[1,98,42],[1,1,0,'neutron']],R:[[1,99,42]],note:'Hospital Tc-99m generators start from molybdenum-99 made this way.'},
 {L:[[1,59,27],[1,1,0,'neutron']],R:[[1,60,27]],note:'Cobalt-60 for radiation therapy and sterilizing supplies is made in reactors this way.'},
 {L:[[1,18,8],[1,1,1,'proton']],R:[[1,18,9],[1,1,0,'neutron']],note:'A hospital cyclotron makes fluorine-18 for PET scans this way.'},
 {L:[[1,6,3],[1,1,0,'neutron']],R:[[1,3,1],[1,4,2,'alpha']],note:'Lithium-6 is used to make tritium (H-3) for fusion research.'},
 {L:[[1,249,98],[1,12,6]],R:[[1,257,104],[4,1,0,'neutron']],note:'New, heavy elements like rutherfordium are made by firing light nuclei at heavy ones.'},
 {L:[[1,238,92],[1,12,6]],R:[[1,246,98],[4,1,0,'neutron']],note:'Californium was made by bombarding uranium with carbon nuclei.'},
 {L:[[1,239,94],[1,4,2,'alpha']],R:[[1,242,96],[1,1,0,'neutron']],note:'Curium-242 was first made by hitting plutonium-239 with alpha particles.'},
 {L:[[1,23,11],[1,232,90]],R:[[1,251,99],[1,4,2,'alpha']],note:'Lecture study check: sodium-23 colliding with thorium-232.'},
 {L:[[1,209,83],[1,58,26]],R:[[1,266,109],[1,1,0,'neutron']],note:'Meitnerium (element 109) was made this way in 1982.'}];
/* U-235 fission splits: [fragment 1], [fragment 2], neutrons released */
const FISSION=[[[141,56],[92,36],3],[[143,54],[90,38],3],[[137,55],[96,37],3],[[139,56],[94,36],3],[[137,52],[97,40],2],[[94,38],[139,54],3],[[131,53],[102,39],3]];
const FUSION=[
 {L:[[1,2,1],[1,3,1]],R:[[1,4,2],[1,1,0,'neutron']],note:'Deuterium–tritium fusion is the reaction fusion reactors try to use.'},
 {L:[[1,2,1],[1,2,1]],R:[[1,3,2],[1,1,0,'neutron']],note:'Two deuterium nuclei can fuse to helium-3 and a neutron.'},
 {L:[[1,3,2],[1,3,2]],R:[[1,4,2],[2,1,1,'proton']],note:'In the Sun, two helium-3 nuclei fuse to helium-4 and two protons.'},
 {L:[[1,2,1],[1,1,1,'proton']],R:[[1,3,2],[1,0,0,'gamma']],note:'In the Sun, deuterium and a proton fuse to helium-3 and a gamma ray.'}];
const term=([c,A,Z,p])=>({coef:c,x:p?PART[p]:N(A,Z)});
/* rough centre of the band of stability (N ≈ Z for light nuclei, ≈1.5 Z for heavy) */
const bandN=Z=>Z+0.0064*Z*Z;

/* ============================== LAB SHELL (shared) ============================== */
const LW=600,LH=320;
const SPEEDS=[[1,'▶ Normal speed'],[0.3,'🐢 Slow motion'],[0,'⏸ Paused']];
const SPEED={i:typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches?1:0,f(){return SPEEDS[this.i][0]}};
const speedChip=()=>`<button type="button" class="chip spd" data-speed aria-label="Animation speed: ${SPEEDS[SPEED.i][1].slice(2)}. Tap to change.">${SPEEDS[SPEED.i][1]}</button>`;
function wireSpeed(el){el.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{SPEED.i=(SPEED.i+1)%SPEEDS.length;document.querySelectorAll('[data-speed]').forEach(x=>{x.textContent=SPEEDS[SPEED.i][1];x.setAttribute('aria-label',`Animation speed: ${SPEEDS[SPEED.i][1].slice(2)}. Tap to change.`)})})}
function fitCanvas(c,w,h){const d=Math.min(2,(typeof devicePixelRatio!=='undefined'&&devicePixelRatio)||1);c.width=Math.round(w*d);c.height=Math.round(h*d);const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return x}
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>17;s^=s<<5;s>>>=0;return s/4294967296}}
const setTxt=(el,t)=>{if(el&&el.textContent!==t)el.textContent=t};
function makeLoop(step){let raf=0,last=0;const f=t=>{const dt=Math.min(0.05,(t-(last||t))/1000)*SPEED.f();last=t;step(dt);raf=requestAnimationFrame(f)};
 return {start(){if(!raf){last=0;raf=requestAnimationFrame(f)}},stop(){cancelAnimationFrame(raf);raf=0}}}
function rrect(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h)}
/* nuclide in HTML: stacked mass number over atomic number */
function nucHTML(x,coef){const z=x.part==='positron'?'+1':String(x.Z).replace('-','−');const lab=x.part?PNAME[x.part]:SYM[x.Z]===x.s?nname(x):`${x.s}-${x.A}`;
 return `${coef>1?`<span class="coef">${coef}</span>`:''}<span class="nuc" role="img" aria-label="${coef>1?coef+' ':''}${lab}${x.part?'':`, mass number ${x.A}, atomic number ${x.Z}`}"><span class="az" aria-hidden="true"><sup>${x.A}${x.m?'m':''}</sup><sub>${z}</sub></span><span class="sy" aria-hidden="true">${x.s}</span></span>`}
const ARROW='<span class="arr" role="img" aria-label="yields"></span>';
function eqHTML(L,R){return `<span class="eq">${L.map(t=>nucHTML(t.x,t.coef)).join('<span class="pl">+</span>')}${ARROW}${R.map(t=>nucHTML(t.x,t.coef)).join('<span class="pl">+</span>')}</span>`}

/* ============================== ⚛️ DECAY LAB ============================== */
const DL_SYS=[
 ['u238','U-238',N(238,92),'Too big (92 protons): alpha decay'],['ra226','Ra-226',N(226,88),'Too big (88 protons): alpha decay'],['am241','Am-241',N(241,95),'Too big: alpha decay (smoke detectors)'],
 ['c14','C-14',N(14,6),'Too many neutrons: beta decay'],['i131','I-131',N(131,53),'Too many neutrons: beta decay'],['co60','Co-60',N(60,27),'Too many neutrons: beta decay'],
 ['f18','F-18',N(18,9),'Too few neutrons: positron emission'],['i125','I-125',N(125,53),'Too few neutrons: electron capture'],['tc99m','Tc-99m',N(99,43,1),'Excited (m): gives off a gamma ray']];
const DSYM={alpha:'α',beta:'β⁻',positron:'β⁺',ec:'EC',gamma:'γ'};
const Decay=(()=>{
 const s={sys:'u238',cur:null,start:null,hist:[],busy:0,fx:[],t:0,flash:0,jig:0,last:null};let el={},ctx=null,nuc=[],R=0;
 function layout(x){const A=x.A,rb=Math.max(4.4,Math.min(12,78/Math.sqrt(A)));R=rb*Math.sqrt(A)*1.02;const r=rng(A*131+x.Z*7);nuc=[];
  for(let i=0;i<A;i++){const a=i*2.39996,d=rb*Math.sqrt(i+0.5)*1.02;nuc.push({x:Math.cos(a)*d,y:Math.sin(a)*d,p:false,rb,ph:r()*6.28})}
  const idx=nuc.map((_,i)=>i).sort(()=>r()-0.5);for(let i=0;i<x.Z;i++)nuc[idx[i]].p=true}
 function load(id){const d=DL_SYS.find(q=>q[0]===id)||DL_SYS[0];s.sys=d[0];s.cur=Object.assign({},d[2]);s.start=Object.assign({},d[2]);s.hist=[];s.fx=[];s.busy=0;s.last=null;layout(s.cur);s.jig=s.cur.m?1:0;paint()}
 function fire(mode){if(s.busy>0||!s.cur)return;const p=s.cur;
  if(mode==='gamma'&&!p.m){say('Only an excited nucleus (marked m) gives off a gamma ray by itself. Try another button.');return}
  if((mode==='positron'||mode==='ec')&&p.Z<2){say('Hydrogen has only 1 proton: it cannot lose one.');return}
  if(mode==='alpha'&&(p.A<8||p.Z<3)){say('This nucleus is too small for alpha decay.');return}
  if(s.hist.length>=8){say('That is enough decays for one sample. Tap ↺ Start over.');return}
  const d=decayOf(p,mode);s.busy=1;
  const out=[...nuc.keys()].sort((a,b)=>Math.hypot(nuc[b].x,nuc[b].y)-Math.hypot(nuc[a].x,nuc[a].y));
  if(mode==='alpha'){const take=out.filter(i=>nuc[i].p).slice(0,2).concat(out.filter(i=>!nuc[i].p).slice(0,2));const ang=Math.atan2(nuc[take[0]].y,nuc[take[0]].x);
   s.fx.push({k:'alpha',x:Math.cos(ang)*R,y:Math.sin(ang)*R,vx:Math.cos(ang)*160,vy:Math.sin(ang)*160,t:0});nuc=nuc.filter((_,i)=>!take.includes(i))}
  else if(mode==='beta'||mode==='positron'||mode==='ec'){const want=mode!=='beta';const cand=nuc.filter(q=>q.p===want);const q=cand[Math.floor(cand.length*0.3)]||cand[0];if(q){q.p=!want;q.fl=1}
   const ang=Math.random()*6.28;if(mode==='ec')s.fx.push({k:'ec',ang,t:0});else s.fx.push({k:mode,x:q?q.x:0,y:q?q.y:0,vx:Math.cos(ang)*260,vy:Math.sin(ang)*260,t:0})}
  else{s.fx.push({k:'gamma',ang:Math.random()*6.28,t:0});s.jig=0}
  const eq=d.side==='L'?{L:[{x:p},{x:d.part}],R:[{x:d.prod}]}:{L:[{x:p}],R:[{x:d.prod},{x:d.part}]};
  s.last={mode,eq,from:p};s.hist.push(mode);s.cur=d.prod;s.flash=1;paint();emit('decay:'+mode)}
 function say(t){if(el.msg){el.msg.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>{if(el.msg)el.msg.textContent=''},3500)}}
 function chainTxt(){let x=s.start;const parts=[nshort(x)];s.hist.forEach(m=>{x=decayOf(x,m).prod;parts.push(`<span class="ch">${DSYM[m]}</span> ${nshort(x)}`)});return 'Chain: '+parts.join(' ')}
 function paint(){if(!el.eq)return;const c=s.cur,Nn=c.A-c.Z,band=bandN(c.Z);
  setTxt(el.name,nname(c));setTxt(el.p,String(c.Z));setTxt(el.n,String(Nn));setTxt(el.np,c.Z?(Nn/c.Z).toFixed(2):'—');
  setTxt(el.st,c.m?'Excited (m): extra energy in the nucleus':c.Z>83?'Too big (Z > 83): alpha decay likely':Nn>band+0.6?'Above the band: too many neutrons':Nn<band-0.6?'Below the band: too few neutrons':'Near the band of stability');
  if(s.last){const e=s.last.eq;
   el.eq.innerHTML=`<div class="eqbig">${eqHTML(e.L,e.R)}</div><div class="sums"><span>Top (mass numbers): ${e.L.map(q=>q.x.A).join(' + ')} = ${e.R.map(q=>q.x.A).join(' + ')} ✔</span><span>Bottom (atomic numbers): ${e.L.map(q=>q.x.Z).join(' + ').replace(/-/g,'−')} = ${e.R.map(q=>q.x.Z).join(' + ').replace(/-/g,'−')} ✔</span></div>`+(s.hist.length>1?`<div class="chain">${chainTxt()}</div>`:'')}
  else el.eq.innerHTML=`<div class="eqbig">${nucHTML(c)}</div><p class="cap" style="text-align:center">Tap a decay button above. The nuclear equation appears here.</p>`;
  if(el.cv)el.cv.setAttribute('aria-label',`Nucleus of ${nname(c)}: ${c.Z} protons (red) and ${Nn} neutrons (gray).`)}
 function step(dt){s.t+=dt;if(s.busy>0)s.busy=Math.max(0,s.busy-dt/1.1);
  s.flash=Math.max(0,s.flash-dt*1.5);s.fx.forEach(f=>{f.t+=dt;if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt}});s.fx=s.fx.filter(f=>f.t<2.2);
  nuc.forEach(q=>{if(q.fl)q.fl=Math.max(0,q.fl-dt*0.8)});draw()}
 function lbl(g,x,y,t,c){g.font='bold 13px system-ui,sans-serif';g.textAlign='center';g.fillStyle='#ffffffd0';const w=g.measureText(t).width;g.fillRect(x-w/2-3,y-11,w+6,15);g.fillStyle=c;g.fillText(t,x,y);g.textAlign='left'}
 function draw(){if(!ctx)return;const g=ctx,cx=190,cy=LH/2+6;g.clearRect(0,0,LW,LH);g.fillStyle='#fbfdff';g.fillRect(0,0,LW,LH);
  const gl=g.createRadialGradient(cx,cy,R*0.3,cx,cy,R+34);gl.addColorStop(0,s.jig?'#fff1b8':'#eef6ff');gl.addColorStop(1,'rgba(251,253,255,0)');g.fillStyle=gl;g.beginPath();g.arc(cx,cy,R+34,0,7);g.fill();
  const j=(s.jig?2.2:0.6)+s.flash*2;
  nuc.forEach(q=>{const x=cx+q.x+Math.sin(s.t*9+q.ph)*j*0.5,y=cy+q.y+Math.cos(s.t*8+q.ph)*j*0.5;g.beginPath();g.arc(x,y,q.rb,0,7);
   g.fillStyle=q.p?'#e0675a':'#9aa9b6';g.fill();g.lineWidth=1;g.strokeStyle=q.p?'#a8443a':'#6b7a86';g.stroke();
   if(q.fl){g.beginPath();g.arc(x,y,q.rb+5*q.fl+2,0,7);g.strokeStyle=`rgba(214,160,30,${q.fl})`;g.lineWidth=3;g.stroke()}});
  s.fx.forEach(f=>{const a=Math.max(0,1-f.t/2.2);
   if(f.k==='alpha'){[[-5,-5,1],[5,-5,0],[-5,5,0],[5,5,1]].forEach(([dx,dy,p])=>{g.beginPath();g.arc(cx+f.x+dx,cy+f.y+dy,6,0,7);g.fillStyle=p?'#e0675a':'#9aa9b6';g.fill();g.strokeStyle='#5b2a24';g.lineWidth=1;g.stroke()});lbl(g,cx+f.x,cy+f.y-16,'α (helium-4 nucleus)','#a8443a')}
   if(f.k==='beta'||f.k==='positron'){g.beginPath();g.arc(cx+f.x,cy+f.y,4.5,0,7);g.fillStyle=f.k==='beta'?'#2f7fbf':'#e8955a';g.fill();lbl(g,cx+f.x,cy+f.y-12,f.k==='beta'?'β⁻ (electron)':'β⁺ (positron)',f.k==='beta'?'#245c86':'#a35a1c')}
   if(f.k==='ec'){const k=Math.min(1,f.t/0.9),rr=(R+60)*(1-k)+4,an=f.ang+k*7;g.setLineDash([3,4]);g.strokeStyle='#9fb6c8';g.lineWidth=1;g.beginPath();g.arc(cx,cy,R+60,0,7);g.stroke();g.setLineDash([]);
    if(k<1){g.beginPath();g.arc(cx+Math.cos(an)*rr,cy+Math.sin(an)*rr,4.5,0,7);g.fillStyle='#2f7fbf';g.fill();lbl(g,cx+Math.cos(an)*rr,cy+Math.sin(an)*rr-12,'e⁻ captured','#245c86')}}
   if(f.k==='gamma'){const d=f.t*300,dx=Math.cos(f.ang),dy=Math.sin(f.ang);g.strokeStyle=`rgba(214,160,30,${a})`;g.lineWidth=3;g.beginPath();
    for(let u=0;u<70;u+=2){const w=Math.sin((d+u)/4)*6,px=cx+dx*(d+u)-dy*w,py=cy+dy*(d+u)+dx*w;u?g.lineTo(px,py):g.moveTo(px,py)}g.stroke();lbl(g,cx+dx*(d+40),cy+dy*(d+40)-14,'γ ray','#8a6510')}});
  /* band of stability */
  const X0=400,Y0=26,W=185,H=200,zx=Z=>X0+Z/100*W,ny=n=>Y0+H-n/155*H;g.fillStyle='#fff';g.fillRect(X0-6,Y0-16,W+16,H+42);g.strokeStyle='#dbe5ee';g.lineWidth=1;g.strokeRect(X0-6,Y0-16,W+16,H+42);
  g.fillStyle='#4c5a65';g.font='bold 11px system-ui,sans-serif';g.fillText('Band of stability',X0,Y0-4);
  g.beginPath();for(let Z=1;Z<=84;Z++)g.lineTo(zx(Z),ny(bandN(Z)*1.07+1));for(let Z=84;Z>=1;Z--)g.lineTo(zx(Z),ny(bandN(Z)*0.94-1));g.closePath();g.fillStyle='#cfe9d6';g.fill();
  g.strokeStyle='#c3ccd4';g.setLineDash([4,4]);g.beginPath();g.moveTo(zx(0),ny(0));g.lineTo(zx(100),ny(100));g.stroke();g.setLineDash([]);
  g.fillStyle='#4c5a65';g.font='10px system-ui,sans-serif';g.fillText('protons (Z) →',X0+W-70,Y0+H+14);g.fillText('N = Z',zx(72),ny(64));g.save();g.translate(X0+2,Y0+H-6);g.rotate(-Math.PI/2);g.fillText('neutrons →',0,8);g.restore();
  if(s.start){let x=s.start;const pts=[[x.Z,x.A-x.Z]];s.hist.forEach(m=>{x=decayOf(x,m).prod;pts.push([x.Z,x.A-x.Z])});g.strokeStyle='#4a9fd6';g.lineWidth=2;g.beginPath();pts.forEach(([z,n],i)=>i?g.lineTo(zx(z),ny(n)):g.moveTo(zx(z),ny(n)));g.stroke();
   const [z,n]=pts[pts.length-1];g.beginPath();g.arc(zx(z),ny(n),5.5,0,7);g.fillStyle='#e0675a';g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke()}
  g.font='bold 12px system-ui,sans-serif';[['#e0675a','proton'],['#9aa9b6','neutron']].forEach(([c,t],i)=>{g.beginPath();g.arc(16,LH-34+i*18,6,0,7);g.fillStyle=c;g.fill();g.fillStyle='#22313b';g.fillText(t,27,LH-30+i*18)})}
 const loop=makeLoop(step);const api={s,onEvent:null,load,fire};function emit(e){api.onEvent&&api.onEvent(e)}
 api.mount=(h,o)=>{h.innerHTML=`<div class="lab"><div class="ctrls" role="group" aria-label="Decay buttons">
  <button type="button" class="chip dk" data-f="alpha"><img class="pic" src="assets/p-alpha.webp" alt="" width="26" height="26"><span>α Alpha</span></button><button type="button" class="chip dk" data-f="beta"><img class="pic" src="assets/p-beta.webp" alt="" width="26" height="26"><span>β⁻ Beta</span></button><button type="button" class="chip dk" data-f="positron"><img class="pic" src="assets/p-positron.webp" alt="" width="26" height="26"><span>β⁺ Positron</span></button><button type="button" class="chip dk" data-f="ec"><img class="pic" src="assets/p-ec.webp" alt="" width="26" height="26"><span>EC Electron capture</span></button><button type="button" class="chip dk" data-f="gamma"><img class="pic" src="assets/p-gamma.webp" alt="" width="26" height="26"><span>γ Gamma</span></button>
  <button type="button" class="chip rst" data-reset>↺ Start over</button>${speedChip()}</div>
  <div class="stage"><canvas width="600" height="320" role="img"></canvas><div class="dmsg" aria-live="polite"></div></div>
  <div class="readout"><div class="counts"><div class="cnt"><span class="sw" style="background:#e0675a;border-color:#a8443a"></span>Protons (Z)<b data-k="p"></b></div><div class="cnt"><span class="sw" style="background:#9aa9b6;border-color:#6b7a86"></span>Neutrons (A − Z)<b data-k="n"></b></div><div class="cnt">Neutron-to-proton ratio<b data-k="np"></b></div></div>
  <div class="counts"><div class="cnt" style="justify-content:center"><b data-k="name" style="margin:0"></b></div><div class="status r" data-k="st"></div></div></div>
  <div class="eqline" aria-live="polite"></div></div>`;
  const q=k=>h.querySelector(`[data-k="${k}"]`);el={cv:h.querySelector('canvas'),eq:h.querySelector('.eqline'),msg:h.querySelector('.dmsg'),p:q('p'),n:q('n'),np:q('np'),name:q('name'),st:q('st')};ctx=fitCanvas(el.cv,LW,LH);
  h.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>fire(b.dataset.f));h.querySelector('[data-reset]').onclick=()=>{load(s.sys);emit('reset')};wireSpeed(h);load(o.sys||s.sys)};
 api.start=()=>loop.start();api.stop=()=>loop.stop();
 return api})();

/* ============================== 🛡️ SHIELD LAB ============================== */
const SHIELDS=[['none','No shield'],['paper','Paper'],['al','Aluminum'],['lead','Lead'],['water','Concrete / water']];
const TRANS={alpha:{none:1,paper:0,al:0,lead:0,water:0},beta:{none:1,paper:0.9,al:0,lead:0,water:0},gamma:{none:1,paper:1,al:0.92,lead:0.12,water:0.3},neutron:{none:1,paper:1,al:0.95,lead:0.85,water:0.06}};
const SRC0={alpha:4000,beta:3000,gamma:2000,neutron:1500},BG=30,ALPHA_RANGE=5;/* alpha range: cm of air */
const IONSTEP={alpha:4,beta:20,gamma:90,neutron:140};
/* expected counts per minute at the counter (inverse square from 10 cm) */
function cpm(rad,shield,d){if(rad==='alpha'&&d>ALPHA_RANGE)return BG;return Math.round(BG+SRC0[rad]*TRANS[rad][shield]*(10/d)**2)}
/* Geiger clicks (off by default): short noise bursts at the counter's rate, capped so very high counts become a buzz */
const Click=(()=>{let ctx=null,buf=null;const api={on:false,
 ensure(){if(!ctx){const AC=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);if(!AC)return false;ctx=new AC();const L=Math.floor(ctx.sampleRate*0.004);buf=ctx.createBuffer(1,L,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3)}if(ctx.state==='suspended')ctx.resume();return true},
 play(k,span){if(!ctx||!api.on)return;for(let i=0;i<k;i++){const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=buf;g.gain.value=0.45;s.connect(g);g.connect(ctx.destination);s.start(ctx.currentTime+Math.random()*span)}}};return api})();
const RADLBL={alpha:'α Alpha',beta:'β Beta',gamma:'γ Gamma',neutron:'n Neutron'};
const Shield=(()=>{
 const s={rad:'alpha',sh:'none',d:10,ps:[],ions:[],t:0,acc:0,shown:BG,tick:0,seen:{},dSeen:[],flash:0};let el={},ctx=null;
 const PX=12.6,SX=34;const detX=()=>SX+s.d*PX,shX=()=>(SX+detX())/2;
 function set(k,v){s[k]=v;s.ps=[];s.seen[s.rad+':'+s.sh]=1;sync();emit('set:'+k)}
 function sync(){if(!el.cv)return;el.root.querySelectorAll('[data-rad]').forEach(b=>{const on=b.dataset.rad===s.rad;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  el.root.querySelectorAll('[data-sh]').forEach(b=>{const on=b.dataset.sh===s.sh;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  el.dist.value=s.d;setTxt(el.dout,s.d+' cm');s.shown=cpm(s.rad,s.sh,s.d);readout()}
 function readout(){setTxt(el.cnt,s.shown.toLocaleString('en-US'));const exp=cpm(s.rad,s.sh,s.d);setTxt(el.note,exp<=BG+5?'≈ background only':exp<BG*4?'a little above background':'well above background');
  el.cv.setAttribute('aria-label',`${PNAME[s.rad]}s from the source, ${SHIELDS.find(x=>x[0]===s.sh)[1].toLowerCase()} in between, counter ${s.d} cm away reads about ${exp} counts per minute.`)}
 function step(dt){s.t+=dt;const tr=TRANS[s.rad][s.sh];
  s.acc+=dt*(s.rad==='alpha'?16:s.rad==='beta'?20:s.rad==='gamma'?16:12);
  while(s.acc>=1){s.acc--;const a=(Math.random()-0.5)*0.75,sp={alpha:150,beta:330,gamma:520,neutron:260}[s.rad];s.ps.push({x:SX+14,y:LH/2+(Math.random()-0.5)*14,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,k:s.rad,go:Math.random()<tr,ion:0,dead:0})}
  const sx=shX(),dx=detX();
  s.ps.forEach(p=>{if(p.dead){p.dead+=dt;return}const ox=p.x;p.x+=p.vx*dt;p.y+=p.vy*dt;
   if(p.k==='alpha'&&p.x>SX+ALPHA_RANGE*PX)p.dead=0.001;
   if(!p.dead&&s.sh!=='none'&&ox<sx-4&&p.x>=sx-4&&!p.go){p.dead=0.001;p.x=sx-4}
   if(!p.dead&&ox<dx&&p.x>=dx&&Math.abs(p.y-LH/2)<34){p.dead=0.001;s.flash=1}
   if(p.y<0||p.y>LH||p.x>LW)p.dead=1;
   if(!p.dead||p.dead<0.01){p.ion+=Math.hypot(p.vx,p.vy)*dt;while(p.ion>IONSTEP[p.k]){p.ion-=IONSTEP[p.k];if(s.ions.length<700)s.ions.push({x:p.x+(Math.random()-0.5)*6,y:p.y+(Math.random()-0.5)*6,t:0,sg:Math.random()<0.5})}}});
  s.ps=s.ps.filter(p=>p.dead<0.6);s.ions.forEach(i=>i.t+=dt);s.ions=s.ions.filter(i=>i.t<1.3);s.flash=Math.max(0,s.flash-dt*4);
  if(Click.on&&dt>0){const lam=Math.min(cpm(s.rad,s.sh,s.d)/60,70)*dt;let k=lam<1?(Math.random()<lam?1:0):Math.max(0,Math.round(lam+(Math.random()+Math.random()+Math.random()-1.5)*Math.sqrt(lam)*1.4));if(k)Click.play(Math.min(k,8),dt)}
  s.tick+=dt;if(s.tick>0.5){s.tick=0;const e=cpm(s.rad,s.sh,s.d);s.shown=Math.max(0,Math.round(e+(Math.random()-0.5)*2*Math.sqrt(e)));readout()}
  draw()}
 function draw(){if(!ctx)return;const g=ctx;g.clearRect(0,0,LW,LH);g.fillStyle='#fbfdff';g.fillRect(0,0,LW,LH);
  g.fillStyle='#5c6a75';g.font='10px system-ui,sans-serif';for(let c=0;c<=44;c+=5){const x=SX+c*PX;if(x>LW-20)break;g.fillRect(x,LH-16,1,6);g.fillText(c+' cm',x-8,LH-2)}
  g.fillStyle='#2f4650';rrect(g,SX-26,LH/2-26,40,52,8);g.fill();g.fillStyle='#f7c968';g.font='bold 20px system-ui,sans-serif';g.fillText('☢',SX-16,LH/2+7);
  if(s.rad==='alpha'){const x=SX+ALPHA_RANGE*PX;g.setLineDash([3,4]);g.strokeStyle='rgba(224,103,90,.6)';g.lineWidth=1;g.beginPath();g.moveTo(x,30);g.lineTo(x,LH-22);g.stroke();g.setLineDash([]);g.fillStyle='#a8443a';g.font='bold 11px system-ui,sans-serif';g.fillText('alpha range in air (~5 cm)',x-30,24)}
  if(s.sh!=='none'){const x=shX(),w={paper:3,al:7,lead:16,water:24}[s.sh],c={paper:'#f4efe2',al:'#c9d3dc',lead:'#6b7480',water:'#9cc7e6'}[s.sh];g.fillStyle=c;g.fillRect(x-4,40,w,LH-80);g.strokeStyle='#4c5a65';g.lineWidth=1;g.strokeRect(x-4,40,w,LH-80);g.fillStyle='#22313b';g.font='bold 12px system-ui,sans-serif';g.textAlign='center';g.fillText(SHIELDS.find(q=>q[0]===s.sh)[1],x+w/2-4,LH-26);g.textAlign='left'}
  g.font='bold 10px system-ui,sans-serif';s.ions.forEach(i=>{g.fillStyle=`rgba(${i.sg?'200,70,60':'47,127,191'},${1-i.t/1.3})`;g.fillText(i.sg?'+':'−',i.x-3,i.y+3)});
  s.ps.forEach(p=>{g.globalAlpha=p.dead?Math.max(0,1-p.dead/0.6):1;
   if(p.k==='alpha'){g.fillStyle='#e0675a';g.beginPath();g.arc(p.x,p.y,5.5,0,7);g.fill()}
   else if(p.k==='beta'){g.fillStyle='#2f7fbf';g.beginPath();g.arc(p.x,p.y,3,0,7);g.fill()}
   else if(p.k==='neutron'){g.fillStyle='#7d8b97';g.beginPath();g.arc(p.x,p.y,4,0,7);g.fill()}
   else{g.strokeStyle='#d6a01e';g.lineWidth=2;g.beginPath();const ang=Math.atan2(p.vy,p.vx),c=Math.cos(ang),sn=Math.sin(ang);for(let u=-16;u<=0;u+=2){const w=Math.sin((p.x+u)/3)*3,px=p.x+c*u-sn*w,py=p.y+sn*u+c*w;u>-16?g.lineTo(px,py):g.moveTo(px,py)}g.stroke()}
   g.globalAlpha=1});
  const x=detX();g.fillStyle=s.flash?'#f7c968':'#e6f2ff';g.strokeStyle='#245c86';g.lineWidth=2;rrect(g,x,LH/2-34,20,68,6);g.fill();g.stroke();
  g.fillStyle='#245c86';g.font='bold 11px system-ui,sans-serif';g.fillText('counter',x-12,LH/2-40)}
 const loop=makeLoop(step);const api={s,onEvent:null,set};function emit(e){api.onEvent&&api.onEvent(e)}
 api.mount=(h,o)=>{h.innerHTML=`<div class="lab">
  <div class="ctrls" role="group" aria-label="Radiation"><span class="lbl">Radiation:</span>${['alpha','beta','gamma','neutron'].map(k=>`<button type="button" class="chip" data-rad="${k}"><img class="pic" src="assets/p-${k}.webp" alt="" width="26" height="26"><span>${RADLBL[k]}</span></button>`).join('')}</div>
  <div class="ctrls" role="group" aria-label="Shield"><span class="lbl">Shield:</span>${SHIELDS.map(([k,t])=>`<button type="button" class="chip" data-sh="${k}">${t}</button>`).join('')}</div>
  <div class="ctrls"><label class="slider">📏 Counter distance <input type="range" min="2" max="40" step="1" data-dist aria-label="Distance from source to counter in centimeters"><output data-dout></output></label>${speedChip()}<button type="button" class="chip" data-snd aria-pressed="${Click.on}">${Click.on?'🔊 Clicks on':'🔇 Clicks off'}</button></div>
  <div class="stage"><canvas width="600" height="320" role="img"></canvas></div>
  <div class="geiger" role="status"><span>📟 Counter:</span> <b data-cnt>0</b> <span>counts/min</span> <small data-note></small></div>
  <p class="cap">+ and − marks are ions made along each track (ionizing power). Background radiation alone gives about ${BG} counts/min.</p></div>`;
  el={root:h,cv:h.querySelector('canvas'),dist:h.querySelector('[data-dist]'),dout:h.querySelector('[data-dout]'),cnt:h.querySelector('[data-cnt]'),note:h.querySelector('[data-note]')};ctx=fitCanvas(el.cv,LW,LH);
  h.querySelectorAll('[data-rad]').forEach(b=>b.onclick=()=>set('rad',b.dataset.rad));h.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>set('sh',b.dataset.sh));
  el.dist.oninput=()=>{s.d=+el.dist.value;setTxt(el.dout,s.d+' cm');s.dSeen.push(s.d);s.shown=cpm(s.rad,s.sh,s.d);readout();emit('set:d')};
  const snd=h.querySelector('[data-snd]');snd.onclick=()=>{if(!Click.on&&!Click.ensure()){snd.textContent='🔇 No sound on this device';return}Click.on=!Click.on;if(Click.on)Click.ensure();snd.textContent=Click.on?'🔊 Clicks on':'🔇 Clicks off';snd.setAttribute('aria-pressed',Click.on)};
  wireSpeed(h);Object.assign(s,{rad:o.rad||'alpha',sh:o.sh||'none',d:o.d||10,ps:[],ions:[],seen:{},dSeen:[o.d||10]});s.seen[s.rad+':'+s.sh]=1;sync()};
 api.start=()=>loop.start();api.stop=()=>loop.stop();return api})();

/* ============================== ⏳ HALF-LIFE LAB ============================== */
/* [id, label, half-life, unit, start mass (mg), radiation] (textbook Table 14.3.1) */
const HL_SYS=[['i131','I-131',8.0,'days',64.0,'beta, gamma'],['tc99m','Tc-99m',6.0,'hours',4.00,'gamma'],['c14','C-14',5730,'years',10.0,'beta'],['co60','Co-60',5.27,'years',80.0,'beta, gamma'],['ir192','Ir-192',74,'days',96.0,'beta, gamma'],['rn222','Rn-222',3.8,'days',2.00,'alpha'],['f18','F-18',110,'minutes',20.0,'positron']];
/* half-life as the textbook writes it (8.0 days, not 8 days) */
const HL_SHOW={i131:'8.0',tc99m:'6.0',c14:'5730',co60:'5.27',ir192:'74',rn222:'3.8',f18:'110'};
const fmtT=(v,u)=>`${Number(v.toPrecision(4)).toLocaleString('en-US')} ${u}`;
let NUMF=(x,s)=>String(Number(x.toPrecision(s)));/* replaced by the page's sig-fig formatter */
const Half=(()=>{
 const NN=400,s={sys:'i131',t:0,alive:[],flash:[],run:false,jump:0,hist:[],jumps:0};let el={},ctx=null;
 const sys=()=>HL_SYS.find(x=>x[0]===s.sys)||HL_SYS[0];
 const left=()=>s.alive.reduce((a,b)=>a+b,0);
 function load(id){s.sys=(HL_SYS.find(x=>x[0]===id)||HL_SYS[0])[0];s.t=0;s.alive=Array(NN).fill(1);s.flash=Array(NN).fill(0);s.run=false;s.jump=0;s.queue=0;s.hist=[[0,NN]];s.jumps=0;sync();syncBtns()}
 function decayN(k){const idx=[];s.alive.forEach((v,i)=>{if(v)idx.push(i)});for(let i=idx.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}idx.slice(0,k).forEach(i=>{s.alive[i]=0;s.flash[i]=1})}
 function jump(){if(s.jump>0){if((s.queue||0)<3)s.queue=(s.queue||0)+1;return}if(s.t>=8-1e-9){say('That is 8 half-lives: tap ↺ Start over.');return}s.run=false;s.jump=1;s.jfrom=s.t;s.jtodo=Math.floor(left()/2);s.jdone=0;syncBtns()}
 function toggle(){if(s.jump>0)return;s.run=!s.run;if(s.t>=8)s.run=false;syncBtns();if(s.run)emit('run')}
 function say(t){if(el.msg){el.msg.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>{if(el.msg)el.msg.textContent=''},3000)}}
 function step(dt){
  if(s.jump>0){const k=Math.min(1,(1-s.jump)+dt/0.9);s.jump=1-k;s.t=s.jfrom+k;const want=Math.round(s.jtodo*k);if(want>s.jdone){decayN(want-s.jdone);s.jdone=want}
   if(s.jump<=1e-9){s.jump=0;s.t=Math.round(s.t);s.jumps++;s.hist.push([s.t,left()]);syncBtns();sync();emit('jump');if(s.queue>0){s.queue--;jump()}}else sync()}
  else if(s.run){const d=dt/2.5,p=1-Math.pow(0.5,d);s.alive.forEach((v,i)=>{if(v&&Math.random()<p){s.alive[i]=0;s.flash[i]=1}});s.t+=d;s.hist.push([s.t,left()]);if(s.t>=8){s.run=false;syncBtns()}sync()}
  for(let i=0;i<NN;i++)if(s.flash[i]>0)s.flash[i]=Math.max(0,s.flash[i]-dt*1.6);draw()}
 const massLeft=()=>sys()[4]*Math.pow(0.5,s.t);
 function sync(){if(!el.root)return;const y=sys(),n=s.t,L=left();
  setTxt(el.time,fmtT(n*y[2],y[3]));setTxt(el.nhl,Math.abs(n-Math.round(n))<1e-6?String(Math.round(n)):n.toFixed(2));
  setTxt(el.left,`${L} of ${NN}`);setTxt(el.mass,`${NUMF(massLeft(),3)} mg of ${NUMF(y[4],3)} mg`);setTxt(el.pct,Number((Math.pow(0.5,n)*100).toPrecision(4))+'%');
  el.cv&&el.cv.setAttribute('aria-label',`${y[1]} sample after ${fmtT(n*y[2],y[3])}: ${L} of ${NN} nuclei left.`)}
 function syncBtns(){if(!el.root)return;setTxt(el.run,s.run?'⏸ Stop clock':'▶ Run clock');el.run.setAttribute('aria-pressed',s.run)}
 function draw(){if(!ctx)return;const g=ctx,y=sys();g.clearRect(0,0,LW,LH);g.fillStyle='#fbfdff';g.fillRect(0,0,LW,LH);
  const cs=14.2,x0=10,y0=20;g.font='bold 11px system-ui,sans-serif';g.fillStyle='#4c5a65';g.fillText(`${y[1]} nuclei: 🟠 not yet decayed`,x0,12);
  for(let i=0;i<NN;i++){const r=Math.floor(i/20),c=i%20,x=x0+c*cs+7,yy=y0+r*cs+7;g.beginPath();g.arc(x,yy,5.6,0,7);g.fillStyle=s.alive[i]?'#f0a63a':'#d5dde3';g.fill();
   if(s.flash[i]>0){g.beginPath();g.arc(x,yy,5.6+6*(1-s.flash[i]),0,7);g.strokeStyle=`rgba(224,103,90,${s.flash[i]})`;g.lineWidth=2;g.stroke()}}
  const X0=318,Y0=26,W=264,H=250,tx=t=>X0+t/6*W,ay=a=>Y0+H-(a/NN)*H;g.fillStyle='#fff';g.fillRect(X0-8,Y0-18,W+20,H+44);g.strokeStyle='#dbe5ee';g.lineWidth=1;g.strokeRect(X0-8,Y0-18,W+20,H+44);
  g.fillStyle='#4c5a65';g.fillText('Amount left',X0,Y0-5);g.strokeStyle='#9fb6c8';g.beginPath();g.moveTo(X0,Y0);g.lineTo(X0,Y0+H);g.lineTo(X0+W,Y0+H);g.stroke();
  g.font='10px system-ui,sans-serif';for(let k=0;k<=6;k++){const x=tx(k);g.fillStyle='#4c5a65';g.fillText(String(k),x-3,Y0+H+12);if(k){g.setLineDash([2,4]);g.strokeStyle='#e4dfd3';g.beginPath();g.moveTo(x,Y0);g.lineTo(x,Y0+H);g.stroke();g.setLineDash([])}}
  g.fillText(`half-lives (1 half-life = ${HL_SHOW[y[0]]} ${y[3]})`,X0+20,Y0+H+24);
  [[1,'100%'],[0.5,'50%'],[0.25,'25%'],[0.125,'12.5%']].forEach(([f,t])=>{g.fillStyle='#8a98a4';g.fillText(t,X0+3,ay(f*NN)-2)});
  g.strokeStyle='#c99a2e';g.setLineDash([5,4]);g.lineWidth=1.5;g.beginPath();for(let t=0;t<=6.001;t+=0.05)g.lineTo(tx(t),ay(NN*Math.pow(0.5,t)));g.stroke();g.setLineDash([]);
  g.strokeStyle='#e0675a';g.lineWidth=2.5;g.beginPath();s.hist.filter(p=>p[0]<=6.001).forEach(([t,a],i)=>i?g.lineTo(tx(t),ay(a)):g.moveTo(tx(t),ay(a)));if(s.t<=6)g.lineTo(tx(s.t),ay(left()));g.stroke();
  if(s.t<=6){g.beginPath();g.arc(tx(s.t),ay(left()),5,0,7);g.fillStyle='#e0675a';g.fill()}}
 const loop=makeLoop(step);const api={s,onEvent:null,load,jump,toggle,left,massLeft,sys};function emit(e){api.onEvent&&api.onEvent(e)}
 api.mount=(h,o)=>{h.innerHTML=`<div class="lab">
  <div class="ctrls"><button type="button" class="chip go" data-jump>⏭ +1 half-life</button><button type="button" class="chip" data-run aria-pressed="false">▶ Run clock</button><button type="button" class="chip rst" data-reset>↺ Start over</button>${speedChip()}</div>
  <div class="stage"><canvas width="600" height="320" role="img"></canvas><div class="dmsg" aria-live="polite"></div></div>
  <div class="readout"><div class="counts"><div class="cnt">⏱️ Time passed<b data-k="time"></b></div><div class="cnt">Half-lives (n)<b data-k="nhl"></b></div></div>
  <div class="counts"><div class="cnt">⚖️ Mass left<b data-k="mass"></b></div><div class="cnt">Percent left<b data-k="pct"></b></div><div class="cnt">Dots left<b data-k="left"></b></div></div></div>
  <p class="cap">Real samples have trillions of atoms, so they halve exactly. With only 400 dots, the last few decay at random.</p></div>`;
  const q=k=>h.querySelector(`[data-k="${k}"]`);el={root:h,cv:h.querySelector('canvas'),msg:h.querySelector('.dmsg'),time:q('time'),nhl:q('nhl'),left:q('left'),mass:q('mass'),pct:q('pct'),run:h.querySelector('[data-run]')};ctx=fitCanvas(el.cv,LW,LH);
  h.querySelector('[data-jump]').onclick=jump;el.run.onclick=toggle;h.querySelector('[data-reset]').onclick=()=>{load(s.sys);emit('reset')};wireSpeed(h);load(o.sys||s.sys)};
 api.start=()=>loop.start();api.stop=()=>loop.stop();return api})();

/* ============================== 🔥 FISSION & FUSION LAB ============================== */
/* physics is separate from drawing so tools/check.js can run it in Node */
const FUEL={small:40,medium:110,large:190};
function fisNew(fuel,rods,seed){const r=rng(seed||7),n=FUEL[fuel]||110,cx=LW/2,cy=LH/2,U=[];
 /* same spacing for every amount, so only the size of the lump changes (critical mass) */
 for(let i=0;U.length<n&&i<5000;i++){const a=i*2.39996,d=17*0.55*Math.sqrt(i+0.5);U.push({x:cx+Math.cos(a)*d+(r()-0.5)*3,y:cy+Math.sin(a)*d*0.82+(r()-0.5)*3,on:1})}
 return {U,nu:[],frag:[],rods,fis:0,lost:0,abs:0,t:0,r,peak:0}}
const RODX=[120,210,300,390,480];
/* chance that a neutron passing a U-235 nucleus splits it (sets the critical mass) */
let PFIS=0.15;
function rodHit(st,x,y){const depth=st.rods*(LH-10);return st.rods>0&&RODX.some(rx=>Math.abs(x-rx)<6&&y<depth)}
function fisFire(st){st.nu.push({x:8,y:LH/2+(st.r()-0.5)*30,vx:150,vy:(st.r()-0.5)*30})}
function fisStep(st,dt){st.t+=dt;const add=[];
 st.nu.forEach(n=>{n.x+=n.vx*dt;n.y+=n.vy*dt;if(n.x<-5||n.x>LW+5||n.y<-5||n.y>LH+5){n.dead=1;st.lost++;return}
  if(rodHit(st,n.x,n.y)){n.dead=1;st.abs++;return}
  for(const u of st.U){if(u.on&&u!==n.last&&Math.abs(u.x-n.x)<7&&Math.abs(u.y-n.y)<7){n.last=u;if(st.r()>PFIS)continue;u.on=0;n.dead=1;st.fis++;const k=st.r()<0.5?2:3;
   for(let i=0;i<k;i++){const a=st.r()*6.283;add.push({x:u.x+Math.cos(a)*9,y:u.y+Math.sin(a)*9,vx:Math.cos(a)*150,vy:Math.sin(a)*150})}
   const a=st.r()*6.283;st.frag.push({x:u.x,y:u.y,vx:Math.cos(a)*40,vy:Math.sin(a)*40,t:0,l:'Ba'},{x:u.x,y:u.y,vx:-Math.cos(a)*40,vy:-Math.sin(a)*40,t:0,l:'Kr'});break}}});
 st.nu=st.nu.filter(n=>!n.dead).concat(add);if(st.nu.length>160)st.nu.length=160;st.peak=Math.max(st.peak,st.nu.length);
 st.frag.forEach(f=>{f.t+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt});st.frag=st.frag.filter(f=>f.t<1.4)}
/* fusion: D and T in a hot box; they fuse only when they hit fast enough to beat the repulsion of two positive nuclei */
const FUSE_T=8;
function fusNew(T,seed){const r=rng(seed||3),P=[];for(let i=0;i<16;i++)P.push({x:40+r()*520,y:30+r()*260,k:i%2?'T':'D',vx:0,vy:0});const st={P,T,fus:0,r,fx:[],t:0,bounce:0};fusSetT(st,T);return st}
function fusSetT(st,T){st.T=T;const v=40+T*9;st.P.forEach(p=>{const a=st.r()*6.283,m=v*(0.7+st.r()*0.6);p.vx=Math.cos(a)*m;p.vy=Math.sin(a)*m})}
function fusStep(st,dt){st.t+=dt;const P=st.P;P.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<12||p.x>LW-12){p.vx*=-1;p.x=Math.max(12,Math.min(LW-12,p.x))}if(p.y<26||p.y>LH-12){p.vy*=-1;p.y=Math.max(26,Math.min(LH-12,p.y))}});
 for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j];if(a.dead||b.dead)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<20&&d>0){
  const nx=dx/d,ny=dy/d,rv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(rv<=0)continue;
  if(st.T>=FUSE_T&&!a.he&&!b.he&&a.k!==b.k&&rv>90){a.he=1;a.k='He';b.dead=1;st.fus++;st.fx.push({x:(a.x+b.x)/2,y:(a.y+b.y)/2,t:0});a.vx=(a.vx+b.vx)/2;a.vy=(a.vy+b.vy)/2;
   st.fx.push({k:'n',x:a.x,y:a.y,vx:-ny*420,vy:nx*420,t:0});continue}
  a.vx-=rv*nx;a.vy-=rv*ny;b.vx+=rv*nx;b.vy+=rv*ny;st.bounce++;if(st.fx.length<40)st.fx.push({k:'b',x:(a.x+b.x)/2,y:(a.y+b.y)/2,t:0})}}
 st.P=P.filter(p=>!p.dead);
 /* keep fuel coming so the box never runs out */
 if(st.P.filter(p=>!p.he).length<8){for(let i=0;i<4;i++){const a=st.r()*6.283,m=(40+st.T*9)*(0.7+st.r()*0.6);st.P.push({x:20,y:40+st.r()*240,k:i%2?'T':'D',vx:Math.abs(Math.cos(a)*m),vy:Math.sin(a)*m})}st.P=st.P.filter(p=>!p.he).concat(st.P.filter(p=>p.he).slice(-6))}
 st.fx.forEach(f=>{f.t+=dt;if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt}});st.fx=st.fx.filter(f=>f.t<(f.k==='n'?1.5:f.k==='b'?0.5:1))}
const Power=(()=>{
 const s={view:'fis',fuel:'large',rods:0,T:3,st:null,fu:null,fired:0};let el={},ctx=null;
 const tempTxt=T=>`${Math.round(T*T*1.1+0.5)} million K`;
 function reset(){s.st=fisNew(s.fuel,s.rods,Math.floor(Math.random()*1e6));s.fu=fusNew(s.T,Math.floor(Math.random()*1e6));s.fired=0;sync()}
 function fire(){if(s.view!=='fis')return;fisFire(s.st);s.fired++;read();emit('fire')}
 function sync(){if(!el.root)return;el.root.querySelectorAll('[data-view]').forEach(b=>{const on=b.dataset.view===s.view;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  ['fisC','fis2'].forEach(k=>el[k].classList.toggle('hidden',s.view!=='fis'));['fusC','fus2'].forEach(k=>el[k].classList.toggle('hidden',s.view!=='fus'));
  el.root.querySelectorAll('[data-fuel]').forEach(b=>{const on=b.dataset.fuel===s.fuel;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  el.rods.value=Math.round(s.rods*100);setTxt(el.rout,Math.round(s.rods*100)+'% in');el.temp.value=s.T;setTxt(el.tout,tempTxt(s.T));read()}
 function read(){if(!el.root)return;if(s.view==='fis'){const st=s.st,left=st.U.filter(u=>u.on).length;setTxt(el.r1,String(st.fis));setTxt(el.r2,String(st.nu.length));setTxt(el.r3,`${left} of ${st.U.length}`);
   setTxt(el.status,s.fired===0?'Tap 🎯 Fire a neutron':st.nu.length>12?'🔥 Chain reaction growing':st.nu.length>0?'Neutrons flying…':st.fis>=st.U.length*0.35?'Chain reaction ran through the fuel':'Chain died out: neutrons escaped or were absorbed');
   el.cv.setAttribute('aria-label',`Fission: ${st.fis} fissions, ${st.nu.length} neutrons flying, ${left} U-235 nuclei left, control rods ${Math.round(s.rods*100)}% in.`)}
  else{setTxt(el.f1,String(s.fu.fus));setTxt(el.f2,String(s.fu.bounce));setTxt(el.status,s.T>=FUSE_T?'Hot enough: fast nuclei can fuse':'Too cool: nuclei repel and bounce apart');
   el.cv.setAttribute('aria-label',`Fusion at ${tempTxt(s.T)}: ${s.fu.fus} fusions, ${s.fu.bounce} bounces.`)}}
 let rt=0;function step(dt){if(s.view==='fis')fisStep(s.st,dt);else fusStep(s.fu,dt);rt+=dt;if(rt>0.2){rt=0;read()}draw()}
 function draw(){if(!ctx)return;const g=ctx;g.clearRect(0,0,LW,LH);g.fillStyle=s.view==='fis'?'#fbfdff':'#1f2a44';g.fillRect(0,0,LW,LH);
  if(s.view==='fis'){const st=s.st;
   st.U.forEach(u=>{if(!u.on)return;g.beginPath();g.arc(u.x,u.y,6,0,7);g.fillStyle='#6fae7e';g.fill();g.strokeStyle='#3f7a4f';g.lineWidth=1;g.stroke()});
   st.frag.forEach(f=>{g.globalAlpha=1-f.t/1.4;g.beginPath();g.arc(f.x,f.y,8+f.t*30,0,7);g.strokeStyle='#f7c968';g.lineWidth=3;g.stroke();g.beginPath();g.arc(f.x,f.y,4.5,0,7);g.fillStyle=f.l==='Ba'?'#9a7fcf':'#e8955a';g.fill();g.fillStyle='#22313b';g.font='bold 10px system-ui,sans-serif';g.fillText(f.l,f.x+6,f.y-5);g.globalAlpha=1});
   g.fillStyle='#2f4650';st.nu.forEach(n=>{g.beginPath();g.arc(n.x,n.y,3,0,7);g.fill()});
   if(st.rods>0){const d=st.rods*(LH-10);RODX.forEach(x=>{g.fillStyle='#4c5a65';g.fillRect(x-5,0,10,d);g.fillStyle='#22313b';g.fillRect(x-5,d-4,10,4)})}
   g.font='bold 12px system-ui,sans-serif';g.fillStyle='#3f7a4f';g.fillText('● U-235',10,16);g.fillStyle='#2f4650';g.fillText('• neutron',74,16);g.fillStyle='#9a7fcf';g.fillText('Ba',146,16);g.fillStyle='#e8955a';g.fillText('Kr fragments',166,16)}
  else{const st=s.fu;st.P.forEach(p=>{const c=p.k==='D'?'#8fd8c8':p.k==='T'?'#70b7e8':'#f7c968';g.beginPath();g.arc(p.x,p.y,p.k==='He'?11:9,0,7);g.fillStyle=c;g.fill();g.fillStyle='#1f2a44';g.font='bold 10px system-ui,sans-serif';g.textAlign='center';g.fillText(p.k==='D'?'²H':p.k==='T'?'³H':'⁴He',p.x,p.y+4);g.textAlign='left'});
   st.fx.forEach(f=>{if(f.k==='n'){g.fillStyle='#fff';g.beginPath();g.arc(f.x,f.y,3.5,0,7);g.fill();g.font='bold 10px system-ui,sans-serif';g.fillText('n',f.x+5,f.y-4)}else if(f.k==='b'){g.fillStyle=`rgba(255,190,180,${1-f.t/0.5})`;g.font='bold 12px system-ui,sans-serif';g.fillText('+ +',f.x-8,f.y-10)}else{g.beginPath();g.arc(f.x,f.y,10+f.t*60,0,7);g.strokeStyle=`rgba(247,201,104,${1-f.t})`;g.lineWidth=4;g.stroke()}});
   g.fillStyle='#e6f2ff';g.font='bold 12px system-ui,sans-serif';g.fillText('²H deuterium · ³H tritium · ⁴He helium · ◯ energy · n neutron',10,16)}}
 const loop=makeLoop(step);const api={s,onEvent:null,fire,reset};function emit(e){api.onEvent&&api.onEvent(e)}
 api.mount=(h,o)=>{h.innerHTML=`<div class="lab">
  <div class="ctrls" role="group" aria-label="Choose a reaction"><button type="button" class="chip" data-view="fis">⚛️ Fission chain</button><button type="button" class="chip" data-view="fus">🌞 Fusion</button>${speedChip()}</div>
  <div data-fisc><div class="ctrls"><button type="button" class="chip go" data-fire>🎯 Fire a neutron</button><span class="lbl">Fuel:</span>${['small','medium','large'].map(k=>`<button type="button" class="chip" data-fuel="${k}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}<button type="button" class="chip rst" data-reset>↺ Reload</button></div>
   <div class="ctrls"><label class="slider">▮ Control rods <input type="range" min="0" max="100" step="10" data-rods aria-label="Control rods, percent inserted"><output data-rout></output></label></div></div>
  <div data-fusc><div class="ctrls"><label class="slider">🌡️ Temp. <input type="range" min="1" max="10" step="1" data-temp aria-label="Temperature"><output data-tout style="min-width:96px;white-space:nowrap"></output></label></div></div>
  <div class="stage"><canvas width="600" height="320" role="img"></canvas></div>
  <div class="readout"><div class="counts" data-fisc2><div class="cnt">💥 Fissions<b data-r1></b></div><div class="cnt">• Neutrons flying<b data-r2></b></div><div class="cnt">U-235 left<b data-r3></b></div></div>
  <div class="counts" data-fusc2><div class="cnt">✸ Fusions<b data-f1></b></div><div class="cnt">↩︎ Bounces (repelled)<b data-f2></b></div></div><div class="counts"><div class="status r" data-status role="status"></div></div></div></div>`;
  const q=k=>h.querySelector(k);el={root:h,cv:q('canvas'),fisC:q('[data-fisc]'),fusC:q('[data-fusc]'),fis2:q('[data-fisc2]'),fus2:q('[data-fusc2]'),rods:q('[data-rods]'),rout:q('[data-rout]'),temp:q('[data-temp]'),tout:q('[data-tout]'),
   r1:q('[data-r1]'),r2:q('[data-r2]'),r3:q('[data-r3]'),f1:q('[data-f1]'),f2:q('[data-f2]'),status:q('[data-status]')};ctx=fitCanvas(el.cv,LW,LH);
  h.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{s.view=b.dataset.view;sync();emit('view:'+s.view)});
  q('[data-fire]').onclick=fire;h.querySelectorAll('[data-fuel]').forEach(b=>b.onclick=()=>{s.fuel=b.dataset.fuel;reset();emit('fuel')});q('[data-reset]').onclick=()=>{reset();emit('reset')};
  el.rods.oninput=()=>{s.rods=+el.rods.value/100;s.st.rods=s.rods;setTxt(el.rout,el.rods.value+'% in');emit('rods')};
  el.temp.oninput=()=>{s.T=+el.temp.value;fusSetT(s.fu,s.T);setTxt(el.tout,tempTxt(s.T));read();emit('temp')};
  wireSpeed(h);Object.assign(s,{view:o.view||'fis',fuel:o.fuel||'large',rods:o.rods||0,T:o.T||3});reset()};
 api.start=()=>loop.start();api.stop=()=>loop.stop();return api})();
