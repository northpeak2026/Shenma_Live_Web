// A deterministic event ledger is the source of every basketball score and statistic.
export function basketballMatchData(match) {
  const seed = [...match.id].reduce((n, c) => (Math.imul(n, 31) + c.charCodeAt(0)) >>> 0, 17);
  const duration = ['NBA', 'CBA'].includes(match.league) ? 720 : 600;
  const stage = match.stage || '';
  const overtime = stage.match(/OT\s*(\d+)|加时\s*(\d+)/i);
  const period = match.status === 'upcoming' ? 0 : match.status === 'finished' ? match.completedPeriod || 4 + (seed % 6 === 0 ? 2 : seed % 3 === 0 ? 1 : 0) : overtime ? 4 + Number(overtime[1] || overtime[2] || 1) : stage.includes('加时') ? 5 : stage.includes('第四') ? 4 : stage.includes('第三') ? 3 : /第二|半场|中场/.test(stage) ? 2 : 1;
  const clock = stage.match(/(\d{1,2}):(\d{2})/);
  const remaining = match.status === 'finished' || /半场|中场/.test(stage) ? 0 : clock ? Number(clock[1]) * 60 + Number(clock[2]) : period > 4 ? 180 : 360;
  const events = [], quarters = [], rosters = ['home', 'away'].map(side => Array.from({length: 8}, (_, i) => ({name: `球员${i + 1}`, number: [23,3,15,1,28,7,2,20][i], points:0, rebounds:0, assists:0, made:0, attempted:0, three:0, two:0, free:0, freeAttempts:0})));
  let homeScore = 0, awayScore = 0;
  const push = (quarter, seconds, side, type, description, points = 0, playerIndex = 0) => {
    if (side === 'home') homeScore += points;
    if (side === 'away') awayScore += points;
    const q = quarters[quarter - 1], s = side === 'home' ? 0 : 1, player = rosters[s][playerIndex];
    if (side !== 'neutral') {
      if (points) {q.score[s] += points;player.points += points;}
      if (type.startsWith('THREE_POINT')) {player.attempted++;if(points){player.made++;player.three++;q.three[s]+=points;}}
      if (type.startsWith('TWO_POINT')) {player.attempted++;if(points){player.made++;player.two++;q.two[s]+=points;}}
      if (type.startsWith('FREE_THROW')) {q.freeAttempts[s]++;player.freeAttempts++;if(points){q.free[s]++;player.free++;}}
      if (type === 'FOUL') q.fouls[s]++;
      if (type === 'TIMEOUT') q.timeouts[s] = Math.max(0,q.timeouts[s]-1);
      if (type === 'REBOUND') player.rebounds++;
      if (points > 1) rosters[s][(playerIndex+1)%8].assists++;
    }
    events.push({id:`${match.id}-${events.length}`,quarter,clock:`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`,seconds,teamSide:side,eventType:type,description,points,isScoringEvent:points>0,scoringTeam:points?side:null,homeScore,awayScore,elapsed:(quarter<=4?(quarter-1)*duration:4*duration+(quarter-5)*300)+(quarter<=4?duration:300)-seconds});
  };
  for(let q=1;q<=period;q++) {
    const length=q<=4?duration:300,cutoff=q===period?Math.min(length,remaining):0;
    quarters.push({period:q,score:[0,0],three:[0,0],two:[0,0],free:[0,0],freeAttempts:[0,0],fouls:[0,0],timeouts:[q>4?2:3,q>4?2:3]});
    push(q,length,'neutral','QUARTER_START',q===1?'比赛开始':'小节开始');
    for(let seconds=length-18,index=0;seconds>=cutoff&&seconds>0;seconds-=18,index++) {
      const phase=Math.floor(index/7),profile=seed%4;
      const side=profile===0?(index%5===0?'away':'home'):profile===1?(index%5===0?'home':'away'):profile===2?((phase+q)%2?'home':'away'):(q<=2||index%3===0?'home':'away');
      const code=(index+seed+q)%12,player=(index+q)%8;
      const actions=[['THREE_POINT_MADE','三分命中',3],['TWO_POINT_MADE','两分投篮命中',2],['FREE_THROW_MADE','罚球命中',1],['FOUL','防守犯规',0],['TWO_POINT_MADE','突破上篮命中',2],['REBOUND','获得篮板',0],['THREE_POINT_MISSED','三分出手未中',0],['FREE_THROW_MISSED','罚球未中',0],['STEAL','抢断成功',0],['TURNOVER','出现失误',0],['SUBSTITUTION','完成换人',0],['TIMEOUT','请求暂停',0]];
      const [type,description,points]=actions[code];push(q,seconds,side,type,description,points,player);
      if(index%13===0&&seconds-1>=cutoff)push(q,seconds-1,'neutral','OFFICIAL_TIMEOUT','官方暂停');
    }
    // Overtime only follows a tied completed period; record the late equaliser in the ledger.
    if(!cutoff && q>=4 && q<period) {
      while(homeScore!==awayScore) {
        const side=homeScore<awayScore?'home':'away',points=Math.min(3,Math.abs(homeScore-awayScore));
        push(q,0,side,points===3?'THREE_POINT_MADE':points===2?'TWO_POINT_MADE':'FREE_THROW_MADE','终场前追平比分',points,0);
      }
    }
    if(!cutoff)push(q,0,'neutral','QUARTER_END',q===period&&match.status==='finished'?'全场比赛结束':'小节结束');
  }
  const sum=key=>[0,1].map(side=>quarters.reduce((n,q)=>n+q[key][side],0));
  const free=sum('free'),attempts=sum('freeAttempts');
  const statistics={threePointersMade:sum('three').map(n=>n/3),twoPointersMade:sum('two').map(n=>n/2),freeThrowsMade:free,timeoutsRemaining:quarters.at(-1)?.timeouts||[0,0],fouls:sum('fouls'),freeThrowPercentage:free.map((n,i)=>attempts[i]?Math.round(n/attempts[i]*100):0),totalTimeouts:[7,7]};
  return {period,duration,events,quarters,rosters,statistics,homeScore,awayScore,score:period?`${homeScore} : ${awayScore}`:'',current:quarters.at(-1)};
}

