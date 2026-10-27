import { useEffect, useRef, useState } from "react";
import { safeMedia, type Item } from "./schema";

type SuspendSource = "call" | "file";

interface Snapshot {
  current: Item | null;
  playing: boolean;
  suspendedBy: SuspendSource | null;
  popup: string;
}

let audioEl: HTMLAudioElement | null = null;
let queue: Item[] = [];
let index = 0;
let playing = false;
let suspendedBy: SuspendSource | null = null;
let autoStarted = false;
let popupText = "";
let popupTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const snap: Snapshot = {
  current: null,
  playing: false,
  suspendedBy: null,
  popup: "",
};

function emit() {
  for (const l of listeners) l();
}

function showPopup(text: string) {
  popupText = text;
  emit();
  if (popupTimer) clearTimeout(popupTimer);
  popupTimer = setTimeout(() => {
    popupText = "";
    emit();
  }, 3600);
}

function playNow() {
  if (!audioEl || !snap.current) return;
  const src = safeMedia(snap.current.media);
  if (!src) return;
  audioEl.src = src;
  const p = audioEl.play();
  if (p) p.then(() => { playing = true; emit(); }).catch(() => { /* autoplay 被浏览器拦截 */ });
}

function load(at: number) {
  index = at;
  snap.current = queue[index] ?? null;
  emit();
  if (snap.current) {
    showPopup(`${snap.current.sender} - ${snap.current.title}`);
    playNow();
  }
}

export function musicSetAudio(el: HTMLAudioElement | null) {
  audioEl = el;
}

export function musicIsAutoStarted() {
  return autoStarted;
}

/** 以给定顺序启动歌单（auto=true 表示由解锁自动触发） */
export function musicStartQueue(items: Item[], auto = false) {
  queue = [...items];
  if (!queue.length) return;
  if (auto) autoStarted = true;
  load(0);
}

/** 点击单曲：若在歌单内从该曲开始，否则单曲播放 */
export function musicPlayItem(item: Item) {
  const i = queue.findIndex((q) => q.id === item.id);
  if (i >= 0) load(i);
  else {
    queue = [item];
    load(0);
  }
}

export function musicToggle() {
  if (!audioEl || !snap.current) return;
  if (playing) {
    audioEl.pause();
    playing = false;
  } else {
    playNow();
  }
  emit();
}

export function musicNext() {
  if (!queue.length) return;
  load((index + 1) % queue.length);
}

export function musicPrevious() {
  if (!queue.length) return;
  load((index - 1 + queue.length) % queue.length);
}

/** 其它音频（来电语音 / 文件录音）开始播放时暂停音乐 */
export function musicSuspend(source: SuspendSource) {
  if (!playing) return;
  suspendedBy = source;
  playing = false;
  audioEl?.pause();
  emit();
}

/** 其它音频结束后恢复音乐 */
export function musicResume(source: SuspendSource) {
  if (suspendedBy !== source) return;
  suspendedBy = null;
  if (audioEl && snap.current) playNow();
  emit();
}

/** 故事重开时重置音乐 */
export function musicReset() {
  autoStarted = false;
  suspendedBy = null;
  playing = false;
  queue = [];
  index = 0;
  snap.current = null;
  popupText = "";
  if (popupTimer) clearTimeout(popupTimer);
  if (audioEl) {
    audioEl.pause();
    audioEl.removeAttribute("src");
  }
  emit();
}

export function useMusic(): Snapshot {
  const [state, setState] = useState<Snapshot>({ ...snap });
  useEffect(() => {
    const fn = () =>
      setState({
        current: snap.current,
        playing,
        suspendedBy,
        popup: popupText,
      });
    listeners.add(fn);
    fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return state;
}

/**
 * 全局音乐宿主：隐藏音频元素 + 弹窗（正在播放）+ 后台迷你播放条。
 * 挂载在 Phone 根节点，切换 App 时音乐不中断（后台播放）。
 */
export function MusicHost({
  visible,
  onOpenSpotify,
}: {
  visible: boolean;
  onOpenSpotify: () => void;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    musicSetAudio(ref.current);
    return () => musicSetAudio(null);
  }, []);
  const s = useMusic();
  return (
    <>
      <audio
        ref={ref}
        style={{ display: "none" }}
        onEnded={() => musicNext()}
      />
      {s.popup && (
        <div className="now-playing-popup" role="status">
          <span className="npp-mark">♪</span>
          <div className="npp-text">
            <small>正在播放</small>
            <strong>{s.popup}</strong>
          </div>
        </div>
      )}
      {visible && s.current && (
        <div className="now-playing-bar">
          <button
            className="npb-art"
            aria-label="打开 Spotify"
            onClick={onOpenSpotify}
          >
            ♪
          </button>
          <button
            className="npb-info"
            aria-label="当前歌曲"
            onClick={onOpenSpotify}
          >
            <strong>{s.current.title}</strong>
            <small>{s.current.sender}</small>
          </button>
          <button
            className="npb-toggle"
            aria-label={s.playing ? "暂停音乐" : "播放音乐"}
            onClick={musicToggle}
          >
            {s.playing ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </>
  );
}
