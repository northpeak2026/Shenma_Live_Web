export const liveRooms = [
  { id: 'premier-ars', title: '阿森纳 vs 利物浦', league: '英超', time: '正在直播', heat: '38.6万', presenterTag:'金牌主播', host: '阿辰解说', avatar: 'https://i.pravatar.cc/100?img=12', cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=88', score: '2  -  1', clock: "73'", color: '#ff5140' },
  { id: 'nba-lal', title: '湖人 vs 勇士', league: 'NBA', time: '第三节 08:42', heat: '29.4万', presenterTag:'实力主播', host: '篮球老周', avatar: 'https://i.pravatar.cc/100?img=13', cover: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=88', score: '82  -  79', clock: 'Q3', color: '#ffae32' },
  { id: 'ucl', title: '皇马 vs 拜仁慕尼黑', league: '欧冠', time: '今晚 03:00', heat: '19.8万', presenterTag:'人气主播', host: '小雨看球', avatar: 'https://i.pravatar.cc/100?img=32', cover: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=88', score: '即将开始', clock: 'LIVE', color: '#8d69ff' },
  { id: 'laliga', title: '巴塞罗那 vs 马竞', league: '西甲', time: '正在直播', heat: '16.2万', presenterTag:'美女主播', host: '西班牙老王', avatar: 'https://i.pravatar.cc/100?img=15', cover: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=1200&q=88', score: '1  -  0', clock: "58'", color: '#ea4d77' },
  { id: 'cba', title: '广东宏远 vs 辽宁本钢', league: 'CBA', time: '第四节 05:20', heat: '11.9万', presenterTag:'实力主播', host: '南哥体育', avatar: 'https://i.pravatar.cc/100?img=47', cover: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=88', score: '98  -  101', clock: 'Q4', color: '#46b8ff' }
];

// Explicit fixture bindings; talk/teaching streams without a fixture remain unbound.
liveRooms.forEach(room=>{room.matchId={'premier-ars':'live-ars','nba-lal':'live-nba',ucl:'up-ucl',laliga:'live-laliga',cba:'live-cba'}[room.id]});

export const hotRooms = [
  ...liveRooms.slice(0, 4),
  { id: 'epl-talk', title: '英超争四关键战，赛前阵容解析', league: '足球', presenterTag:'金牌主播', heat: '9.6万', host: '大熊侃球', avatar: 'https://i.pravatar.cc/100?img=5', cover: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=82', color: '#2bb894' },
  { id: 'lpl', title: 'LPL 夏季赛：BLG vs TES', league: '电竞', presenterTag:'人气主播', heat: '22.3万', host: '小麦电竞', avatar: 'https://i.pravatar.cc/100?img=44', cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=82', color: '#a169ff' },
  { id: 'seriea', title: '意甲焦点：国际米兰冲击冠军', league: '意甲', presenterTag:'实力主播', heat: '8.1万', host: '蓝黑日记', avatar: 'https://i.pravatar.cc/100?img=33', cover: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=82', color: '#377cff' },
  { id: 'nbatalk', title: '季后赛对阵推演，湖人还有机会吗', league: '篮球', presenterTag:'美女主播', heat: '7.4万', host: '阿伦说球', avatar: 'https://i.pravatar.cc/100?img=11', cover: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=900&q=82', color: '#fc7b37' }
];

export const featuredEvents = [
  {id:'event-epl',time:'09/24 15:30',league:'英超',home:'阿森纳',away:'利物浦',homeLogo:'A',awayLogo:'L',score:'VS',color:'#e64b3d'},
  {id:'event-nba',time:'09/24 18:30',league:'NBA',home:'洛杉矶湖人',away:'金州勇士',homeLogo:'LAL',awayLogo:'GSW',score:'VS',color:'#f29d2d'},
  {id:'event-tennis',time:'09/24 19:00',league:'ATP 500',home:'张之臻',away:'鲁内',homeLogo:'ZZ',awayLogo:'RH',score:'VS',color:'#37a978'},
  {id:'event-lol',time:'09/24 20:00',league:'英雄联盟 LPL',home:'BLG',away:'TES',homeLogo:'BLG',awayLogo:'TES',score:'1 - 0',color:'#8e61ec'},
  {id:'event-cba',time:'09/24 20:30',league:'CBA',home:'广东华南虎',away:'辽宁飞豹',homeLogo:'GD',awayLogo:'LN',score:'VS',color:'#3c8df0'},
  {id:'event-kpl',time:'09/24 21:00',league:'王者荣耀 KPL',home:'成都AG',away:'北京WB',homeLogo:'AG',awayLogo:'WB',score:'VS',color:'#ee6d94'}
];


export const scheduleEvents = [
{id:'epl-live',date:'today',sport:'football',league:'英超',time:'19:30',status:'live',stage:"下半场 72'",home:'阿森纳',away:'利物浦',homeLogo:'ARS',awayLogo:'LIV',score:'2 : 1',color:'#df5147',roomId:'premier-ars',hosts:[12,14,32]},
{id:'laliga-live',date:'today',sport:'football',league:'西甲',time:'20:00',status:'live',stage:"上半场 30'",home:'巴塞罗那',away:'马德里竞技',homeLogo:'BAR',awayLogo:'ATM',score:'1 : 0',color:'#5d79d8',roomId:'laliga',hosts:[15]},
{id:'seriea',date:'today',sport:'football',league:'意甲',time:'22:15',status:'upcoming',home:'AC米兰',away:'国际米兰',homeLogo:'MIL',awayLogo:'INT',color:'#8c65bf',hosts:[33,47]},
{id:'nba-live',date:'today',sport:'basketball',league:'NBA',time:'20:30',status:'live',stage:"第三节 8'",home:'洛杉矶湖人',away:'金州勇士',homeLogo:'LAL',awayLogo:'GSW',score:'82 : 79',color:'#ec9a2d',roomId:'nba-lal',hosts:[13,51,36,20]},
{id:'cba-live',date:'today',sport:'basketball',league:'CBA',time:'21:00',status:'live',stage:"第四节 5'",home:'广东华南虎',away:'辽宁飞豹',homeLogo:'GUA',awayLogo:'LIA',score:'98 : 101',color:'#318ed8',roomId:'cba',hosts:[47,48]},
{id:'tennis-live',date:'today',sport:'other',league:'ATP 500',time:'19:00',status:'live',stage:'第二盘',home:'张之臻',away:'鲁内',homeLogo:'ZZ',awayLogo:'RH',score:'1 : 0',color:'#35a270',roomId:'stream-09',hosts:[52]},
{id:'ucl',date:'tomorrow',sport:'football',league:'欧冠',time:'03:00',status:'upcoming',home:'皇家马德里',away:'拜仁慕尼黑',homeLogo:'RMA',awayLogo:'FCB',color:'#5c6ed8',hosts:[32,5]},
{id:'epl-tomorrow',date:'tomorrow',sport:'football',league:'英超',time:'20:00',status:'upcoming',home:'曼彻斯特城',away:'托特纳姆热刺',homeLogo:'MCI',awayLogo:'TOT',color:'#4d99c7',hosts:[12]},
{id:'nba-tomorrow',date:'tomorrow',sport:'basketball',league:'NBA',time:'19:35',status:'upcoming',home:'波士顿凯尔特人',away:'纽约尼克斯',homeLogo:'BOS',awayLogo:'NYK',color:'#2b9a67',hosts:[13,36,51]},
{id:'tennis-tomorrow',date:'tomorrow',sport:'other',league:'中网',time:'18:30',status:'upcoming',home:'郑钦文',away:'高芙',homeLogo:'ZQW',awayLogo:'CG',color:'#41a47d',hosts:[53,41]},
{id:'bundesliga',date:'sep30',sport:'football',league:'德甲',time:'20:30',status:'upcoming',home:'多特蒙德',away:'RB莱比锡',homeLogo:'BVB',awayLogo:'RBL',color:'#e3a83c',hosts:[14,33]},
{id:'ligue1',date:'sep30',sport:'football',league:'法甲',time:'22:00',status:'upcoming',home:'巴黎圣日耳曼',away:'马赛',homeLogo:'PSG',awayLogo:'OM',color:'#416ed0',hosts:[15]},
{id:'cba-sep30',date:'sep30',sport:'basketball',league:'CBA',time:'19:35',status:'upcoming',home:'浙江金牛',away:'新疆飞虎',homeLogo:'ZHE',awayLogo:'XIN',color:'#397fd7',hosts:[48,47,13,36]},
{id:'laliga-oct1',date:'oct1',sport:'football',league:'西甲',time:'21:00',status:'upcoming',home:'皇家贝蒂斯',away:'瓦伦西亚',homeLogo:'BET',awayLogo:'VAL',color:'#4c9a77',hosts:[45]},
{id:'basketball-oct1',date:'oct1',sport:'basketball',league:'欧篮联',time:'20:00',status:'upcoming',home:'费内巴切',away:'帕纳辛奈科斯',homeLogo:'FB',awayLogo:'PAO',color:'#e2a43e',hosts:[51,13]}
];

export const liveStreams = [
  {id:'stream-01',category:'足球',title:'英超焦点战：阿森纳冲击榜首',presenterTag:'金牌主播',heat:'5.6万',host:'阿辰解说',avatar:'https://i.pravatar.cc/100?img=12',cover:'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=84',color:'#ff5a43'},
  {id:'stream-02',category:'足球',title:'欧冠淘汰赛战术复盘与实时解说',presenterTag:'实力主播',heat:'2.3万',host:'球场边的老周',avatar:'https://i.pravatar.cc/100?img=14',cover:'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=84',color:'#3d88ed'},
  {id:'stream-03',category:'足球',title:'西甲：皇马 vs 巴萨赛前聊天室',presenterTag:'人气主播',heat:'8,632',host:'西语小橙',avatar:'https://i.pravatar.cc/100?img=47',cover:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=84',color:'#a168f1'},
  {id:'stream-04',category:'足球',title:'五大联赛晚场串关数据分析',presenterTag:'美女主播',heat:'1.2万',host:'米娜看球',avatar:'https://i.pravatar.cc/100?img=45',cover:'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=84',color:'#eb6b91'},
  {id:'stream-05',category:'篮球',title:'湖人 vs 勇士：第三节关键回合',presenterTag:'金牌主播',heat:'4.8万',host:'篮球老周',avatar:'https://i.pravatar.cc/100?img=13',cover:'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=84',color:'#f4a229'},
  {id:'stream-06',category:'篮球',title:'NBA 早场连线：东部格局分析',presenterTag:'实力主播',heat:'1.7万',host:'小白篮球',avatar:'https://i.pravatar.cc/100?img=51',cover:'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=84',color:'#3987ef'},
  {id:'stream-07',category:'篮球',title:'CBA 新赛季阵容与主力观察',presenterTag:'人气主播',heat:'9,824',host:'南哥体育',avatar:'https://i.pravatar.cc/100?img=48',cover:'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=900&q=84',color:'#39a8e5'},
  {id:'stream-08',category:'篮球',title:'掘金主场赛后更衣室点评',presenterTag:'美女主播',heat:'6,981',host:'丸子说球',avatar:'https://i.pravatar.cc/100?img=36',cover:'https://images.unsplash.com/photo-1518407613690-d9fc990e795f?auto=format&fit=crop&w=900&q=84',color:'#df6384'},
  {id:'stream-09',category:'网球',title:'ATP 500：张之臻 vs 鲁内',presenterTag:'金牌主播',heat:'2.6万',host:'网球阿哲',avatar:'https://i.pravatar.cc/100?img=52',cover:'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=84',color:'#2ea66f'},
  {id:'stream-10',category:'网球',title:'中国赛季晚场：中心球场直击',presenterTag:'实力主播',heat:'1.1万',host:'一拍定音',avatar:'https://i.pravatar.cc/100?img=53',cover:'https://images.unsplash.com/photo-1530915365347-e35b749a0381?auto=format&fit=crop&w=900&q=84',color:'#36a879'},
  {id:'stream-11',category:'网球',title:'美网名场面回顾，聊聊发球战术',presenterTag:'美女主播',heat:'7,562',host:'小鹿网球',avatar:'https://i.pravatar.cc/100?img=41',cover:'https://images.unsplash.com/photo-1622279457486-28b3a8b5abf5?auto=format&fit=crop&w=900&q=84',color:'#ec7190'},
  {id:'stream-12',category:'网球',title:'大师赛签表解读与夺冠预测',presenterTag:'人气主播',heat:'5,316',host:'ACE频道',avatar:'https://i.pravatar.cc/100?img=20',cover:'https://images.unsplash.com/photo-1617083934555-ac7f7c620b92?auto=format&fit=crop&w=900&q=84',color:'#42af80'},
  {id:'stream-13',category:'英雄联盟',title:'LPL 夏季赛：BLG vs TES',presenterTag:'人气主播',heat:'6.9万',host:'小麦电竞',avatar:'https://i.pravatar.cc/100?img=44',cover:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=84',color:'#a168f1'},
  {id:'stream-14',category:'英雄联盟',title:'峡谷之巅冲分：辅助教学局',presenterTag:'金牌主播',heat:'1.9万',host:'Kirin',avatar:'https://i.pravatar.cc/100?img=60',cover:'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=84',color:'#7d61e9'},
  {id:'stream-15',category:'英雄联盟',title:'世界赛资格赛数据模拟',presenterTag:'实力主播',heat:'1.4万',host:'数据小周',avatar:'https://i.pravatar.cc/100?img=7',cover:'https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=900&q=84',color:'#785ce4'},
  {id:'stream-16',category:'英雄联盟',title:'下路双排快乐局，陪你看比赛',presenterTag:'美女主播',heat:'8,375',host:'柚子酱',avatar:'https://i.pravatar.cc/100?img=40',cover:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=84',color:'#de668c'},
  {id:'stream-17',category:'王者荣耀',title:'KPL 焦点：成都AG vs 北京WB',presenterTag:'金牌主播',heat:'4.2万',host:'峡谷小北',avatar:'https://i.pravatar.cc/100?img=56',cover:'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=84',color:'#f08a45'},
  {id:'stream-18',category:'王者荣耀',title:'巅峰赛冲击前百：边路细节教学',presenterTag:'实力主播',heat:'1.6万',host:'长安夜话',avatar:'https://i.pravatar.cc/100?img=67',cover:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=84',color:'#ef7548'},
  {id:'stream-19',category:'王者荣耀',title:'新英雄实战测评与出装攻略',presenterTag:'美女主播',heat:'9,118',host:'糖糖的峡谷',avatar:'https://i.pravatar.cc/100?img=38',cover:'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=84',color:'#e76693'},
  {id:'stream-20',category:'王者荣耀',title:'五排车队欢乐赛，和水友开黑',presenterTag:'人气主播',heat:'1.3万',host:'野王阿哲',avatar:'https://i.pravatar.cc/100?img=68',cover:'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&w=900&q=84',color:'#f0933c'}
];

const football = {
  '英超': [['Arsenal','ARS','28','20','5','3','65/26','65'],['Liverpool','LIV','28','19','6','3','64/28','63'],['Manchester City','MCI','28','18','7','3','62/31','61'],['Aston Villa','AVL','28','16','5','7','55/38','53'],['Tottenham','TOT','28','15','5','8','57/42','50'],['Manchester United','MUN','28','14','3','11','39/39','45'],['West Ham','WHU','28','12','7','9','45/49','43'],['Brighton','BHA','28','11','9','8','50/44','42'],['Wolves','WOL','28','12','5','11','42/44','41'],['Newcastle','NEW','28','12','4','12','59/48','40']],
  '西甲': [['Real Madrid','RMA','28','21','6','1','59/18','69'],['Barcelona','BAR','28','18','7','3','57/30','61'],['Girona','GIR','28','18','5','5','57/33','59'],['Atletico Madrid','ATM','28','17','4','7','54/31','55'],['Athletic Club','ATH','28','15','8','5','48/26','53'],['Real Sociedad','RSO','28','11','10','7','40/31','43'],['Real Betis','BET','28','10','12','6','36/34','42'],['Valencia','VAL','28','10','7','11','31/32','37'],['Getafe','GET','28','9','11','8','34/39','38'],['Las Palmas','LPA','28','10','7','11','29/31','37']],
  '意甲': [['Inter Milan','INT','28','23','3','2','67/13','72'],['Juventus','JUV','28','17','7','4','42/19','58'],['AC Milan','MIL','28','17','5','6','50/32','56'],['Bologna','BOL','28','14','9','5','41/24','51'],['Roma','ROM','28','14','5','9','51/33','47'],['Atalanta','ATA','28','14','4','10','50/33','46'],['Napoli','NAP','28','12','7','9','42/33','43'],['Lazio','LAZ','28','12','4','12','35/31','40'],['Fiorentina','FIO','28','12','4','12','40/41','40'],['Torino','TOR','28','10','10','8','28/26','40']],
  '德甲': [['Bayer Leverkusen','B04','25','21','4','0','63/16','67'],['Bayern Munich','FCB','25','18','3','4','65/29','57'],['Stuttgart','VFB','25','17','2','6','56/31','53'],['Dortmund','BVB','25','13','8','4','50/31','47'],['RB Leipzig','RBL','25','14','4','7','55/31','46'],['Frankfurt','SGE','25','10','10','5','38/29','40'],['Freiburg','SCF','25','10','6','9','34/41','36'],['Hoffenheim','TSG','25','9','6','10','43/47','33'],['Werder Bremen','SVW','25','8','7','10','33/39','31'],['Augsburg','FCA','25','8','8','9','34/40','32']],
  '法甲': [['PSG','PSG','26','17','8','1','59/22','59'],['Brest','BRE','26','14','7','5','37/20','49'],['Monaco','ASM','26','14','6','6','49/34','48'],['Lille','LOSC','26','12','9','5','38/23','45'],['Nice','OGCN','26','12','8','6','28/19','44'],['Lens','RCL','26','12','6','8','35/27','42'],['Marseille','OM','26','10','9','7','39/29','39'],['Reims','SDR','26','11','5','10','34/36','38'],['Rennes','SRFC','26','9','10','7','36/31','37'],['Lyon','OL','26','10','5','11','30/38','35']]
};

const nbaEast = [['Boston Celtics','BOS','56','16','.778','—','7-3'],['New York Knicks','NYK','47','29','.618','11.5','6-4'],['Milwaukee Bucks','MIL','46','30','.605','12.5','7-3'],['Cleveland Cavaliers','CLE','45','31','.592','13.5','5-5'],['Orlando Magic','ORL','43','33','.566','15.5','6-4'],['Indiana Pacers','IND','42','34','.553','16.5','7-3'],['Philadelphia 76ers','PHI','40','36','.526','18.5','4-6'],['Miami Heat','MIA','39','37','.513','19.5','6-4'],['Chicago Bulls','CHI','37','39','.487','21.5','5-5'],['Atlanta Hawks','ATL','35','41','.461','23.5','4-6']];
const nbaWest = [['Denver Nuggets','DEN','55','21','.724','—','8-2'],['Minnesota Timberwolves','MIN','54','22','.711','1.0','7-3'],['Oklahoma City Thunder','OKC','53','23','.697','2.0','6-4'],['LA Clippers','LAC','49','27','.645','6.0','7-3'],['Los Angeles Lakers','LAL','45','31','.592','10.0','7-3'],['Phoenix Suns','PHX','44','32','.579','11.0','5-5'],['New Orleans Pelicans','NOP','43','33','.566','12.0','6-4'],['Sacramento Kings','SAC','42','34','.553','13.0','5-5'],['Golden State Warriors','GSW','41','35','.539','14.0','8-2'],['Houston Rockets','HOU','39','37','.513','16.0','7-3']];
const cba = [['Liaoning Flying Leopards','LIA','41','7','.854','—','8-2'],['Xinjiang Flying Tigers','XIN','40','8','.833','1.0','9-1'],['Zhejiang Golden Bulls','ZHE','38','10','.792','3.0','7-3'],['Guangdong Southern Tigers','GUA','37','11','.771','4.0','8-2'],['Guangsha Lions','GUS','35','13','.729','6.0','6-4'],['Shenzhen Aviators','SZE','32','16','.667','9.0','5-5'],['Beijing Ducks','BEI','31','17','.646','10.0','7-3'],['Qingdao Eagles','QIN','30','18','.625','11.0','6-4'],['Shanghai Sharks','SHA','28','20','.583','13.0','4-6'],['Shanxi Loongs','SHX','27','21','.563','14.0','5-5']];
const streamMatchBindings={'stream-01':'live-ars','stream-02':'up-ucl','stream-05':'live-nba','stream-07':'live-cba','stream-08':'result-nba','stream-09':'event-tennis','stream-13':'event-lol','stream-17':'event-kpl',lpl:'event-lol'};
[...hotRooms,...liveStreams].forEach(room=>{if(streamMatchBindings[room.id])room.matchId=streamMatchBindings[room.id]});
export const standings = { football, basketball: { NBA: { east: nbaEast, west: nbaWest }, CBA: { all: cba } } };
export const initials = (name) => name.split(' ').map(s => s[0]).slice(0, 3).join('');
