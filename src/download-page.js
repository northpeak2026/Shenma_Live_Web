import { downloadHeroCopy, downloadQrCard } from './download-visual.js';
import { downloadConfig, downloadUrl, preferredPlatform } from "./download-config.js";

let activeTutorial = "ios";

const tutorialData = {
ios: {
  eyebrow: "通过浏览器将 H5 网页添加到主屏幕，无需下载安装包",
  title: "iOS 添加到主屏幕教程",
  action: "打开 H5 网页",
  images: Array.from({ length: 5 }, (_, index) => `${import.meta.env.BASE_URL}assets/download/ios-chrome-step-${index + 1}.png`),
  dimensions: Array.from({ length: 5 }, () => [763,512]),
  steps: [
    ["打开网页，点击分享", "使用 iPhone 浏览器打开神马直播 H5 网页，点击地址栏旁的分享图标。"],
    ["展开更多操作", "在分享面板中点击“更多”。不同浏览器的菜单位置可能略有不同。"],
    ["选择添加到主屏幕", "在操作列表中找到并点击“添加到主屏幕”。"],
    ["确认名称并添加", "确认名称为“神马直播”，点击右上角“添加”；如有“作为网页 App 打开”选项，可保持开启。"],
    ["从桌面快捷访问", "返回手机主屏幕，点击“神马直播”图标，即可快捷打开 H5 网页。"],
  ],
},
  webclip: {
    eyebrow: "通过描述文件添加桌面入口",
    title: "苹果快捷版安装教程",
    images: Array.from({ length: 5 }, (_, index) => `${import.meta.env.BASE_URL}assets/download/ios-webclip-step-${index + 1}.png`),
    dimensions: [[446,980],[436,984],[448,976],[446,978],[444,970]],
    steps: [
      ["步骤 1", "点击下载按钮，安装描述文件。"],
      ["步骤 2", "进入手机的系统设置，找到「通用」→「VPN与设备管理」，点击刚才下载的描述文件。"],
      ["步骤 3", "点击右上角的「安装」按钮。"],
      ["步骤 4", "输入手机的解锁密码。"],
      ["步骤 5", "点击「下一步」，完成安装后，即可在手机桌面看到 App。"],
    ],
  },
  android: {
    eyebrow: "APK 安装方式",
    title: "安卓安装教程",
    images: Array.from({ length: 4 }, (_, index) => `${import.meta.env.BASE_URL}assets/download/android-install-step-${index + 1}.png`),
    dimensions: [[750,1654],[740,1654],[750,1646],[742,1658]],
    note: "不同 Android 品牌的系统提示可能不同，本教程展示通用 APK 安装流程。",
    steps: [
      ["点击立即下载", "点击下载页里的「立即下载」按钮。"],
      ["确认下载", "点击弹窗里的「仍然下载」（这一步是手机系统误报导致）。"],
      ["继续安装", "点击「继续安装」（我们不会收集你的个人信息）。"],
      ["完成安装", "点击「继续安装」后，即可体验 App。"],
    ],
  },
};

function phoneStatus() {
  return `<div class="phone-status"><span>9:41</span><span>● ᴡɪғɪ ▰</span></div>`;
}

function bottomNav(active) {
  return `<div class="phone-bottom-nav"><b>${active === "首页" ? "首页" : "首页"}</b><span>直播</span><span>${active === "赛事" ? "赛事" : "赛事"}</span><span>聊天</span><span>我的</span></div>`;
}

function homePhone(images) {
  return `<div class="download-phone"><div class="download-phone-screen">${phoneStatus()}<img class="phone-cover" src="${images.football}" alt=""><div class="phone-cover-shade"></div><div class="phone-brand"><i>S</i>神马直播</div><div class="phone-hero-copy"><small>英超 · 正在直播</small><b>阿森纳 VS 利物浦</b></div><div class="phone-ui-body"><div class="phone-ui-title"><span>热门直播</span><i>查看更多 ›</i></div><div class="phone-live-list"><div class="phone-live-card"><img src="${images.basketball}" alt=""><span>湖人勇士焦点战</span></div><div class="phone-live-card"><img src="${images.footballAlt}" alt=""><span>欧冠战术解析</span></div><div class="phone-live-card"><img src="${images.tennis}" alt=""><span>ATP 中心球场</span></div><div class="phone-live-card"><img src="${images.esports}" alt=""><span>LPL 夏季赛</span></div></div>${bottomNav("首页")}</div></div></div>`;
}

