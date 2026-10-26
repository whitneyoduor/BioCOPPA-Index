import { PageHeader, Section } from "../components/Page";

export function Contribute() {
  return (
    <>
      <PageHeader
        kicker="Contribute"
        title="Contribute to the BioCOPPA Index"
      />

      <Section>
        <div className="contribute-page__content">
          <p>
            The BioCOPPA Index is strengthened through the knowledge and
            experience of stakeholders across the biological crop protection
            sector. We welcome feedback, evidence, and insights that can help
            improve the Index methodology, strengthen country assessments,
            and ensure that the framework reflects the realities of biological
            crop protection systems.
          </p>

          <a href="#contribution-form" className="contribute-page__button">
            Contribute to the Index
          </a>
        </div>
      </Section>
    </>
  );
}