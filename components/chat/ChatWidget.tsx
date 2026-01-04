"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  PointerEvent,
} from "react";
import ChatMessage from "./ChatMessage";

/**
 * -------------------------
 * Types
 * -------------------------
 */
type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

/**
 * -------------------------
 * Constants (UX constraints)
 * -------------------------
 */
const MIN_W = 280;
const MIN_H = 260;
const MAX_W = 520;
const MAX_H = 640;

const STORAGE_KEY = "h2-physics-chat-widget";

/**
 * -------------------------
 * Helper: clamp value
 * -------------------------
 */
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

/**
 * -------------------------
 * ChatWidget
 * -------------------------
 */
export default function ChatWidget() {
  /**
   * -------------------------
   * Chat state (unchanged logic)
   * -------------------------
   */
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me an H2 Physics question. I will only answer within the H2 syllabus and based on your site notes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function send() {
    if (!canSend) return;

    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data: { reply: string } = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry — something went wrong.\n\nDebug hint: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    } 
  }

  /**
   * -------------------------
   * UI state: open / size
   * -------------------------
   */
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ width: 360, height: 420 });

  /**
   * Restore persisted state
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.size) setSize(parsed.size);
      if (typeof parsed?.open === "boolean") setOpen(parsed.open);
    } catch {
      /* ignore */
    }
  }, []);

  /**
   * Persist state
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ open, size }));
  }, [open, size]);

  /**
   * -------------------------
   * Resize logic (Pointer Events)
   * -------------------------
   */
  const resizingRef = useRef(false);
  const startRef = useRef({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  function onResizeStart(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    resizingRef.current = true;
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = "none";
  }

  function onResizeMove(e: PointerEvent<HTMLDivElement>) {
    if (!resizingRef.current) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    const vw = window.innerWidth * 0.9;
    const vh = window.innerHeight * 0.8;

    setSize({
      width: clamp(startRef.current.w + dx, MIN_W, Math.min(MAX_W, vw)),
      height: clamp(startRef.current.h + dy, MIN_H, Math.min(MAX_H, vh)),
    });
  }

  function onResizeEnd(e: PointerEvent<HTMLDivElement>) {
    resizingRef.current = false;
    document.body.style.userSelect = "";
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  /**
   * -------------------------
   * Scrolling / focus refs
   * -------------------------
   */
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages.length, loading, open]);

  useEffect(() => {
    if (!open) return;
    if (loading) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, loading]);

  /**
   * -------------------------
   * Collapsed button (default)
   * -------------------------
   */
  if (!open) {
    return (
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="
          fixed bottom-5 right-5 z-[60]
          group
          inline-flex items-center gap-2
          h-11
          rounded-full
          bg-slate-950 text-slate-50
          border border-slate-800/80
          shadow-[0_10px_30px_rgba(0,0,0,0.35)]
          px-4
          hover:bg-slate-900
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
          transition
        "
      >
        <span
          aria-hidden
          className="
            grid place-items-center
            h-7 w-7
            rounded-full
            bg-slate-900
            border border-slate-800
            shadow-inner
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 8h10M7 12h6M7 16h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="text-sm font-medium tracking-tight">AI Tutor</span>
        <span
          className="
            text-[11px]
            text-slate-300/90
            hidden sm:inline
          "
        >
          H2 Physics
        </span>
      </button>
    );
  }

  /**
   * -------------------------
   * Expanded panel
   * -------------------------
   */
  return (
    <section
      aria-label="H2 Physics AI Tutor"
      className="
        fixed bottom-5 right-5 z-[60]
        text-slate-50
      "
      style={{
        width: size.width,
        height: size.height,
        maxWidth: "90vw",
        maxHeight: "80vh",
      }}
    >
      <div
        className="
          relative
          h-full w-full
          rounded-2xl
          border border-slate-800/80
          bg-gradient-to-b from-slate-950 to-slate-900
          shadow-[0_18px_60px_rgba(0,0,0,0.45)]
          overflow-hidden
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-4 py-3
            border-b border-slate-800/70
            bg-slate-950/70
            backdrop-blur
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="
                  inline-flex h-7 w-7 items-center justify-center
                  rounded-lg
                  bg-slate-900
                  border border-slate-800
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-slate-200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2l3 6 7 .8-5.2 4.5 1.6 6.7L12 17.8 5.6 20l1.6-6.7L2 8.8 9 8l3-6z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 truncate">
                  H2 Physics Tutor
                </p>
                <p className="text-xs text-slate-300/90 truncate">
                  Grounded in your site notes • Syllabus-only
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`
                hidden sm:inline-flex items-center gap-2
                text-xs
                px-2 py-1
                rounded-full
                border
                ${
                  loading
                    ? "border-slate-700 text-slate-200 bg-slate-900/60"
                    : "border-slate-800 text-slate-300 bg-slate-900/30"
                }
              `}
              aria-live="polite"
            >
              <span
                aria-hidden
                className={`
                  inline-block h-1.5 w-1.5 rounded-full
                  ${loading ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}
                `}
              />
              {loading ? "Thinking…" : "Ready"}
            </span>

            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="
                inline-flex items-center justify-center
                h-9 w-9
                rounded-lg
                text-slate-300
                hover:text-white
                hover:bg-slate-900/60
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                transition
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            px-3 py-3
            sm:px-4
            sm:py-4
            space-y-3
            [scrollbar-width:thin]
            [scrollbar-color:rgba(148,163,184,0.45)_transparent]
          "
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="mx-auto w-full max-w-[44rem] space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`
                  w-full
                  ${m.role === "user" ? "flex justify-end" : "flex justify-start"}
                `}
              >
                <div
                  className={`
                    min-w-0
                    w-full
                    max-w-[90%]
                    ${
                      m.role === "user"
                        ? "rounded-2xl rounded-br-md bg-white text-slate-950 border border-white/10 shadow-sm"
                        : "rounded-2xl rounded-bl-md bg-slate-900/60 text-slate-50 border border-slate-800/70"
                    }
                    px-3.5 py-2.5
                  `}
                >
                  <div className="min-w-0">
                    <ChatMessage role={m.role} content={m.content} />
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    min-w-0
                    w-full
                    max-w-[90%]
                    rounded-2xl rounded-bl-md
                    bg-slate-900/60
                    border border-slate-800/70
                    px-3.5 py-2.5
                  "
                >
                  <ChatMessage
                    role="assistant"
                    content="Thinking… (checking your notes)"
                  />
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Input */}
        <div
          className="
            border-t border-slate-800/70
            bg-slate-950/70
            backdrop-blur
            px-3 py-3
            sm:px-4
          "
        >
          <div className="mx-auto w-full max-w-[44rem]">
            <div
              className="
                flex items-end gap-2
                rounded-2xl
                border border-slate-800/80
                bg-slate-950/70
                px-2.5 py-2.5
                shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]
              "
            >
              <div className="flex-1 min-w-0">
                <label htmlFor="h2-chat-input" className="sr-only">
                  Ask an H2 Physics question
                </label>
                <input
                  id="h2-chat-input"
                  ref={inputRef}
                  className="
                    w-full
                    bg-transparent
                    text-[14px]
                    leading-6
                    text-slate-100
                    placeholder:text-slate-400
                    outline-none
                    px-2
                    py-1.5
                    disabled:opacity-60
                    min-w-0
                  "
                  placeholder="Ask an H2 Physics question…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  disabled={loading}
                />
                <div className="mt-1 flex items-center justify-between px-2">
                  <p className="text-[11px] text-slate-400/90">
                    Enter to send
                    <span className="hidden sm:inline"> • Shift+Enter not supported</span>
                  </p>
                  <p className="text-[11px] text-slate-400/80">
                    {loading ? "Sending…" : " "}
                  </p>
                </div>
              </div>

              <button
                onClick={send}
                disabled={!canSend}
                className="
                  inline-flex items-center justify-center
                  h-10
                  px-3.5
                  rounded-xl
                  text-sm font-semibold
                  bg-white text-slate-950
                  hover:bg-slate-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                  transition
                  shrink-0
                "
                aria-label="Send message"
              >
                <span className="hidden sm:inline">Send</span>
                <span className="sm:hidden" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 11.5l18-8-6.5 18-2.8-7.2L3 11.5z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Resize handle */}
        <div
          aria-hidden
          className="
            absolute bottom-2 right-2
            h-8 w-8
            cursor-se-resize
            rounded-xl
            hover:bg-slate-800/40
            active:bg-slate-800/60
            transition
          "
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
          onPointerCancel={onResizeEnd}
          title="Resize"
        >
          <div
            className="
              absolute bottom-2 right-2
              h-4 w-4
              opacity-70
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-300"
            >
              <path
                d="M6 14L14 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10 14L14 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M2 14L14 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
