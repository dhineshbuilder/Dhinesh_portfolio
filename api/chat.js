import fs from "node:fs";
import path from "node:path";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const ROOT_DIR = process.cwd();
const MAX_FILE_BYTES = 700_000;
const MAX_CHUNKS = 9;
const REFUSAL_TEXT =
    "I can only answer questions about my portfolio, projects, skills, achievements, resume, and related personal information.";

const TEXT_EXTENSIONS = new Set([
    ".css",
    ".html",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".svg",
    ".txt",
]);

const IMAGE_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp"]);

const SEARCH_ROOTS = [
    "README.md",
    "index.html",
    "package.json",
    "src",
    "public",
];

const SKIP_DIRS = new Set([
    ".git",
    ".vercel",
    "dist",
    "dist-ssr",
    "node_modules",
]);

const RAW_PUBLIC_FOLDERS_TO_SKIP = [
    `${path.sep}public${path.sep}certificates${path.sep}`,
    `${path.sep}public${path.sep}timeline_images${path.sep}`,
];

const ALLOWED_BADGES = [
    "Project",
    "Skills",
    "Achievement",
    "Resume",
    "About",
    "Contact",
    "Certification",
    "Timeline",
    "Education",
    "Website",
];

const PORTFOLIO_TERMS = [
    "about",
    "achievement",
    "ai",
    "aira",
    "attendance",
    "award",
    "bus",
    "canteen",
    "certificate",
    "certification",
    "contact",
    "dhinesh",
    "education",
    "email",
    "experience",
    "github",
    "hackathon",
    "invoice",
    "linkedin",
    "mpnmjec",
    "portfolio",
    "project",
    "quiz",
    "resume",
    "skill",
    "sixquest",
    "stack",
    "technology",
    "timeline",
    "training",
];

const normalizeSlashes = (value) => value.replaceAll("\\", "/");

