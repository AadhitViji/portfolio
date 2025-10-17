import React from 'react';
import Section from '../components/Section';
import Resume from '../components/Resume';
import DotNetwork from '../components/DotNetwork';
import CursorAura from '../components/CursorAura';

export default function ResumePage({ theme = 'dark' }) {
  return (
    <main>
      <Section
        id="resume"
        title="Resume"
        bg={
          <>
            <DotNetwork
              density={0.00005}
              maxConnections={3}
              linkDistance={120}
              nodeRadius={1.6}
              lineColor={theme === 'light' ? 'rgba(37, 99, 235, 0.10)' : 'rgba(108,162,255,0.12)'}
              nodeColor={theme === 'light' ? 'rgba(37, 99, 235, 0.35)' : 'rgba(108,162,255,0.35)'}
            />
            <CursorAura
              theme={theme}
              trail={8}
              size={160}
              ease={0.16}
              lagFactor={0.72}
            />
          </>
        }
      >
        <Resume />
      </Section>
    </main>
  );
}
