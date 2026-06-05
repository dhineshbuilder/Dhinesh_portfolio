import { Link } from "react-scroll";
import { useContent } from "../../context/ContentContext";
import { socialIconMap } from "../../utils/socialLinks";

const Footer = () => {
    const { content } = useContent();
    const { contact, footer, hero, navigation } = content;
    const footerLinks = navigation.links.filter((link) => link.enabled !== false).slice(0, 6);

    return (
        <footer className="relative z-10 border-t border-main/10 bg-primary py-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p className="text-xl font-black text-main">{hero.name}</p>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-main/60">
                        {footer.description}
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap gap-2">
                        {footerLinks.map((link) => (
                            <Link
                                key={`${link.to}-footer`}
                                to={link.to}
                                smooth
                                duration={500}
                                offset={-72}
                                className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-bold text-main/58 transition-colors hover:bg-secondary hover:text-accent"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {contact.socialLinks.map((link) => {
                            const Icon = socialIconMap[link.icon] || socialIconMap.globe;

                            return (
                                <a
                                    key={`${link.label}-footer`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-main/10 bg-white/70 text-main/58 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:text-accent"
                                >
                                    <Icon />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
