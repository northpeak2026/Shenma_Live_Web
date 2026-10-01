import assert from 'node:assert/strict';
import {basketballMatchData,basketballSituationMarkup} from '../src/basketball-situation.js';
let checked=0;
for(const league of ['NBA','CBA','EuroLeague'])for(let i=0;i<24;i++)for(const stage of ['第一节 08:21','第二节 04:12','半场','第三节 07:06','第四节 02:31','加时 03:12','OT2 01:48']) {
 const fixture={id:`test-${i}`,sport:'basketball',league,home:'主队',away:'客队',status:'live',stage};
 const data=basketballMatchData(fixture);
 assert.equal(data.homeScore,data.quarters.reduce((n,q)=>n+q.score[0],0));
 assert.equal(data.awayScore,data.quarters.reduce((n,q)=>n+q.score[1],0));
 for(let side=0;side<2;side++) {
  assert.equal(data.rosters[side].reduce((n,p)=>n+p.points,0),side?data.awayScore:data.homeScore);
  for(const q of data.quarters)assert.equal(q.score[side],q.three[side]+q.two[side]+q.free[side]);
 }
 let home=0,away=0;
 for(const event of data.events){
  if(event.scoringTeam==='home')home+=event.points;
  if(event.scoringTeam==='away')away+=event.points;
  assert.equal(event.homeScore,home);assert.equal(event.awayScore,away);
 }
 assert(data.events.filter(e=>e.quarter===data.period).every(e=>e.seconds>=Number(stage.match(/(\d+):/)?.[1]||0)*60+Number(stage.match(/:(\d+)/)?.[1]||0)));
 const html=basketballSituationMarkup(fixture,data,data.period,()=>'<span>Logo</span>');
 assert(html.includes('分差走势图'));assert(!html.includes('暂无小节数据'));assert(html.includes('罚球命中率'));
 assert.equal((html.match(/<path /g)||[]).length,1);
 checked++;
}
for(const status of ['upcoming','finished']) {
 const fixture={id:'boundary',league:'NBA',home:'主队',away:'客队',status};
 const data=basketballMatchData(fixture),html=basketballSituationMarkup(fixture,data,data.period,()=>'<span>Logo</span>');
 if(status==='upcoming'){assert.equal(data.events.length,0);assert(!html.includes('data-match-timeline-period'));assert(html.includes('暂无本节数据'));assert.equal((html.match(/<td[^>]*>-<\/td>/g)||[]).length,10);}
 else assert.equal(data.events.at(-1).eventType,'QUARTER_END');
}
console.log(`PASS ${checked} live snapshots, upcoming/finished, score ledger, roster totals, period stats, one curve, event cutoff`);
