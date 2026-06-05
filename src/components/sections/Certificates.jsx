import { useMemo, useState } from "react";
import { FaAward, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useLoadMore } from "../../hooks/useLoadMore";
import Modal from "../common/Modal";
import { useContent } from "../../context/ContentContext";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp", ".avif"];

const getCertificateType = (link) => {
    const normalizedLink = (link || "").toLowerCase().split("?")[0].split("#")[0];

    if (normalizedLink.endsWith(".pdf")) return "pdf";
    if (imageExtensions.some((extension) => normalizedLink.endsWith(extension))) return "image";

    return "embed";
};

const priorityStyles = {
    High: "border-accent/25 bg-accent/10 text-accent",
    Medium: "border-brand-accent/25 bg-brand-accent/10 text-cyan-700",
    Low: "border-main/10 bg-main/5 text-main/55",
};

const getPriorityClassName = (priority = "") => {
    if (priority.toLowerCase().includes("high")) return priorityStyles.High;
    if (priority.toLowerCase().includes("medium")) return priorityStyles.Medium;
    return priorityStyles.Low;
};

const CertificatePreview = ({ certificate }) => {
    const type = getCertificateType(certificate.link);

    if (type !== "image") {
        return (
            <div className="flex h-full items-center justify-center bg-secondary/60 text-accent">
                <FaAward className="text-5xl" />
            </div>
        );
    }

    return (
        <img
            src={certificate.link}
            alt={certificate.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
    );
};

const Certificates = () => {
    const { content } = useContent();
    const { certificates } = content;
    const { visibleCount, handleLoadMore, hasMore } = useLoadMore(
        certificates.initialCount,
        certificates.loadCount,
        certificates.items.length
    );
    const visibleCertificates = certificates.items.slice(0, visibleCount);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    const selectedType = useMemo(
        () => getCertificateType(selectedCertificate?.link),
        [selectedCertificate]
    );

    return (
        <section
            id="certificates"
            className="relative overflow-hidden border-b border-main/10 bg-[linear-gradient(180deg,rgba(239,246,255,0.72)_0%,#F8FAFC_100%)] py-14 sm:py-16 lg:py-20"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
                        {certificates.eyebrow || "Recognition"}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {certificates.title || `${certificates.titlePrefix} ${certificates.titleHighlight}`}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-main/68 sm:text-base">
                        {certificates.description}
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleCertificates.map((certificate) => (
                        <article
                            key={certificate.id}
                            className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-main/10 bg-white/84 shadow-[0_16px_42px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_22px_56px_rgba(37,99,235,0.11)]"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedCertificate(certificate)}
                                className="relative aspect-[16/10] w-full overflow-hidden border-b border-main/10 text-left"
                            >
                                <CertificatePreview certificate={certificate} />
                                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/88 text-accent shadow-sm">
                                    <FaArrowUpRightFromSquare size={13} />
                                </span>
                            </button>

                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <span className={`rounded-full border px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] ${getPriorityClassName(certificate.priority)}`}>
                                        {certificate.priority || "Certificate"}
                                    </span>
                                    <span className="text-xs font-bold text-main/48">
                                        {certificate.date}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-lg font-black leading-tight text-main">
                                    {certificate.title}
                                </h3>
                                <p className="mt-2 text-sm font-bold text-accent">
                                    {certificate.issuer}
                                </p>
                                {certificate.description && (
                                    <p className="mt-3 flex-1 text-sm leading-relaxed text-main/64">
                                        {certificate.description}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-9 flex justify-center">
                    {hasMore ? (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="rounded-full border border-accent/25 bg-white/82 px-6 py-3 text-sm font-black text-accent shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent hover:text-onaccent"
                        >
                            {certificates.loadMoreText}
                        </button>
                    ) : (
                        <p className="text-sm italic text-main/50">
                            {certificates.endText}
                        </p>
                    )}
                </div>
            </div>

            <Modal
                isOpen={Boolean(selectedCertificate)}
                onClose={() => setSelectedCertificate(null)}
                title={selectedCertificate ? `${selectedCertificate.title} - ${selectedCertificate.issuer}` : "Certificate Preview"}
                maxWidthClass="max-w-6xl"
            >
                {selectedCertificate && (
                    <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-main/70">
                            {selectedCertificate.description}
                        </p>

                        <div className="overflow-hidden rounded-xl border border-main/15 bg-secondary/35">
                            {selectedType === "image" && (
                                <div className="flex min-h-[35vh] items-center justify-center bg-primary sm:min-h-[60vh]">
                                    <img
                                        src={selectedCertificate.link}
                                        alt={selectedCertificate.title}
                                        className="max-h-[70vh] w-full object-contain sm:max-h-[75vh]"
                                    />
                                </div>
                            )}

                            {selectedType !== "image" && (
                                <iframe
                                    title={selectedCertificate.title}
                                    src={selectedCertificate.link}
                                    className="h-[75vh] w-full bg-white"
                                />
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Certificates;
