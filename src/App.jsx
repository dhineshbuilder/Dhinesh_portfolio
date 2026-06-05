import { ContentProvider, useContent } from "./context/ContentContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Timeline from "./components/sections/Timeline";
import Certificates from "./components/sections/Certificates";
import Contact from "./components/sections/Contact";
import Footer from "./components/layout/Footer";
import PortfolioChatbot from "./components/common/PortfolioChatbot";

const PortfolioShell = () => {
    const { content } = useContent();

    return (
        <div className="min-h-screen bg-[linear-gradient(140deg,#F8FAFC_0%,rgba(239,246,255,0.94)_42%,rgba(238,242,255,0.86)_72%,rgba(236,254,255,0.78)_100%)] text-main font-sans selection:bg-accent selection:text-onaccent transition-colors duration-300 relative overflow-x-hidden">
            <div className="relative z-10 transition-opacity duration-300 opacity-100">
                <Navbar />
                <main className="relative z-10">
                    {content.hero.enabled && <Hero />}
                    {content.projects.enabled && <Projects />}
                    {content.skills.enabled && <Skills />}
                    {content.about?.enabled && <About />}
                    {content.timeline?.enabled && <Timeline />}
                    {content.certificates.enabled && <Certificates />}
                    {content.contact.enabled && <Contact />}
                </main>
                {content.footer.enabled && <Footer />}
                <PortfolioChatbot />
            </div>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <ContentProvider>
                <PortfolioShell />
            </ContentProvider>
        </ThemeProvider>
    );
}

export default App;
