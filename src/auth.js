const AUTH_STORAGE_KEY = "shenma-live-web-auth";

const MOCK_USER = {
  id: "mock-user",
  nickname: "神马球迷 8842",
  userId: "SM884208",
  avatar: "https://i.pravatar.cc/160?img=49",
};

const initialForm = () => ({
  phone: "",
  code: "",
  password: "",
  newPassword: "",
  confirmPassword: "",
});

const readStoredUser = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return stored?.id ? stored : null;
  } catch {
    return null;
  }
};

let currentUser = readStoredUser();
let modalOpen = false;
let intent = "login";
let view = "code";
let form = initialForm();
let visibility = { password: false, newPassword: false, confirmPassword: false };
let countdown = 0;
let countdownTimer = null;
let successTimer = null;
let escapeBound = false;

const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const validPhone = (value) => /^\d{11}$/.test(value);

const eyeIcon = (visible) => visible
  ? `<svg class="auth-eye-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="2.7"></circle></svg>`
  : `<svg class="auth-eye-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.2 8.8C2.7 9.5 2.5 10 2.5 10s3.5 6 9.5 6c1.3 0 2.5-.3 3.5-.7"></path><path d="M20.8 13.2c.5-.7.7-1.2.7-1.2S18 6 12 6c-1.3 0-2.5.3-3.5.7"></path><path d="M4 4l16 16"></path></svg>`;

export const getAuthUser = () => currentUser;

const guestAvatar = () => `<span class="guest-avatar-figure" aria-hidden="true"><i></i><b></b></span>`;

export function authHeaderArea() {
  if (currentUser) {
    return `<div class="auth-entry is-logged-in">
      <button class="avatar-btn auth-avatar-btn" type="button" aria-label="打开用户菜单" aria-haspopup="menu">
        <img src="${currentUser.avatar}" alt="${escapeHTML(currentUser.nickname)}">
        <span class="online-dot"></span>
      </button>
      <section class="auth-popover auth-user-menu" role="menu" aria-label="用户菜单">
        <div class="auth-user-summary">
          <img src="${currentUser.avatar}" alt="">
          <span><b>${escapeHTML(currentUser.nickname)}</b><small>ID：${escapeHTML(currentUser.userId)}</small></span>
        </div>
        <a href="/#/profile/${currentUser.id}" role="menuitem"><span>个人中心</span><b>›</b></a>
        <button type="button" data-auth-logout role="menuitem"><span>退出登录</span><b>↗</b></button>
      </section>
    </div>`;
  }

  const benefitIcon = paths => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const benefits = [
    [benefitIcon('<rect x="3" y="4" width="18" height="15" rx="3"/><path d="m10 8 6 4-6 4Z"/>'), "蓝光10M超清画质畅快看"],
    [benefitIcon('<path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h7"/>'), "美女陪你看球，弹幕礼物互动"],
    [benefitIcon('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5"/>'), "五大联赛/NBA赛事随心订阅"],
    [benefitIcon('<rect x="2" y="4" width="14" height="11" rx="2"/><path d="M5 20h8m-4-5v5"/><rect x="17" y="9" width="5" height="12" rx="1"/>'), "多端同步观看，播放记录不丢"],
  ];
  return `<div class="auth-entry is-guest">
    <button class="avatar-btn auth-avatar-btn guest-avatar" type="button" aria-label="登录或注册" aria-haspopup="dialog">${guestAvatar()}</button>
    <section class="auth-popover auth-guide" aria-label="登录引导">
      <h3>登录后可享受</h3>
      <ul>${benefits.map(([icon, label]) => `<li><i>${icon}</i><span>${label}</span></li>`).join("")}</ul>
      <div class="auth-guide-actions">
        <button class="auth-primary" type="button" data-auth-open="login">登录</button>
      </div>
    </section>
  </div>`;
}

function phoneInput() {
  return `<label class="auth-field">
    <span>手机号</span>
    <div class="auth-phone-input">
      <b>+86</b><i></i>
      <input type="tel" inputmode="numeric" maxlength="11" autocomplete="tel" data-auth-field="phone" value="${escapeHTML(form.phone)}" placeholder="请输入中国大陆手机号">
    </div>
    <small class="auth-field-error" data-phone-error></small>
  </label>`;
}

function codeInput() {
  const sendText = countdown > 0 ? `重新获取 ${countdown}s` : "获取验证码";
  return `<label class="auth-field">
    <span>验证码</span>
    <div class="auth-code-input">
      <input type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" data-auth-field="code" value="${escapeHTML(form.code)}" placeholder="请输入验证码">
      <button type="button" data-auth-code-send ${!validPhone(form.phone) || countdown > 0 ? "disabled" : ""}>${sendText}</button>
    </div>
  </label>`;
}

