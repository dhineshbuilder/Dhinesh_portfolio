import { motion as Motion } from "framer-motion";
import {
    FaArrowsRotate,
    FaBrain,
    FaCloudArrowUp,
    FaCode,
    FaDatabase,
    FaDiagramProject,
    FaKey,
    FaMicrochip,
    FaNetworkWired,
    FaRobot,
    FaRocket,
    FaVectorSquare,
    FaWandMagicSparkles,
} from "react-icons/fa6";
import {
    SiCss3,
    SiExpress,
    SiFirebase,
    SiGit,
    SiGithub,
    SiGithubactions,
    SiHtml5,
    SiJavascript,
    SiLangchain,
    SiMongodb,
    SiNextdotjs,
    SiNodedotjs,
    SiOpenai,
    SiOpenapiinitiative,
    SiPostgresql,
    SiPostman,
    SiReact,
    SiSupabase,
    SiTailwindcss,
    SiTypescript,
    SiVercel,
} from "react-icons/si";
import { useContent } from "../../context/ContentContext";

const coreStack = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "OpenAI",
    "Supabase",
    "PostgreSQL",
    "Tailwind CSS",
];

const techIconMap = {
    "AI Agents": { Icon: FaRobot, color: "#4F46E5" },
    "API Integration": { Icon: FaNetworkWired, color: "#2563EB" },
    Authentication: { Icon: FaKey, color: "#4F46E5" },
    "CI/CD": { Icon: SiGithubactions, color: "#2088FF" },
    CSS3: { Icon: SiCss3, color: "#1572B6" },
    Deployment: { Icon: FaCloudArrowUp, color: "#06B6D4" },
    "Express.js": { Icon: SiExpress, color: "#0F172A" },
    Firebase: { Icon: SiFirebase, color: "#FFCA28" },
    Git: { Icon: SiGit, color: "#F05032" },
    GitHub: { Icon: SiGithub, color: "#0F172A" },
    Groq: { initials: "G", color: "#F55036" },
    HTML5: { Icon: SiHtml5, color: "#E34F26" },
    JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
    LangChain: { Icon: SiLangchain, color: "#1C3C3C" },
    "LLM APIs": { Icon: FaMicrochip, color: "#2563EB" },
    MongoDB: { Icon: SiMongodb, color: "#47A248" },
    "Next.js": { Icon: SiNextdotjs, color: "#0F172A" },
    "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
    OpenAI: { Icon: SiOpenai, color: "#0F172A" },
    PostgreSQL: { Icon: SiPostgresql, color: "#4169E1" },
    Postman: { Icon: SiPostman, color: "#FF6C37" },
    "Prompt Engineering": { Icon: FaWandMagicSparkles, color: "#4F46E5" },
    RAG: { Icon: FaDiagramProject, color: "#06B6D4" },
    React: { Icon: SiReact, color: "#087EA4" },
    "REST APIs": { Icon: SiOpenapiinitiative, color: "#6BA539" },
    Supabase: { Icon: SiSupabase, color: "#3ECF8E" },
    "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },
    TypeScript: { Icon: SiTypescript, color: "#3178C6" },
    "Vector Databases": { Icon: FaVectorSquare, color: "#2563EB" },
    Vercel: { Icon: SiVercel, color: "#0F172A" },
    "Workflow Automation": { Icon: FaArrowsRotate, color: "#4F46E5" },
};

const categoryIconMap = {
    "AI Development": FaBrain,
    "Frontend Development": FaCode,
    "Backend & Databases": FaDatabase,
    "Tools & Deployment": FaRocket,
};

const cardToneMap = {
    "AI Development": {
        glow: "group-hover:shadow-[0_24px_60px_rgba(37,99,235,0.16)]",
        icon: "from-blue-600 via-indigo-600 to-cyan-500",
    },
    "Frontend Development": {
        glow: "group-hover:shadow-[0_24px_60px_rgba(79,70,229,0.16)]",
        icon: "from-indigo-600 via-blue-600 to-sky-500",
    },
    "Backend & Databases": {
        glow: "group-hover:shadow-[0_24px_60px_rgba(6,182,212,0.15)]",
        icon: "from-cyan-500 via-blue-600 to-indigo-600",
    },
    "Tools & Deployment": {
        glow: "group-hover:shadow-[0_24px_60px_rgba(37,99,235,0.15)]",
        icon: "from-blue-600 via-indigo-600 to-cyan-500",
    },
};

const fallbackSkills = {
    eyebrow: "TECH STACK",
    title: "Technologies I Build With",
    description:
        "Building AI-powered applications, full-stack web products, scalable backend systems, and intelligent automation workflows.",
    categories: [
        {
            category: "AI Development",
            description:
                "Building AI-powered applications using modern LLMs, retrieval systems, and intelligent automation.",
            skills: [
                "OpenAI",
                "Groq",
                "LangChain",
                "AI Agents",
                "RAG",
                "Prompt Engineering",
                "Vector Databases",
                "LLM APIs",
            ],
        },
        {
            category: "Frontend Development",
            description:
                "Creating responsive user interfaces and modern web experiences.",
            skills: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
        },
        {
            category: "Backend & Databases",
            description:
                "Designing scalable APIs, backend services, and data-driven applications.",
            skills: [
                "Node.js",
                "Express.js",
                "PostgreSQL",
                "MongoDB",
                "Supabase",
                "Firebase",
                "REST APIs",
                "Authentication",
            ],
        },
        {
            category: "Tools & Deployment",
            description:
                "Deploying applications, integrating services, and automating workflows.",
            skills: [
                "Git",
                "GitHub",
                "Vercel",
                "Postman",
                "API Integration",
                "Workflow Automation",
                "CI/CD",
                "Deployment",
            ],
        },
    ],
};

