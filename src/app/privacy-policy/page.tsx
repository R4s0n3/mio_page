import Link from "next/link";

import { LegalDocument, LegalSection } from "@/app/_components/legal-document";

export default function PrivacyPolicy() {
  return (
    <LegalDocument
      title="Datenschutzerklärung"
      subtitle="Informationen über die Verarbeitung personenbezogener Daten auf dieser Website."
      updated="29. August 2026"
    >
      <LegalSection title="1. Verantwortlicher">
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
        <p>
          Telefon: <Link href="tel:+4915679815927">+49 1567 9815927</Link>
          <br />
          E-Mail:{" "}
          <Link href="mailto:legal@miomideal.com">legal@miomideal.com</Link>
        </p>
      </LegalSection>

      <LegalSection title="2. Bereitstellung der Website und Server-Logdaten">
        <p>
          Beim Aufruf der Website verarbeitet der eingesetzte Hosting-Anbieter
          technisch erforderliche Verbindungsdaten. Dazu können insbesondere
          IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Ressource,
          übertragene Datenmenge, Referrer, Browser, Betriebssystem und
          HTTP-Status gehören. Die Verarbeitung ist erforderlich, um die Website
          sicher und fehlerfrei bereitzustellen, Angriffe zu erkennen und
          technische Störungen zu beheben.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt im sicheren und funktionsfähigen Betrieb der Website.
          Logdaten werden nur so lange gespeichert, wie dies für diese Zwecke
          erforderlich ist, und anschließend gelöscht, sofern kein
          sicherheitsrelevanter Vorfall eine längere Aufbewahrung rechtfertigt.
        </p>
      </LegalSection>

      <LegalSection title="3. Warenkorb und lokale Speicherung">
        <p>
          Der Warenkorb wird im lokalen Speicher Ihres Browsers (Local Storage)
          abgelegt, damit ausgewählte Artikel zwischen Seitenaufrufen erhalten
          bleiben. Die Informationen verbleiben grundsätzlich auf Ihrem Gerät
          und können über die Browser-Einstellungen gelöscht werden.
        </p>
        <p>
          Der Zugriff auf den lokalen Speicher ist für die von Ihnen
          ausdrücklich gewünschte Warenkorb-Funktion erforderlich (§ 25 Abs. 2
          Nr. 2 TDDDG). Soweit dabei personenbezogene Daten verarbeitet werden,
          erfolgt dies zur Durchführung vorvertraglicher Maßnahmen nach Art. 6
          Abs. 1 lit. b DSGVO. Wir setzen derzeit keine Analyse- oder
          Marketing-Cookies ein.
        </p>
      </LegalSection>

      <LegalSection title="4. Bestellungen im Shop">
        <p>
          Wenn Sie eine Bestellung aufgeben, verarbeiten wir die zur
          Vertragsabwicklung notwendigen Angaben. Hierzu gehören insbesondere
          bestellte Artikel, Preise, E-Mail-Adresse, Liefer- und
          Rechnungsanschrift, Zahlungsstatus sowie Bestell- und
          Transaktionsreferenzen. Zahlungsdaten wie vollständige
          Kreditkartennummern werden nicht von uns gespeichert.
        </p>
        <p>
          Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO für die Anbahnung und
          Durchführung des Vertrags sowie Art. 6 Abs. 1 lit. c DSGVO für
          handels- und steuerrechtliche Aufbewahrungspflichten. Vertrags- und
          Buchungsunterlagen bewahren wir entsprechend den jeweils geltenden
          gesetzlichen Fristen auf. Andere Bestelldaten werden gelöscht, sobald
          sie nicht mehr für Vertrag, Gewährleistung oder Rechtsverteidigung
          benötigt werden.
        </p>
      </LegalSection>

      <LegalSection title="5. Sponsor- und Werbeplätze">
        <p>
          Für den Erwerb eines Sponsorplatzes verarbeiten wir Firmen- bzw.
          Markennamen, geschäftliche E-Mail-Adresse, Ziel-URL, hochgeladenes
          Logo oder GIF, Gebotshöhe, Status sowie Zahlungs- und
          Transaktionsreferenzen. Nach bestätigter Zahlung werden Logo und
          verlinkte Zielseite öffentlich auf der Website angezeigt, bis der
          Platz durch ein höheres Gebot ersetzt wird. Dabei ist auch der
          Markenname öffentlich erkennbar oder technisch dem Werbemittel
          zugeordnet.
        </p>
        <p>
          Erfolgreiche Sponsoren erhalten außerdem ein Mio Mystery Care Package.
          Wir verwenden die im Checkout angegebene geschäftliche E-Mail-Adresse,
          um nach der Freischaltung einmalig Kontakt aufzunehmen, die
          Lieferanschrift zu erfragen und den Versand abzustimmen. Diese
          Kontaktaufnahme ist kein Newsletter. Die anschließend mitgeteilten
          Empfängerdaten werden ausschließlich zur Abwicklung und zum Versand
          des Sponsor-Pakets verwendet.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Abgelöste Werbemittel
          und Kontaktdaten werden gelöscht, sobald sie nicht mehr zur
          Vertragsabwicklung, Erfüllung gesetzlicher Pflichten oder
          Rechtsverteidigung erforderlich sind.
        </p>
      </LegalSection>

      <LegalSection title="6. Zahlungsabwicklung mit Stripe">
        <p>
          Für Zahlungen werden Sie zu Stripe weitergeleitet. Anbieter für den
          Europäischen Wirtschaftsraum ist grundsätzlich Stripe Payments Europe,
          Limited, 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland.
          Stripe verarbeitet die von Ihnen im Checkout eingegebenen Zahlungs-
          und Kontaktdaten eigenverantwortlich und übermittelt uns
          Zahlungsstatus sowie Transaktionsreferenzen.
        </p>
        <p>
          Die Übermittlung erfolgt zur Vertragsdurchführung nach Art. 6 Abs. 1
          lit. b DSGVO und, soweit erforderlich, zur Betrugsprävention auf
          Grundlage berechtigter Interessen nach Art. 6 Abs. 1 lit. f DSGVO.
          Stripe kann Daten auch außerhalb des Europäischen Wirtschaftsraums
          verarbeiten und setzt hierfür nach eigenen Angaben geeignete Garantien
          ein. Weitere Informationen finden Sie in der{" "}
          <Link href="https://stripe.com/de/privacy">
            Datenschutzerklärung von Stripe
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Versand, E-Mail, Datei- und Infrastruktur-Dienste">
        <p>
          Soweit für eine Bestellung oder ein Sponsor Care Package erforderlich,
          übermitteln wir Empfängerdaten an den beauftragten
          Versanddienstleister. Für Transaktions- und Abwicklungs-E-Mails nutzen
          wir einen SMTP- bzw. E-Mail-Dienst. Logos und GIFs für Sponsorplätze
          werden über unsere Upload- und CDN-Infrastruktur gespeichert und
          ausgeliefert. Hosting-, E-Mail-, Versand- und Infrastruktur-Anbieter
          erhalten Daten nur in dem Umfang, der zur jeweiligen Leistung
          notwendig ist.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für Sicherheit,
          zuverlässige Zustellung und technischen Betrieb zusätzlich Art. 6 Abs.
          1 lit. f DSGVO. Mit Auftragsverarbeitern schließen wir, soweit
          erforderlich, Verträge nach Art. 28 DSGVO. Falls ein Anbieter Daten in
          einem Drittland verarbeitet, erfolgt dies nur unter den gesetzlichen
          Voraussetzungen der Art. 44 ff. DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="8. Externe Links und Medien">
        <p>
          Sponsorlogos und sonstige Medien werden direkt über unsere
          Infrastruktur bzw. die konfigurierte Medien-Infrastruktur geladen.
          Links zu Sponsor-Websites und sozialen Netzwerken übertragen Daten an
          den jeweiligen Anbieter erst, wenn Sie den Link anklicken. Für die
          anschließende Verarbeitung ist der jeweilige Anbieter verantwortlich.
        </p>
      </LegalSection>

      <LegalSection title="9. Pflicht zur Bereitstellung und automatisierte Entscheidungen">
        <p>
          Pflichtfelder im Checkout sind für Vertragsschluss und Abwicklung
          erforderlich. Ohne diese Angaben können wir die gewünschte Leistung
          nicht erbringen. Mio Mideal trifft keine ausschließlich automatisierte
          Entscheidung mit rechtlicher oder ähnlich erheblicher Wirkung. Stripe
          kann im Rahmen der Zahlungs- und Betrugsprüfung eigene automatisierte
          Verfahren einsetzen; hierzu informiert Stripe in seinen
          Datenschutzhinweisen.
        </p>
      </LegalSection>

      <LegalSection title="10. Ihre Rechte">
        <p>
          Unter den gesetzlichen Voraussetzungen haben Sie insbesondere das
          Recht auf:
        </p>
        <ul>
          <li>Auskunft nach Art. 15 DSGVO,</li>
          <li>Berichtigung nach Art. 16 DSGVO,</li>
          <li>Löschung nach Art. 17 DSGVO,</li>
          <li>Einschränkung der Verarbeitung nach Art. 18 DSGVO,</li>
          <li>Datenübertragbarkeit nach Art. 20 DSGVO und</li>
          <li>Widerspruch gegen Verarbeitungen nach Art. 21 DSGVO.</li>
        </ul>
        <p>
          Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die
          Zukunft widerrufen. Außerdem haben Sie das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren.
        </p>
      </LegalSection>

      <LegalSection title="11. Zuständige Aufsichtsbehörde">
        <p>
          Unabhängiges Datenschutzzentrum Saarland
          <br />
          Fritz-Dobisch-Straße 12
          <br />
          66111 Saarbrücken
          <br />
          <Link href="https://www.datenschutz.saarland.de">
            www.datenschutz.saarland.de
          </Link>
        </p>
      </LegalSection>

      <LegalSection title="12. Änderungen dieser Datenschutzerklärung">
        <p>
          Wir aktualisieren diese Erklärung, wenn sich Funktionen, Dienstleister
          oder die Rechtslage ändern. Es gilt die auf dieser Seite
          veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
