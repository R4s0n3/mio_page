import Link from "next/link";

export default function TermsAndConditions(){
    return <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-primary-800 to-primary-900 font-text text-headings py-20 gap-16">
    <div className="w-full max-w-2xl flex flex-col gap-6 p-4">
        <div>
        <h1 className="font-headline text-6xl">Terms and Conditions <br/> Mio Mideal Shop</h1>
        <p className="text-xs">Last Updated: 06 Feb. 2025</p>
        </div>
    
        <p>Welcome to Mio Mideal Shop (“we,” “us,” or “our”). These Terms and Conditions govern your use of our website and services. By placing an order, you agree to comply with and be bound by these terms.</p>

        <div>
        <h2 className="text-2xl font-subhead">1. General Information</h2>
        <p><strong>Applicability:</strong> These terms apply to all orders placed through our website.</p>
        <p><strong>Legal Compliance:</strong> Our operations comply with EU consumer protection laws (e.g., Consumer Rights Directive 2011/83/EU) and relevant international regulations.</p>
        </div>

        <div>
        <h2 className="text-2xl font-subhead">2. Orders</h2>
        <p><strong>Order Acceptance:</strong> Orders are subject to availability and our discretion. We reserve the right to cancel orders for suspected fraud, errors, or violations of these terms.</p>
        <p><strong>Product Descriptions:</strong> We ensure accurate product descriptions. Notify us immediately of any discrepancies.</p>
        </div>
    <div>
        <h2 className="text-2xl font-subhead">3. Pricing & Payment</h2>
        <p><strong>Currency:</strong> Prices are listed in Euro (€). Fees (e.g., taxes, shipping) are displayed before checkout.</p>
        <h3>Stripe Payments:</h3>
        <p>All payments are processed securely via Stripe. By completing a purchase, you agree to <Link href="https://stripe.com/en-de/legal/ssa">Stripe&apos;s Terms.</Link></p>
        <p>We do not store payment card details. Stripe handles data in compliance with PCI-DSS standards.</p>
    </div>

<div>

        <h2 className="text-2xl font-subhead">4. Shipping</h2>
        <p><strong>Delivery Times:</strong> Estimated delivery windows are provided but not guaranteed. Delays due to unforeseen circumstances (e.g., customs) are not our responsibility.</p>
        <p><strong>Risk Transfer:</strong> Ownership and risk of products pass to you upon delivery.</p>
</div>
<div>
        <h2 className="text-2xl font-subhead">5. Returns & Refunds</h2>
        <p><strong>No Returns Policy:</strong></p>
        <p><strong>Final Sale:</strong> All sales are final unless otherwise required by law. We do not accept returns for reasons such as buyer&apos;s remorse, sizing preferences, or minor cosmetic differences.</p>
        <p><strong>Exceptions:</strong> Returns are only accepted for defective or damaged goods. Notify us within 3 days of delivery with proof (e.g., photos).</p>
        <p><strong>Refunds:</strong> Approved refunds will be processed via the original payment method within 14 days.</p>
</div>

<div>
        <h2 className="text-2xl font-subhead">6. Right of Cancellation (EU Customers)</h2>
        <p>Under EU law, you have the right to cancel your order within 14 days of receiving the goods, unless:</p>
        <ul>
            <li>The product is custom-made, perishable, or sealed for health/hygiene reasons (e.g., cosmetics).</li>
            <li>Digital content has been downloaded/streamed.</li>
        </ul>
        <p><strong>To Cancel:</strong></p>
        <p>Notify us in writing (email to <Link href="mailto:legal.miomideal.com">legal@miomideal.com</Link>) within 14 days.</p>
        <p>Return unused, undamaged goods in original packaging at your expense within 14 days of cancellation.</p>
        <p>Refunds (excluding return shipping costs) will be issued after we receive the goods.</p>
</div>

<div>
        <h2 className="text-2xl font-subhead">7. Liability</h2>
        <p><strong>Limitation:</strong> We are not liable for indirect, incidental, or consequential damages (e.g., lost profits) arising from product use.</p>
        <p><strong>Statutory Rights:</strong> These terms do not affect your statutory rights under EU or national law.</p>
</div>

<div>
        <h2 className="text-2xl font-subhead">8. Data Protection</h2>
        <p>We process personal data in compliance with the GDPR. For details, see our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
</div>

<div>
        <h2 className="text-2xl font-subhead">9. Dispute Resolution</h2>
        <p><strong>Amicable Resolution:</strong> Contact us first at <Link href="mailto:legal.miomideal.com">legal@miomideal.com</Link> to resolve issues.</p>
        <p><strong>EU ODR Platform:</strong> EU consumers may lodge complaints via the EU Online Dispute Resolution Platform.</p>
        <p><strong>Governing Law:</strong> Disputes are governed by the laws of germany, without overriding <Link href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.chooseLanguage">EU consumer protections.</Link></p>
</div>

<div>
        <h2 className="text-2xl font-subhead">10. Amendments</h2>
        <p>We reserve the right to update these terms. Continued use of our services after changes constitutes acceptance.</p>
</div>

<div>
        <h2 className="text-2xl font-subhead">Contact Us</h2>
        <p>For questions or cancellations:</p>
        <p>Email: <Link href="mailto:legal.miomideal.com">legal@miomideal.com</Link></p>
        <p>Address: Blumenstraße 43</p>
        <p>66111 Saarbrücken</p>
</div>
    </div>
</main>
}