const revealProps = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.55, ease: "easeOut" },
};

const TechnologyIcon = ({ name, size = "text-[2.55rem]", emphasized = false }) => {
    const tech = techIconMap[name] || {};
    const Icon = tech.Icon;

    return (
        <div
            className={`group/tech relative flex items-center justify-center rounded-2xl border border-main/10 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_16px_34px_rgba(37,99,235,0.14)] focus:outline-none focus:ring-2 focus:ring-accent/25 ${
                emphasized ? "h-16 w-16 sm:h-20 sm:w-20 lg:h-[5.5rem] lg:w-[5.5rem]" : "h-14 w-14"
            }`}
            title={name}
            aria-label={name}
            tabIndex={0}
        >
            {Icon ? (
                <Icon
                    className={`${size} transition-transform duration-300 group-hover/tech:scale-110 group-focus/tech:scale-110`}
                    style={{ color: tech.color }}
                    aria-hidden="true"
                />
            ) : (
                <span
                    className={`${size} font-black leading-none transition-transform duration-300 group-hover/tech:scale-110 group-focus/tech:scale-110`}
                    style={{ color: tech.color || "#2563EB" }}
                    aria-hidden="true"
                >
                    {tech.initials || name.charAt(0)}
                </span>
            )}

            <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-main/10 bg-main px-3 py-1 text-[0.7rem] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover/tech:-top-11 group-hover/tech:opacity-100 group-focus/tech:-top-11 group-focus/tech:opacity-100">
                {name}
            </span>
        </div>
    );
};

const SkillCard = ({ category, index }) => {
    const CategoryIcon = categoryIconMap[category.category] || FaCode;
    const tone = cardToneMap[category.category] || cardToneMap["AI Development"];

    return (
        <Motion.article
            {...revealProps}
            transition={{ ...revealProps.transition, delay: index * 0.08 }}
            className={`group relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/72 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 sm:p-6 ${tone.glow}`}
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08)_0%,rgba(79,70,229,0.05)_48%,rgba(6,182,212,0.08)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${tone.icon} text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)]`}>
                        <CategoryIcon className="text-2xl" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-accent/15 bg-white/70 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>

                <div className="mt-6">
                    <h3 className="text-xl font-black tracking-tight text-main">
                        {category.category}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-main/65">
                        {category.description || category.summary}
                    </p>
                </div>

                <div className="mt-7 grid grid-cols-4 justify-items-center gap-2">
                    {category.skills.map((skill) => (
                        <TechnologyIcon key={skill} name={skill} />
                    ))}
                </div>
            </div>
        </Motion.article>
    );
};

const Skills = () => {
    const { content } = useContent();
    const configuredSkills = content.skills || {};
    const skills = {
        ...fallbackSkills,
        ...configuredSkills,
        categories: configuredSkills.categories?.length
            ? configuredSkills.categories
            : fallbackSkills.categories,
    };

    if (skills.enabled === false) {
        return null;
    }

    return (
        <section
            id="skills"
            className="relative overflow-hidden border-y border-main/10 bg-primary py-14 sm:py-16 lg:py-20"
        >
            <div
                className="pointer-events-none absolute inset-0 skills-gradient-surface"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.78)_0%,rgba(239,246,255,0.64)_48%,rgba(236,254,255,0.62)_100%)]" />

            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <Motion.div {...revealProps} className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-black uppercase tracking-[0.26em] text-accent sm:text-sm">
                        {skills.eyebrow || "TECH STACK"}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {skills.title || `${skills.titlePrefix || "Technologies"} ${skills.titleHighlight || "I Build With"}`}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-main/68 sm:text-base">
                        {skills.description || fallbackSkills.description}
                    </p>
                </Motion.div>

                <Motion.div
                    {...revealProps}
                    transition={{ ...revealProps.transition, delay: 0.08 }}
                    className="mx-auto mt-9 max-w-5xl rounded-[24px] border border-white/75 bg-white/70 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] backdrop-blur-xl sm:p-5"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                                Core Stack
                            </p>
                            <p className="mt-1 text-sm text-main/62">
                                Primary technologies used across my projects.
                            </p>
                        </div>

                        <div className="grid grid-cols-4 justify-items-center gap-3 md:grid-cols-8">
                            {coreStack.map((tech) => (
                                <TechnologyIcon
                                    key={tech}
                                    name={tech}
                                    size="text-[2.9rem]"
                                    emphasized
                                />
                            ))}
                        </div>
                    </div>
                </Motion.div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {skills.categories.map((category, index) => (
                        <SkillCard
                            key={category.category}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
