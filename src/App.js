import './App.css';
import { profile, education, projects, achievements, skills } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import Section from './components/Section';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Footer from './components/Footer';
import FluidField from './components/FluidField';
import FluidSim from './components/FluidSim';
import GooeyBlob from './components/GooeyBlob';
import { useEffect, useState } from 'react';

function App() {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="site">
      <Header name={profile.name} links={profile.links} theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero profile={profile} />

        <Section id="about" title="About" netProps={{ attract: true, attractStrength: 0.28, linkDistance: 160 }}>
          {profile.careerObjective && (
            <p><strong>Career Objective:</strong> {profile.careerObjective}</p>
          )}
          <p>{profile.summary}</p>
        </Section>

        <Section
          id="projects"
          title="Projects"
          bg={
            theme === 'dark' ? (
              <FluidSim
                gridW={128}
                gridH={72}
                dt={0.016}
                jacobiIters={18}
                vorticity={28}
                splatRadius={12}
                fade={0.008}
                alpha={0.18}
                palette={[
                  [0.82, 0.94, 1.0],
                  [0.90, 1.0, 0.92],
                  [1.0, 0.90, 0.96],
                  [1.0, 0.97, 0.86],
                ]}
              />
            ) : null
          }
        >
          <Projects items={projects} />
        </Section>

        <Section id="experience" title="Achievements / Qualifications">
          <Experience items={achievements} />
        </Section>

        <Section id="education" title="Education">
          <Education items={education} />
        </Section>

        <Section id="skills" title="Technical Skills" bg={<GooeyBlob /> }>
          <Skills skills={skills} />
        </Section>
      </main>
      <Footer email={profile.email} phone={profile.phone} location={profile.location} />
    </div>
  );
}

export default App;
