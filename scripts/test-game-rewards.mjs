import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {accessSync} from 'node:fs';
// Mirror Vite's asset URL export when account modules import the avatar in Node.
registerHooks({load(url,context,nextLoad){if(url.endsWith('.png')){accessSync(new URL(url));return {format:'module',source:`export default ${JSON.stringify(url)}`,shortCircuit:true};}return nextLoad(url,context);}});
import {normalizeRewards,applyReward,levelThreshold} from '../src/game-rewards.js';
import {prizes,loadGame,saveGame,drawGame,settleGame,paymentMethods} from '../src/game-state.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const fresh=()=>normalizeRewards({chances:10,diamonds:1280,coins:8650,records:[],pending:null});
let s=fresh();s.vip=3;s.exp=4950;s.nextExp=5000;let r=applyReward(s,prizes.find(p=>p.id==='exp'));assert.deepEqual([s.vip,s.exp,s.nextExp],[4,50,8000]);assert.equal(r.stages[0].to,5000);
s=fresh();s.vip=1;s.exp=950;s.nextExp=1000;r=applyReward(s,{id:'exp',quantity:10000});assert.deepEqual([s.vip,s.exp,s.nextExp],[4,2450,8000]);assert.equal(r.stages.length,4);
s=fresh();applyReward(s,{id:'exp',quantity:2650});assert.deepEqual([s.vip,s.exp,s.nextExp],[4,0,8000]);
for(const payment of paymentMethods){for(const p of prizes){s=fresh();const cumulative=prizes.slice(0,prizes.indexOf(p)).reduce((n,p)=>n+p.weight,0);drawGame(s,()=>(cumulative+p.weight/2)/100,1,payment.id);assert.equal(drawGame(s),null);saveGame(s);s=loadGame();const record=settleGame(s);const expected=fresh();expected[payment.id]-=payment.cost;applyReward(expected,p);for(const field of ['chances','diamonds','coins','vip','exp','nextExp','inventory'])assert.deepEqual(s[field],expected[field]);const snapshot=JSON.stringify(s);assert.equal(settleGame(s),undefined);assert.equal(JSON.stringify(s),snapshot);s.pending=record.id;settleGame(s);assert.equal(s.records.length,1);}}
s=fresh();applyReward(s,prizes.find(p=>p.id==='car'));applyReward(s,prizes.find(p=>p.id==='car'));assert.equal(s.inventory.car.quantity,2);assert.equal(Object.keys(s.inventory).length,1);saveGame(s);assert.equal(loadGame().inventory.car.quantity,2);
localStorage.setItem('shenma-game-treasure-v1',JSON.stringify({chances:7,records:[],pending:null}));assert.equal(loadGame().chances,7);assert.equal(loadGame().vip,3);
localStorage.setItem('shenma-live-web-auth',JSON.stringify({id:'mock-user',vip:3,exp:4950,nextExp:5000,diamonds:200,coins:400,inventory:{car:{id:'car',type:'gift',name:'跑车',icon:'🏎️',quantity:2}}}));
const {syncGameAccount,persistGameAccount}=await import('../src/game-account.js');const {getAuthUser,updateAuthUser}=await import('../src/auth.js');
s=syncGameAccount(fresh());assert.equal(s.inventory.car.quantity,2);drawGame(s,()=>.5,2,'diamonds');settleGame(s);assert.equal(persistGameAccount(s),true);assert.equal(getAuthUser().diamonds,190);assert.equal(getAuthUser().vip,4);assert.equal(getAuthUser().exp,50);updateAuthUser({coins:900});syncGameAccount(s);assert.equal(s.coins,900);
console.log('通过：24 种消耗/奖励组合、阈值升级、多级升级、经验溢出、背包合并、刷新恢复、重复结算保护、旧数据兼容及个人中心同步');
