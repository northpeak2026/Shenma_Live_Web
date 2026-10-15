import {getAuthUser,updateAuthUser} from './auth.js';
import {saveGame} from './game-state.js';
import {normalizeRewards} from './game-rewards.js';
const ownerOf=user=>user?`${user.id}:${user.isCreator?'creator':'regular'}`:'guest';
export function syncGameAccount(state){
  const user=getAuthUser();
  if(!user)return normalizeRewards(state);
  if(state.accountSync&&state.owner===ownerOf(user)){persistGameAccount(state);return state;}
  for(const field of ['vip','exp','nextExp','diamonds','coins'])if(Number.isFinite(user[field]))state[field]=user[field];
  state.inventory={...(user.inventory||{})};
  state.owner=ownerOf(user);
  return normalizeRewards(state);
}
export function persistGameAccount(state){
  const user=getAuthUser();
  state.accountSync=Boolean(user);state.owner=ownerOf(user);
  if(!saveGame(state))return false;
  if(user){try{updateAuthUser(Object.fromEntries(['vip','exp','nextExp','diamonds','coins','inventory'].map(field=>[field,state[field]])));}catch{return false;}}
  state.accountSync=false;
  return saveGame(state);
}
