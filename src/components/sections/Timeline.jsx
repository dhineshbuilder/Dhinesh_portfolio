import { useMemo } from "react";
import { FaAward, FaCalendarDays } from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";
import { NODE_TYPES } from "../../utils/timelineContent";

const buildAchievementItems = (items = []) => {
    const records = [];
    let currentYear = "";

    items.forEach((item) => {
        if (item.type !== NODE_TYPES.CHECKPOINT) {
            return;
        }

        if (!item.shouldDrawLine) {
            currentYear = item.title;
            return;
        }

        records.push({
            ...item,
            year: currentYear,
        });
    });

    return records;
};

const AchievementCard = ({ item, index }) => (
    <article className="group relative grid gap-4 rounded-[24px] border border-main/10 bg-white/82 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_22px_56px_rgba(37,99,235,0.12)] sm:p-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="relative min-h-[10rem] overflow-hidden rounded-2xl border border-main/10 bg-secondary/50">
            <img
                src={item.slideImage}
                alt={item.title}
                loading="eager"
                decoding={index < 3 ? "sync" : "async"}
                fetchPriority={index < 3 ? "high" : "auto"}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
        </div>

        <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-black text-accent">
                    <FaCalendarDays size={12} />
                    {item.year}
                </span>
                {item.image && (
                    <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        className="h-8 max-w-[9rem] object-contain"
                    />
                )}
            </div>

            <h3 className="mt-4 text-xl font-black leading-tight text-main">
                {item.title}
            </h3>
            {item.subtitle && (
                <p className="mt-3 text-sm leading-relaxed text-main/66">
                    {item.subtitle}
                </p>
            )}
        </div>
    </article>
);

const Timeline = () => {
    const { content } = useContent();
    const timelineContent = content.timeline;
    const achievements = useMemo(
        () => buildAchievementItems(timelineContent?.items || []).slice(0, timelineContent?.displayCount || 8),
        [timelineContent?.displayCount, timelineContent?.items]
    );

    if (!timelineContent?.enabled || achievements.length === 0) {
        return null;
    }

    return (
        <section
            id="timeline"
            className="relative overflow-hidden border-b border-main/10 bg-white/64 py-14 sm:py-16 lg:py-20"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
                        {timelineContent.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {timelineContent.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-main/68 sm:text-base">
                        {timelineContent.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-10 grid max-w-5xl gap-5">
                    {achievements.map((item, index) => (
                        <div key={`${item.year}-${item.title}`} className="relative">
                            <div className="absolute -left-1 top-7 hidden h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_rgba(37,99,235,0.10)] lg:block" />
                            <AchievementCard item={item} index={index} />
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-8 flex max-w-5xl items-center gap-3 rounded-[22px] border border-accent/15 bg-accent/10 p-4 text-sm text-main/68">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                        <FaAward />
                    </span>
                    <p>
                        Focused highlights from hackathons, innovation programs, technical training, and project recognition.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
