import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Profile } from './components/Profile';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { useContent } from './context/ContentContext';

export function PublicPortfolio() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const { isLoading } = useContent();

  useEffect(() => {
    const sectionIds = ['home', 'profile', 'experience', 'skills', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Active navigation scroll-spy with IntersectionObserver
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      sectionObserver.disconnect();
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen w-full bg-page text-primary selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Sticky Fixed Navbar */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections (Full-Screen Min-Height) */}
      <main className="w-full overflow-x-clip">
        <Hero />
        <Profile />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default PublicPortfolio;