function roomPhone(images) {
  return `<div class="download-phone"><div class="download-phone-screen">${phoneStatus()}<div class="phone-brand" style="background:#202833"><i>S</i>直播间</div><div class="phone-room-video"><img src="${images.basketball}" alt=""><span>▶</span></div><div class="phone-room-host"><img src="https://i.pravatar.cc/80?img=13" alt=""><span><b>篮球老周</b>金牌主播 · 5.6万热度</span><button>+ 关注</button></div><div class="phone-chat"><p><i>VIP 6</i> <b>紫金湖畔</b>：这球太精彩了！</p><p><i>VIP 3</i> <b>三分雨</b>：主播分析很专业</p><p><i>主播</i> <b>篮球老周</b>：一起看关键回合</p></div><div class="phone-bottom-nav"><span>说点什么吧…</span><b>发送</b></div></div></div>`;
}

function matchPhone() {
  const matches = [
    ["英超 · 进行中", "阿森纳", "2 : 1", "利物浦"],
    ["NBA · 第三节", "湖人", "82 : 79", "勇士"],
    ["欧冠 · 03:00", "皇家马德里", "VS", "拜仁"],
    ["CBA · 19:35", "广东", "VS", "辽宁"],
  ];
  return `<div class="download-phone"><div class="download-phone-screen">${phoneStatus()}<div class="phone-match-head">赛事中心</div><div class="phone-match-tabs"><b>全部</b><span>足球</span><span>篮球</span><span>电竞</span></div><div class="phone-match-list">${matches.map(item => `<div class="phone-match-card"><small>${item[0]}</small><div><span>${item[1]}</span><strong>${item[2]}</strong><span>${item[3]}</span></div></div>`).join("")}</div>${bottomNav("赛事")}</div></div>`;
}

function hostPhone(images) {
  const hosts = [[45,"米娜看球","英超晚场陪你看"],[44,"小麦电竞","LPL 焦点赛事"],[52,"网球阿哲","ATP 赛事直播"]];
  return `<div class="download-phone"><div class="download-phone-screen">${phoneStatus()}<div class="phone-host-banner"><img src="${images.footballAlt}" alt=""><div class="phone-host-info"><img src="https://i.pravatar.cc/80?img=45" alt=""><span><b>米娜看球</b>人气主播 · 正在直播</span></div></div><div class="phone-ui-title" style="padding:11px 11px 0"><span>推荐主播</span><i>全部 ›</i></div><div class="phone-host-list">${hosts.map(item => `<div class="phone-host-row"><img src="https://i.pravatar.cc/80?img=${item[0]}" alt=""><span><b>${item[1]}</b>${item[2]}</span><button>关注</button></div>`).join("")}</div>${bottomNav("主播")}</div></div>`;
}

function tutorialMarkup() {
  const data = tutorialData[activeTutorial];

  const isShortcut = activeTutorial === 'ios';
  return `<div class="tutorial-intro"><span><b>${data.title}</b><small>${data.eyebrow}</small></span></div><div class="tutorial-steps ${isShortcut ? 'ios-shortcut-steps' : 'install-screenshot-steps'} ${activeTutorial === 'android' ? 'android-install-steps' : ''}">${data.steps.map((step,index) => `<article class="tutorial-step"><span class="tutorial-step-number">${String(index+1).padStart(2,'0')}</span><h3>${step[0]}</h3><p>${step[1]}</p><a class="ios-tutorial-image" href="${data.images[index]}" target="_blank" rel="noopener noreferrer" aria-label="查看第${index+1}步大图：${step[0]}"><img src="${data.images[index]}" alt="${isShortcut ? `第${index+1}步：${step[0]}，按红色箭头指引操作` : `${data.title}，第${index+1}步：${step[1]}`}" ${data.dimensions ? `width="${data.dimensions[index][0]}" height="${data.dimensions[index][1]}"` : ''} loading="lazy"><span>查看大图 ↗</span></a></article>`).join('')}</div>${data.note ? `<p class="tutorial-install-note">${data.note}</p>` : ''}`;
}

