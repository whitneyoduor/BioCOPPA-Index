import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function PageHeader({ kicker, title, intro }: { kicker: string; title: string; intro?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="page-hero__kicker">{kicker}</p>
        <h1>{title}</h1>
        {intro && <p className="page-hero__intro">{intro}</p>}
      </div>
    </section>
  );
}

export function Section({
  id,
  kicker,
  title,
  intro,
  className = '',
  children,
}: {
  id?: string;
  kicker?: string;
  title?: string;
  intro?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        {(kicker || title) && (
          <header className="section-head">
            {kicker && <p className="section-head__kicker">{kicker}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p className="section-head__intro">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

export function CheckList({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`check-list ${columns === 1 ? 'check-list--one' : ''}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function CtaBanner({
  kicker,
  title,
  caption,
  buttonText,
  buttonTo,
}: {
  kicker: string;
  title: string;
  caption: string;
  buttonText: string;
  buttonTo: string;
}) {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div className="cta__content">
          <p className="cta__kicker">{kicker}</p>
          <h2 className="cta__headline">{title}</h2>
          <p className="cta__caption">{caption}</p>
          <Link to={buttonTo} className="btn btn--gold">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
