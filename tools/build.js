/* node tools/build.js → ../index.html (page-src.html + engine-src.js) */
const fs=require('fs'),p=require('path');
const page=fs.readFileSync(p.join(__dirname,'page-src.html'),'utf8'),eng=fs.readFileSync(p.join(__dirname,'engine-src.js'),'utf8');
if(!page.includes('/*@ENGINE@*/'))throw 'no engine slot';
const out=p.join(__dirname,'..',process.argv[2]||'index.html');fs.writeFileSync(out,page.replace('/*@ENGINE@*/',()=>eng));console.log('wrote',out);

/* class report: tools/report-src.html + topic and slip names from the built game → ../report.html */
{const html=fs.readFileSync(out,'utf8'),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 global.window={};global.matchMedia=()=>({matches:false});
 const G=(0,eval)(scripts.slice(0,2).join('\n;\n').replace('const GEN={','var GEN={')+';({TOPICS,SLIPS,EXAM_PLAN,QUIZ_PLAN})');
 const T={},L={};for(const [k,v] of Object.entries(G.TOPICS))T[k]=[v[0],v[1]];for(const [k,v] of Object.entries(G.SLIPS))L[k]=v[0];
 const src=fs.readFileSync(p.join(__dirname,'report-src.html'),'utf8');if(!src.includes('/*@MAPS@*/'))throw 'no maps slot';
 const rep=p.join(__dirname,'..','report.html');fs.writeFileSync(rep,src.replace('/*@MAPS@*/',()=>JSON.stringify({topics:T,slips:L,examN:G.EXAM_PLAN.length,practiceN:G.QUIZ_PLAN.length})));console.log('wrote',rep)}
