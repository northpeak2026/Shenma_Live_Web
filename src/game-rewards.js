// Each threshold is the experience needed within the current level.
export const levelThresholds={1:1000,2:2500,3:5000,4:8000,5:12000};
export const levelThreshold=level=>levelThresholds[level]??12000+(level-5)*4000;
export const rewardTypes={diamond:'diamonds',coin:'coins',exp:'exp',car:'gift',yacht:'gift',beer:'gift',free:'chances',none:'none'};
export function normalizeRewards(state){
  state.vip=Number.isInteger(state.vip)&&state.vip>0?state.vip:3;
  state.exp=Number.isFinite(state.exp)&&state.exp>=0?state.exp:2350;
  state.nextExp=Number.isFinite(state.nextExp)&&state.nextExp>0?state.nextExp:levelThreshold(state.vip);
  state.inventory=Object.fromEntries(Object.entries(state.inventory||{}).filter(([,item])=>item&&Number.isInteger(item.quantity)&&item.quantity>0));
  return state;
}
export function applyReward(state,prize){
  normalizeRewards(state);
  const before={vip:state.vip,exp:state.exp,nextExp:state.nextExp};
  const type=rewardTypes[prize.id],stages=[],previousQuantity=state.inventory[prize.id]?.quantity||0;
  if(type==='exp'){
    let remaining=prize.quantity;
    while(remaining>0){const gain=Math.min(remaining,Math.max(0,state.nextExp-state.exp));const from=state.exp;state.exp+=gain;remaining-=gain;stages.push({vip:state.vip,from,to:state.exp,max:state.nextExp});if(state.exp>=state.nextExp){state.exp-=state.nextExp;state.vip++;state.nextExp=levelThreshold(state.vip);}else break;}
  }else if(type==='gift'){
    const old=state.inventory[prize.id];
    state.inventory[prize.id]={id:prize.id,type:'gift',name:prize.name,icon:prize.icon,quantity:(old?.quantity||0)+prize.quantity};
  }else if(['diamonds','coins','chances'].includes(type))state[type]+=prize.quantity;
  return {type,previousQuantity,quantity:prize.quantity,before,after:{vip:state.vip,exp:state.exp,nextExp:state.nextExp},stages};
}
