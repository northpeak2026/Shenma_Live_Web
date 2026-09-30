import qrCode from "./assets/shenma-download-qr.svg";

// Replace these two URLs when the production packages are ready.
export const downloadConfig = {
  appName: "神马直播",
  logoLetter: "S",
  qrCode,
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
