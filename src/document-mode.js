import './document-mode.css';

// Escape source HTML: this reader deliberately supports maintainable Markdown only.
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline = value => escape(value).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
export function renderMarkdown(source) {
  const lines=source.replace(/\r/g,'').split('\n'), output=[], headings=[];
  const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim());
  let i=0;
  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue;}
    const heading=line.match(/^(#{1,6})\s+(.+)$/);
    if(heading){const level=heading[1].length,id=`requirement-${headings.length}`;headings.push({level,id,text:heading[2]});output.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);i++;continue;}
    if(line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i+1]||'')){
      const header=cells(line);i+=2;const rows=[];
      while(i<lines.length&&lines[i].includes('|'))rows.push(cells(lines[i++]));
      output.push(`<div class="requirements-table"><table><thead><tr>${header.map(c=>`<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${header.map((_,n)=>`<td>${inline(row[n]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
    }
    if(/^>/.test(line)){const quote=[];while(i<lines.length&&/^>/.test(lines[i]))quote.push(lines[i++].replace(/^>\s?/,''));output.push(`<blockquote>${quote.map(text=>text?`<p>${inline(text)}</p>`:'').join('')}</blockquote>`);continue;}
    if(/^\s*(?:- |\d+\. )/.test(line)){
      const ordered=/^\s*\d+\./.test(line),tag=ordered?'ol':'ul',items=[];
      const pattern=ordered?/^\s*\d+\.\s+/:/^\s*-\s+/;
      while(i<lines.length&&pattern.test(lines[i]))items.push(`<li>${inline(lines[i++].replace(pattern,''))}</li>`);
      output.push(`<${tag}>${items.join('')}</${tag}>`);continue;
    }
    const paragraph=[];
    while(i<lines.length&&lines[i].trim()&&!/^(#{1,6}\s|>|\s*- |\s*\d+\. )/.test(lines[i])){paragraph.push(lines[i++]);if(lines[i]?.includes('|'))break;}
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return {html:output.join('\n'),headings};
}

const key='shenma-display-mode';
let mode='prototype',prototypeScroll=0,documentScroll=0,loaded=false,controller;
try{if(localStorage.getItem(key)==='document')mode='document';}catch{}
const workspace=document.createElement('section');
workspace.id='requirements-workspace';workspace.setAttribute('aria-label','有料需求文档工作区');workspace.hidden=true;
workspace.innerHTML=`<header class="requirements-header"><strong>神马直播 <span>需求文档</span></strong></header><div class="requirements-layout"><aside><div class="requirements-module">文档目录 <b>神马直播需求文档</b></div><nav aria-label="章节目录"></nav></aside><main class="requirements-main"><article class="requirements-article"></article></main></div>`;
document.body.append(workspace);
const switcher=document.createElement('div');switcher.className='display-mode-switcher';
switcher.innerHTML=`<div class="display-mode-panel" id="display-mode-panel" role="group" aria-label="选择展示模式" hidden><button type="button" data-mode="prototype">原型模式 <span>✓</span></button><button type="button" data-mode="document">文档模式 <span>✓</span></button></div><button class="display-mode-trigger" type="button" aria-expanded="false" aria-controls="display-mode-panel" title="切换原型模式 / 文档模式"></button>`;
document.body.append(switcher);
const trigger=switcher.querySelector('.display-mode-trigger'),panel=switcher.querySelector('.display-mode-panel');
function close(){panel.hidden=true;trigger.setAttribute('aria-expanded','false');}
trigger.onclick=()=>{panel.hidden=!panel.hidden;trigger.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)panel.querySelector(`[data-mode="${mode}"]`).focus();};
switcher.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{setMode(button.dataset.mode);close();trigger.focus();});
document.addEventListener('click',event=>{if(!switcher.contains(event.target))close();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){close();trigger.focus();}});
function updateReading(){
  const headings=[...workspace.querySelectorAll('article h2,article h3')];
  const current=headings.filter(h=>h.getBoundingClientRect().top<=150).at(-1)||headings[0];
  workspace.querySelectorAll('[data-section]').forEach(button=>{const active=button.dataset.section===current?.id;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');});
}
workspace.addEventListener('scroll',updateReading,{passive:true});
async function load(){
  controller?.abort();controller=new AbortController();
  const article=workspace.querySelector('article'),nav=workspace.querySelector('nav');
  article.setAttribute('aria-busy','true');article.innerHTML='<p role="status">正在读取需求文档…</p>';nav.innerHTML='';
  try{
    const response=await fetch(`${import.meta.env.BASE_URL}docs/${encodeURIComponent('神马直播需求.md')}`,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const source=await response.text();if(!source.trim()||/^\s*<!doctype html/i.test(source))throw new Error('文档内容无效');
    const result=renderMarkdown(source);article.innerHTML=result.html;
    nav.innerHTML=result.headings.filter(h=>h.level===2||h.level===3).map(h=>`<button type="button" class="level-${h.level}" data-section="${h.id}">${inline(h.text)}</button>`).join('');
    nav.querySelectorAll('button').forEach(button=>button.onclick=()=>{const heading=document.getElementById(button.dataset.section);workspace.scrollTo({top:heading.getBoundingClientRect().top-workspace.getBoundingClientRect().top+workspace.scrollTop-100,behavior:'smooth'});heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});});
    loaded=true;updateReading();
  }catch(error){if(error.name==='AbortError')return;loaded=false;article.innerHTML='<div class="requirements-error" role="alert"><h2>需求文档读取失败</h2><p>请检查网络或确认文档文件存在，然后重新读取。</p><button type="button" data-retry>重试</button></div>';article.querySelector('[data-retry]').onclick=load;}
  finally{article.setAttribute('aria-busy','false');}
}
function setMode(next){
  const app=document.getElementById('app');
  if(next==='document'&&mode!=='document')prototypeScroll=window.scrollY;
  if(next==='prototype'&&mode==='document')documentScroll=workspace.scrollTop;
  mode=next;const isDocument=mode==='document';
  app.hidden=isDocument;app.inert=isDocument;workspace.hidden=!isDocument;
  document.body.classList.toggle('document-mode',isDocument);
  trigger.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 4v16M14 9h3M14 13h3"/></svg>';
  const label=`当前为${isDocument?'文档':'原型'}模式，切换展示模式`;
  trigger.setAttribute('aria-label',label);
  trigger.title=label;
  mountSwitcher();
  switcher.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
  try{localStorage.setItem(key,mode);}catch{}
  if(isDocument){workspace.scrollTop=documentScroll;if(!loaded)load();}else window.scrollTo({top:prototypeScroll,behavior:'instant'});
}
function mountSwitcher(){
  const target=mode==='document'?workspace.querySelector('.requirements-header'):document.querySelector('.site-header .header-actions');
  if(target&&switcher.parentElement!==target)target.append(switcher);
  else if(!target&&switcher.parentElement!==document.body)document.body.append(switcher);
  switcher.classList.toggle('display-mode-fallback',!target);
}
// Prototype renders replace the header; reattach the same control and event handlers.
new MutationObserver(mountSwitcher).observe(document.getElementById('app'),{childList:true,subtree:true});
setMode(mode);