function features(images) {
  const items = [
    [homePhone(images), "热门赛事直播，一触即达"],
    [roomPhone(images), "高清直播互动，边看边聊"],
    [matchPhone(), "实时赛程比分，赛事尽掌握"],
    [hostPhone(images), "关注人气主播，精彩不间断"],
  ];
  return `<section class="download-section download-features"><div class="download-shell"><header class="download-section-heading"><span>APP HIGHLIGHTS</span><h2>App精彩功能</h2><p>从热门直播到即时赛况，把每一场热爱装进口袋，随时随地尽享体育现场。</p></header><div class="download-phone-grid">${items.map((item, index) => `<article class="download-feature">${item[0]}<h3>${["首页 · 直播推荐","直播间 · 实时互动","赛事 · 比分赛程","主播 · 聊天关注"][index]}</h3><p>${item[1]}</p></article>`).join("")}</div></div></section>`;
}

export function downloadPage({ header, footer, images }) {
  const styles = `--football-bg:url('${images.football}');--basketball-bg:url('${images.basketball}')`;
  return `${header()}<main class="download-page" style="${styles}"><section><div class="download-shell download-hero"><div class="download-hero-copy">${downloadHeroCopy()}<div class="download-hero-tags"><span>高清体育直播</span><span>实时赛事比分</span><span>人气主播互动</span><span>多端记录同步</span></div></div><aside class="download-hero-card">${downloadQrCard()}</aside></div></section>${features(images)}<section class="download-section download-tutorial" id="install-guide"><div class="download-shell"><header class="download-section-heading"><span>安装指引</span><h2>安装教程</h2><p>选择苹果桌面快捷方式、苹果快捷版或安卓，按下方步骤开始使用。</p></header><nav class="download-tutorial-tabs" role="tablist"><button class="${activeTutorial === "ios" ? "selected" : ""}" data-download-tab="ios" role="tab" aria-selected="${activeTutorial === "ios"}">苹果</button><button class="${activeTutorial === "webclip" ? "selected" : ""}" data-download-tab="webclip" role="tab" aria-selected="${activeTutorial === "webclip"}">苹果快捷版</button><button class="${activeTutorial === "android" ? "selected" : ""}" data-download-tab="android" role="tab" aria-selected="${activeTutorial === "android"}">安卓</button></nav><div class="download-tutorial-content">${tutorialMarkup()}</div></div></section><div class="download-page-toast" id="downloadPageToast" role="status"></div></main>${footer()}`;
}

function showDownloadToast(text) {
  const toast = document.querySelector("#downloadPageToast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showDownloadToast.timer);
  showDownloadToast.timer = setTimeout(() => toast.classList.remove("show"), 1900);
}

function attemptDownload(platform) {
  const selected = platform === "auto" ? preferredPlatform() : platform;
  const url = downloadUrl(selected);
  if (url) {
    window.location.href = url;
    return;
  }
  showDownloadToast(`${selected === "ios" ? "iOS" : "Android"} 下载即将开放（原型演示）`);
}

function bindPlatformButtons() {
  document.querySelectorAll("[data-platform-download]").forEach(button => {
    button.addEventListener("click", () => attemptDownload(button.dataset.platformDownload));
  });
}

export function bindDownloadPage() {
  document.querySelectorAll("[data-download-tab]").forEach(button => {
    button.addEventListener("click", () => {
      activeTutorial = button.dataset.downloadTab;
      document.querySelectorAll("[data-download-tab]").forEach(item => {
        const selected = item.dataset.downloadTab === activeTutorial;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      const content = document.querySelector(".download-tutorial-content");
      if (content) content.innerHTML = tutorialMarkup();
      bindPlatformButtons();
    });
  });
  bindPlatformButtons();
  if (location.hash.endsWith("#install-guide")) requestAnimationFrame(() => document.querySelector("#install-guide")?.scrollIntoView({ behavior: "smooth" }));
}
