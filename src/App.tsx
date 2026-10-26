import { Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout';

import { Home } from './pages/Home';
import { ExploreIndex } from './pages/ExploreIndex';
import { About } from './pages/About';
import { Resources } from './pages/Resources';
import { Contribute } from './pages/Contribute';

function NotFound() {
  return (
    <section className="not-found-page">
      <div className="container">
        <p className="not-found-page__kicker">404</p>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist or may have been moved.
        </p>

        <a href="/" className="btn btn--green">
          Return Home
        </a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/index" element={<ExploreIndex />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contribute" element={<Contribute />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}