function passwordInput(field, label, placeholder) {
  const visible = visibility[field];
  return `<label class="auth-field">
    <span>${label}</span>
    <div class="auth-password-input">
      <input type="${visible ? "text" : "password"}" autocomplete="${field === "password" ? "current-password" : "new-password"}" data-auth-field="${field}" value="${escapeHTML(form[field])}" placeholder="${placeholder}">
      <button type="button" data-auth-password-toggle="${field}" aria-label="${visible ? "隐藏" : "显示"}${label}">${eyeIcon(visible)}</button>
    </div>
    ${field === "confirmPassword" ? `<small class="auth-field-error" data-password-error>${form.confirmPassword && form.newPassword !== form.confirmPassword ? "两次输入的密码不一致" : ""}</small>` : ""}
  </label>`;
}

const submitEnabled = () => {
  if (view === "code") return validPhone(form.phone) && Boolean(form.code.trim());
  if (view === "password") return validPhone(form.phone) && Boolean(form.password);
  if (view === "forgot-phone") return validPhone(form.phone) && Boolean(form.code.trim());
  if (view === "forgot-password") return Boolean(form.newPassword) && form.newPassword === form.confirmPassword;
  return false;
};

function loginTabs() {
  if (intent === "register") return "";
  return `<nav class="auth-tabs" role="tablist">
    <button type="button" class="${view === "code" ? "selected" : ""}" data-auth-tab="code" role="tab" aria-selected="${view === "code"}">验证码登录</button>
    <button type="button" class="${view === "password" ? "selected" : ""}" data-auth-tab="password" role="tab" aria-selected="${view === "password"}">密码登录</button>
  </nav>`;
}

function modalContent() {
  if (view === "forgot-success") {
    return `<div class="auth-success" role="status"><i>✓</i><h3>密码修改完成</h3><p>正在返回密码登录…</p></div>`;
  }

  if (view === "forgot-phone") {
    return `<div class="auth-flow-title"><span>忘记密码</span><h3>验证手机号</h3><p>验证通过后即可设置新密码</p></div>
      <form class="auth-form" data-auth-form>${phoneInput()}${codeInput()}
        <button class="auth-submit" type="submit" data-auth-submit ${submitEnabled() ? "" : "disabled"}>下一步</button>
      </form>
      <button class="auth-back-login" type="button" data-auth-return>← 返回登录</button>`;
  }

  if (view === "forgot-password") {
    return `<div class="auth-flow-title"><span>忘记密码</span><h3>设置新密码</h3><p>请设置一个便于记忆的新密码</p></div>
      <form class="auth-form" data-auth-form>${passwordInput("newPassword", "输入新密码", "请输入新密码")}${passwordInput("confirmPassword", "再次输入新密码", "请再次输入新密码")}
        <button class="auth-submit" type="submit" data-auth-submit ${submitEnabled() ? "" : "disabled"}>下一步</button>
      </form>
      <button class="auth-back-login" type="button" data-auth-return>← 返回登录</button>`;
  }

  const isCode = view === "code";
  const title = intent === "register" ? "注册神马直播" : "欢迎登录神马直播";
  const subtitle = intent === "register" ? "手机号验证后将自动创建平台账号" : "登录后，精彩赛事与互动体验不中断";
  return `<div class="auth-modal-heading"><span class="brand-mark">S</span><div><h2>${title}</h2><p>${subtitle}</p></div></div>
    ${loginTabs()}
    <form class="auth-form" data-auth-form>
      ${phoneInput()}
      ${isCode ? codeInput() : passwordInput("password", "密码", "请输入密码")}
      ${!isCode && intent === "login" ? `<button class="auth-forgot" type="button" data-auth-forgot>忘记密码？</button>` : ""}
      <p class="auth-account-note">未注册的手机号将自动创建神马直播平台账号</p>
      <button class="auth-submit" type="submit" data-auth-submit ${submitEnabled() ? "" : "disabled"}>${intent === "register" ? "注册并登录" : "登录"}</button>
    </form>
    ${intent === "register" ? `<button class="auth-back-login" type="button" data-auth-switch-login>已有账号，返回登录</button>` : ""}`;
}

function modalInner() {
  return `<button class="auth-modal-close" type="button" data-auth-close aria-label="关闭">×</button>${modalContent()}`;
}

export function authModal() {
  if (!modalOpen) return "";
  return `<div class="auth-modal-backdrop" data-auth-backdrop>
    <section class="auth-modal" role="dialog" aria-modal="true" aria-label="${intent === "register" ? "注册" : "登录"}">${modalInner()}</section>
  </div>`;
}

function openModal(nextIntent, rerender) {
  clearTimeout(successTimer);
  intent = nextIntent;
  view = "code";
  form = initialForm();
  visibility = { password: false, newPassword: false, confirmPassword: false };
  modalOpen = true;
  rerender();
  requestAnimationFrame(() => document.querySelector("[data-auth-field=phone]")?.focus());
}

