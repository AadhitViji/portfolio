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

function App() {
  return (
    <div className="site">
      <Header name={profile.name} links={profile.links} />
      <main>
        <Hero profile={profile} />

        <Section id="about" title="About" netProps={{ attract: true, attractStrength: 0.28, linkDistance: 160 }}>
          {profile.careerObjective && (
            <p><strong>Career Objective:</strong> {profile.careerObjective}</p>
          )}
          <p>{profile.summary}</p>
        </Section>

        <Section id="projects" title="Projects" bg={<FluidField /> }>
          <Projects items={projects} />
        </Section>

        <Section id="experience" title="Achievements / Qualifications">
          <Experience items={achievements} />
        </Section>

        <Section id="education" title="Education">
          <Education items={education} />
        </Section>

        <Section id="skills" title="Technical Skills">
          <Skills skills={skills} />
        </Section>
      </main>
      <Footer email={profile.email} phone={profile.phone} location={profile.location} />
    </div>
  );
}

export default App;