const cleanText = (text) =>
    text
        .replace(/\r/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

const tokenize = (text) => {
    const stopWords = new Set([
        "a",
        "an",
        "and",
        "are",
        "can",
        "do",
        "does",
        "for",
        "from",
        "how",
        "i",
        "in",
        "is",
        "me",
        "my",
        "of",
        "on",
        "or",
        "show",
        "tell",
        "the",
        "to",
        "use",
        "what",
        "with",
        "you",
        "your",
    ]);

    return cleanText(text)
        .toLowerCase()
        .split(/[^a-z0-9+#.]+/g)
        .filter((word) => word.length > 1 && !stopWords.has(word));
};

const humanizeFileName = (filePath) => {
    const parsed = path.parse(filePath);
    return parsed.name
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const inferBadge = (relativePath, text = "") => {
    const haystack = `${relativePath} ${text}`.toLowerCase();

    if (haystack.includes("certificate")) return "Certification";
    if (haystack.includes("timeline") || haystack.includes("achievement") || haystack.includes("hackathon")) return "Achievement";
    if (haystack.includes("education")) return "Education";
    if (haystack.includes("contact") || haystack.includes("email") || haystack.includes("phone")) return "Contact";
    if (haystack.includes("skill") || haystack.includes("stack") || haystack.includes("technology")) return "Skills";
    if (haystack.includes("resume")) return "Resume";
    if (haystack.includes("about") || haystack.includes("profile")) return "About";
    if (haystack.includes("project") || haystack.includes("quiz") || haystack.includes("bus") || haystack.includes("invoice") || haystack.includes("attendance") || haystack.includes("canteen")) return "Project";

    return "Website";
};

const shouldSkipPath = (absolutePath) => {
    const normalized = absolutePath.toLowerCase();

    return RAW_PUBLIC_FOLDERS_TO_SKIP.some((folder) => normalized.includes(folder.toLowerCase()));
};

const readPortfolioFiles = (targetPath, files = []) => {
    const absolutePath = path.resolve(ROOT_DIR, targetPath);

    if (!fs.existsSync(absolutePath) || shouldSkipPath(absolutePath)) {
        return files;
    }

    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
        if (SKIP_DIRS.has(path.basename(absolutePath))) {
            return files;
        }

        fs.readdirSync(absolutePath)
            .sort()
            .forEach((entry) => readPortfolioFiles(path.join(targetPath, entry), files));

        return files;
    }

    const extension = path.extname(absolutePath).toLowerCase();

    if (TEXT_EXTENSIONS.has(extension) && stat.size <= MAX_FILE_BYTES) {
        files.push({
            path: normalizeSlashes(path.relative(ROOT_DIR, absolutePath)),
            kind: "text",
            content: fs.readFileSync(absolutePath, "utf8"),
        });
    } else if (IMAGE_EXTENSIONS.has(extension)) {
        files.push({
            path: normalizeSlashes(path.relative(ROOT_DIR, absolutePath)),
            kind: "image",
            content: `Image asset: ${humanizeFileName(absolutePath)}. Path: ${normalizeSlashes(path.relative(ROOT_DIR, absolutePath))}.`,
        });
    }

    return files;
};

const chunkText = (file) => {
    const cleaned = cleanText(file.content);
    const badge = inferBadge(file.path, cleaned);

    if (!cleaned) {
        return [];
    }

    const paragraphs = cleaned.split(/\n{2,}/g);
    const chunks = [];
    let buffer = "";

    paragraphs.forEach((paragraph) => {
        const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;

        if (next.length > 1_450 && buffer) {
            chunks.push(buffer);
            buffer = paragraph;
        } else {
            buffer = next;
        }
    });

    if (buffer) {
        chunks.push(buffer);
    }

    return chunks.map((content, index) => ({
        badge,
        content,
        id: `${file.path}#${index + 1}`,
        path: file.path,
        tokens: tokenize(`${file.path} ${content}`),
    }));
};

const buildKnowledgeBase = () =>
    SEARCH_ROOTS.flatMap((root) => readPortfolioFiles(root)).flatMap(chunkText);

const scoreChunk = (chunk, queryTokens, queryText) => {
    if (!queryTokens.length) {
        return chunk.path.includes("content.js") ? 2 : 0;
    }

    const tokenSet = new Set(chunk.tokens);
    let score = 0;

    queryTokens.forEach((token) => {
        if (tokenSet.has(token)) score += 3;
        if (chunk.path.toLowerCase().includes(token)) score += 2;
        if (chunk.content.toLowerCase().includes(token)) score += 1;
    });

    const badge = chunk.badge.toLowerCase();
    if (queryText.includes("project") && badge === "project") score += 6;
    if ((queryText.includes("skill") || queryText.includes("technology") || queryText.includes("stack")) && badge === "skills") score += 6;
    if ((queryText.includes("achievement") || queryText.includes("hackathon") || queryText.includes("award")) && badge === "achievement") score += 6;
    if ((queryText.includes("certificate") || queryText.includes("certification")) && badge === "certification") score += 6;
    if ((queryText.includes("contact") || queryText.includes("email") || queryText.includes("phone")) && badge === "contact") score += 6;
    if ((queryText.includes("about") || queryText.includes("who")) && badge === "about") score += 5;

    if (chunk.path.includes("src/data/content.js")) score += 3;
    if (chunk.path.includes("src/utils/timelineContent")) score += 2;

    return score;
};

const retrieveContext = (message) => {
    const knowledgeBase = buildKnowledgeBase();
    const queryText = message.toLowerCase();
    const queryTokens = tokenize(message);

    const ranked = knowledgeBase
        .map((chunk) => ({
            ...chunk,
            score: scoreChunk(chunk, queryTokens, queryText),
        }))
        .filter((chunk) => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_CHUNKS);

    const fallback = knowledgeBase
        .filter((chunk) => chunk.path.includes("src/data/content.js"))
        .slice(0, 4);

    return ranked.length ? ranked : fallback;
};

const isPortfolioLikely = (message) => {
    const normalized = message.toLowerCase();
    const greetingOnly = /^(hi|hello|hey|vanakkam|start|help)[!.\s]*$/i.test(message.trim());

    if (greetingOnly) {
        return true;
    }

    return PORTFOLIO_TERMS.some((term) => normalized.includes(term));
};

const safeParseGroqResponse = (content, sourceBadges) => {
    const fallback = {
        answer: cleanText(content) || "I do not know from the portfolio files yet.",
        sourceBadges,
    };

    try {
        const jsonStart = content.indexOf("{");
        const jsonEnd = content.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
            return fallback;
        }

        const parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1));

        return {
            answer: cleanText(parsed.answer || fallback.answer),
            sourceBadges: Array.isArray(parsed.sourceBadges)
                ? parsed.sourceBadges.filter((badge) => ALLOWED_BADGES.includes(badge)).slice(0, 4)
                : sourceBadges,
        };
    } catch {
        return fallback;
    }
};

