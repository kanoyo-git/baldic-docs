import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve('_site');
const origin='https://example.test/baldic-docs/';
const errors=[];
function files(folder){return fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(folder,entry.name)):[path.join(folder,entry.name)]);}
const all=files(root);
const pages=all.filter(file=>file.endsWith('.html'));
const html=new Map(pages.map(file=>[file,fs.readFileSync(file,'utf8')]));
const ids=new Map([...html].map(([file,text])=>[file,new Set([...text.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]))]));
function checkLink(file,link){
 if(/^(?:https?:|mailto:|data:|javascript:|\/\/)/.test(link))return;
 const relative=path.relative(root,file).split(path.sep).join('/');
 const url=new URL(link.replaceAll('&amp;','&'),origin+relative);
 if(!url.pathname.startsWith('/baldic-docs/')){errors.push(relative+': link leaves project prefix: '+link);return;}
 let target=path.join(root,decodeURIComponent(url.pathname.slice('/baldic-docs/'.length)));
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 if(!fs.existsSync(target)){errors.push(relative+': missing '+link);return;}
 if(url.hash&&ids.has(target)&&!ids.get(target).has(decodeURIComponent(url.hash.slice(1))))errors.push(relative+': missing anchor '+link);
}
const summary=fs.readFileSync('SUMMARY.md','utf8');
const expected=[...summary.matchAll(/\[[^\]]+\]\([^)]+\)/g)].length;
if(pages.length!==expected)errors.push('Page count differs from SUMMARY');
for(const [file,text] of html){
 if(!text.includes('<html lang="ru"')||!text.includes('Baldic — руководство разработчика</title>'))errors.push(path.relative(root,file)+': book configuration was not loaded');
 if(!text.includes('placeholder="Подготовка поиска…" disabled')||!text.includes('Ничего не найдено'))errors.push(path.relative(root,file)+': missing Russian search readiness interface');
 if(!text.includes('href="/baldic-docs/assets/baldic-logo.png"'))errors.push(path.relative(root,file)+': missing project-root site icon');
 for(const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g))checkLink(file,match[1]);
}
for(const file of all.filter(file=>file.endsWith('.css'))){
 for(const match of fs.readFileSync(file,'utf8').matchAll(/url\(['"]?([^'"\s)]+)['"]?\)/g))checkLink(file,match[1]);
}
for(const name of ['book.json','package.json','node_modules','scripts','.git','.github','.gitbook.yaml','_layouts','_i18n'])if(fs.existsSync(path.join(root,name)))errors.push('Build exposes '+name);
if(all.some(file=>/\.(?:dll|exe|baldic|pdb)$/i.test(file)))errors.push('Build contains a binary release file');
const index=JSON.parse(fs.readFileSync(path.join(root,'search_index.json'),'utf8'));
if(Object.keys(index.store).length!==expected)errors.push('Search index omits pages');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('BALDIC_SITE_CHECK_COMPLETE pages='+pages.length+' indexed='+Object.keys(index.store).length+' links=valid');
