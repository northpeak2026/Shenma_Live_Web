import {getAuthUser,updateAuthUser} from './auth.js';
import {prizes,loadGame,saveGame} from './game-state.js';
const icon=id=>prizes.find(p=>p.id===id)?.icon||'🎁';
export const checkinRewards=[{id:'coin-100',type:'coins',name:'金币',quantity:100,icon:icon('coin')},{id:'diamond-20',type:'diamonds',name:'钻石',quantity:20,icon:icon('diamond')},{id:'car',type:'gift',name:'跑车',quantity:1,icon:icon('car')},{id:'free',type:'chances',name:'免费抽奖',quantity:2,unit:'次',icon:icon('free')},{id:'coin-300',type:'coins',name:'金币',quantity:300,icon:icon('coin')},{id:'yacht',type:'gift',name:'游艇',quantity:1,icon:icon('yacht')},{id:'horse',type:'mount',name:'赤焰战马',quantity:1,icon:'🐎'}];
checkinRewards[0]={rewards:[checkinRewards[0],{id:'diamond-5',type:'diamonds',name:'钻石',quantity:5,icon:icon('diamond')}]};
checkinRewards[2]={rewards:[checkinRewards[2],{id:'coin-150',type:'coins',name:'金币',quantity:150,icon:icon('coin')}]};
checkinRewards[3]={rewards:[checkinRewards[3],{id:'diamond-10',type:'diamonds',name:'钻石',quantity:10,icon:icon('diamond')}]};
checkinRewards[6]={rewards:[checkinRewards[6],{id:'diamond-50',type:'diamonds',name:'钻石',quantity:50,icon:icon('diamond')},{id:'coin-500',type:'coins',name:'金币',quantity:500,icon:icon('coin')}]};
export const dayRewards=day=>Array.isArray(day?.rewards)?day.rewards:day?[day]:[];
export const checkinDate=(offset=0)=>{const day=new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Kuala_Lumpur'}),date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+offset);return date.toISOString().slice(0,10)};
const key=()=>`shenma-checkin-v1-${getAuthUser()?.id}-${getAuthUser()?.isCreator?'creator':'regular'}`;
const save=state=>localStorage.setItem(key(),JSON.stringify(state));
export function reconcileCheckin(state,today=checkinDate(),yesterday=checkinDate(-1)){const s={...state,claimed:[...state.claimed]};if(s.lastDate!==today)s.lastReward=null;if(s.lastDate!==today&&s.claimed.length===7){s.claimed=[];s.cycle++}if(s.lastDate!==today&&s.lastDate!==yesterday){s.streak=0;s.claimed=[]}return s}
export function loadCheckin(){let state;try{state=JSON.parse(localStorage.getItem(key())||'null')}catch{}if(!state||!Array.isArray(state.claimed)||state.claimed.length>7||!Number.isInteger(state.streak))state={claimed:[0,1,2],streak:3,lastDate:checkinDate(-1),cycle:1,lastReward:null};state=reconcileCheckin(state);save(state);return state}
export function setCheckinScenario(mode){const count=mode==='signed'?4:mode==='last'?6:mode==='complete'?7:3;const state={claimed:Array.from({length:count},(_,i)=>i),streak:count,lastDate:checkinDate(mode==='signed'||mode==='complete'?0:-1),cycle:1,lastReward:null};save(state);return state}
export function claimCheckin(rewards=checkinRewards){const user=getAuthUser();if(!user)throw new Error('请先登录');const state=loadCheckin();if(state.lastDate===checkinDate())return null;const items=dayRewards(rewards[state.claimed.length]);
if(!items.length||items.some(r=>!Number.isFinite(r.quantity)||r.quantity<=0))throw new Error('签到奖励暂不可领取');
const patch={};let chances=0;
for(const reward of items){
if(['coins','diamonds'].includes(reward.type))patch[reward.type]=(patch[reward.type]??user[reward.type]??0)+reward.quantity;
else if(reward.type==='chances')chances+=reward.quantity;
else{patch.inventory??={...(user.inventory||{})};patch.inventory[reward.id]={...reward,quantity:(patch.inventory[reward.id]?.quantity||0)+reward.quantity}}
}
if(chances){patch.freeSpins=(user.freeSpins||0)+chances;const game=loadGame();game.chances+=chances;
if(!saveGame(game))throw new Error('奖励保存失败，请重试');
if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('shenma-game-chances-credit',{detail:chances}))}
updateAuthUser(patch);state.claimed.push(state.claimed.length);state.streak++;state.lastDate=checkinDate();state.lastReward=items.map(r=>({...r}));save(state);return items}