function closeModal(rerender) {
  clearTimeout(successTimer);
  modalOpen = false;
  rerender();
}

function updateModal(rerender, focusField = null) {
  const modal = document.querySelector(".auth-modal");
  if (!modal) {
    rerender();
    return;
  }
  modal.setAttribute("aria-label", intent === "register" ? "注册" : "登录");
  modal.innerHTML = modalInner();
  bindModal(rerender);
  if (focusField) requestAnimationFrame(() => document.querySelector(`[data-auth-field=${focusField}]`)?.focus());
}

function refreshControls() {
  const submit = document.querySelector("[data-auth-submit]");
  if (submit) submit.disabled = !submitEnabled();
  const send = document.querySelector("[data-auth-code-send]");
  if (send) {
    send.disabled = !validPhone(form.phone) || countdown > 0;
    send.textContent = countdown > 0 ? `重新获取 ${countdown}s` : "获取验证码";
  }
  const phoneError = document.querySelector("[data-phone-error]");
  if (phoneError) phoneError.textContent = form.phone && !validPhone(form.phone) ? "请输入有效的 11 位手机号" : "";
  const passwordError = document.querySelector("[data-password-error]");
  if (passwordError) passwordError.textContent = form.confirmPassword && form.newPassword !== form.confirmPassword ? "两次输入的密码不一致" : "";
}

function startCountdown() {
  if (countdown > 0 || !validPhone(form.phone)) return;
  countdown = 60;
  refreshControls();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown -= 1;
    refreshControls();
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }, 1000);
}

function completeLogin(rerender) {
  currentUser = { ...MOCK_USER, phone: form.phone };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
  modalOpen = false;
  rerender();
}

function handleSubmit(rerender) {
  if (!submitEnabled()) return;
  if (view === "code" || view === "password") {
    completeLogin(rerender);
    return;
  }
  if (view === "forgot-phone") {
    view = "forgot-password";
    form.newPassword = "";
    form.confirmPassword = "";
    updateModal(rerender, "newPassword");
    return;
  }
  if (view === "forgot-password") {
    view = "forgot-success";
    updateModal(rerender);
    successTimer = setTimeout(() => {
      view = "password";
      intent = "login";
      form.password = "";
      form.newPassword = "";
      form.confirmPassword = "";
      updateModal(rerender, "password");
    }, 1200);
  }
}

function bindModal(rerender) {
  document.querySelector("[data-auth-close]")?.addEventListener("click", () => closeModal(rerender));
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      view = button.dataset.authTab;
      form.code = "";
      form.password = "";
      updateModal(rerender, view === "code" ? "code" : "password");
    });
  });
  document.querySelectorAll("[data-auth-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.dataset.authField;
      form[field] = field === "phone" ? input.value.replace(/\D/g, "").slice(0, 11) : input.value;
      if (field === "phone" && input.value !== form[field]) input.value = form[field];
      refreshControls();
    });
  });
  document.querySelector("[data-auth-code-send]")?.addEventListener("click", startCountdown);
  document.querySelectorAll("[data-auth-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.authPasswordToggle;
      const input = button.closest(".auth-password-input")?.querySelector("input");
      visibility[field] = !visibility[field];
      if (input) {
        input.type = visibility[field] ? "text" : "password";
        input.focus();
      }
      button.innerHTML = eyeIcon(visibility[field]);
      button.setAttribute("aria-label", `${visibility[field] ? "隐藏" : "显示"}密码`);
    });
  });
  document.querySelector("[data-auth-forgot]")?.addEventListener("click", () => {
    view = "forgot-phone";
    form.code = "";
    updateModal(rerender, "phone");
  });
  document.querySelector("[data-auth-return]")?.addEventListener("click", () => {
    view = "password";
    intent = "login";
    form.password = "";
    form.newPassword = "";
    form.confirmPassword = "";
    updateModal(rerender, "password");
  });
  document.querySelector("[data-auth-switch-login]")?.addEventListener("click", () => {
    intent = "login";
    view = "code";
    updateModal(rerender, "phone");
  });
  document.querySelector("[data-auth-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSubmit(rerender);
  });
}

export function bindAuth(rerender) {
  document.querySelectorAll("[data-auth-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.authOpen, rerender));
  });
  document.querySelector("[data-auth-backdrop]")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeModal(rerender);
  });
  document.querySelector("[data-auth-logout]")?.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (location.hash === "#/profile/mock-user") location.hash = "#/";
    else rerender();
  });
  bindModal(rerender);

  if (!escapeBound) {
    escapeBound = true;
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modalOpen) closeModal(rerender);
    });
  }
}
