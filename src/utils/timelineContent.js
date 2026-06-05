export const BRANCH = {
    LEFT: "leftSide",
    RIGHT: "rightSide",
};

export const NODE_TYPES = {
    CONVERGE: "converge",
    DIVERGE: "diverge",
    CHECKPOINT: "checkpoint",
};

export const ITEM_SIZE = {
    SMALL: "small",
    LARGE: "large",
};

const escapeSvgValue = (value = "") =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const createTimelineSlide = ({
    eyebrow = "Milestone",
    title = "",
    subtitle = "",
    accent = "#2563EB",
    accentSoft = "rgba(37, 99, 235, 0.14)",
    backgroundStart = "#f8fafc",
    backgroundEnd = "#ecfeff",
}) => {
    const svg = `
        <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="timeline-bg" x1="120" y1="60" x2="1160" y2="660" gradientUnits="userSpaceOnUse">
                    <stop stop-color="${escapeSvgValue(backgroundStart)}" />
                    <stop offset="1" stop-color="${escapeSvgValue(backgroundEnd)}" />
                </linearGradient>
                <linearGradient id="timeline-accent" x1="232" y1="194" x2="936" y2="522" gradientUnits="userSpaceOnUse">
                    <stop stop-color="${escapeSvgValue(accent)}" />
                    <stop offset="0.52" stop-color="#4F46E5" stop-opacity="0.76" />
                    <stop offset="1" stop-color="#06B6D4" stop-opacity="0.76" />
                </linearGradient>
            </defs>
            <rect width="1280" height="720" rx="32" fill="url(#timeline-bg)" />
            <g opacity="0.95">
                <path d="M-20 608L454 116L542 196L68 688H-20V608Z" fill="${escapeSvgValue(accentSoft)}" />
                <path d="M892 -12H1280V132L996 416L902 338L1214 24H892V-12Z" fill="rgba(6, 182, 212, 0.12)" />
                <path d="M0 684H1280" stroke="rgba(15, 23, 42, 0.08)" stroke-width="2" />
                <path d="M0 626H1280" stroke="rgba(15, 23, 42, 0.055)" stroke-width="2" />
            </g>
            <rect x="92" y="82" width="1096" height="556" rx="30" fill="rgba(255, 255, 255, 0.76)" stroke="rgba(15, 23, 42, 0.10)" stroke-width="2"/>
            <rect x="124" y="118" width="184" height="42" rx="21" fill="rgba(37, 99, 235, 0.10)" />
            <text x="216" y="145" text-anchor="middle" fill="${escapeSvgValue(accent)}" font-size="20" font-family="Space Grotesk, Inter, sans-serif" font-weight="700" letter-spacing="4">
                ${escapeSvgValue(eyebrow).toUpperCase()}
            </text>
            <foreignObject x="124" y="206" width="968" height="154">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Space Grotesk, Inter, sans-serif; color: #0F172A; font-size: 64px; line-height: 1.08; font-weight: 700; letter-spacing: 0.01em; overflow-wrap: break-word;">
                    ${escapeSvgValue(title)}
                </div>
            </foreignObject>
            <rect x="124" y="376" width="812" height="4" rx="2" fill="url(#timeline-accent)" />
            <foreignObject x="124" y="416" width="968" height="150">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Space Grotesk, Inter, sans-serif; color: #475569; font-size: 30px; line-height: 1.45; font-weight: 500; letter-spacing: 0.01em;">
                    ${escapeSvgValue(subtitle)}
                </div>
            </foreignObject>
        </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const createTimelineBadge = ({
    label = "MILESTONE",
    accent = "#2563EB",
    background = "#ffffff",
}) => {
    const svg = `
        <svg width="144" height="40" viewBox="0 0 144 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="142" height="38" rx="19" fill="${escapeSvgValue(background)}" fill-opacity="0.92" stroke="${escapeSvgValue(accent)}" stroke-opacity="0.38" stroke-width="2"/>
            <text x="72" y="25" text-anchor="middle" fill="${escapeSvgValue(accent)}" font-size="14" font-family="Space Grotesk, Inter, sans-serif" font-weight="700" letter-spacing="2">
                ${escapeSvgValue(label).toUpperCase()}
            </text>
        </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const parseYearValue = (value = "") => {
    const matches = String(value).match(/\b(19|20)\d{2}\b/g);

    if (!matches || matches.length === 0) {
        return null;
    }

    return Number(matches[matches.length - 1]);
};

const pickHackathonSlide = (hackathon) =>
    hackathon?.eventPhotos?.find(Boolean) ||
    hackathon?.projectScreenshot ||
    createTimelineSlide({
        eyebrow: "Hackathon",
        title: hackathon?.title || "Hackathon Milestone",
        subtitle: [hackathon?.projectTitle, hackathon?.location].filter(Boolean).join(" - "),
        accent: "#4F46E5",
        accentSoft: "rgba(79, 70, 229, 0.14)",
        backgroundStart: "#eef2ff",
        backgroundEnd: "#ecfeff",
    });

const buildHackathonCheckpoint = (hackathon, alignment) => ({
    type: NODE_TYPES.CHECKPOINT,
    title: hackathon.title,
    subtitle: [hackathon.projectTitle, hackathon.location].filter(Boolean).join(" - "),
    size: ITEM_SIZE.SMALL,
    image: createTimelineBadge({
        label: "Hackathon",
        accent: "#4F46E5",
        background: "#eef2ff",
    }),
    slideImage: pickHackathonSlide(hackathon),
    shouldDrawLine: true,
    alignment,
});

const buildEducationCheckpoint = (entry, alignment) => ({
    type: NODE_TYPES.CHECKPOINT,
    title: entry.degree,
    subtitle: [entry.institution, entry.description].filter(Boolean).join(" - "),
    size: ITEM_SIZE.SMALL,
    image: createTimelineBadge({
        label: "Education",
        accent: "#2563EB",
        background: "#eff6ff",
    }),
    slideImage: createTimelineSlide({
        eyebrow: "Education",
        title: entry.degree,
        subtitle: `${entry.institution}${entry.description ? ` - ${entry.description}` : ""}`,
        accent: "#2563EB",
        accentSoft: "rgba(37, 99, 235, 0.14)",
        backgroundStart: "#eff6ff",
        backgroundEnd: "#ecfeff",
    }),
    shouldDrawLine: true,
    alignment,
});

export const buildTimelineItemsFromSections = ({
    hackathons = { items: [] },
    education = { items: [] },
} = {}) => {
    const hackathonEvents = (hackathons.items || [])
        .map((hackathon) => ({
            year: parseYearValue(hackathon.date),
            node: buildHackathonCheckpoint(hackathon, BRANCH.LEFT),
        }))
        .filter((item) => Number.isFinite(item.year));

    const educationEvents = [...(education.items || [])]
        .reverse()
        .map((entry) => ({
            year: parseYearValue(entry.year),
            node: buildEducationCheckpoint(entry, BRANCH.LEFT),
        }))
        .filter((item) => Number.isFinite(item.year));

    const groupedEvents = [...hackathonEvents, ...educationEvents].reduce((groups, item) => {
        if (!groups.has(item.year)) {
            groups.set(item.year, []);
        }

        groups.get(item.year).push(item.node);
        return groups;
    }, new Map());

    const years = [...groupedEvents.keys()].sort((first, second) => second - first);

    if (years.length === 0) {
        return [
            {
                type: NODE_TYPES.CHECKPOINT,
                title: "Timeline",
                subtitle: "Add milestones in the admin panel to populate this section.",
                size: ITEM_SIZE.SMALL,
                image: createTimelineBadge({
                    label: "Milestone",
                    accent: "#2563EB",
                    background: "#ffffff",
                }),
                slideImage: createTimelineSlide({
                    eyebrow: "Timeline",
                    title: "No milestones yet",
                    subtitle: "Add records to your portfolio timeline from the content editor.",
                }),
                shouldDrawLine: true,
                alignment: BRANCH.LEFT,
            },
        ];
    }

    return years.flatMap((year) => {
        const yearNodes = groupedEvents.get(year) || [];
        const timelineNodes = [
            {
                type: NODE_TYPES.CHECKPOINT,
                title: String(year),
                size: ITEM_SIZE.LARGE,
                shouldDrawLine: false,
                alignment: BRANCH.LEFT,
            },
        ];

        if (yearNodes.length === 1) {
            timelineNodes.push(yearNodes[0]);
            return timelineNodes;
        }

        if (yearNodes.length >= 2) {
            timelineNodes.push(
                { type: NODE_TYPES.DIVERGE },
                { ...yearNodes[0], alignment: BRANCH.RIGHT },
                { ...yearNodes[1], alignment: BRANCH.LEFT },
                { type: NODE_TYPES.CONVERGE }
            );
        }

        if (yearNodes.length > 2) {
            timelineNodes.push(...yearNodes.slice(2));
        }

        return timelineNodes;
    });
};

export const normalizeTimelineItems = (items = []) =>
    (Array.isArray(items) ? items : []).filter((item) => {
        if (!item || typeof item !== "object" || !item.type) {
            return false;
        }

        if (item.type === NODE_TYPES.CHECKPOINT) {
            return Boolean(item.title || item.shouldDrawLine);
        }

        return item.type === NODE_TYPES.DIVERGE || item.type === NODE_TYPES.CONVERGE;
    });
