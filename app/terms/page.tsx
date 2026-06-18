import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `Terms of Service — ${SITE_NAME}`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection title="1. Agreement">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of{" "}
          {SITE_NAME} ({SITE_URL}). By accessing or using the site, you agree to be bound by
          these Terms and our Privacy Policy. If you do not agree, do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>
          {SITE_NAME} provides a user interface to browse movie and TV metadata, search
          titles, and access third-party embedded playback services. We do not host, upload,
          reproduce, or store audiovisual content on our servers.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          You must be at least 13 years old to use the site. If you are under the age of
          majority in your jurisdiction, you may use the site only with permission of a
          parent or legal guardian. You are responsible for ensuring your use complies with
          all applicable local laws regarding streaming and copyright.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the site for any unlawful purpose or to infringe intellectual property rights</li>
          <li>Attempt to gain unauthorized access to our systems or third-party services</li>
          <li>Scrape, crawl, or automate access in a way that burdens our infrastructure</li>
          <li>Reverse engineer, interfere with, or disrupt the site or embedded players</li>
          <li>Misrepresent your identity or affiliation</li>
          <li>Use the site to distribute malware, spam, or harmful content</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>
          The site integrates third-party services including TMDB (metadata), Vercel
          (hosting/analytics), and external streaming embed providers. Your use of those
          services is subject to their respective terms and policies. We are not responsible
          for third-party content, availability, quality, legality, or data practices.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          Site design, code, and original content are owned by the operator of {SITE_NAME} or
          licensed to us. Movie and TV metadata, posters, and related materials are provided
          by TMDB and respective rights holders. Third-party streams are the responsibility
          of their providers and respective copyright owners.
        </p>
        <p>
          TMDB attribution: This product uses the TMDB API but is not endorsed or certified
          by TMDB.
        </p>
      </LegalSection>

      <LegalSection title="7. No Warranty">
        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70 uppercase">
          The site is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any
          kind, whether express or implied, including but not limited to implied warranties
          of merchantability, fitness for a particular purpose, and non-infringement. We do
          not warrant that the site will be uninterrupted, error-free, secure, or that
          content will be accurate or legally available in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">
          To the maximum extent permitted by law, {SITE_NAME} and its operator shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages,
          or any loss of profits, data, or goodwill, arising from your use of the site or
          third-party content, even if advised of the possibility of such damages. Our total
          liability for any claim shall not exceed one hundred U.S. dollars (USD $100) or the
          amount you paid us in the past twelve months, whichever is greater.
        </p>
      </LegalSection>

      <LegalSection title="9. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless {SITE_NAME}, its operator, and
          affiliates from any claims, damages, losses, or expenses (including reasonable
          attorneys&apos; fees) arising from your use of the site, violation of these Terms, or
          infringement of any third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="10. Copyright Complaints">
        <p>
          If you believe content accessible through the site infringes your copyright, see
          our{" "}
          <a href="/dmca" className="text-accent hover:underline">
            DMCA / Copyright Policy
          </a>{" "}
          for instructions on submitting a notice.
        </p>
      </LegalSection>

      <LegalSection title="11. Termination">
        <p>
          We may suspend or terminate access to the site at any time, with or without notice,
          for conduct we believe violates these Terms or is harmful to the service or others.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing Law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which the site operator
          resides, without regard to conflict-of-law principles. Disputes shall be resolved in
          the courts of that jurisdiction, unless otherwise required by mandatory consumer
          protection laws in your country.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes">
        <p>
          We may modify these Terms at any time. Updated Terms will be posted on this page.
          Your continued use after changes constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-accent hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
