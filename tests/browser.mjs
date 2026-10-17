// npm install --no-save playwright && npx playwright install chromium
// node tests/browser.mjs  (starts a loopback-only server and stops it on exit)
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'.qa');await fs.mkdir(out,{recursive:true});
const server=spawn(process.env.PYTHON || 'python3',['-m','http.server','18794','--bind','127.0.0.1','--directory',path.join(root,'dist')],{stdio:'ignore'});
const base='http://127.0.0.1:18794';
let browser;const errors=[], rows=[], externalFailures=[];
try {
 for(let n=0;n<40;n++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>externalFailures.push({url:r.url(),reason:r.failure()?.errorText}));
 assert.equal((await page.goto(base)).status(),200);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.slide-item').count(),12);
 const current=()=>page.locator('.slide-item.active').getAttribute('id');
 await page.keyboard.press('End');assert.equal(await current(),'slide-12');assert(await page.locator('#nextBtn').isDisabled());
 await page.keyboard.press('Home');assert.equal(await current(),'slide-1');assert(await page.locator('#prevBtn').isDisabled());
 for(let n=2;n<=12;n++){await page.keyboard.press('ArrowRight');assert.equal(await current(),`slide-${n}`);}
 for(let n=11;n>=1;n--){await page.keyboard.press('ArrowLeft');assert.equal(await current(),`slide-${n}`);}
 await page.keyboard.press('Space');assert.equal(await current(),'slide-2');
 await page.keyboard.press('PageDown');assert.equal(await current(),'slide-3');
 await page.keyboard.press('PageUp');assert.equal(await current(),'slide-2');
 await page.locator('#nextBtn').click();assert.equal(await current(),'slide-3');
 await page.locator('#prevBtn').click();assert.equal(await current(),'slide-2');
 await page.locator('#mapJumpBtn').click();assert.equal(await current(),'slide-3');
 await page.goto(base+'/#8');assert.equal(await current(),'slide-8');
 await page.evaluate(()=>location.hash='#6');await page.waitForFunction(()=>document.querySelector('.active').id==='slide-6');
 await page.locator('#themeToggleBtn').focus();await page.keyboard.press('Space');assert.equal(await current(),'slide-6');assert.equal(await page.locator('#slideCanvas').getAttribute('data-theme'),'dark');
 await page.locator('#themeToggleBtn').click();assert.equal(await page.locator('#slideCanvas').getAttribute('data-theme'),null);
 // Fullscreen uses a real trusted click and checks the browser state, including all slides.
 await page.locator('#fullScreenBtn').click();await page.waitForFunction(()=>document.fullscreenElement===document.documentElement);
 assert(await page.locator('#mapJumpBtn').isVisible());await page.locator('#nextBtn').evaluate(e=>e.blur());
 for(let n=1;n<=12;n++){await page.evaluate(n=>updateSlide(n-1),n);assert.equal(await current(),`slide-${n}`);assert(await page.locator('#fullScreenBtn').isVisible());}
 await page.waitForTimeout(350); // Capture after the slide fade and progress transition settle.
 await page.screenshot({path:path.join(out,'fullscreen.png'),fullPage:true});
 await page.locator('#fullScreenBtn').click();await page.waitForFunction(()=>!document.fullscreenElement);
 for(const width of [1440,1280,390,320]){
  await page.setViewportSize({width,height:900});
  for(const dark of [false,true]){
   const actual=await page.locator('#slideCanvas').getAttribute('data-theme');if((actual==='dark')!==dark)await page.locator('#themeToggleBtn').click();
   for(let n=1;n<=12;n++){
    await page.evaluate(n=>updateSlide(n-1),n);await page.waitForTimeout(330);
    const metrics=await page.evaluate(()=>{
     const canvas=document.querySelector('#slideCanvas').getBoundingClientRect();const s=document.querySelector('.slide-item.active');const footer=s.querySelector('footer').getBoundingClientRect();
     const progress=document.querySelector('.progress-wrap').getBoundingClientRect(),bar=document.querySelector('.progress-bar').getBoundingClientRect();
     const escaped=[...s.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>canvas.right+1||b.left<canvas.left-1||b.bottom>canvas.bottom+1)}).map(e=>e.className).slice(0,5);
     const controls=[...document.querySelectorAll('.deck-controls button')].map(e=>{const b=e.getBoundingClientRect();return b.left>=0&&b.right<=innerWidth+1&&b.height<60});
     return {horizontal:document.documentElement.scrollWidth>innerWidth,escaped,footerVisible:footer.bottom<=canvas.bottom,progressWidth:progress.width,ratio:bar.width/progress.width,controls:controls.every(Boolean)};
    });
    rows.push({width,dark,n,...metrics});
    assert(!metrics.horizontal,JSON.stringify(rows.at(-1)));assert.deepEqual(metrics.escaped,[],JSON.stringify(rows.at(-1)));assert(metrics.footerVisible);assert(metrics.controls,JSON.stringify(rows.at(-1)));assert(metrics.progressWidth>=50);assert(Math.abs(metrics.ratio-n/12)<0.015);
    if(width===1280&&!dark || width===320&&[2,3,6,8,12].includes(n) || width===390&&dark&&[1,9].includes(n))await page.screenshot({path:path.join(out,`slide-${width}-${dark?'dark':'light'}-${n}.png`),fullPage:true});
   }
  }
 }
 for(const asset of ['favicon.svg','404.html'])assert.equal((await fetch(base+'/'+asset)).status,200);
 assert.equal((await fetch(base+'/missing')).status,404);
 for(const p of ['/.git/config','/README.md','/tests/browser.mjs','/.qa/baseline.json'])assert.equal((await fetch(base+p)).status,404);
 assert.equal(await page.locator('a[href="desk-and-mesh-v3.html"]').count(),0);
 assert.deepEqual(errors,[]);
 const report={timestamp:new Date().toISOString(),browser:await browser.version(),status:'passed',layoutCases:rows.length,controls:'keyboard, buttons, hash, map, theme, actual fullscreen',rows,errors,externalFailures,scope:'Chromium localhost HTTP. Cloudflare deployment and other browser engines not tested.'};
 await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,rows:undefined},null,2));
}finally{await browser?.close();server.kill('SIGTERM');}
