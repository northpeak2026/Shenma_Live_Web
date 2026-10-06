export const matchLeagueId = match => match.leagueId ?? `${match.sport}:${match.league}`;
export function sameLeagueMatches(current, matches) {
  const rank={live:0,upcoming:1,finished:2};
  const time=match=>new Date(`${match.date}T${match.time||'00:00'}:00`).getTime()||0;
  return matches.filter(match=>match.id!==current.id&&matchLeagueId(match)===matchLeagueId(current))
    .sort((a,b)=>(rank[a.status]??3)-(rank[b.status]??3)||(a.status==='finished'?time(b)-time(a):time(a)-time(b))||a.id.localeCompare(b.id));
}
