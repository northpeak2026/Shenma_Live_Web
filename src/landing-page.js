import { heroPreview,bindSceneAnimations,bindCarousel } from './landing-scenes.js';
import { downloadHeroCopy,downloadQrCard } from './download-visual.js';
import { downloadUrl } from './download-config.js';
import { landingConfig } from './landing-config.js';
import './download-page.css';
import './landing-page.css';
import './landing-scenes.css';
document.querySelector('#landingApp').innerHTML=`<main class="download-page landing-page" style="--football-bg:url('${landingConfig.footballBackground}');--basketball-bg:url('${landingConfig.basketballBackground}')"><section><div class="download-shell download-hero"><div class="download-hero-copy">${downloadHeroCopy()}<div class="landing-actions"><a class="landing-watch" href="${landingConfig.mainSiteUrl}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>在线观看</a><button class="landing-download" type="button" id="openDownload"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></svg>下载 App</button></div></div>${heroPreview()}</div></section></main><dialog class="landing-download-dialog" aria-label="下载神马直播 App"><button class="landing-close" type="button" aria-label="关闭下载面板">×</button><div class="download-hero-card">${downloadQrCard()}<button class="landing-watch landing-package-download" type="button">立即下载</button><p class="landing-download-feedback" role="status" aria-live="polite"></p></div></dialog>`;
const dialog=document.querySelector('dialog');
document.querySelector('#openDownload').onclick=()=>dialog.showModal();
document.querySelector('.landing-close').onclick=()=>dialog.close();
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});
document.querySelector('.landing-package-download').onclick=()=>{const url=downloadUrl();if(url)location.href=url;else document.querySelector('.landing-download-feedback').textContent='下载即将开放，请先体验在线观看'};

bindSceneAnimations();

bindCarousel();
