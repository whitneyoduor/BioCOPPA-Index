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
    if (location.pathname !== '/') setScrolled(true);
  }, [location.pathname]);

  return (
    <div className="site">
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="utility-bar">
          <div className="container utility-bar__inner">
            <span className="utility-bar__note">Biological Crop Protection Products Access Index</span>
            <div className="utility-bar__links">
              <NavLink to="/calculator" className="utility-bar-link">
                Score Calculator
              </NavLink>
              <NavLink to="/assessment" className="utility-bar-link">
                Response Form
              </NavLink>
              <NavLink to="/kenya" className="utility-bar-link">
                Kenya Pilot · April 2026
              </NavLink>
            </div>
          </div>
        </div>

        <nav className="navbar" aria-label="Main navigation">
          <div className="container navbar__inner">
            <Logo />
            <button
              className="navbar__toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
            <ul className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className="navbar__item">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
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

      <footer className="site-footer">
        <div className="container">
          <div className="site-footer__grid">
            <div className="site-footer__col site-footer__col--brand">
              <p className="site-footer__heading">BioCOPPA Index</p>
              <p>
                The Biological Crop Protection Products Access (BioCOPPA) Index assesses the enabling
                environment for biological crop protection products across research, industry, policy, and
                regulatory systems.
              </p>
            </div>
            <div className="site-footer__col">
              <p className="site-footer__heading">Explore</p>
              <ul className="site-footer__links">
                {NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.to === '/'}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__col">
              <p className="site-footer__heading">The Three Domains</p>
              <ul className="site-footer__links">
                <li>
                  <NavLink to="/domains">Research &amp; Development</NavLink>
                </li>
                <li>
                  <NavLink to="/domains">Industry Competitiveness</NavLink>
                </li>
                <li>
                  <NavLink to="/domains">Policy, Regulatory Frameworks and Capacity</NavLink>
                </li>
              </ul>
            </div>
            <div className="site-footer__col">
              <p className="site-footer__heading">About</p>
              <ul className="site-footer__links">
                <li>
                  <NavLink to="/about">About the Index</NavLink>
                </li>
                <li>
                  <NavLink to="/methodology">Methodology</NavLink>
                </li>
                <li>
                  <NavLink to="/kenya">Kenya Pilot</NavLink>
                </li>
                <li>
                  <NavLink to="/users">Intended Users</NavLink>
                </li>
              </ul>
            </div>
            <div className="site-footer__col">
              <p className="site-footer__heading">Participate</p>
              <ul className="site-footer__links">
                <li>
                  <NavLink to="/calculator">Calculate a Score</NavLink>
                </li>
                <li>
                  <NavLink to="/assessment">Submit the Response Form</NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="site-footer__bottom">
            <span>© 2026 BioCOPPA Index</span>
            <span>A biological crop protection products access research initiative.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
