/* node tools/check.js : loads the game's logic in Node and checks
   1) every generated question: answer among the options, a reason for every wrong choice, known video and topic, no undefined/NaN text
   2) every nuclear equation (data tables and generated blanks) balances in mass number and atomic number, with real element symbols
   3) typed numeric answers: the shown answer passes its own sig-fig rule; slips differ from the answer
   4) the fission lab: large fuel sustains a chain, small fuel fizzles, rods all the way in stop it; fusion only when hot
   5) hand-checked values from the lecture slides and MyOpenMath homework */
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..',process.argv[2]||'index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
global.window={};global.matchMedia=()=>({matches:false});
(0,eval)(scripts.slice(0,2).join('\n;\n').replace('const GEN={','var GEN={')+
 ';Object.assign(globalThis,{GEN,MODES,TOPICS,QUIZ_PLAN,topicQ,IDEAS,VIDEO_FOR,DECAYS,BOMB,FISSION,FUSION,decayOf,N,PART,SYM,NUM,nf,fisNew,fisFire,fisStep,fusNew,fusStep,FUSE_T,DLQ,DL_SYS,HL_SYS,state,cpm,TRANS,eqWithBlanks})');
let fails=0,n=0;const bad=m=>{if(fails++<40)console.log('FAIL',m)};
const strip=s=>String(s).replace(/<[^>]+>/g,'');
const sums=terms=>terms.reduce((a,t)=>[a[0]+(t.coef||1)*t.x.A,a[1]+(t.coef||1)*t.x.Z],[0,0]);
function checkEq(L,R,where){n++;const a=sums(L),b=sums(R);if(a[0]!==b[0]||a[1]!==b[1])bad(`${where}: unbalanced ${a} vs ${b}`);
 [...L,...R].forEach(t=>{if(!t.x.part&&SYM[t.x.Z]!==t.x.s)bad(`${where}: symbol ${t.x.s} for Z=${t.x.Z}`);if(!t.x.part&&(t.x.A<t.x.Z||t.x.Z<1))bad(`${where}: impossible nuclide A=${t.x.A} Z=${t.x.Z}`)})}
