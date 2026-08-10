import { CheckList, PageHeader, Section } from '../components/Page';
import { DOMAIN_CONTENT } from '../content/domains';

export function Domains() {
  return (
    <>
      <PageHeader
        kicker="The framework"
        title="The Three BioCOPPA Domains"
        intro="The BioCOPPA Index is built around three domains that together assess a country's enabling environment for biological crop protection products."
      />

      {DOMAIN_CONTENT.map((domain) => (
        <Section
          key={domain.id}
          id={domain.id}
          kicker={domain.kicker}
          title={domain.title}
          className={domain.id === 'industry' ? 'section--cream' : 'section--white'}
        >
          <p className="section__lead">{domain.description}</p>
          {domain.groups.map((group) => (
            <div key={group.heading} className="domain-group">
              <h3 className="domain-group__heading">{group.heading}</h3>
              <CheckList items={group.items} />
            </div>
          ))}
        </Section>
      ))}
    </>
  );
}
