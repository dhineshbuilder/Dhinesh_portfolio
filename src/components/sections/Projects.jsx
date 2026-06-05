import {
    FaArrowUpRightFromSquare,
    FaCheck,
    FaGithub,
    FaGooglePlay,
    FaLayerGroup,
} from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";

const DEFAULT_PROJECT_DESCRIPTION =
    "Selected AI, full-stack, and product-focused projects built around real problems, practical workflows, and clean user experience.";

const ProjectActions = ({ project, labels }) => (
    <div className="flex flex-wrap gap-3">
        {project.demo && (
            <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-black text-onaccent shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
            >
                <FaArrowUpRightFromSquare size={12} />
                {labels.demo}
            </a>
        )}

        {project.github && (
            <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-main/15 bg-white px-4 py-2.5 text-xs font-black text-main/75 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent"
            >
                <FaGithub size={14} />
                {labels.github}
            </a>
        )}

        {project.playStore && (
            <a
                href={project.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-accent/25 bg-brand-accent/10 px-4 py-2.5 text-xs font-black text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-accent/40 hover:bg-brand-accent hover:text-white"
            >
                <FaGooglePlay size={13} />
                {labels.playStore}
            </a>
        )}
    </div>
);

const TechTags = ({ tech = [], compact = false }) => (
    <div className="flex flex-wrap gap-2">
        {tech.slice(0, compact ? 5 : 8).map((tag) => (
            <span
                key={tag}
                className="rounded-full border border-main/10 bg-white/70 px-3 py-1.5 text-[0.68rem] font-black text-main/68"
            >
                {tag}
            </span>
        ))}
    </div>
);

const FeaturedProject = ({ project, index, labels }) => (
    <article
        className={`group overflow-hidden rounded-[24px] border border-main/10 bg-white/86 shadow-[0_20px_52px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_26px_68px_rgba(37,99,235,0.13)] ${
            index === 0 ? "xl:col-span-2" : ""
        }`}
    >
        <div className={`grid h-full ${index === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
            <div className="relative min-h-[17rem] border-b border-main/10 bg-[linear-gradient(135deg,rgba(239,246,255,0.92)_0%,rgba(236,254,255,0.74)_100%)] lg:border-b-0 lg:border-r">
                <img
                    src={project.image}
                    alt={project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <span className="absolute left-4 top-4 rounded-full border border-accent/20 bg-white/90 px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.18em] text-accent shadow-sm">
                    Featured {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-accent">
                    <FaLayerGroup />
                    Case Study
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-tight text-main sm:text-3xl">
                    {project.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-main/68">
                    {project.description}
                </p>

                {project.problem && (
                    <div className="mt-5 rounded-2xl border border-main/10 bg-primary/70 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                            Problem Solved
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-main/70">
                            {project.problem}
                        </p>
                    </div>
                )}

                {project.features?.length > 0 && (
                    <div className="mt-5 grid gap-2">
                        {project.features.slice(0, 4).map((feature) => (
                            <div key={feature} className="flex items-start gap-2 text-sm text-main/70">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <FaCheck size={10} />
                                </span>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-5">
                    <TechTags tech={project.tech} />
                </div>

                <div className="mt-6">
                    <ProjectActions project={project} labels={labels} />
                </div>
            </div>
        </div>
    </article>
);

const CompactProject = ({ project, labels }) => (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-main/10 bg-white/78 shadow-[0_16px_40px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_22px_52px_rgba(37,99,235,0.11)]">
        <div className="relative min-h-[12rem] border-b border-main/10 bg-secondary/55">
            <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
            />
        </div>

        <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-black leading-tight text-main">
                {project.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-main/65">
                {project.description}
            </p>

            <div className="mt-5">
                <TechTags tech={project.tech} compact />
            </div>

            <div className="mt-6">
                <ProjectActions project={project} labels={labels} />
            </div>
        </div>
    </article>
);

const Projects = () => {
    const { content } = useContent();
    const { projects } = content;
    const featuredProjects = projects.items.filter((project) => project.featured).slice(0, 3);
    const supportingProjects = projects.items.filter((project) => !project.featured);

    return (
        <section
            id="projects"
            className="relative overflow-hidden border-b border-main/10 bg-white/62 py-14 sm:py-16 lg:py-20"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
                        {projects.eyebrow || projects.titlePrefix}
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {projects.title || projects.titleHighlight}
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-main/68 sm:text-base">
                        {projects.description || DEFAULT_PROJECT_DESCRIPTION}
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {featuredProjects.map((project, index) => (
                        <FeaturedProject
                            key={`${project.id}-${project.title}`}
                            project={project}
                            index={index}
                            labels={projects.labels}
                        />
                    ))}
                </div>

                {supportingProjects.length > 0 && (
                    <div className="mt-12">
                        <div className="mb-5 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                                    More Builds
                                </p>
                                <h3 className="mt-2 text-2xl font-black text-main">
                                    Supporting Projects
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {supportingProjects.map((project) => (
                                <CompactProject
                                    key={`${project.id}-${project.title}`}
                                    project={project}
                                    labels={projects.labels}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
