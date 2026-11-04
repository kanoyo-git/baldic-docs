import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ignored=new Set(['node_modules','_site','.git','.github','scripts']);
function files(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>ignored.has(entry.name)?[]:entry.isDirectory()?files(path.join(folder,entry.name)):[path.join(folder,entry.name)]);}
const markdown=files(root).filter(file=>file.endsWith('.md'));
const errors=[];
const links=text=>[...text.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(match=>match[1]);
const summary=links(fs.readFileSync(path.join(root,'SUMMARY.md'),'utf8')).map(link=>decodeURIComponent(link.split('#')[0]));
if(new Set(summary).size!==summary.length)errors.push('SUMMARY contains a duplicate page');
for(const item of summary)if(!fs.existsSync(path.resolve(root,item)))errors.push('SUMMARY missing '+item);
for(const file of markdown){
 const relative=path.relative(root,file);let text=fs.readFileSync(file,'utf8');
 if((text.match(/^```/gm)||[]).length%2)errors.push(relative+': unbalanced fences');
 if(!/^#\s+\S/m.test(text))errors.push(relative+': missing title');
 if(!['SUMMARY.md','THIRD_PARTY_NOTICES.md'].includes(relative)&&!summary.includes(relative.split(path.sep).join('/')))errors.push(relative+': absent from SUMMARY');
 if(/\/home\/kanoyo|\.codex\/worktrees|file:\/\//.test(text))errors.push(relative+': private machine path');
 text=text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm,'');
 for(const link of links(text)){
  if(/^(?:https?:|mailto:|#)/.test(link))continue;
  const target=path.resolve(path.dirname(file),decodeURIComponent(link.split('#')[0]));
  if(target!==root&&!target.startsWith(root+path.sep))errors.push(relative+': leaves book root: '+link);
  else if(!fs.existsSync(target))errors.push(relative+': broken link '+link);
 }
}
const coverage=JSON.parse(fs.readFileSync(path.join(root,'reference/coverage.json'),'utf8'));
if(coverage.length!==28)errors.push('Expected 28 reference pages');
if(coverage.filter(item=>item.page.startsWith('reference/bbplus/')).length!==15)errors.push('Missing BB+ module reference');
if(coverage.filter(item=>item.page.startsWith('reference/bbcr/')).length!==8)errors.push('Missing BBCR module reference');
for(const entry of coverage)if(!fs.existsSync(path.join(root,entry.page)))errors.push('Missing reference '+entry.page);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('BALDIC_BOOK_CHECK_COMPLETE pages='+summary.length+' referenceTypes='+coverage.reduce((sum,item)=>sum+item.types,0)+' members='+coverage.reduce((sum,item)=>sum+item.members,0));
