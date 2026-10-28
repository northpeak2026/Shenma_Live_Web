import { beijingDate } from './access-date.js';

const key = 'shenma-access-date';
const gate = document.querySelector('#accessGate');
const form = document.querySelector('#accessForm');
const input = document.querySelector('#accessPassword');
const error = document.querySelector('#accessError');
const root = document.querySelector('#app, #landingApp');
let authorizedDate = null;
let started = false;

function lock() {
  document.documentElement.removeAttribute('data-access');
  root.inert = true;
  gate.hidden = false;
  authorizedDate = null;
}

function currentAuthorization() {
  try {
    return sessionStorage.getItem(key) === beijingDate();
  } catch {
    return false;
  }
}

async function enter() {
  const date = beijingDate();
  if (!currentAuthorization()) return lock();
  try {
    if (!started) {
      if (root.id === 'landingApp') await import('./landing-page.js');
      else await import('./app.js');
      started = true;
    }
    if (date !== beijingDate() || !currentAuthorization()) return lock();
    authorizedDate = date;
    root.inert = false;
    gate.hidden = true;
    document.documentElement.setAttribute('data-access', 'granted');
  } catch {
    lock();
    error.textContent = '页面加载失败，请刷新后重试';
  }
}

function check() {
  if (authorizedDate && (authorizedDate !== beijingDate() || !currentAuthorization())) {
    lock();
    // Remove all previous page handlers, media and timers before the next authorization.
    location.reload();
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (input.value !== beijingDate()) {
    error.textContent = '密码错误，请重试';
    input.setAttribute('aria-invalid', 'true');
    input.select();
    return;
  }
  try {
    sessionStorage.setItem(key, beijingDate());
  } catch {
    error.textContent = '无法保存验证状态，请允许浏览器会话存储后重试';
    return;
  }
  error.textContent = '';
  input.removeAttribute('aria-invalid');
  input.value = '';
  await enter();
});

// Capture before application handlers, including history traversal and resumed tabs.
for (const type of ['focus', 'pageshow', 'popstate', 'hashchange', 'pointerdown', 'keydown', 'click', 'submit']) {
  window.addEventListener(type, event => {
    check();
    if (!authorizedDate && !gate.contains(event.target) && ['pointerdown', 'keydown', 'click', 'submit'].includes(type)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}
document.addEventListener('visibilitychange', check, true);
window.addEventListener('pagehide', () => {
  document.documentElement.removeAttribute('data-access');
  root.inert = true;
  gate.hidden = false;
});
window.addEventListener('pageshow', () => {
  check();
  if (authorizedDate) {
    root.inert = false;
    gate.hidden = true;
    document.documentElement.setAttribute('data-access', 'granted');
  }
});
setInterval(check, 1000);
lock();
if (currentAuthorization()) enter();
else input.focus();
