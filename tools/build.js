/* node tools/build.js → ../index.html (page-src.html + engine-src.js) */
const fs=require('fs'),p=require('path');
const page=fs.readFileSync(p.join(__dirname,'page-src.html'),'utf8'),eng=fs.readFileSync(p.join(__dirname,'engine-src.js'),'utf8');
if(!page.includes('/*@ENGINE@*/'))throw 'no engine slot';
const out=p.join(__dirname,'..',process.argv[2]||'index.html');fs.writeFileSync(out,page.replace('/*@ENGINE@*/',()=>eng));console.log('wrote',out);
