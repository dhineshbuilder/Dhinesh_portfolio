import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaArrowDown,
    FaArrowUpRightFromSquare,
    FaBrain,
    FaCertificate,
    FaCheck,
    FaCode,
    FaCompress,
    FaCopy,
    FaExpand,
    FaGithub,
    FaGooglePlay,
    FaGraduationCap,
    FaMinus,
    FaPaperPlane,
    FaPhone,
    FaRobot,
    FaRocket,
    FaTrash,
    FaTrophy,
    FaUserTie,
    FaWandMagicSparkles,
    FaXmark,
} from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";

const QUICK_ACTIONS = [
    { label: "Best Projects", prompt: "Show me your best projects", Icon: FaRocket },
    { label: "Achievements", prompt: "What are your achievements?", Icon: FaTrophy },
    { label: "Tech Stack", prompt: "What technologies do you use?", Icon: FaCode },
    { label: "SaaS Products", prompt: "Which SaaS or product-style projects have you built?", Icon: FaRocket },
    { label: "AI Projects", prompt: "What AI projects have you built?", Icon: FaBrain },
    { label: "Education", prompt: "Tell me about your education", Icon: FaGraduationCap },
    { label: "Contact", prompt: "How can I contact you?", Icon: FaPhone },
    { label: "Training Experience", prompt: "Tell me about your training experience", Icon: FaUserTie },
];

const POPULAR_QUESTIONS = [
    "What is your strongest project?",
    "What hackathons have you won?",
    "What technologies do you use?",
    "How can I contact you?",
    "What AI projects have you built?",
];

const SMART_REPLIES = [
    "Tell me more",
    "Show related project",
    "View achievements",
    "View skills",
    "Contact Dhinesh",
];

const REFUSAL_TEXT =
    "I can only answer questions about my portfolio, projects, skills, achievements, resume, and related personal information.";

const createMessageId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getTimeLabel = () =>
    new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

const createBotMessage = (content, sourceBadges = ["About"], enhancement = null, question = "") => ({
    id: createMessageId(),
    role: "assistant",
    content,
    enhancement,
    question,
    sourceBadges,
    time: getTimeLabel(),
});

const createUserMessage = (content) => ({
    id: createMessageId(),
    role: "user",
    content,
    sourceBadges: [],
    time: getTimeLabel(),
});

const normalize = (value = "") => value.toLowerCase();

const isProjectPrompt = (question = "", badges = []) => {
    const text = normalize(question);

    return (
        badges.includes("Project") ||
        ["project", "projects", "product", "saas", "ai project", "best", "strongest"].some((term) => text.includes(term))
    );
};

const isAchievementPrompt = (question = "", badges = []) => {
    const text = normalize(question);

    return (
        badges.some((badge) => ["Achievement", "Certification", "Timeline"].includes(badge)) ||
        ["achievement", "award", "hackathon", "won", "winner", "recognition", "certificate"].some((term) => text.includes(term))
    );
};

const isSkillsPrompt = (question = "", badges = []) => {
    const text = normalize(question);

    return badges.includes("Skills") || ["skill", "stack", "technology", "technologies"].some((term) => text.includes(term));
};

const pickEnhancement = (question, badges) => {
    if (isProjectPrompt(question, badges)) return "projects";
    if (isAchievementPrompt(question, badges)) return "achievements";
    if (isSkillsPrompt(question, badges)) return "skills";
    return null;
};

const getProjectMatches = (question, projects = []) => {
    const text = normalize(question);
    const featured = projects.filter((project) => project.featured);
    const exactMatches = projects.filter((project) => {
        const haystack = normalize([
            project.title,
            project.description,
            project.problem,
            ...(project.features || []),
            ...(project.tech || []),
        ].join(" "));

        return text
            .split(/[^a-z0-9]+/g)
            .filter((word) => word.length > 3)
            .some((word) => haystack.includes(word));
    });

    const source = exactMatches.length ? exactMatches : featured;
    return source.slice(0, text.includes("best") || text.includes("strongest") ? 3 : 2);
};

const buildAchievementItems = (timelineItems = []) => {
    const records = [];
    let currentYear = "";

    timelineItems.forEach((item) => {
        if (item.type !== "checkpoint") return;

        if (!item.shouldDrawLine) {
            currentYear = item.title;
            return;
        }

        records.push({
            ...item,
            year: currentYear,
        });
    });

    return records.slice(0, 3);
};

