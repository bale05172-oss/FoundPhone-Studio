// 朋友圈跳转请求 + 运行时通知推送的轻量事件总线。
// 供 WeChatSkin（朋友圈）与 Phone（横幅/通知中心）跨组件通信。
type JumpListener = () => void;
const jumpListeners = new Set<JumpListener>();
let pendingJumps = 0;
export function requestMomentsJump() {
  pendingJumps++;
  jumpListeners.forEach((l) => l());
}
export function consumeMomentsJump() {
  if (pendingJumps > 0) {
    pendingJumps = 0;
    return true;
  }
  return false;
}
export function onMomentsJump(l: JumpListener) {
  jumpListeners.add(l);
  return () => {
    jumpListeners.delete(l);
  };
}

type NoticeListener = (text: string) => void;
const noticeListeners = new Set<NoticeListener>();
export function pushNotice(text: string) {
  noticeListeners.forEach((l) => l(text));
}
export function onNotice(l: NoticeListener) {
  noticeListeners.add(l);
  return () => {
    noticeListeners.delete(l);
  };
}

// 用于识别“朋友圈相关”通知：点击后应直达微信朋友圈
export function isMomentsNotice(body: string) {
  return body.includes("发了一条朋友圈") || body.includes("回复了你");
}
