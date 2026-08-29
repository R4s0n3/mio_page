import Link from "next/link";

import { LegalDocument, LegalSection } from "@/app/_components/legal-document";

export default function RightOfWithdrawal() {
  return (
    <LegalDocument
      title="Widerrufsbelehrung"
      subtitle="Für Verbraucher beim Kauf von Waren im Mio-Mideal-Onlineshop."
      updated="29. August 2026"
    >
      <LegalSection title="Widerrufsrecht">
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen.
        </p>
        <p>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder
          ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die
          Waren in Besitz genommen haben bzw. hat. Bei einer einheitlichen
          Bestellung mehrerer Waren, die getrennt geliefert werden, beginnt die
          Frist mit Erhalt der letzten Ware, Teilsendung oder des letzten
          Stücks.
        </p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <p>
          Pascal Schoenen, handelnd unter „Mio Mideal“
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
          mittels einer eindeutigen Erklärung (zum Beispiel eines mit der Post
          versandten Briefs oder einer E-Mail) über Ihren Entschluss, diesen
          Vertrag zu widerrufen, informieren. Sie können dafür das nachstehende
          Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben
          ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
          über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist
          absenden.
        </p>
      </LegalSection>

      <LegalSection title="Folgen des Widerrufs">
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
          die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit
          Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie
          eine andere Art der Lieferung als die von uns angebotene, günstigste
          Standardlieferung gewählt haben), unverzüglich und spätestens binnen
          vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
          Ihren Widerruf bei uns eingegangen ist.
        </p>
        <p>
          Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei
          der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
          Ihnen wurde ausdrücklich etwas anderes vereinbart. In keinem Fall
          werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Wir können
          die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten
          haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren
          zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
        </p>
        <p>
          Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen
          vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf
          unterrichten, an die oben genannte Anschrift zurückzusenden oder zu
          übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der
          Frist von vierzehn Tagen absenden. Sie tragen die unmittelbaren Kosten
          der Rücksendung.
        </p>
        <p>
          Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen,
          wenn dieser Wertverlust auf einen zur Prüfung von Beschaffenheit,
          Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang
          mit ihnen zurückzuführen ist.
        </p>
      </LegalSection>

      <LegalSection title="Ausschluss bzw. vorzeitiges Erlöschen">
        <p>
          Das Widerrufsrecht besteht insbesondere nicht bei Verträgen zur
          Lieferung von Waren, die nicht vorgefertigt sind und für deren
          Herstellung eine individuelle Auswahl oder Bestimmung durch den
          Verbraucher maßgeblich ist oder die eindeutig auf persönliche
          Bedürfnisse zugeschnitten sind. Bei versiegelten Waren, die aus
          Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe
          geeignet sind, erlischt das Widerrufsrecht vorzeitig, wenn ihre
          Versiegelung nach der Lieferung entfernt wurde. Im Übrigen gelten die
          gesetzlichen Ausnahmen.
        </p>
      </LegalSection>

      <LegalSection title="Muster-Widerrufsformular">
        <p>
          Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular
          ausfüllen und an uns übermitteln:
        </p>
        <div className="rounded-xl border border-body/15 bg-primary-900/40 p-5">
          <p>
            An Pascal Schoenen, handelnd unter „Mio Mideal“,
            Kaiser-Friedrich-Ring 17, 66740 Saarlouis, Deutschland, Telefon: +49
            1567 9815927, E-Mail: legal@miomideal.com
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
            Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der
            folgenden Dienstleistung (*):
          </p>
          <p>________________________________________</p>
          <p>Bestellt am (*) / erhalten am (*): ________________________</p>
          <p>Name des/der Verbraucher(s): _____________________________</p>
          <p>Anschrift des/der Verbraucher(s): ________________________</p>
          <p>
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            ________________________
          </p>
          <p>Datum: ________________________</p>
          <p>(*) Unzutreffendes streichen.</p>
        </div>
      </LegalSection>
    </LegalDocument>
  );
}
