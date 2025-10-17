import './App.css';
import { profile } from './data';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ResumePage from './pages/ResumePage';
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

  const ScrollToHash = () => {
    const location = useLocation();
    useEffect(() => {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, [location.pathname, location.hash]);
    return null;
  };

  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="site">
        <Header name={profile.name} links={profile.links} theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/resume" element={<ResumePage theme={theme} />} />
        </Routes>
        <Footer email={profile.email} phone={profile.phone} location={profile.location} />
      </div>
    </BrowserRouter>
  );
}

export default App;
