const {chromium}=require('playwright');
const pages=['index.html','chapters/01-what-ai-can-and-cant-do.html','chapters/02-try-it-for-you.html','chapters/03-let-ai-take-your-test.html','resources/sample-assignment.html','chapters/04-a-quick-look-at-tilt.html','chapters/05-clinical-eye-and-teaching-eye.html','chapters/06-make-your-assignment-stronger.html','chapters/07-tell-your-students-where-ai-fits.html','chapters/week7-takeaway.html','chapters/08-theres-a-name-for-this.html','chapters/09-label-the-assignments-that-count.html','chapters/10-help-your-students-use-ai-well.html','chapters/11-talk-with-your-students-about-ai.html','chapters/12-try-these-with-your-group-or-class.html','resources/label-maker.html','resources/keep-learning.html','resources/session-slides.html'];
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();
await ctx.addInitScript(`Date.now=()=>${Date.parse('2026-12-02T12:00:00-05:00')};try{localStorage.clear()}catch(e){}`);
const out=[];for(const pg of pages){const p=await ctx.newPage();await p.goto('http://localhost:8765/'+pg,{waitUntil:'networkidle'});
const html=await p.evaluate(()=>{const m=document.querySelector('main');return m.innerHTML;});
const title=await p.evaluate(()=>document.title.replace(/ \| AVTE \+ AI$/,''));
out.push({page:pg,title,html});await p.close();}
require('fs').writeFileSync(process.argv[2],JSON.stringify(out));await b.close();})();
