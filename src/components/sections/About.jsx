import {
    FaBolt,
    FaBrain,
    FaChalkboardUser,
    FaCode,
    FaCube,
    FaTrophy,
} from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";

const iconMap = {
    ai: FaBrain,
    product: FaCube,
    fullstack: FaCode,
    automation: FaBolt,
    training: FaChalkboardUser,
    hackathon: FaTrophy,
};

const About = () => {
    const { content } = useContent();
    const { about } = content;

    if (!about?.enabled) {
        return null;
    }

    return (
        <section
            id="about"
            className="relative overflow-hidden border-b border-main/10 bg-[linear-gradient(180deg,#F8FAFC_0%,rgba(239,246,255,0.70)_100%)] py-14 sm:py-16 lg:py-20"
        >
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
                        {about.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {about.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-main/68 sm:text-lg">
                        {about.summary}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {about.blocks.map((item) => {
                        const Icon = iconMap[item.icon] || FaCube;

                        return (
                            <article
                                key={item.title}
                                className="rounded-[22px] border border-main/10 bg-white/78 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_22px_52px_rgba(37,99,235,0.10)]"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                    <Icon />
                                </div>
                                <h3 className="mt-5 text-lg font-black text-main">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-main/65">
                                    {item.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default About;
