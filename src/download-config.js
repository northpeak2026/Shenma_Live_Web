import qrCode from "./assets/shenma-download-qr.svg";

// Replace these two URLs when the production packages are ready.
export const downloadConfig = {
  appName: "神马直播",
  logoLetter: "S",
  qrCode,
  h5Url: import.meta.env.VITE_H5_SITE_URL || 'https://smzb999.com/',
  iosUrl: "",
  androidUrl: "",
};

export function preferredPlatform() {
  const agent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|macintosh/.test(agent) ? "ios" : "android";
}

export function downloadUrl(platform = preferredPlatform()) {
  return platform === "ios" ? downloadConfig.iosUrl : downloadConfig.androidUrl;
}