const buildPrompt = ({ message, contextChunks, history }) => {
    const context = contextChunks
        .map((chunk, index) => `[${index + 1}] Badge: ${chunk.badge}\nFile: ${chunk.path}\n${chunk.content}`)
        .join("\n\n---\n\n");

    const recentConversation = (history || [])
        .slice(-6)
        .map((item) => `${item.role === "user" ? "Visitor" : "Assistant"}: ${cleanText(item.content || "")}`)
        .join("\n");

    return [
        {
            role: "system",
            content: [
                "You are Dhinesh Portfolio Assistant, a chatbot embedded in Dhinesh's personal portfolio website.",
                "You must answer only about Dhinesh, his portfolio website, projects, skills, achievements, education, certifications, resume, contact details, and personal brand.",
                "Use only the supplied PORTFOLIO_CONTEXT. Never invent facts. Never use unrelated general knowledge.",
                `If the user asks anything unrelated, respond exactly: "${REFUSAL_TEXT}"`,
                "If the user asks a general technical question, refuse unless they ask how it relates to Dhinesh or his projects.",
                "If the portfolio context does not contain enough information, say you do not know from the portfolio files yet.",
                "Keep answers short, clear, recruiter-friendly, and confident.",
                "For project questions, include what it does, main features, tech stack, and why it is useful when those details exist in context.",
                `Return JSON only with this shape: {"answer":"short answer","sourceBadges":["Project"]}. Badges can only be: ${ALLOWED_BADGES.join(", ")}.`,
            ].join("\n"),
        },
        {
            role: "user",
            content: [
                "PORTFOLIO_CONTEXT:",
                context,
                recentConversation ? `RECENT_CONVERSATION:\n${recentConversation}` : "",
                `VISITOR_QUESTION:\n${message}`,
            ].filter(Boolean).join("\n\n"),
        },
    ];
};

export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ answer: "Method not allowed.", sourceBadges: [] });
        return;
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
    const message = cleanText(req.body?.message || "");
    const history = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!message) {
        res.status(400).json({ answer: "Please ask a portfolio-related question.", sourceBadges: [] });
        return;
    }

    if (!isPortfolioLikely(message)) {
        res.status(200).json({ answer: REFUSAL_TEXT, sourceBadges: [] });
        return;
    }

    if (!apiKey) {
        res.status(503).json({
            answer: "The portfolio chatbot is not connected yet because GROQ_API_KEY is missing on the server.",
            sourceBadges: ["Website"],
        });
        return;
    }

    const contextChunks = retrieveContext(message);
    const sourceBadges = [...new Set(contextChunks.map((chunk) => chunk.badge))].slice(0, 4);

    try {
        const groqResponse = await fetch(GROQ_CHAT_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages: buildPrompt({ message, contextChunks, history }),
                temperature: 0.15,
                max_tokens: 650,
            }),
        });

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            throw new Error(`Groq request failed: ${groqResponse.status} ${errorText}`);
        }

        const data = await groqResponse.json();
        const content = data.choices?.[0]?.message?.content || "";
        const parsed = safeParseGroqResponse(content, sourceBadges);

        if (parsed.answer === REFUSAL_TEXT) {
            parsed.sourceBadges = [];
        }

        res.status(200).json(parsed);
    } catch (error) {
        console.error(error);
        res.status(502).json({
            answer: "I could not reach the portfolio chatbot service right now. Please try again shortly.",
            sourceBadges: ["Website"],
        });
    }
}
