import assert from 'node:assert/strict';
import {standings} from '../src/data.js';
import {buildTeams,extendTeamEvents,teamEvents} from '../src/team-details.js';
const teams=buildTeams(standings,(name,code)=>`${name}-${code}`),events=[],followed=new Set();
const make=(id,status,sport,league,n,time,home,away,score,stage,extra)=>({id,status,sport,league,date:`2026-10-${String(19+n).padStart(2,'0')}`,time,home,away,score,stage,...extra});
extendTeamEvents(teams,events,make,followed);
assert.equal(new Set(teams.map(t=>t.id)).size,teams.length);
assert.equal(teams.filter(t=>t.code==='MIL').length,2);
assert.equal(new Set(events.map(e=>e.id)).size,events.length);
for(const team of teams){
 const list=teamEvents(team,events);
 assert.ok(list.length>=15);
 assert.deepEqual(new Set(list.map(e=>e.status)),new Set(['upcoming','live','finished']));
 assert.ok(list.some(e=>followed.has(e.id)));
 assert.ok(list.some(e=>!followed.has(e.id)));
 assert.ok(list.every(e=>e.sport===team.sport));
 assert.ok(list.every((e,i)=>!i||`${list[i-1].date}T${list[i-1].time}`>=`${e.date}T${e.time}`));
 if(team.sport==='football'&&team.rank<=4)assert.ok(new Set(list.map(e=>e.league)).size>=3);
 assert.equal(new Set(list.map(e=>e.id)).size,list.length);
}
assert.equal(teamEvents(teams[0],[]).length,0);
console.log(`通过：${teams.length} 支球队的 ID、数据关联、多赛事分类、三种比赛状态、收藏与倒序排列。`);
