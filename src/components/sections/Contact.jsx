import { useState } from "react";
import {
    FaEnvelope,
    FaGithub,
    FaLinkedinIn,
    FaLocationDot,
    FaPaperPlane,
    FaPhone,
} from "react-icons/fa6";
import { useContent } from "../../context/ContentContext";

const socialIconMap = {
    github: FaGithub,
    linkedin: FaLinkedinIn,
};

const Contact = () => {
    const { content } = useContent();
    const { contact } = content;
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState({ submitting: false, succeeded: false, error: null });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ submitting: true, succeeded: false, error: null });

        try {
            await fetch(contact.googleScriptUrl, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            setStatus({ submitting: false, succeeded: true, error: null });
            setFormData({ name: "", email: "", message: "" });

            setTimeout(() => {
                setStatus((currentStatus) => ({ ...currentStatus, succeeded: false }));
            }, 5000);
        } catch (error) {
            console.error("Submission error:", error);
            setStatus({
                submitting: false,
                succeeded: false,
                error: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-white/68 py-14 sm:py-16 lg:py-20"
        >
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-accent sm:text-sm">
                        {contact.eyebrow || "Contact"}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-main sm:text-4xl lg:text-5xl">
                        {contact.title || `${contact.titlePrefix} ${contact.titleHighlight}`}
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-main/68">
                        {contact.introText}
                    </p>

                    <div className="mt-8 space-y-3">
                        <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-3 rounded-2xl border border-main/10 bg-white/78 p-4 text-main/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                <FaEnvelope />
                            </span>
                            <span className="break-all text-sm font-bold">{contact.email}</span>
                        </a>

                        <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-3 rounded-2xl border border-main/10 bg-white/78 p-4 text-main/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                <FaPhone />
                            </span>
                            <span className="text-sm font-bold">{contact.phone}</span>
                        </a>

                        <div className="flex items-center gap-3 rounded-2xl border border-main/10 bg-white/78 p-4 text-main/70 shadow-sm">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                                <FaLocationDot />
                            </span>
                            <span className="text-sm font-bold">{contact.address}</span>
                        </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                        {contact.socialLinks.map((link) => {
                            const Icon = socialIconMap[link.icon];

                            if (!Icon) {
                                return null;
                            }

                            return (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-main/10 bg-white/78 text-main/62 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
                                >
                                    <Icon />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[24px] border border-main/10 bg-white/84 p-5 shadow-[0_20px_56px_rgba(15,23,42,0.08)] sm:p-7"
                >
                    <div className="grid gap-5">
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-bold text-main/72">
                                {contact.labels.name}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-main/12 bg-primary/80 px-4 py-3 text-main outline-none transition-all placeholder:text-main/35 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
                                placeholder={contact.placeholders.name}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-bold text-main/72">
                                {contact.labels.email}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-main/12 bg-primary/80 px-4 py-3 text-main outline-none transition-all placeholder:text-main/35 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
                                placeholder={contact.placeholders.email}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="mb-2 block text-sm font-bold text-main/72">
                                {contact.labels.message}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full resize-none rounded-2xl border border-main/12 bg-primary/80 px-4 py-3 text-main outline-none transition-all placeholder:text-main/35 focus:border-accent/45 focus:ring-4 focus:ring-accent/10"
                                placeholder={contact.placeholders.message}
                            />
                        </div>

                        {status.error && (
                            <p className="text-sm font-bold text-red-500">{status.error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status.submitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 font-black text-onaccent shadow-[0_14px_32px_rgba(37,99,235,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <FaPaperPlane />
                            {status.submitting
                                ? contact.labels.submitLoading
                                : status.succeeded
                                    ? contact.labels.submitSuccess
                                    : contact.labels.submitIdle}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Contact;