const periodName=(q,count)=>q<=4?`第${['一','二','三','四'][q-1]}节`:`加时${q-4}`;
export function basketballSituationMarkup(match, data, selected, logo, {compact=false}={}) {
  const empty=text=>`<div class="detail-empty"><span>◌</span>${text}</div>`;
  const count=Math.max(4,data.period),columns=Array.from({length:count},(_,i)=>i+1);
  const table=compact?`<div class="basket-period-compact"><div class="basket-period-heading"><span>小节</span><span>主队</span><span>客队</span></div>${columns.map(q=>`<div class="${q===data.period?'current':''}"><span>${periodName(q,count)}</span><b>${data.quarters[q-1]?.score[0]??'-'}</b><b>${data.quarters[q-1]?.score[1]??'-'}</b></div>`).join('')}<div><span>总分</span><b>${data.homeScore}</b><b>${data.awayScore}</b></div></div>`:`<div class="basket-period-scroll"><table class="basket-period-table"><thead><tr><th>球队</th>${columns.map(q=>`<th>${periodName(q,count)}</th>`).join('')}<th>总分</th></tr></thead><tbody>${['home','away'].map((side,i)=>`<tr><th>${logo(match[side],match.color)}<span>${match[side]}</span></th>${columns.map(q=>`<td class="${q===data.period&&match.status==='live'?'current':''}">${data.quarters[q-1]?.score[i]??'-'}</td>`).join('')}<td>${data.period?(i?data.awayScore:data.homeScore):'-'}</td></tr>`).join('')}</tbody></table></div>`;
  let chart=empty('暂无分差走势数据');
  if(data.events.length){
    const end=4*data.duration+Math.max(0,data.period-4)*300,max=Math.max(5,Math.ceil(Math.max(...data.events.map(e=>Math.abs(e.homeScore-e.awayScore)))/5)*5),x=t=>42+t/end*716,y=d=>102-d/max*66;
    let path='';data.events.forEach((e,i)=>{const px=x(e.elapsed),py=y(e.homeScore-e.awayScore);if(!i)path=`M ${px} ${py}`;else{const prev=data.events[i-1],mid=(x(prev.elapsed)+px)/2;path+=` C ${mid} ${y(prev.homeScore-prev.awayScore)} ${mid} ${py} ${px} ${py}`;}});
    chart=`<svg class="basket-difference-chart" viewBox="${compact?'-30 -16 850 228':'0 0 800 196'}" role="img" aria-label="分差走势图：主队领先为正，客队领先为负">${[-max,0,max].map(d=>`<text x="30" y="${y(d)+4}" text-anchor="end">${d>0?'+':''}${d}</text><line class="${d===0?'zero':''}" x1="42" x2="758" y1="${y(d)}" y2="${y(d)}"/>`).join('')}${columns.map(q=>{const start=q<=4?(q-1)*data.duration:4*data.duration+(q-5)*300,length=q<=4?data.duration:300;return `<text x="${x(start+length/2)}" y="16" text-anchor="middle">${periodName(q,count)}</text><line x1="${x(start)}" x2="${x(start)}" y1="28" y2="178"/>`}).join('')}<path d="${path}" fill="none" stroke="#d96b62" stroke-width="2"/></svg>`;
  }
  const q=data.current,rate=side=>q.freeAttempts[side]?Math.round(q.free[side]/q.freeAttempts[side]*100):0;
  const currentRows=q?[['three','3 分球得分'],['two','2 分球得分'],['free','罚球得分'],['rate','罚球命中率']].map(([key,label])=>{const home=key==='rate'?rate(0):q[key][0],away=key==='rate'?rate(1):q[key][1],max=key==='rate'?100:Math.max(home,away,1);return `<article class="detail-stat-row"><div><b class="home ${home>away?'lead':''}">${home}${key==='rate'?'%':''}</b><span>${label}</span><b class="away ${away>home?'lead':''}">${away}${key==='rate'?'%':''}</b></div><p><i class="home" style="width:${home/max*50}%"></i><i class="away" style="width:${away/max*50}%"></i></p></article>`}).join(''):'';
  const current=q?`<div class="basket-current-grid"><aside class="basket-current-team home"><div class="basket-current-team-heading">${logo(match.home,match.color)}<b title="${match.home}">${match.home}</b></div><div class="basket-current-aux"><div><span>本节犯规</span><strong>${q.fouls[0]}</strong></div><div><span>剩余暂停</span><strong>${q.timeouts[0]}</strong></div></div></aside><div class="basket-current-core">${currentRows}</div><aside class="basket-current-team away"><div class="basket-current-team-heading">${logo(match.away,match.color)}<b title="${match.away}">${match.away}</b></div><div class="basket-current-aux"><div><span>本节犯规</span><strong>${q.fouls[1]}</strong></div><div><span>剩余暂停</span><strong>${q.timeouts[1]}</strong></div></div></aside></div>`:empty('比赛尚未开始，暂无本节数据');
  const sideLabel={home:'主队',away:'客队',neutral:'中立'},visible=data.events.filter(e=>e.quarter===selected).sort((a,b)=>a.seconds-b.seconds);
  const text=data.period?`<nav class="basketball-period-tabs">${data.quarters.map(q=>`<button class="${q.period===selected?'selected':''}" data-match-timeline-period="${q.period}">${q.period<=4?`第${['一','二','三','四'][q.period-1]}节`:periodName(q.period,count)}</button>`).join('')}</nav><div class="basketball-live-list">${visible.map(e=>`<article class="basketball-live-row ${e.teamSide} ${e.isScoringEvent?'scoring':'non-scoring'}"><time>${e.clock}</time><b class="basketball-event-score"><span class="${e.scoringTeam==='home'?'scored':''}">${e.homeScore}</span><i>:</i><span class="${e.scoringTeam==='away'?'scored':''}">${e.awayScore}</span></b><em class="event-side-tag">${sideLabel[e.teamSide]}</em><span class="basketball-event-copy">${e.description}</span></article>`).join('')}</div>`:empty('比赛尚未开始，暂无文字直播数据');
  return `<section class="basketball-situation"><section class="basket-situation-module"><h3>分差走势图</h3>${chart}</section><section class="basket-situation-module"><h3>小节数据</h3>${table}</section><section class="basket-situation-module"><h3>本节数据${q?` · ${periodName(q.period,count)}`:''}</h3>${current}</section><section class="basketball-text-live"><h3>文字直播</h3>${text}</section></section>`;
}
