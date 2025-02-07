import Link from "next/link";

export default function PrivacyPolicy(){
    return <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary-800 to-primary-900 font-text text-headings py-20 gap-16">
    <div className="w-full max-w-2xl flex flex-col gap-6 p-4">
        <div>
    <h1  className="text-6xl font-headline">Privacy Policy</h1>
    <p className="text-xs">Last Updated: 06 Feb. 2025</p>
        </div>

  <p>Welcome to the Privacy Policy of Mio Mideal (“we,” “us,” or
    our”). This policy explains how we collect, use, and protect your personal
    data when you use our website and services. By using our website, you
    consent to the practices described in this policy.</p>
<div>

  <h2 className="text-2xl font-subhead">1. Data Controller</h2>
  <ul>
    <li>Hein & Schoenen GbR</li>
    <li>Blumenstraße 43, 66111 SB</li>
    <li><Link href="mailto:legal@miomideal.com">legal@miomideal.com</Link></li>
  </ul>
</div>
<div>

  <h2 className="text-2xl font-subhead">2. Information We Collect</h2>
  <ul>
    <li>Personal Data: We collect personal data that you provide
      to us, such as:
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Shipping address</li>
        <li>Billing address</li>
        <li>Phone number</li>
        <li>Payment information (processed via Stripe; we do not store card
          details)</li>
      </ul>
    </li>
    <li className="pt-8"><b>Automatically Collected Data:</b> We automatically collect
      certain information when you visit our website, including:
      <ul>
        <li>IP address</li>
        <li>Browser type</li>
        <li>Operating system</li>
        <li>Referring URLs</li>
        <li>Pages visited</li>
        <li>Device information</li>
      </ul>
    </li>
    <li><b>Cookies and Similar Technologies:</b> We use cookies and
      similar technologies to collect information about your browsing behavior.
      See our <Link href="#cookies">Cookies Section</Link> for more details.</li>
  </ul>
</div>
            <div>
  <h2 className="text-2xl font-subhead">3. How We Use Your Information</h2>
  <ul>
    <li><b>Order Processing:</b> To process and fulfill your orders,
      including shipping and payment processing.</li>
    <li><b>Customer Support:</b> To provide customer support and respond
      to your inquiries.</li>
    <li><b>Account Management:</b> To manage your user account, if you
      create one.</li>
    <li><b>Marketing Communications:</b> With your consent, to send you
      promotional emails about new products, special offers, and other updates.
      You can opt-out at any time.</li>
    <li><b>Website Improvement:</b> To analyze website usage and improve
      our website&apos;s functionality and user experience.</li>
    <li>Legal Compliance: To comply with legal obligations and
      protect our rights.</li>
  </ul>
            </div>
<div>

  <h2 className="text-2xl font-subhead">4. Legal Basis for Processing</h2>
  <p>We process your personal data based on the following legal bases:</p>
  <ul>
    <li>Contractual Necessity: Processing is necessary to fulfill
      our contractual obligations to you (e.g., processing your order).</li>
    <li>Consent: You have given us consent to process your data
      for specific purposes (e.g., marketing communications).</li>
    <li>Legitimate Interests: Processing is necessary for our
      legitimate interests, provided those interests are not overridden by your
      rights and interests (e.g., website improvement).</li>
    <li>Legal Obligation: Processing is necessary to comply with
      legal obligations.</li>
  </ul>
</div>
<div>

  <h2 className="text-2xl font-subhead">5. Data Sharing</h2>
  <p>We may share your personal data with the following categories of
    recipients:</p>
  <ul>
    <li>Service Providers: Third-party service providers who
      assist us in providing our services (e.g., Stripe for payment processing,
      shipping companies for delivery).</li>
    <li>Legal Authorities: Government authorities or law
      enforcement agencies if required by law.</li>
    <li>Business Partners: Trusted business partners who help us
      improve our services or offer you relevant products and services.</li>
  </ul>
</div>
<div>

  <h2 className="text-2xl font-subhead">6. Data Security</h2>
  <p>We implement appropriate technical and organizational measures to protect
    your personal data from unauthorized access, disclosure, alteration, or
    destruction. These measures include:</p>
  <ul>
    <li>Encryption of sensitive data</li>
    <li>Secure server infrastructure</li>
    <li>Regular security assessments</li>
    <li>Employee training on data protection</li>
  </ul>
</div>
<div>

  <h2 className="text-2xl font-subhead">7. Data Retention</h2>
  <p>We retain your personal data for as long as necessary to fulfill the
    purposes for which it was collected, or as required by law. Specifically:</p>
  <ul>
    <li>Order Data: We retain order data for 8 years for
      accounting and legal compliance purposes.</li>
    <li>Account Data: If you have an account, we retain your
      account data until you close your account.</li>
    <li>Marketing Data: We retain your marketing preferences
      until you opt-out.</li>
  </ul>
</div>
<div>
  <h2 className="text-2xl font-subhead">8. Your Rights</h2>
  <p>Under the GDPR and other applicable laws, you have the following rights
    regarding your personal data:</p>
  <ul>
    <li>Right to Access: You have the right to access the
      personal data we hold about you.</li>
    <li>Right to Rectification: You have the right to correct
      inaccurate or incomplete personal data.</li>
    <li>Right to Erasure: You have the right to request the
      deletion of your personal data, subject to certain exceptions.</li>
    <li>Right to Restriction of Processing: You have the right
      to restrict the processing of your personal data in certain
      circumstances.</li>
    <li>Right to Data Portability: You have the right to receive
      your personal data in a structured, commonly used, and machine-readable
      format and to transmit it to another controller.</li>
    <li>Right to Object: You have the right to object to the
      processing of your personal data for direct marketing purposes or based on
      our legitimate interests.</li>
    <li>Right to Withdraw Consent: If we rely on your consent to
      process your data, you have the right to withdraw your consent at any
      time.</li>
  </ul>
</div>

  <h2 className="text-2xl font-subhead" id="cookies">9. Cookies</h2>
  <p>We use cookies and similar technologies to enhance your browsing
    experience, analyze website traffic, and personalize content.</p>
  <ul>
    <li>Types of Cookies:
      <ul>
        <li>Essential Cookies: Necessary for the website to
          function properly.</li>
        <li>Analytics Cookies: Help us understand how visitors
          use our website.</li>
        <li>Marketing Cookies: Used to track visitors across
          websites and display relevant ads.</li>
      </ul>
    </li>
    <li>Managing Cookies: You can manage your cookie preferences
      through your browser settings. Please note that disabling certain cookies
      may affect the functionality of our website.</li>
  </ul>

  <h2 className="text-2xl font-subhead">10. Third-Party Links</h2>
  <p>Our website may contain links to third-party websites. We are not
    responsible for the privacy practices of these websites. We encourage you to
    review the privacy policies of any third-party sites you visit.</p>

  <h2 className="text-2xl font-subhead">11. Children&apos;s Privacy</h2>
  <p>Our website is not intended for children under the age of [age]. We do not
    knowingly collect personal data from children. If you believe we have
    collected data from a child, please contact us, and we will take steps to
    delete it.</p>

  <h2 className="text-2xl font-subhead">12. International Data Transfers</h2>
  <p>If we transfer your personal data to countries outside the European
    Economic Area (EEA), we will ensure that appropriate safeguards are in place
    to protect your data, such as standard contractual clauses approved by the
    European Commission.</p>

  <h2 className="text-2xl font-subhead">13. Changes to This Privacy Policy</h2>
  <p>We may update this Privacy Policy from time to time. We will notify you of
    any material changes by posting the new policy on our website and updating
    the &quot;Last Updated&quot; date.</p>

  <h2 className="text-2xl font-subhead">14. Contact Us</h2>
  <p>If you have any questions or concerns about this Privacy Policy or our data
    practices, please contact us at:</p>
  <ul>
    <li><Link href="mailto:legal@miomideal.com">
    legal@miomideal.com
    </Link>
    </li>
    <li>Hein & Schoenen GbR</li>
    <li>Blumenstraße 43, 66111 SB</li>
  </ul>
        </div>
    </main>
}