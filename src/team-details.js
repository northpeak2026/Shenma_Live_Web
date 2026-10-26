// Team identity is scoped by sport; standings remain the single source of metrics.
export function buildTeams(standings, nameOf) {
  const teams=[];
  const add=(sport,league,conference,rows)=>rows.forEach((row,index)=>teams.push({id:`${sport}-${row[1]}`,sport,league,conference,row,rank:index+1,name:nameOf(row[0],row[1]),code:row[1]}));
  Object.entries(standings.football).filter(([league])=>league!=='欧冠').forEach(([league,rows])=>add('football',league,'',rows));
  // Multiple competitions share one team identity and fixture pool.
  teams.forEach(team=>{team.rankings=Object.fromEntries(Object.entries(standings.football).flatMap(([league,rows])=>{const rank=rows.findIndex(row=>row[1]===team.code);return rank<0?[]:[[league,{row:rows[rank],rank:rank+1}]]}));});
  Object.entries(standings.basketball).forEach(([league,groups])=>Object.entries(groups).forEach(([conference,rows])=>add('basketball',league,conference,rows)));
  return teams;
}
const aliases={MCI:['曼城'],MUN:['曼联'],TOT:['热刺'],BOS:['凯尔特人'],NYK:['尼克斯'],CLE:['骑士'],ORL:['魔术'],IND:['步行者'],PHI:['76人'],MIA:['热火'],CHI:['公牛'],ATL:['老鹰'],DEN:['掘金'],MIN:['森林狼'],OKC:['雷霆'],LAC:['快船'],LAL:['湖人'],PHX:['太阳'],NOP:['鹈鹕'],SAC:['国王'],GSW:['勇士'],HOU:['火箭'],MIL:['雄鹿'],GUS:['浙江广厦'],SVW:['不来梅']};
export function teamEvents(team,events) {
  const names=new Set([team.name,...(aliases[team.code]||[])]);
  return [...new Map(events.filter(e=>(e.sport==='nba'?'basketball':e.sport)===team.sport&&(e.homeTeamId===team.id||e.awayTeamId===team.id||names.has(e.home)||names.has(e.away))).map(e=>[e.id,e])).values()].sort((a,b)=>`${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`)||a.id.localeCompare(b.id));
}
export function extendTeamEvents(teams,events,make,followed) {
  teams.forEach((team,index)=>{
    const peers=teams.filter(t=>t.sport===team.sport&&t.league===team.league&&t.id!==team.id);
    // Cup participation is explicitly assigned; tabs are derived only from actual fixtures.
    const cup=team.sport==='football'&&team.rank<=4;
    for(let i=0;i<15;i++) {
      const opponent=peers[(index+i)%peers.length],status=i===5?'live':i<5?'upcoming':'finished';
      const league=cup&&i%3===0?'欧冠':cup&&i%3===1?({'英超':'足总杯','西甲':'国王杯','意甲':'意大利杯','德甲':'德国杯','法甲':'法国杯'}[team.league]):team.league;
      const home=i%2?opponent:team,away=i%2?team:opponent,id=`team-game-${team.id}-${i}`;
      events.push(make(id,status,team.sport,league,5-i,i%2?'19:35':'21:00',home.name,away.name,status==='upcoming'?'':team.sport==='football'?`${i%4} : ${(i+1)%3}`:`${88+i} : ${82+i}`,status==='live'?(team.sport==='football'?"下半场 67'":'第三节 07:06'):'',{homeTeamId:home.id,awayTeamId:away.id,hosts:[],color:'#ff5a43'}));
      if(i===6)followed.add(id);
    }
  });
}
export function createTeamDetail({teams,events,header,footer,mark,logo,score,followed}) {
  let activeId='',league='全部',page=1;
  function render(id) {
    const source=teams.find(t=>t.id===id)||teams.find(t=>t.code===id);
    const selectedLeague=new URLSearchParams(location.hash.split('?')[1]||'').get('league');
    const ranking=source?.rankings?.[selectedLeague];
    const team=ranking?{...source,...ranking,league:selectedLeague}:source;
    if(!team)return `${header()}<main class="team-detail"><div class="team-empty">球队不存在，请返回球队排行选择球队。<p><a href="#/data">返回球队排行</a></p></div></main>${footer()}`;
    if(activeId!==team.id){activeId=team.id;league='全部';page=1;}
    const all=teamEvents(team,events),leagues=['全部',...new Set(all.map(e=>e.league))];
    if(!leagues.includes(league)){league='全部';page=1;}
    const filtered=all.filter(e=>league==='全部'||e.league===league),pages=Math.max(1,Math.ceil(filtered.length/12));page=Math.min(page,pages);
    const r=team.row,football=team.sport==='football';
    const metrics=football?[[`第 ${team.rank} 名`,'联赛排名'],[`${r[3]}胜 ${r[4]}平 ${r[5]}负`,'联赛战绩'],[r[7],'积分']]:[[`${team.league==='NBA'?(team.conference==='east'?'东部':'西部'):''}第 ${team.rank} 名`,'联赛排名'],[`${r[2]}胜 ${r[3]}负`,'常规赛战绩'],[`${(parseFloat(r[4])*100).toFixed(1)}%`,'胜率'],[r[6],'近况']];
    const row=e=>{const current=side=>e[side+'TeamId']===team.id||[team.name,...(aliases[team.code]||[])].includes(e[side]);const saved=followed.has(e.id);return `<article class="team-event" data-team-status="${e.status}"><a href="#/match/${e.id}" class="team-event-link"><div class="team-event-date"><time>${e.date} <b>${e.time}</b></time><span>${e.league}</span></div><div class="team-event-game"><div class="team-event-side home ${current('home')?'current':''}"><b title="${e.home}">${e.home}</b>${current('home')?mark(team.row[0],team.code):logo(e.home,e.color)}</div><div class="team-event-score"><strong>${e.status==='upcoming'?'VS':score(e)}</strong><span class="${e.status}">${e.status==='upcoming'?'未开赛':e.status==='finished'?'已结束':`进行中 · ${e.stage}`}</span></div><div class="team-event-side away ${current('away')?'current':''}">${current('away')?mark(team.row[0],team.code):logo(e.away,e.color)}<b title="${e.away}">${e.away}</b></div></div></a><button class="match-star ${saved?'saved':''}" data-match-follow="${e.id}" aria-pressed="${saved}" aria-label="${saved?'取消收藏':'收藏赛事'}">${saved?'★':'☆'}</button></article>`};
    return `${header()}<main class="team-detail"><section class="team-summary"><div class="team-identity">${mark(r[0],team.code)}<div><span>${football?'足球':'篮球'} · ${team.league}${team.league==='NBA'?` · ${team.conference==='east'?'东部':'西部'}`:''}</span><h1>${team.name}</h1></div></div><div class="team-metrics">${metrics.map(([value,label])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('')}</div></section><section class="team-fixtures"><div class="team-fixtures-heading"><h2>球队赛事</h2><span>共 ${filtered.length} 场赛事</span></div><nav class="team-leagues" role="tablist" aria-label="赛事分类">${leagues.map(l=>`<button role="tab" aria-selected="${l===league}" class="${l===league?'selected':''}" data-team-league="${l}">${l}</button>`).join('')}</nav>${filtered.length?filtered.slice((page-1)*12,page*12).map(row).join(''):'<div class="team-empty">暂无赛事，敬请关注球队后续赛程。</div>'}${pages>1?`<nav class="team-pagination" aria-label="赛事分页"><button data-team-page="${page-1}" ${page===1?'disabled':''}>上一页</button><span>第 ${page} / ${pages} 页</span><button data-team-page="${page+1}" ${page===pages?'disabled':''}>下一页</button></nav>`:''}</section></main>${footer()}`;
  }
  function bind(update){document.querySelectorAll('[data-team-league]').forEach(b=>b.onclick=()=>{league=b.dataset.teamLeague;page=1;update()});document.querySelectorAll('[data-team-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.teamPage);update();document.querySelector('.team-fixtures')?.scrollIntoView({block:'start'})});}
  return {render,bind};
}