const term=([c,A,Z,p])=>({coef:c,x:p?PART[p]:N(A,Z)});
// 2) data tables
BOMB.forEach((b,i)=>checkEq(b.L.map(term),b.R.map(term),'BOMB '+i));FUSION.forEach((b,i)=>checkEq(b.L.map(term),b.R.map(term),'FUSION '+i));
FISSION.forEach(([a,b,k],i)=>checkEq([{x:PART.neutron},{x:N(235,92)}],[{x:N(...a)},{x:N(...b)},{x:PART.neutron,coef:k}],'FISSION '+i));
for(const [mode,list] of Object.entries(DECAYS))list.forEach(([A,Z,m])=>{const p=N(A,Z,m),d=decayOf(p,mode);checkEq(d.side==='L'?[{x:p},{x:d.part}]:[{x:p}],d.side==='L'?[{x:d.prod}]:[{x:d.prod},{x:d.part}],`${mode} ${p.s}-${A}`)});
// 5) hand-checked values
const chk=(got,want,what)=>{n++;if(got!==want)bad(`${what}: got ${got}, want ${want}`)};
chk(decayOf(N(241,95),'alpha').prod.s+decayOf(N(241,95),'alpha').prod.A,'Np237','slide 17 Am-241 alpha');
chk(decayOf(N(60,27),'beta').prod.s+decayOf(N(60,27),'beta').prod.A,'Ni60','slide 20 Co-60 beta');
chk(decayOf(N(244,94),'alpha').prod.s+decayOf(N(244,94),'alpha').prod.A,'U240','MOM Pu-244 alpha');
chk(decayOf(N(11,6),'positron').prod.s,'B','slide 26 C-11 positron');chk(decayOf(N(206,81),'beta').prod.s,'Pb','slide 26 Tl-206 beta');
{let x=N(238,92);for(let i=0;i<8;i++)x=decayOf(x,'alpha').prod;for(let i=0;i<6;i++)x=decayOf(x,'beta').prod;chk(x.s+x.A,'Pb206','MOM U-238 8α 6β')}
chk(BOMB[1].R[0][1]+','+BOMB[1].R[0][2],'55,27','slide 24 Ni-58 + p');chk(BOMB[2].R[0][2],41,'slide 25 Tc-98 + 2n');chk(BOMB[14].R[0][2],99,'slide 27 Na-23 + Th-232');
chk(Number((36/2**4).toPrecision(3)),2.25,'slide 34 Sr-90 (38.1 y, 152.4 y)');chk(64/2**5,2,'slide 35 I-123');chk(Math.log2(100/6.25)*74,296,'slide 37 Ir-192');chk(Number((0.684*2**8).toPrecision(3)),175,'slide 38 Tc-99');
chk(cpm('alpha','paper',3),30,'alpha stopped by paper');chk(cpm('alpha','none',10),30,'alpha out of range at 10 cm');n++;if(!(cpm('gamma','lead',10)>60))bad('gamma not fully stopped by lead');
n++;{const a=cpm('gamma','none',10)-30,b=cpm('gamma','none',20)-30;if(Math.abs(b/a-0.25)>0.01)bad('inverse square '+a+' '+b)}
n++;if(cpm('beta','al',10)!==30)bad('beta not stopped by aluminum');n++;if(!(cpm('neutron','water',10)<cpm('neutron','lead',10)))bad('water should beat lead for neutrons');
// 1+3) generated questions
global.document=undefined;
const seenTopics=new Set();
function checkQ(q,where){n++;if(!q.prompt||!q.hint||!q.why)bad(where+': missing prompt/hint/why '+strip(q.prompt||''));
 if(q.video&&!VIDEO_FOR[q.video])bad(where+': unknown video '+q.video);if(!q.topic||!TOPICS[q.topic])bad(where+': bad topic '+q.topic);seenTopics.add(q.topic);
 const txt=[q.prompt,q.hint,q.why,q.html||'',...(q.options||[]),...Object.values(q.whys||{})].join(' ');if(/undefined|NaN|Infinity|\[object/.test(txt))bad(where+': bad text '+strip(txt).slice(0,160));
 if(q.lab&&!(q.task&&typeof q.task.ok==='function'))bad(where+': lab question without a task');
 if(q.type==='mc'){if(!q.options.includes(q.answer))bad(where+': answer not in options '+strip(q.prompt));if(new Set(q.options).size!==q.options.length)bad(where+': duplicate options '+q.options.map(strip).join(' | '));
  if(q.options.length<3)bad(where+': only '+q.options.length+' options: '+strip(q.prompt));
  q.options.filter(o=>o!==q.answer).forEach(o=>{if(!q.whys[o])bad(where+': no reason for wrong choice '+strip(o))})}
 if(q.type==='num'){if(!(q.answer>0))bad(where+': bad answer '+q.answer);if(!q.loose){const sh=nf(q.answer,q.sf);if(NUM.sfCount(sh)!==q.sf)bad(`${where}: shown ${sh} has ${NUM.sfCount(sh)} sf`);if(Math.abs(NUM.parseValue(sh)-Number(q.answer.toPrecision(q.sf)))>q.answer*1e-9)bad(where+': shown '+sh+' != '+q.answer)}
  (q.slips||[]).forEach(([x])=>{if(Math.abs(x-q.answer)<=q.answer*0.006)bad(where+': slip equals answer '+strip(q.prompt))})}
 if(q.type==='nuc'){checkEq(q.L,q.R,where+' '+strip(q.prompt).slice(0,40));if(!q.blanks.length)bad(where+': no blanks');if(q.then)checkQ(q.then,where+'→then')}}
for(const m of MODES.filter(m=>m.id!=='quiz')){const reps=m.id==='decay'||m.id==='half'?0:4000;
 if(m.id==='decay'){for(const [sys] of DL_SYS){state.labSys=sys;for(let i=0;i<300;i++)checkQ(GEN.decay(),'decay/'+sys)}state.labSys=null}
 else if(m.id==='half'){for(const sys of [null,...HL_SYS.map(h=>h[0])]){state.labSys=sys;for(let i=0;i<500;i++)checkQ(GEN.half(),'half/'+sys)}state.labSys=null}
 else for(let i=0;i<reps;i++)checkQ(GEN[m.id](),m.id)}
for(const t of QUIZ_PLAN)for(let i=0;i<600;i++){const q=topicQ(t);q.topic=t;checkQ(q,'quiz/'+t);if(q.lab)bad('quiz question with a lab: '+t)}
IDEAS.forEach((it,i)=>{n++;if(it.c.filter(c=>c[1]).length!==1)bad('IDEAS '+i+' needs exactly one right answer');if(!TOPICS[it.t])bad('IDEAS '+i+' topic '+it.t);if(!VIDEO_FOR[it.v])bad('IDEAS '+i+' video '+it.v)});
Object.keys(TOPICS).forEach(t=>{n++;if(!seenTopics.has(t))bad('topic never generated: '+t)});
// 4) fission and fusion physics
function fisRate(fuel,rods){let tot=0;for(let s=1;s<=40;s++){const st=fisNew(fuel,rods,s*97);for(let k=0;k<3;k++){fisFire(st);for(let i=0;i<300;i++)fisStep(st,1/60)}tot+=st.fis/st.U.length}return tot/40}
const L0=fisRate('large',0),S0=fisRate('small',0),L1=fisRate('large',1);n+=3;
if(L0<0.5)bad('large fuel should sustain a chain: '+L0.toFixed(2));if(S0>0.3)bad('small fuel should fizzle: '+S0.toFixed(2));if(L1>0.05)bad('rods in should stop the chain: '+L1.toFixed(2));
{let cold=0,hot=0;for(let s=1;s<=10;s++){const a=fusNew(3,s),b=fusNew(10,s);for(let i=0;i<600;i++){fusStep(a,1/60);fusStep(b,1/60)}cold+=a.fus;hot+=b.fus}n+=2;if(cold)bad('fusion happened when cold');if(hot<10)bad('too little fusion when hot: '+hot);
 let t8=0;for(let s=1;s<=10;s++){const c=fusNew(FUSE_T,s);for(let i=0;i<600;i++)fusStep(c,1/60);t8+=c.fus}n++;if(t8<5)bad('fusion too rare at the lowest fusing temperature: '+t8);
 console.log(`fission: large ${(L0*100).toFixed(0)}%, small ${(S0*100).toFixed(0)}%, rods in ${(L1*100).toFixed(0)}% · fusion in 10 s ×10 runs: cold ${cold}, slider ${FUSE_T} → ${t8}, hot ${hot}`)}
console.log(fails?`${fails} problem(s) in ${n} checks`:`OK · ${n} checks`);process.exit(fails?1:0);
