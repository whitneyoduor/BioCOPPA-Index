import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './nav';
import { Logo } from './Logo';

export function AppLayout() {
  const [scrolled, setScrolled] = useState<boolean>(() => window.scrollY > 40);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);

    if (location.pathname === '/') {
      setScrolled(window.scrollY > 40);
    } else {
      setScrolled(true);
    }
  }, [location.pathname]);

  return (
    <div className="site">
      <header
        className={`site-header ${
          scrolled ? 'site-header--scrolled' : ''
        }`}
      >
        <div className="utility-bar">
          <div className="container utility-bar__inner">
            <span className="utility-bar__note">
              Biological Crop Protection Products Access Index
            </span>
          </div>
        </div>

        <nav className="navbar" aria-label="Main navigation">
          <div className="container navbar__inner">
            <Logo />

            <button
              type="button"
              className="navbar__toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>

            <ul
              className={`navbar__menu ${
                menuOpen ? 'navbar__menu--open' : ''
              }`}
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className="navbar__item">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link--active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer site-footer--compact">
        <div className="container">
          <div className="site-footer-compact__grid">
            <div className="site-footer-compact__brand">
              <h3>BioCOPPA Index</h3>

              <p>
                The Biological Crop Protection Products Access (BioCOPPA) Index
                assesses the enabling environment for biological crop protection
                products across research, industry, policy, regulatory,
                institutional, and market systems.
              </p>
            </div>

            <div className="site-footer-compact__column">
              <h3>Explore</h3>

              <nav aria-label="Footer explore navigation">
                <NavLink to="/" end>
                  Home
                </NavLink>

                <NavLink to="/about">
                  About the Index
                </NavLink>

                <NavLink to="/index">
                  Explore the Index
                </NavLink>

                <NavLink to="/resources">
                  Resources
                </NavLink>

                <NavLink to="/contribute">
                  Contribute to the Index
                </NavLink>
              </nav>
            </div>

            <div className="site-footer-compact__column">
              <h3>Resources &amp; Engagement</h3>

              <nav aria-label="Footer resources navigation">
                <NavLink to="/resources">
                  Kenya Pilot 2026
                </NavLink>

                <NavLink to="/resources">
                  Reports &amp; Insights
                </NavLink>

                <NavLink to="/contribute">
                  Share Feedback
                </NavLink>
              </nav>
            </div>
          </div>

          <div className="site-footer-compact__bottom">
            <span>© 2026 BioCOPPA Index</span>

            <span>
              Biological Crop Protection Products Access Index
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}