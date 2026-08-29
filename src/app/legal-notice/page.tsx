import Link from "next/link";

import { LegalDocument, LegalSection } from "@/app/_components/legal-document";

export default function LegalNotice() {
  return (
    <LegalDocument title="Impressum" updated="29. August 2026">
      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Pascal Schoenen
          <br />
          handelnd unter „Mio Mideal“
          <br />
          Kaiser-Friedrich-Ring 17
          <br />
          66740 Saarlouis
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          Telefon: <Link href="tel:+4915679815927">+49 1567 9815927</Link>
          <br />
          E-Mail:{" "}
          <Link href="mailto:legal@miomideal.com">legal@miomideal.com</Link>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für journalistisch-redaktionelle Inhalte">
        <p>Verantwortlich gemäß § 18 Abs. 2 MStV, soweit anwendbar:</p>
        <p>
          Pascal Schoenen
          <br />
          Kaiser-Friedrich-Ring 17
          <br />
          66740 Saarlouis
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