const SourceBadges = ({ badges = [] }) => {
    if (!badges.length) return null;

    return (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {badges.map((badge) => (
                <span
                    key={badge}
                    className="inline-flex items-center rounded-full border border-accent/15 bg-accent/10 px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.12em] text-accent"
                >
                    Source: {badge}
                </span>
            ))}
        </div>
    );
};

const AiraAvatar = ({ size = "md" }) => (
    <div
        className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_52%,#06B6D4_100%)] text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] ${
            size === "lg" ? "h-14 w-14" : "h-10 w-10"
        }`}
    >
        <FaRobot className={size === "lg" ? "text-2xl" : "text-lg"} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.15)]" />
    </div>
);

const TypingIndicator = () => (
    <div className="flex items-center gap-3 rounded-2xl border border-main/10 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        <AiraAvatar />
        <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-main/54">
                Dhinesh AI is thinking...
            </p>
            <div className="mt-2 flex items-center gap-1.5">
                {[0, 1, 2].map((dot) => (
                    <span
                        key={dot}
                        className="h-2 w-2 animate-pulse rounded-full bg-accent"
                        style={{ animationDelay: `${dot * 150}ms` }}
                    />
                ))}
            </div>
        </div>
    </div>
);

const TechPill = ({ children }) => (
    <span className="rounded-full border border-main/10 bg-white/80 px-2.5 py-1 text-[0.66rem] font-black text-main/62">
        {children}
    </span>
);

const ProjectChatCard = ({ project }) => {
    const primaryLink = project.demo || project.playStore || project.github;
    const primaryLabel = project.demo ? "View Project" : project.playStore ? "Play Store" : "Code";

    return (
        <article className="overflow-hidden rounded-[22px] border border-main/10 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25">
            <div className="relative h-36 bg-[linear-gradient(135deg,#EFF6FF_0%,#ECFEFF_100%)]">
                <img
                    src={project.image}
                    alt={project.title}
                    draggable={false}
                    className="h-full w-full object-contain p-4"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h4 className="text-sm font-black leading-tight text-main">
                    {project.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-main/62">
                    {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech?.slice(0, 4).map((tech) => (
                        <TechPill key={tech}>{tech}</TechPill>
                    ))}
                </div>
                {primaryLink && (
                    <a
                        href={primaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-xs font-black text-onaccent shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
                    >
                        {project.playStore && !project.demo ? <FaGooglePlay size={12} /> : <FaArrowUpRightFromSquare size={12} />}
                        {primaryLabel}
                    </a>
                )}
            </div>
        </article>
    );
};

const AchievementChatCard = ({ item }) => (
    <article className="grid gap-3 rounded-[22px] border border-main/10 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:grid-cols-[6.5rem_minmax(0,1fr)]">
        <div className="min-h-24 overflow-hidden rounded-2xl bg-secondary">
            <img
                src={item.slideImage}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
                draggable={false}
            />
        </div>
        <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-accent">
                    {item.year}
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-main/58">
                    Outcome
                </span>
            </div>
            <h4 className="mt-2 text-sm font-black text-main">
                {item.title}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-main/62">
                {item.subtitle}
            </p>
        </div>
    </article>
);

const SkillsChatCard = ({ categories = [] }) => (
    <div className="grid gap-2">
        {categories.slice(0, 4).map((category) => (
            <div
                key={category.category}
                className="rounded-[20px] border border-main/10 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                    {category.category}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {category.skills.slice(0, 6).map((skill) => (
                        <TechPill key={skill}>{skill}</TechPill>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const MessageEnhancement = ({ type, question, content }) => {
    if (type === "projects") {
        const cards = getProjectMatches(question, content.projects.items);
        return (
            <div className="mt-3 grid gap-3">
                {cards.map((project) => (
                    <ProjectChatCard key={project.title} project={project} />
                ))}
            </div>
        );
    }

    if (type === "achievements") {
        const achievements = buildAchievementItems(content.timeline?.items || []);
        return (
            <div className="mt-3 grid gap-3">
                {achievements.map((item) => (
                    <AchievementChatCard key={`${item.year}-${item.title}`} item={item} />
                ))}
            </div>
        );
    }

    if (type === "skills") {
        return (
            <div className="mt-3">
                <SkillsChatCard categories={content.skills.categories} />
            </div>
        );
    }

    return null;
};

const ChatMessage = ({ message, content, onCopy, copiedId, onSmartReply }) => {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex animate-[fadeIn_220ms_ease-out] justify-end">
                <div className="max-w-[86%]">
                    <div className="rounded-[22px] rounded-br-md bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_58%,#06B6D4_100%)] px-4 py-3 text-sm leading-relaxed text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)]">
                        <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                    <p className="mt-1 text-right text-[0.68rem] font-semibold text-main/42">
                        {message.time}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex animate-[fadeIn_240ms_ease-out] items-start gap-3">
            <AiraAvatar />
            <div className="min-w-0 flex-1">
                <div className="rounded-[24px] rounded-tl-md border border-main/10 bg-white px-4 py-3 text-sm leading-relaxed text-main/78 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
                    <div className="flex items-start justify-between gap-3">
                        <p className="whitespace-pre-line">{message.content}</p>
                        <button
                            type="button"
                            onClick={() => onCopy(message)}
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-main/10 bg-secondary/60 text-main/48 transition-colors hover:border-accent/25 hover:text-accent"
                            aria-label="Copy response"
                        >
                            {copiedId === message.id ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        </button>
                    </div>
                    <MessageEnhancement type={message.enhancement} question={message.question} content={content} />
                    <SourceBadges badges={message.sourceBadges} />
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-main/10 pt-3">
                        {SMART_REPLIES.map((reply) => (
                            <button
                                key={reply}
                                type="button"
                                onClick={() => onSmartReply(reply)}
                                className="rounded-full border border-main/10 bg-secondary/65 px-3 py-1.5 text-[0.68rem] font-bold text-main/58 transition-colors hover:border-accent/25 hover:text-accent"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                </div>
                <p className="mt-1 text-[0.68rem] font-semibold text-main/42">
                    {message.time}
                </p>
            </div>
        </div>
    );
};

const WelcomePanel = ({ content, onAsk }) => {
    const projectCount = content.projects.items.length;

    const capabilities = [
        { label: "Projects", Icon: FaRocket },
        { label: "Achievements", Icon: FaTrophy },
        { label: "Technical Skills", Icon: FaCode },
        { label: "Education", Icon: FaGraduationCap },
        { label: "Certifications", Icon: FaCertificate },
        { label: "Contact Information", Icon: FaPhone },
        { label: "Experience", Icon: FaUserTie },
    ];

    const scrollToProjects = () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-[28px] border border-main/10 bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3">
                    <AiraAvatar size="lg" />
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                            Welcome
                        </p>
                        <h3 className="mt-1 text-2xl font-black tracking-tight text-main">
                            I'm AIRA.
                        </h3>
                    </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-main/66">
                    I can answer questions about Dhinesh's portfolio, projects, skills, achievements, education, certifications, contact details, and experience.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {capabilities.map((capability) => {
                        const Icon = capability.Icon;

                        return (
                            <div
                                key={capability.label}
                                className="flex items-center gap-2 rounded-2xl border border-main/10 bg-secondary/55 px-3 py-2 text-xs font-bold text-main/68"
                            >
                                <Icon className="text-accent" />
                                {capability.label}
                            </div>
                        );
                    })}
                </div>
                <p className="mt-4 rounded-2xl border border-accent/15 bg-accent/10 px-3 py-2 text-xs font-bold text-accent">
                    Built from Dhinesh's portfolio knowledge base.
                </p>
            </div>

            <div className="rounded-[28px] border border-main/10 bg-[linear-gradient(135deg,#FFFFFF_0%,#EFF6FF_100%)] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-accent">
                    Profile Snapshot
                </p>
                <div className="flex items-center gap-4">
                    <img
                        src={content.hero.profileImage}
                        alt={content.hero.profileAlt}
                        className="h-16 w-16 rounded-2xl border border-white object-cover shadow-sm"
                        draggable={false}
                    />
                    <div>
                        <h3 className="text-xl font-black text-main">
                            Dhinesh V
                        </h3>
                        <p className="mt-1 text-sm font-bold text-accent">
                            AI Engineer / Full Stack Developer
                        </p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-main/68">
                    <span className="rounded-2xl bg-white px-3 py-2 shadow-sm">Multiple Hackathon Wins</span>
                    <span className="rounded-2xl bg-white px-3 py-2 shadow-sm">{projectCount} Portfolio Projects</span>
                    <span className="rounded-2xl bg-white px-3 py-2 shadow-sm">Technical Trainer</span>
                    <span className="rounded-2xl bg-white px-3 py-2 shadow-sm">AI Product Builder</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <a
                        href={content.hero.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-accent px-4 py-2 text-xs font-black text-onaccent shadow-[0_12px_28px_rgba(37,99,235,0.18)]"
                    >
                        View Resume
                    </a>
                    <button
                        type="button"
                        onClick={scrollToProjects}
                        className="rounded-full border border-main/10 bg-white px-4 py-2 text-xs font-black text-main/68 shadow-sm transition-colors hover:border-accent/25 hover:text-accent"
                    >
                        View Projects
                    </button>
                </div>
            </div>

            <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-main/48">
                    Popular Questions
                </p>
                <div className="grid gap-2">
                    {POPULAR_QUESTIONS.map((question) => (
                        <button
                            key={question}
                            type="button"
                            onClick={() => onAsk(question)}
                            className="rounded-2xl border border-main/10 bg-white px-4 py-3 text-left text-sm font-bold text-main/68 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PortfolioChatbot = () => {
    const { content } = useContent();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState("");
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    const visibleHistory = useMemo(
        () => messages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        [messages]
    );

    const scrollToBottom = (behavior = "smooth") => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior,
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        if (isAtBottom) {
            window.setTimeout(() => scrollToBottom("smooth"), 40);
        } else if (messages.at(-1)?.role === "assistant") {
            setUnreadCount((current) => current + 1);
        }
    }, [messages, isAtBottom, isOpen]);

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            window.setTimeout(() => inputRef.current?.focus(), 180);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            window.setTimeout(() => scrollRef.current?.scrollTo({ top: 0 }), 80);
        }
    }, [isOpen, messages.length]);

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        const atBottom = distanceFromBottom < 80;
        setIsAtBottom(atBottom);

        if (atBottom) {
            setUnreadCount(0);
        }
    };

    const resetChat = () => {
        setMessages([]);
        setInput("");
        setError("");
        setUnreadCount(0);
    };

    const copyMessage = async (message) => {
        await navigator.clipboard.writeText(message.content);
        setCopiedId(message.id);
        window.setTimeout(() => setCopiedId(""), 1300);
    };

    const sendMessage = async (question = input) => {
        const cleanQuestion = question.trim();

        if (!cleanQuestion || isLoading) return;

        const userMessage = createUserMessage(cleanQuestion);
        setMessages((current) => [...current, userMessage]);
        setInput("");
        setError("");
        setIsLoading(true);
        setIsAtBottom(true);

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

            const badges = data.sourceBadges || [];
            const enhancement = data.answer === REFUSAL_TEXT ? null : pickEnhancement(cleanQuestion, badges);

            setMessages((current) => [
                ...current,
                createBotMessage(data.answer, badges, enhancement, cleanQuestion),
            ]);
        } catch (requestError) {
            const fallback =
                requestError.message ||
                "I could not connect to AIRA right now. Please try again shortly.";

            setError(fallback);
            setMessages((current) => [
                ...current,
                createBotMessage(fallback, ["Website"], null, cleanQuestion),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage();
    };

    const handleSmartReply = (reply) => {
        const prompts = {
            "Tell me more": "Tell me more with portfolio details",
            "Show related project": "Show related project from the portfolio",
            "View achievements": "What are your achievements?",
            "View skills": "What technologies do you use?",
            "Contact Dhinesh": "How can I contact you?",
        };

        sendMessage(prompts[reply] || reply);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
            <div
                className={`mb-4 flex h-[min(700px,calc(100svh-6.5rem))] w-[calc(100vw-1rem)] max-w-[30rem] origin-bottom-right flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] transition-all duration-300 sm:w-[30rem] ${
                    isExpanded ? "sm:max-w-[44rem] sm:w-[44rem]" : ""
                } ${
                    isOpen
                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none translate-y-6 scale-[0.98] opacity-0"
                }`}
            >
                <div className="border-b border-main/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(239,246,255,0.92)_56%,rgba(236,254,255,0.9)_100%)] px-4 py-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <AiraAvatar size="lg" />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="truncate text-xl font-black tracking-tight text-main">
                                    AIRA
                                </h2>
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                </span>
                            </div>
                            <p className="mt-0.5 text-[0.72rem] font-bold leading-snug text-main/58">
                                AI Engineer • Product Builder • Portfolio Assistant
                            </p>
                            <p className="mt-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-accent">
                                Online / Powered by portfolio knowledge
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsExpanded((current) => !current)}
                                className="hidden h-10 w-10 items-center justify-center rounded-full border border-main/10 bg-white/80 text-main/58 shadow-sm transition-colors hover:border-accent/25 hover:text-accent sm:flex"
                                aria-label={isExpanded ? "Compress AIRA" : "Expand AIRA"}
                            >
                                {isExpanded ? <FaCompress size={14} /> : <FaExpand size={14} />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-main/10 bg-white/80 text-main/58 shadow-sm transition-colors hover:border-accent/25 hover:text-accent"
                                aria-label="Minimize AIRA"
                            >
                                <FaMinus size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-main/10 bg-white/80 text-main/58 shadow-sm transition-colors hover:border-accent/25 hover:text-accent"
                                aria-label="Close AIRA"
                            >
                                <FaXmark size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative min-h-0 flex-1 overflow-y-auto scroll-smooth bg-[linear-gradient(135deg,#F8FAFC_0%,#EFF6FF_62%,#ECFEFF_100%)] px-4 py-5"
                >
                    {messages.length === 0 ? (
                        <WelcomePanel content={content} onAsk={sendMessage} />
                    ) : (
                        <div className="space-y-5">
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    content={content}
                                    copiedId={copiedId}
                                    onCopy={copyMessage}
                                    onSmartReply={handleSmartReply}
                                />
                            ))}

                            {isLoading && <TypingIndicator />}
                        </div>
                    )}

                    {(!isAtBottom || unreadCount > 0) && (
                        <button
                            type="button"
                            onClick={() => {
                                scrollToBottom();
                                setUnreadCount(0);
                            }}
                            className="sticky bottom-2 left-full z-10 ml-auto mt-3 flex items-center gap-2 rounded-full border border-accent/20 bg-white px-3 py-2 text-xs font-black text-accent shadow-[0_14px_34px_rgba(15,23,42,0.14)]"
                        >
                            <FaArrowDown size={11} />
                            {unreadCount > 0 ? `${unreadCount} new` : "Latest"}
                        </button>
                    )}
                </div>

                <div className="border-t border-main/10 bg-white px-4 py-4">
                    <div className="project-rail mb-3 flex gap-2 overflow-x-auto pb-1">
                        {QUICK_ACTIONS.map((action) => {
                            const Icon = action.Icon;

                            return (
                                <button
                                    key={action.label}
                                    type="button"
                                    onClick={() => sendMessage(action.prompt)}
                                    disabled={isLoading}
                                    className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-accent/15 bg-accent/[0.07] px-3.5 py-2 text-xs font-black text-accent transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Icon size={12} />
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-end gap-2">
                        <label className="sr-only" htmlFor="aira-chat-input">
                            Ask about projects, achievements, skills
                        </label>
                        <textarea
                            id="aira-chat-input"
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
                            placeholder="Ask about projects, achievements, skills..."
                            className="max-h-28 min-h-12 flex-1 resize-none rounded-2xl border border-main/10 bg-primary/75 px-4 py-3 text-sm text-main outline-none transition-colors placeholder:text-main/40 focus:border-accent/35 focus:bg-white"
                        />

                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_58%,#06B6D4_100%)] text-onaccent shadow-[0_14px_30px_rgba(37,99,235,0.24)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Send message"
                        >
                            <FaPaperPlane size={15} />
                        </button>
                    </form>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-main/50">
                        <p className="truncate">
                            {error ? "Connection issue shown in chat." : "AIRA only answers from portfolio knowledge."}
                        </p>
                        <button
                            type="button"
                            onClick={resetChat}
                            className="inline-flex items-center gap-1.5 font-black text-main/58 transition-colors hover:text-accent"
                        >
                            <FaTrash size={11} />
                            Clear chat
                        </button>
                    </div>
                </div>
            </div>

            <div className="group relative ml-auto flex justify-end">
                <div className="pointer-events-none absolute bottom-full right-0 mb-3 rounded-full border border-main/10 bg-white px-3 py-2 text-xs font-bold text-main/66 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition-opacity duration-200 group-hover:opacity-100">
                    Ask anything about Dhinesh
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="flex h-14 items-center gap-3 rounded-full border border-white/70 bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_58%,#06B6D4_100%)] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-onaccent shadow-[0_20px_48px_rgba(37,99,235,0.34)] transition-all duration-300 hover:-translate-y-1"
                    aria-label={isOpen ? "Close AIRA" : "Open AIRA"}
                >
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-white/20" />
                        <FaWandMagicSparkles className="relative" />
                    </span>
                    <span>Ask AIRA</span>
                </button>
            </div>
        </div>
    );
};

export default PortfolioChatbot;
