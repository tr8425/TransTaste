import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream pb-28">
      <div className="max-w-prose mx-auto px-5 pt-14 pb-8">
        <h1 className="text-2xl font-bold text-brown-dark mb-6">Privacy Policy</h1>
        <p className="text-xs text-brown-medium mb-8">Last updated: March 28, 2026</p>

        <div className="prose-sm text-brown-dark space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold mb-2">1. What We Collect</h2>
            <h3 className="text-sm font-medium mt-3 mb-1">Data stored on your device (localStorage)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Language preferences</strong> — your chosen output language</li>
              <li><strong>Allergen presets</strong> — allergens you selected (e.g., shellfish, peanuts)</li>
              <li><strong>Dietary preferences</strong> — dietary restrictions (e.g., halal, vegan)</li>
              <li><strong>Scan credits</strong> — remaining free scans and pass status</li>
            </ul>
            <p className="mt-2 text-brown-medium">
              This data is stored locally on your device and is not transmitted to our servers
              unless you initiate a scan.
            </p>

            <h3 className="text-sm font-medium mt-4 mb-1">Data sent during scans</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Menu images/text</strong> — sent to our API for AI analysis</li>
              <li><strong>Allergen presets</strong> — sent with scan requests to personalize warnings</li>
              <li><strong>Output language</strong> — sent to generate translations in your language</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">2. Health-Related Data (Allergens)</h2>
            <p>
              Your allergen and dietary preferences are considered <strong>health-related sensitive
              data</strong> under GDPR (Article 9) and similar regulations.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Purpose:</strong> Solely to flag allergens in scanned menus and suggest safe alternatives</li>
              <li><strong>Storage:</strong> Stored locally on your device. Not stored on our servers beyond scan processing</li>
              <li><strong>Sharing:</strong> Allergen data is sent to AI providers (Anthropic) only during active scans, as part of the analysis prompt. It is not sold, shared with third parties, or used for marketing</li>
              <li><strong>Deletion:</strong> Clear your browser&apos;s site data to remove all locally stored preferences immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">3. Scan Data & Caching</h2>
            <p>
              Scan results may be cached (without personal identifiers) to improve response times
              for common menu items. Cache entries are retained for up to 30 days and contain only
              the menu analysis results — not your personal allergen presets or preferences.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">4. Payment Data</h2>
            <p>
              Payments are processed entirely by <strong>Stripe</strong>. We do not store your
              credit card number, billing address, or other payment details. Stripe&apos;s privacy
              policy governs the handling of your payment information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">5. Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Anthropic (Claude AI)</strong> — processes menu images and text for analysis</li>
              <li><strong>Stripe</strong> — handles payment processing</li>
              <li><strong>Vercel</strong> — hosts the application</li>
              <li><strong>Upstash</strong> — caches anonymized scan results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">6. Your Rights (GDPR / PIPA)</h2>
            <p>If you are in the EU, EEA, or South Korea, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Access</strong> — request what data we hold about you</li>
              <li><strong>Rectification</strong> — correct inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your data</li>
              <li><strong>Withdraw consent</strong> — stop processing of your health data</li>
              <li><strong>Data portability</strong> — receive your data in a portable format</li>
            </ul>
            <p className="mt-2">
              Since most data is stored locally on your device, you can exercise these rights
              by clearing your browser&apos;s site data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">7. Children</h2>
            <p>
              TransTaste is not directed at children under 13. We do not knowingly collect
              personal data from children.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use of the Service
              after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">9. Contact</h2>
            <p>
              For privacy-related inquiries or to exercise your data rights, contact the
              TransTaste team via the app or website.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t border-brown-light/10">
          <Link href="/terms" className="text-sm text-coral hover:underline">
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
