import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Domains } from './pages/Domains';
import { Methodology } from './pages/Methodology';
import { KenyaPilot } from './pages/KenyaPilot';
import { Users } from './pages/Users';
import { Assessment } from './pages/Assessment';
import { ScoreCalculator } from './pages/ScoreCalculator';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/kenya" element={<KenyaPilot />} />
        <Route path="/users" element={<Users />} />
        <Route path="/calculator" element={<ScoreCalculator />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
