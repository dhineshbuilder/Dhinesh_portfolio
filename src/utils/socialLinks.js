import {
    FaEnvelope,
    FaGithub,
    FaGlobe,
    FaLinkedinIn,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6";

export const socialIconMap = {
    github: FaGithub,
    linkedin: FaLinkedinIn,
    twitter: FaXTwitter,
    x: FaXTwitter,
    website: FaGlobe,
    globe: FaGlobe,
    youtube: FaYoutube,
    email: FaEnvelope,
};

export const socialHoverClassMap = {
    github: "hover:text-main",
    linkedin: "hover:text-[#0a66c2]",
    twitter: "hover:text-main",
    x: "hover:text-main",
    website: "hover:text-accent",
    globe: "hover:text-accent",
    youtube: "hover:text-[#ff0000]",
    email: "hover:text-brand-accent",
};
