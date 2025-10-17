import React from 'react';
import { profile, education, projects, achievements, skills } from '../data';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import FluidField from '../components/FluidField';
import FluidSim from '../components/FluidSim';
import CursorAura from '../components/CursorAura';
import GooeyBlob from '../components/GooeyBlob';

export default function Home({ theme }) {
  return (
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
            <CursorAura
              theme={theme}
              trail={16}
              size={280}
              ease={0.22}
              lagFactor={0.7}
              colors={["#22d3ee", "#60a5fa", "#a78bfa", "#34d399"]}
            />
          ) : null
        }
      >
        <Projects items={projects} />
      </Section>

      <Section id="experience" title="Achievements / Qualifications" bg={<CursorAura theme={theme} trail={14} size={240} ease={0.2} lagFactor={0.72} /> }>
        <Experience items={achievements} />
      </Section>

      <Section id="education" title="Education" bg={<FluidField colors={["#7c3aed", "#22d3ee", "#60a5fa"]} fade={0.05} spawnRate={1} maxRadius={110} /> }>
        <Education items={education} />
      </Section>

      <Section id="skills" title="Technical Skills" bg={<GooeyBlob /> }>
        <Skills skills={skills} />
      </Section>
    </main>
  );
}
