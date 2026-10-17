import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const store=new Map();let user={id:'test',diamonds:100,coins:500};let clock=Date.now();
const ctx={URLSearchParams,Date:class extends Date{static now(){return clock}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},getAuthUser:()=>user,updateAuthUser:p=>Object.assign(user,p),location:{hash:'#/tips'},setInterval:()=>1,clearInterval:()=>{},document:{querySelectorAll:()=>[],querySelector:()=>null}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/tips.js','utf8').replace(/^import .*;$/gm,'').replace(/export /g,''),ctx);
const run=code=>vm.runInContext(code,ctx);
run("initTips([{id:'achen',name:'阿辰',avatar:'a',fans:123}])");
assert.equal(run('experts.length'),36);assert.equal(run('plans.length'),540);
assert.equal(run('canRead(plans[0])'),false);assert.equal(run('canRead(plans[1])'),true);assert.equal(run('canRead(plans[6])'),true);assert.equal(run('canRead(plans[4])'),true);
assert.equal(run("detail(plans[0]).includes('recommended')"),false);
assert.equal(run("detail(plans[0]).includes('本场关注')"),false);
for(const outcome of ['赢','赢半','走水','输','输半'])assert.equal(run(`plans.some(p=>p.result==='${outcome}')`),true);
assert.equal(run("rankExperts('rate').length"),30);
assert.equal(run("(ranks('rate').match(/tip-rank-row/g)||[]).length"),9);
assert.equal(run("listing(new URLSearchParams()).includes('tip-result')"),false);
assert.equal(run("listing(new URLSearchParams('asset=free')).includes('解锁后查看推荐')"),false);
assert.equal(run("listing(new URLSearchParams('sport=basketball&market=1')).includes('让球')"),true);
assert.equal(run("expertTips('expert-10').includes('tip-result')"),true);
assert.equal(run("matchTips('missing').includes('暂无相关有料')"),true);
assert.equal(run("hasMatchTips('missing')"),false);
assert.ok(run("(matchTips('focus-0').match(/class=\"tip-card\"/g)||[]).length")>9);
run('rankPage=1');assert.equal(run("ranks('rate').includes('>10</b>')"),true);
run('rankPage=3');assert.equal(run("(ranks('rate').match(/tip-rank-row/g)||[]).length"),3);
run('rankPage=0');
let click, message={textContent:''};ctx.document.querySelector=selector=>selector==='[data-tip-buy]'?{addEventListener:(_,fn)=>click=fn}:selector==='#tipPaymentMessage'?message:null;
let renders=0;ctx.rerender=()=>renders++;
run('bindTips(rerender)');click({target:{dataset:{tipBuy:'p1'}}});assert.equal(user.diamonds,62);assert.equal(run('purchased(plans[0])'),true);click({target:{dataset:{tipBuy:'p1'}}});assert.equal(user.diamonds,62);
click({target:{dataset:{tipBuy:'p85'}}});assert.match(message.textContent,/余额不足/);assert.equal(user.coins,500);
clock+=2*3600000;assert.equal(run('canRead(plans[36])'),true);assert.equal(run("detail(plans[36]).includes('data-tip-buy')"),false);
console.log('有料：权限隐藏、免费/已购/截止、30名排行榜、组合筛选、五种结算、支付扣款、防重付与余额不足检查通过。');

// Production event bindings must use exact match IDs, including same-league isolation.
const ids=['up-epl','up-nba','up-ucl','up-cba','live-ars','live-nba','up-serie','up-euro','up-bundes','up-nbl','result-epl','result-nba'];
ctx.canonicalEvents=ids.map((id,i)=>({id,sport:i%2?'basketball':'football',league:'相同联赛',home:'主队'+i,away:'客队'+i,date:'2099-10-16',time:'22:00',status:i>=10?'finished':i===4||i===5?'live':'upcoming'}));
run('experts=[];initTips([],canonicalEvents)');
assert.equal(run("hasMatchTips('live-ars')"),true);
assert.equal(run("hasMatchTips('live-laliga')"),false);
assert.equal(run("hasMatchTips(undefined)"),false);
assert.ok(run("(matchTips('live-ars').match(/class=\"tip-card\"/g)||[]).length")>9);
assert.equal(run("matchTips('live-ars').includes('主队5')"),false);
assert.equal(run("matchTips('result-epl').includes('tip-result')"),true);
assert.equal(run("matchTips('live-ars',{compact:true}).includes('tip-related-compact')"),true);
assert.equal(run("fixtures.every(m=>canonicalEvents.some(e=>e.id===m.id))"),true);
console.log('新增检查通过：榜单翻页、赛事ID隔离、空状态、直播关联条件与紧凑卡片。');

for(const planIndex of [0,1,4,6,10]){
 assert.equal(run(`card(plans[${planIndex}]).includes(' · 推荐 ')`),false);
 assert.equal(run(`card(plans[${planIndex}]).includes('tip-card-odds')`),false);
}
assert.equal(run("listing(new URLSearchParams()).includes('已截止')"),false);
assert.equal(run("listing(new URLSearchParams()).includes('篇方案')"),false);
assert.equal(run("filters(new URLSearchParams()).includes('排序')"),false);
assert.equal(run("detail(plans[0]).includes('<b>对阵</b>')"),false);
assert.equal(run("detail(plans[0]).includes(' 开赛')"),false);
assert.equal(run("focusMatches(()=>'<i></i>').includes('#/match/up-epl?tab=tips')"),true);
console.log('批注检查通过：卡片仅显示盘口、首页排除截止、移除数量与排序、焦点赛事定向跳转、详情文案精简。');

assert.equal(run('experts.every(e=>plans.filter(p=>p.expert.id===e.id).length===15)'),true);
assert.equal(run("experts.every(e=>['赢','赢半','走水','输','输半'].every(result=>plans.some(p=>p.expert.id===e.id&&p.result===result)))"),true);
assert.equal(run("experts.every(e=>['free','coins','diamonds'].every(asset=>plans.some(p=>p.expert.id===e.id&&p.asset===asset)))"),true);
console.log('专家数据检查通过：每位15篇方案，覆盖全部收费类型与五种结算结果。');

assert.equal(run("plans.every(p=>!detail(p).includes('NaN'))"),true);
assert.equal(run("(popularTips(plans[0]).match(/class=\"tip-card\"/g)||[]).length"),5);
assert.equal(run("popularTips(plans[0]).includes('href=\"#/tips/detail/p1\"')"),false);
assert.equal(run("detail(plans[0]).includes('class=\"tip-panel tip-pay\"')"),false);
assert.equal(run("detail(plans[1]).includes('tip-recommend-tag')"),true);
assert.equal(run("countdownMarkup(3661).includes('01')"),true);
console.log('详情调整检查通过：五条其他热门方案、移除侧栏支付卡、推荐角标和电子倒计时。');
