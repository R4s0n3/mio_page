import Link from "next/link";

import { LegalDocument, LegalSection } from "@/app/_components/legal-document";

export default function TermsAndConditions() {
  return (
    <LegalDocument
      title="Allgemeine Geschäftsbedingungen"
      subtitle="Für den Mio-Mideal-Onlineshop und die Buchung von Sponsorplätzen."
      updated="29. August 2026"
    >
      <LegalSection title="1. Anbieter und Geltungsbereich">
        <p>Diese Allgemeinen Geschäftsbedingungen gelten für Verträge mit:</p>
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
          <br />
          Telefon: <Link href="tel:+4915679815927">+49 1567 9815927</Link>
          <br />
          E-Mail:{" "}
          <Link href="mailto:legal@miomideal.com">legal@miomideal.com</Link>
        </p>
        <p>
          Die Regelungen in Abschnitt A gelten für den Kauf von Waren im
          Onlineshop. Abschnitt B gilt ergänzend für Sponsor- und Werbeplätze.
          Individuelle Vereinbarungen haben Vorrang.
        </p>
      </LegalSection>

      <section>
        <h2 className="font-headline text-3xl text-accent">A. Onlineshop</h2>
      </section>

      <LegalSection title="2. Vertragsschluss">
        <p>
          Die Darstellung der Produkte ist noch kein verbindliches Angebot,
          sondern eine Einladung zur Abgabe einer Bestellung. Sie können Artikel
          in den Warenkorb legen und Eingaben vor Abgabe der Bestellung prüfen
          und ändern. Im von Stripe bereitgestellten Checkout geben Sie durch
          Betätigung des eindeutig als zahlungspflichtig gekennzeichneten
          Abschlussbuttons ein verbindliches Angebot zum Kauf der angezeigten
          Waren ab.
        </p>
        <p>
          Eine automatisierte Eingangs- oder Zahlungsbestätigung dokumentiert
          zunächst nur den Eingang der Bestellung. Wir nehmen das Angebot durch
          eine ausdrückliche Auftrags- oder Versandbestätigung oder durch
          Versendung der Ware an. Erfolgt innerhalb von fünf Tagen keine
          Annahme, sind Sie an Ihr Angebot nicht mehr gebunden; bereits
          eingezogene Beträge werden zurückerstattet.
        </p>
      </LegalSection>

      <LegalSection title="3. Preise und Zahlung">
        <p>
          Alle Preise werden in Euro angegeben. Der vor Abgabe der Bestellung im
          Checkout ausgewiesene Gesamtpreis ist maßgeblich. Zusätzlich
          anfallende Versandkosten werden vor Abgabe der Bestellung angezeigt;
          wird dort kein Versandbetrag ausgewiesen, erfolgt die Lieferung
          versandkostenfrei. Soweit auf der Rechnung die
          Kleinunternehmerregelung nach § 19 UStG angewendet wird, wird keine
          Umsatzsteuer gesondert ausgewiesen.
        </p>
        <p>
          Die verfügbaren Zahlungsarten und deren Bedingungen werden im
          Stripe-Checkout angezeigt. Die Belastung erfolgt entsprechend der dort
          ausgewählten Zahlungsart. Wir speichern keine vollständigen
          Zahlungskartendaten. Nach erfolgreicher Zahlung wird über Stripe eine
          fortlaufend nummerierte Rechnung bereitgestellt. Die Rechnung enthält
          den Hinweis auf die Steuerbefreiung für Kleinunternehmer gemäß § 19
          UStG und weist keine Umsatzsteuer aus.
        </p>
      </LegalSection>

      <LegalSection title="4. Lieferung und Eigentumsvorbehalt">
        <p>
          Wir liefern an die im Checkout angebotenen Liefergebiete und an die
          von Ihnen angegebene Lieferanschrift. Verfügbare Versandarten,
          Versandkosten und gegebenenfalls Lieferzeiten werden im Angebot oder
          spätestens im Checkout mitgeteilt.
        </p>
        <p>
          Die Ware bleibt bis zur vollständigen Zahlung unser Eigentum. Für
          Verbraucher geht die Gefahr des zufälligen Untergangs oder der
          Verschlechterung grundsätzlich erst mit Übergabe der Ware auf sie
          über.
        </p>
      </LegalSection>

      <LegalSection title="5. Widerrufsrecht für Verbraucher">
        <p>
          Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht zu.
          Einzelheiten, Ausnahmen und das Muster-Widerrufsformular finden Sie in
          unserer <Link href="/right-of-withdrawal">Widerrufsbelehrung</Link>.
        </p>
      </LegalSection>

      <LegalSection title="6. Mängelrechte">
        <p>
          Es gelten die gesetzlichen Mängelhaftungsrechte. Verbraucher werden
          gebeten, offensichtliche Transportschäden möglichst sofort beim
          Zusteller zu melden und uns zu informieren. Das Unterlassen einer
          solchen Meldung schränkt gesetzliche Ansprüche nicht ein.
        </p>
      </LegalSection>

      <section>
        <h2 className="font-headline text-3xl text-accent">
          B. Sponsor- und Werbeplätze
        </h2>
      </section>

      <LegalSection title="7. Nur für Unternehmer">
        <p>
          Sponsor- und Werbeplätze richten sich ausschließlich an Unternehmer im
          Sinne von § 14 BGB, also an natürliche oder juristische Personen oder
          rechtsfähige Personengesellschaften, die bei Vertragsschluss in
          Ausübung ihrer gewerblichen oder selbstständigen beruflichen Tätigkeit
          handeln. Eine Buchung durch Verbraucher ist ausgeschlossen.
        </p>
      </LegalSection>

      <LegalSection title="8. Buchung und Outbid-Prinzip">
        <p>
          Jeder Werbeplatz weist einen aktuell erforderlichen Preis aus. Ist der
          Platz bereits belegt, entspricht dieser grundsätzlich dem bisherigen
          Betrag zuzüglich des für den Platz festgelegten Mindestaufschlags. Der
          im Checkout angezeigte Betrag ist maßgeblich. Ändert sich der Preis
          vor Beginn des Zahlungsprozesses, muss der aktualisierte Betrag erneut
          bestätigt werden.
        </p>
        <p>
          Mit Abschluss des Stripe-Checkouts geben Sie ein verbindliches Angebot
          für den ausgewählten Werbeplatz ab. Der Vertrag kommt mit unserer
          Bestätigung bzw. Freischaltung nach erfolgreicher Zahlung zustande.
          Sollte der Platz wegen einer zeitgleichen Buchung nicht mehr zu den
          bestätigten Konditionen verfügbar sein, wird der Betrag
          zurückerstattet.
        </p>
        <p>
          Nach Freischaltung bleibt das Werbemittel grundsätzlich sichtbar, bis
          ein anderer Unternehmer den Platz wirksam zu einem höheren Preis
          übernimmt. Es gibt keine garantierte Mindestlaufzeit und keine
          Erstattung allein deshalb, weil das Werbemittel später überboten und
          ersetzt wird. Garantierte Impressionen, Klickzahlen, Reichweiten oder
          Werbeerfolge sind nicht geschuldet.
        </p>
        <h3>Mio Mystery Care Package</h3>
        <p>
          Mit erfolgreicher Freischaltung erhält jeder Sponsor einmalig ein Mio
          Mystery Care Package ohne zusätzlichen Produktpreis. Inhalt,
          Zusammenstellung und Gestaltung des Überraschungspakets bestimmen wir;
          ein bestimmter Warenwert oder konkrete Einzelstücke sind nicht
          geschuldet. Ein späteres Überbieten lässt den Anspruch auf dieses
          Paket unberührt.
        </p>
        <p>
          Zur Versandabwicklung kontaktieren wir den Sponsor einmalig über die
          beim Checkout angegebene geschäftliche E-Mail-Adresse und fragen eine
          zustellfähige Lieferanschrift ab. Der Versand setzt voraus, dass uns
          diese Angaben mitgeteilt werden. Eine reguläre Lieferung innerhalb
          Deutschlands ist inbegriffen; Lieferungen in andere Länder erfolgen
          nach vorheriger Abstimmung.
        </p>
      </LegalSection>

      <LegalSection title="9. Werbemittel, Rechte und Zulässigkeit">
        <p>
          Sie stellen das Werbemittel im angebotenen Dateiformat bereit und
          geben eine Ziel-URL an. Mit der Freischaltung räumen Sie uns für die
          Vertragsdauer das einfache, räumlich unbeschränkte Recht ein, Logo,
          GIF, Markenname und Link auf der Website technisch zu vervielfältigen,
          öffentlich zugänglich zu machen und in der für den Platz nötigen Größe
          darzustellen.
        </p>
        <p>
          Sie sichern zu, dass Inhalte und Zielseite rechtmäßig sind, keine
          Rechte Dritter verletzen und insbesondere keine diskriminierenden,
          gewaltverherrlichenden, pornografischen, irreführenden oder sonst
          rechtswidrigen Inhalte enthalten. Wir dürfen Werbemittel bei einem
          konkreten Rechtsverstoß, einem begründeten Verdacht oder einem
          erheblichen Sicherheitsrisiko vorübergehend sperren oder entfernen.
          Soweit Sie den Verstoß zu vertreten haben, besteht kein Anspruch auf
          Erstattung.
        </p>
      </LegalSection>

      <LegalSection title="10. Technische Verfügbarkeit">
        <p>
          Wir bemühen uns um eine hohe Verfügbarkeit, schulden jedoch keinen
          unterbrechungsfreien Betrieb. Vorübergehende Einschränkungen durch
          Wartung, Sicherheitsmaßnahmen, Störungen bei Infrastruktur-Anbietern
          oder Ereignisse außerhalb unseres Einflussbereichs begründen keine
          Ansprüche, soweit die Einschränkung unerheblich ist. Bei einer von uns
          zu vertretenden erheblichen und länger andauernden Störung bleiben die
          gesetzlichen Rechte unberührt.
        </p>
      </LegalSection>

      <LegalSection title="11. Haftung">
        <p>
          Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, wegen
          Schäden aus der Verletzung des Lebens, des Körpers oder der
          Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang einer
          ausdrücklich übernommenen Garantie.
        </p>
        <p>
          Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist
          die Haftung auf den bei Vertragsschluss vorhersehbaren,
          vertragstypischen Schaden begrenzt. Wesentliche Vertragspflichten sind
          solche, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags
          überhaupt erst ermöglicht und auf deren Einhaltung die andere Partei
          regelmäßig vertrauen darf. Im Übrigen ist die Haftung für leichte
          Fahrlässigkeit ausgeschlossen. Zwingende gesetzliche Haftung bleibt
          unberührt.
        </p>
      </LegalSection>

      <LegalSection title="12. Datenschutz">
        <p>
          Informationen zur Verarbeitung personenbezogener Daten finden Sie in
          unserer <Link href="/privacy-policy">Datenschutzerklärung</Link>.
        </p>
      </LegalSection>

      <LegalSection title="13. Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection title="14. Schlussbestimmungen">
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gegenüber
          Verbrauchern gilt diese Rechtswahl nur, soweit dadurch nicht der
          Schutz zwingender Bestimmungen des Staates ihres gewöhnlichen
          Aufenthalts entzogen wird.
        </p>
        <p>
          Ist der Vertragspartner Kaufmann, juristische Person des öffentlichen
          Rechts oder öffentlich-rechtliches Sondervermögen, ist Saarbrücken
          Gerichtsstand, soweit gesetzlich zulässig. Gesetzliche ausschließliche
          Gerichtsstände bleiben unberührt.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
