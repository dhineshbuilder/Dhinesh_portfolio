import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaCheck,
    FaCopy,
    FaPaperPlane,
    FaRotateRight,
    FaTrash,
    FaWandMagicSparkles,
    FaXmark,
} from "react-icons/fa6";

const SUGGESTED_QUESTIONS = [
    "Tell me about your projects",
    "What technologies do you use?",
    "What are your achievements?",
    "Show me your best project",
    "What is your strongest skill?",
    "How can I contact you?",
];

const createMessageId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createBotMessage = (content, sourceBadges = ["About"]) => ({
    id: createMessageId(),
    role: "assistant",
    content,
    sourceBadges,
});

const createUserMessage = (content) => ({
    id: createMessageId(),
    role: "user",
    content,
    sourceBadges: [],
});

const INITIAL_MESSAGE = createBotMessage(
    "Hi, I am Dhinesh's portfolio assistant. Ask me about projects, skills, achievements, certifications, or contact details.",
    ["About"]
);

const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 px-1 py-2">
        {[0, 1, 2].map((dot) => (
            <span
                key={dot}
                className="h-2 w-2 animate-pulse rounded-full bg-accent/60"
                style={{ animationDelay: `${dot * 140}ms` }}
            />
        ))}
    </div>
);

const SourceBadges = ({ badges = [] }) => {
    if (!badges.length) {
        return null;
    }

    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
                <span
                    key={badge}
                    className="rounded-full border border-accent/15 bg-accent/10 px-2 py-0.5 text-[0.64rem] font-black uppercase tracking-[0.12em] text-accent"
                >
                    {badge}
                </span>
            ))}
        </div>
    );
};

const ChatMessage = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === "user";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1300);
    };

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[86%] ${isUser ? "text-right" : "text-left"}`}>
                <div
                    className={`rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        isUser
                            ? "bg-accent text-onaccent"
                            : "border border-main/10 bg-white/[0.92] text-main/80"
                    }`}
                >
                    <p className="whitespace-pre-line">{message.content}</p>
                </div>

                {!isUser && (
                    <div className="mt-1.5 flex items-center gap-2">
                        <SourceBadges badges={message.sourceBadges} />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-main/10 bg-white/70 text-main/50 transition-colors hover:border-accent/25 hover:text-accent"
                            aria-label="Copy response"
                        >
                            {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PortfolioChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const visibleHistory = useMemo(
        () => messages.map(({ role, content }) => ({ role, content })),
        [messages]
    );

    useEffect(() => {
        if (!scrollRef.current) {
            return;
        }

        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        if (isOpen) {
            window.setTimeout(() => inputRef.current?.focus(), 180);
        }
    }, [isOpen]);

    const resetChat = () => {
        setMessages([INITIAL_MESSAGE]);
        setInput("");
        setError("");
    };

    const sendMessage = async (question = input) => {
        const cleanQuestion = question.trim();

        if (!cleanQuestion || isLoading) {
            return;
        }

        const userMessage = createUserMessage(cleanQuestion);
        setMessages((current) => [...current, userMessage]);
        setInput("");
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: cleanQuestion,
                    history: visibleHistory.slice(-8),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.answer || "The chatbot service is not available right now.");
            }

            setMessages((current) => [
                ...current,
                createBotMessage(data.answer, data.sourceBadges || []),
            ]);
        } catch (requestError) {
            const fallback =
                requestError.message ||
                "I could not connect to the portfolio chatbot. Please try again shortly.";

            setError(fallback);
            setMessages((current) => [
                ...current,
                createBotMessage(fallback, ["Website"]),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
            <div
                className={`mb-4 w-[calc(100vw-2rem)] max-w-[25rem] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_26px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all duration-300 sm:w-[25rem] ${
                    isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-5 opacity-0"
                }`}
            >
                <div className="border-b border-main/10 bg-[linear-gradient(135deg,rgba(248,250,252,0.98)_0%,rgba(239,246,255,0.96)_58%,rgba(236,254,255,0.94)_100%)] px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-white shadow-sm">
                            <img
                                src="/favicon.svg"
                                alt=""
                                draggable={false}
                                className="h-8 w-8"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-black text-main">
                                Dhinesh Portfolio Assistant
                            </h2>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-main/60">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                                Online for portfolio questions
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetChat}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-main/10 bg-white/80 text-main/60 transition-colors hover:border-accent/25 hover:text-accent"
                            aria-label="Restart chat"
                        >
                            <FaRotateRight size={13} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-main/10 bg-white/80 text-main/60 transition-colors hover:border-accent/25 hover:text-accent"
                            aria-label="Close chat"
                        >
                            <FaXmark size={15} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="h-[min(18rem,calc(100svh-23rem))] overflow-y-auto bg-[linear-gradient(135deg,#F8FAFC_0%,#EFF6FF_100%)] px-4 py-4"
                >
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-[20px] border border-main/10 bg-white/[0.92] px-4 py-2 shadow-sm">
                                    <TypingIndicator />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-main/10 bg-white px-4 py-3">
                    <div className="mb-3 grid grid-cols-2 gap-2">
                        {SUGGESTED_QUESTIONS.map((question) => (
                            <button
                                key={question}
                                type="button"
                                onClick={() => sendMessage(question)}
                                disabled={isLoading}
                                className="min-h-10 rounded-2xl border border-accent/15 bg-accent/[0.08] px-3 py-2 text-left text-[0.72rem] font-bold leading-tight text-accent transition-colors hover:border-accent/30 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {question}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-end gap-2">
                        <label className="sr-only" htmlFor="portfolio-chat-input">
                            Ask about Dhinesh portfolio
                        </label>
                        <textarea
                            id="portfolio-chat-input"
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    sendMessage();
                                }
                            }}
                            rows={1}
                            placeholder="Ask about projects, skills, achievements..."
                            className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-main/10 bg-primary/75 px-4 py-3 text-sm text-main outline-none transition-colors placeholder:text-main/40 focus:border-accent/35 focus:bg-white"
                        />

                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-onaccent shadow-[0_12px_28px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Send message"
                        >
                            <FaPaperPlane size={15} />
                        </button>
                    </form>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-main/50">
                        <p className="truncate">
                            {error ? "Connection issue shown in chat." : "Grounded in portfolio files only."}
                        </p>
                        <button
                            type="button"
                            onClick={resetChat}
                            className="inline-flex items-center gap-1.5 font-bold text-main/60 transition-colors hover:text-accent"
                        >
                            <FaTrash size={11} />
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="ml-auto flex h-14 items-center gap-3 rounded-full border border-white/70 bg-accent px-4 py-3 text-sm font-black text-onaccent shadow-[0_18px_44px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-accent/90"
                aria-label={isOpen ? "Close portfolio chatbot" : "Open portfolio chatbot"}
            >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <FaWandMagicSparkles />
                </span>
                <span className="hidden sm:inline">
                    Ask Portfolio
                </span>
            </button>
        </div>
    );
};

export default PortfolioChatbot;
