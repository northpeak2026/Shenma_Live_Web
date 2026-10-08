export const prizes = [
  {id:'diamond',name:'钻石',quantity:66,icon:'💎',weight:20},
  {id:'coin',name:'金币',quantity:88,icon:'🪙',weight:24},
  {id:'exp',name:'经验值',quantity:100,icon:'⭐',weight:20},
  {id:'car',name:'跑车',quantity:1,icon:'🏎️',weight:3},
  {id:'yacht',name:'游艇',quantity:1,icon:'🛥️',weight:2},
  {id:'beer',name:'牛啤',quantity:1,icon:'🍻',weight:8},
  {id:'free',name:'免费抽奖次数',quantity:3,icon:'🎟️',weight:8},
  {id:'none',name:'谢谢惠顾',quantity:0,icon:'🍀',weight:15},
];
export const gameTypes = [{id:'treasure',name:'幸运大转盘',icon:'🎡',available:true},{id:'monopoly',name:'大富翁',icon:'🎲'},{id:'dice',name:'骰子',icon:'⚄'},{id:'guess',name:'猜大小',icon:'🃏'}];
export const paymentMethods = [
  {id:'chances',name:'转盘次数',icon:'🎟️',cost:1,unit:'次'},
  {id:'diamonds',name:'钻石',icon:'💎',cost:10,unit:'钻石'},
  {id:'coins',name:'金币',icon:'🪙',cost:100,unit:'金币'},
];
export const initialBalances={chances:10,diamonds:1280,coins:8650};
export function paymentOf(id){return paymentMethods.find(method=>method.id===id);}
export function canDraw(state,id='chances'){const method=paymentOf(id);return Boolean(method&&Number.isFinite(state[method.id])&&state[method.id]>=method.cost&&!state.pending);}
const key='shenma-game-treasure-v1';
export function loadGame(){try{const s=JSON.parse(localStorage.getItem(key));if(Number.isInteger(s?.chances)&&s.chances>=0&&Array.isArray(s.records))return {...s,diamonds:Number.isInteger(s.diamonds)&&s.diamonds>=0?s.diamonds:initialBalances.diamonds,coins:Number.isInteger(s.coins)&&s.coins>=0?s.coins:initialBalances.coins,records:s.records.filter(r=>prizes.some(p=>p.id===r.prizeId)&&Number.isFinite(r.time))};}catch{}return {...initialBalances,records:[],pending:null};}
export function selectPrize(random=Math.random){const total=prizes.reduce((s,p)=>s+p.weight,0);let n=random()*total;return prizes.find(p=>(n-=p.weight)<0)||prizes.at(-1);}
export function saveGame(state){try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{return false;}}
export function drawGame(state,random=Math.random,now=Date.now(),payment='chances'){if(!canDraw(state,payment))return null;const method=paymentOf(payment);const prize=selectPrize(random);const record={id:`${now}-${Math.random().toString(36).slice(2)}`,time:now,prizeId:prize.id,payment:method.id,cost:method.cost};state[method.id]-=method.cost;state.records.unshift(record);state.pending=record.id;return {prize,record};}
export function settleGame(state){const record=state.records.find(r=>r.id===state.pending);if(record?.prizeId==='free')state.chances+=prizes.find(p=>p.id==='free').quantity;state.pending=null;return record;}
export const siteRecords=Array.from({length:18},(_,i)=>({nickname:['晴***球','小***熊','阿***辰','橙***水','追***风','星***河'][i%6],avatar:['🦊','🐻','🐼','🐱','🐯','🐰'][i%6],prizeId:prizes[i%7].id,time:Date.now()-(i+1)*79000}));

const siteUsers = [
  {nickname:'晴***球',avatar:'🦊'}, {nickname:'小***熊',avatar:'🐻'},
  {nickname:'阿***辰',avatar:'🐼'}, {nickname:'橙***水',avatar:'🐱'},
  {nickname:'追***风',avatar:'🐯'}, {nickname:'星***河',avatar:'🐰'},
];
export function createSiteRecord(random=Math.random,now=Date.now()) {
  const user=siteUsers[Math.floor(random()*siteUsers.length)];
  const winning=prizes.filter(p=>p.id!=='none');
  const total=winning.reduce((sum,p)=>sum+p.weight,0);
  let roll=random()*total;
  const prize=winning.find(p=>(roll-=p.weight)<0)||winning.at(-1);
  return {...user,prizeId:prize.id,time:now};
}
