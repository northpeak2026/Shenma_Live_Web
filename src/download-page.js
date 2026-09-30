import { downloadConfig, downloadUrl, preferredPlatform } from "./download-config.js";

let activeTutorial = "ios";

const tutorialData = {
  ios: {
    eyebrow: "超级签安装方式",
    title: "iOS 安装教程",
    action: "iOS 立即下载",
    steps: [
      ["扫描二维码或点击立即下载", "请使用 Safari 打开神马直播下载页。", "⌁"],
      ["点击安装", "根据下载页面提示，确认安装神马直播 App。", "↓"],
      ["等待 App 安装完成", "返回手机桌面，即可查看 App 安装进度。", "…"],
      ["完成设备授权", "如系统要求授权或信任，请按照提示完成操作。", "✓"],
      ["打开神马直播", "授权完成后，即可畅享体育直播与互动。", "▶"],
    ],
  },
  android: {
    eyebrow: "APK 安装方式",
    title: "Android 安装教程",
    action: "Android 立即下载",
    steps: [
      ["下载 APK", "扫描二维码或点击按钮下载 Android 安装包。", "↓"],
      ["打开安装包", "下载完成后，在浏览器下载列表中点击 APK。", "▣"],
      ["允许安装应用", "如系统提示，请开启本次未知来源应用安装权限。", "✓"],
      ["完成安装", "点击安装并稍候片刻，等待安装进度完成。", "…"],
      ["打开神马直播", "安装成功后，点击图标即可进入神马直播。", "▶"],
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
  return `<div class="tutorial-intro"><span><b>${data.title}</b><small>${data.eyebrow}</small></span><button class="tutorial-download-button" type="button" data-platform-download="${activeTutorial}">${data.action}</button></div><div class="tutorial-steps">${data.steps.map((step, index) => `<article class="tutorial-step"><span class="tutorial-step-number">${String(index + 1).padStart(2, "0")}</span><h3>${step[0]}</h3><p>${step[1]}</p><div class="tutorial-phone"><div class="tutorial-phone-bar">9:41　　神马直播</div><div class="tutorial-phone-screen"><i>${step[2]}</i><b>${step[0]}</b><small>${activeTutorial === "ios" ? "Safari · 神马直播" : "Android · 神马直播 APK"}</small>${index < 4 ? `<button>${index === 0 ? "立即下载" : "继续"}</button>` : ""}</div></div></article>`).join("")}</div>`;
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
  return `${header()}<main class="download-page" style="${styles}"><section><div class="download-shell download-hero"><div class="download-hero-copy"><div class="download-hero-brand"><span class="brand-mark">${downloadConfig.logoLetter}</span><span>${downloadConfig.appName}</span></div><h1>看直播 <em>上神马</em></h1><p class="download-slogans"><span>网红女神直播 · 行业专家赛前预测</span><span>体育视听盛宴 · 万千佳人相伴</span></p><div class="download-hero-tags"><span>高清体育直播</span><span>实时赛事比分</span><span>人气主播互动</span><span>多端记录同步</span></div></div><aside class="download-hero-card"><div class="download-hero-card-head"><span class="brand-mark">${downloadConfig.logoLetter}</span><b>${downloadConfig.appName}</b></div><img class="download-hero-qr" src="${downloadConfig.qrCode}" alt="神马直播 App 下载二维码"><h2>扫描二维码下载 App</h2><p>随时随地，打开精彩体育现场</p></aside></div></section>${features(images)}<section class="download-section download-tutorial" id="install-guide"><div class="download-shell"><header class="download-section-heading"><span>INSTALL GUIDE</span><h2>安装教程</h2><p>根据你的手机系统选择安装方式，按照步骤即可快速开始使用神马直播。</p></header><nav class="download-tutorial-tabs" role="tablist"><button class="${activeTutorial === "ios" ? "selected" : ""}" data-download-tab="ios" role="tab" aria-selected="${activeTutorial === "ios"}">iOS</button><button class="${activeTutorial === "android" ? "selected" : ""}" data-download-tab="android" role="tab" aria-selected="${activeTutorial === "android"}">Android</button></nav><div class="download-tutorial-content">${tutorialMarkup()}</div></div></section><div class="download-page-toast" id="downloadPageToast" role="status"></div></main>${footer()}`;
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
  if (location.hash === "#install-guide") requestAnimationFrame(() => document.querySelector("#install-guide")?.scrollIntoView({ behavior: "smooth" }));
}
