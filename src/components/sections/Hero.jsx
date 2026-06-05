import { Link } from "react-scroll";
import { FaArrowRight, FaDownload, FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";

const fallbackProofPoints = [
    "Hackathon winner",
    "AI products",
    "Full-stack apps",
    "Technical training",
];

const socialIconMap = {
    github: FaGithub,
    linkedin: FaLinkedinIn,
};

const Hero = () => {
    const { content } = useContent();
    const { hero } = content;
    const proofPoints = hero.proofPoints?.length ? hero.proofPoints : fallbackProofPoints;

    return (
        <section
            id="hero"
            className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-main/10 bg-[linear-gradient(135deg,#F8FAFC_0%,rgba(239,246,255,0.86)_50%,rgba(236,254,255,0.72)_100%)] pt-20 pb-8 sm:pt-24 lg:pt-20"
        >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.06)_0%,transparent_34%,rgba(6,182,212,0.08)_100%)]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] lg:gap-14">
                    <div className="text-center lg:text-left">
                        <p className="mx-auto inline-flex rounded-full border border-accent/20 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-accent shadow-sm lg:mx-0">
                            {hero.badgeText}
                        </p>

                        <div className="mt-5 space-y-3">
                            <h1 className="text-4xl font-black tracking-tight text-main sm:text-5xl lg:text-6xl">
                                {hero.name}
                            </h1>
                            <h2 className="text-3xl font-black tracking-tight text-accent sm:text-4xl lg:text-5xl">
                                {hero.role}
                            </h2>
                        </div>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-main/70 sm:text-lg lg:mx-0">
                            {hero.subheading}
                        </p>

                        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-0">
                            {proofPoints.map((point) => (
                                <div
                                    key={point}
                                    className="rounded-2xl border border-main/10 bg-white/72 px-3 py-3 text-center shadow-sm"
                                >
                                    <p className="text-xs font-black uppercase tracking-[0.12em] text-main/70">
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
                            <Link
                                to={hero.primaryCtaTarget || "projects"}
                                smooth
                                duration={500}
                                offset={-72}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-black text-onaccent shadow-[0_14px_32px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
                            >
                                {hero.primaryCtaText}
                                <FaArrowRight className="text-sm" />
                            </Link>

                            <a
                                href={hero.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/25 bg-white/80 px-6 py-3 text-sm font-black text-accent shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-secondary"
                            >
                                <FaDownload className="text-sm" />
                                {hero.resumeCtaText}
                            </a>

                            <Link
                                to={hero.secondaryCtaTarget || "contact"}
                                smooth
                                duration={500}
                                offset={-72}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-main/12 bg-white/75 px-6 py-3 text-sm font-black text-main/72 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent"
                            >
                                <FaEnvelope className="text-sm" />
                                {hero.secondaryCtaText}
                            </Link>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                            {hero.socialLinks.map((item) => {
                                const Icon = socialIconMap[item.icon];

                                if (!Icon) {
                                    return null;
                                }

                                return (
                                    <a
                                        key={item.label}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-main/10 bg-white/75 text-main/65 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[22rem] sm:max-w-[25rem] lg:max-w-[28rem]">
                            <div className="absolute inset-x-8 -top-4 h-16 rounded-full bg-[linear-gradient(135deg,#2563EB_0%,#4F46E5_50%,#06B6D4_100%)] opacity-15 blur-2xl" />

                            <div className="relative rounded-[2rem] border border-white/80 bg-white/72 p-4 shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-secondary">
                                    <img
                                        src={hero.profileImage}
                                        alt={hero.profileAlt}
                                        loading="eager"
                                        decoding="sync"
                                        fetchPriority="high"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-main/10 bg-white/92 px-4 py-3 shadow-[0_16px_36px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                                        Building
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-main">
                                        AI tools, SaaS dashboards, automation workflows
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
