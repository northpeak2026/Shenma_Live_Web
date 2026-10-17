import assert from 'node:assert/strict';
import {ensureRecords,appendChanges,selectRecords,dateBefore,today} from '../src/account-records-data.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const user={id:'test',isCreator:false,coins:8700,diamonds:1280,vip:3,exp:2350,nextExp:5000};
const initial=ensureRecords(user);for(const asset of ['exp','coins','diamonds'])assert.ok(initial.filter(r=>r.asset===asset).length>=30);
assert.equal(initial.filter(r=>r.source==='邀请好友奖励').length,10);
assert.ok(initial.filter(r=>r.asset==='exp').every(r=>r.amount>0));
for(const asset of ['coins','diamonds'])assert.ok(initial.some(r=>r.asset===asset&&r.amount<0));
const month=selectRecords(initial,{asset:'coins'});assert.equal(month.error,'');assert.equal(month.rows.length,12);assert.ok(month.pages>1);assert.ok(month.rows.every(r=>r.asset==='coins'));
const ancient=selectRecords(initial,{asset:'exp',range:'custom',start:dateBefore(500),end:dateBefore(90)});assert.ok(ancient.count>0);
assert.equal(selectRecords(initial,{asset:'coins',range:'custom',start:'2000-01-01',end:'2000-02-01'}).count,0);
assert.ok(selectRecords(initial,{asset:'exp',range:'custom',start:'2026-10-15',end:'2026-01-01'}).error);
assert.equal(selectRecords(initial,{asset:'exp',range:'1'}).count,2);
const count=initial.length;appendChanges(user,{...user,coins:8800,diamonds:1270,exp:2400},'完成任务');let records=ensureRecords(user);assert.equal(records.length,count+3);assert.equal(records.find(r=>r.source==='完成任务'&&r.asset==='diamonds').amount,-10);
appendChanges(user,{...user,vip:4,exp:50,nextExp:8000},'幸运转盘奖励');assert.equal(ensureRecords(user).find(r=>r.source==='幸运转盘奖励'&&r.asset==='exp'&&r.time.slice(0,10)===today()&&r.amount===2700)?.amount,2700);
assert.equal(user.coins,8700);assert.equal(ensureRecords({...user,id:'other'}).length,count);
console.log('通过：三类记录数量、邀请数据关联、收支方向、筛选边界、历史日期、空状态、分页、增量入账、跨级经验值、账户隔离。');
appendChanges(user,{...user,coins:user.coins-400},'购买有料');
appendChanges(user,{...user,diamonds:user.diamonds-38},'购买有料');
for(const [asset,amount] of [['coins',-400],['diamonds',-38]]){
 const selected=selectRecords(ensureRecords(user),{asset,source:'购买有料',range:'1'});
 assert.equal(selected.count,1);assert.equal(selected.rows[0].source,'购买有料');assert.equal(selected.rows[0].amount,amount);
}
assert.equal(selectRecords(ensureRecords(user),{asset:'coins',source:'不存在的类型'}).count,0);
console.log('通过：购买有料金币/钻石扣款记录、类型筛选和空结果。');
