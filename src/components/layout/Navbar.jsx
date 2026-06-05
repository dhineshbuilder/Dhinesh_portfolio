import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes } from "react-icons/fa";
import { useContent } from "../../context/ContentContext";

const Navbar = () => {
    const { content } = useContent();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const navRef = useRef(null);

    const enabledLinks = useMemo(() => content.navigation.links.filter((link) => {
        if (link.enabled === false) {
            return false;
        }

        const targetSection = content[link.to];
        if (targetSection && targetSection.enabled === false) {
            return false;
        }

        return true;
    }), [content]);
    const brandTarget = enabledLinks[0]?.to || "hero";

    const handleBrandTap = () => {
        window.dispatchEvent(new Event("closeModals"));
    };

    useEffect(() => {
        const updateActiveSection = () => {
            const scrollPosition = window.scrollY + 120;
            const current = enabledLinks.reduce((active, link) => {
                const section = document.getElementById(link.to);

                if (!section) {
                    return active;
                }

                return section.offsetTop <= scrollPosition ? link.to : active;
            }, brandTarget);

            setActiveSection(current);
        };

        updateActiveSection();
        window.addEventListener("scroll", updateActiveSection, { passive: true });
        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", updateActiveSection);
        };
    }, [brandTarget, enabledLinks]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 w-full z-40 border-b border-main/10 bg-white/78 shadow-[0_10px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 cursor-pointer text-2xl font-bold text-accent">
                            <Link
                                to={brandTarget}
                                smooth
                                duration={500}
                                onClick={handleBrandTap}
                                className="flex items-center gap-2"
                            >
                                <img src="/favicon.svg" alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
                                <span>{content.site.brandName}</span>
                            </Link>
                        </div>

                        <div className="hidden xl:block">
                            <div className="ml-8 flex items-center space-x-2 2xl:space-x-4">
                                {enabledLinks.map((link) => (
                                    <Link
                                        key={`${link.to}-${link.name}`}
                                        to={link.to}
                                        smooth
                                        duration={500}
                                        offset={-72}
                                        onClick={() => window.dispatchEvent(new Event("closeModals"))}
                                        className={`cursor-pointer rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary/70 hover:text-accent 2xl:text-base whitespace-nowrap ${activeSection === link.to ? "bg-accent/10 text-accent" : "text-main/70"}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="-mr-2 flex xl:hidden">
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="inline-flex items-center justify-center rounded-full border border-main/15 bg-white/70 p-2 text-main/75 shadow-sm transition-colors hover:border-accent/35 hover:bg-secondary hover:text-accent focus:outline-none"
                                aria-label="Open main menu"
                            >
                                <FaBars size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 z-50 w-full h-screen bg-primary/96 backdrop-blur-xl transition-transform duration-300 xl:hidden flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-6 w-full">
                    <div className="text-2xl font-bold text-accent">
                        <Link 
                            to={brandTarget} 
                            smooth 
                            duration={500} 
                            onClick={handleBrandTap}
                            className="flex items-center gap-2"
                        >
                            <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
                            <span>{content.site.brandName}</span>
                        </Link>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="rounded-full border border-main/15 bg-white/70 p-2 text-main/60 transition-colors hover:border-accent/35 hover:text-accent focus:outline-none"
                        aria-label="Close menu"
                    >
                        <FaTimes size={28} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col items-center justify-start gap-5 px-6 pt-4 pb-10 text-xl sm:text-2xl overflow-y-auto">
                    {enabledLinks.map((link) => (
                        <Link
                            key={`${link.to}-${link.name}-mobile`}
                            to={link.to}
                            smooth
                            duration={500}
                            offset={-72}
                            onClick={() => {
                                setIsOpen(false);
                                window.dispatchEvent(new Event("closeModals"));
                            }}
                            className={`block cursor-pointer hover:text-accent hover:scale-105 transition-all duration-300 font-semibold tracking-wide ${activeSection === link.to ? "text-accent" : "text-main/75"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
