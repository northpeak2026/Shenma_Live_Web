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
export const gameTypes = [{id:'treasure',name:'夺宝游戏',icon:'🎡',available:true},{id:'monopoly',name:'大富翁',icon:'🎲'},{id:'dice',name:'骰子',icon:'⚄'},{id:'guess',name:'猜大小',icon:'🃏'}];
const key='shenma-game-treasure-v1';
export function loadGame(){try{const s=JSON.parse(localStorage.getItem(key));if(Number.isInteger(s?.chances)&&s.chances>=0&&Array.isArray(s.records))return {...s,records:s.records.filter(r=>prizes.some(p=>p.id===r.prizeId)&&Number.isFinite(r.time))};}catch{}return {chances:10,records:[],pending:null};}
export function selectPrize(random=Math.random){const total=prizes.reduce((s,p)=>s+p.weight,0);let n=random()*total;return prizes.find(p=>(n-=p.weight)<0)||prizes.at(-1);}
export function saveGame(state){try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{return false;}}
export function drawGame(state,random=Math.random,now=Date.now()){if(state.chances<=0||state.pending)return null;const prize=selectPrize(random);const record={id:`${now}-${Math.random().toString(36).slice(2)}`,time:now,prizeId:prize.id};state.chances-=1;state.records.unshift(record);state.pending=record.id;return {prize,record};}
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
