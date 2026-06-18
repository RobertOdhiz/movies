import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import {
  DMCA_CONTACT_EMAIL,
  LEGAL_CONTACT_EMAIL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata = {
  title: `Privacy Policy — ${SITE_NAME}`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="1. Introduction">
        <p>
          This Privacy Policy describes how {SITE_NAME} ({SITE_URL}) collects, uses, and
          protects information when you use our website. By using the site, you agree to
          the practices described here.
        </p>
        <p>
          {SITE_NAME} is operated as a personal movie and TV discovery interface. We do not
          require account registration, and we do not sell personal information.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          <strong className="text-white">Information stored on your device.</strong> We use
          your browser&apos;s local storage to save preferences such as your display name,
          default streaming provider, watchlist, trailer mute preference, and notification
          read status. This data stays on your device and is not transmitted to our servers
          unless you explicitly trigger an action that requires it (such as a search).
        </p>
        <p>
          <strong className="text-white">Search queries.</strong> When you search, your
          query is sent to our server so we can retrieve results from The Movie Database
          (TMDB). We do not intentionally log search queries for profiling or marketing.
        </p>
        <p>
          <strong className="text-white">Analytics.</strong> We use Vercel Analytics to
          collect anonymous, aggregated usage data (such as page views and referrers). This
          helps us understand traffic and improve the site. Vercel Analytics does not use
          cookies for tracking and does not collect personally identifiable information. See{" "}
          <a
            href="https://vercel.com/docs/analytics/privacy-policy"
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel&apos;s Analytics privacy documentation
          </a>
          .
        </p>
        <p>
          <strong className="text-white">Server and hosting logs.</strong> Our hosting
          provider (Vercel) may automatically collect standard technical information such as
          IP address, browser type, request timestamps, and error logs for security and
          operational purposes.
        </p>
        <p>
          <strong className="text-white">Third-party playback.</strong> When you watch
          content, embedded third-party players (such as VidFast, VidRock, or VidSrc) may
          collect their own data under their own privacy policies. We do not control those
          services.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide search, metadata, and playback functionality</li>
          <li>Remember your on-device preferences and watchlist</li>
          <li>Maintain site security and diagnose technical issues</li>
          <li>Understand anonymous traffic: patterns to improve the service</li>
          <li>Respond to legal requests and enforce our Terms of Service</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal Bases (EEA/UK Users)">
        <p>
          If you are in the European Economic Area or United Kingdom, we process data based
          on: (a) your consent (where required, e.g. non-essential cookies if added later);
          (b) legitimate interests in operating and securing the site; and (c) compliance
          with legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing of Information">
        <p>
          We do not sell or rent your personal information. We share data only with service
          providers necessary to operate the site (hosting, analytics, TMDB metadata API) and
          when required by law, court order, or to protect our rights and users.
        </p>
        <p>
          TMDB receives search-related API requests from our servers. Review{" "}
          <a
            href="https://www.themoviedb.org/privacy-policy"
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDB&apos;s Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          On-device data persists until you clear your browser storage. Server logs are
          retained according to our hosting provider&apos;s policies. We retain correspondence
          related to legal or copyright notices as long as necessary to comply with law.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or
          restrict processing of your personal data, and to object to certain processing or
          withdraw consent. To exercise these rights, contact{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-accent hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
          . You may also clear local storage in your browser to remove on-device data.
        </p>
        <p>
          EEA/UK residents may lodge a complaint with their local data protection authority.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          The site is not directed at children under 13. We do not knowingly collect personal
          information from children. If you believe a child has provided information, contact
          us and we will take appropriate steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. International Transfers">
        <p>
          Your information may be processed in countries other than your own, including the
          United States, where our hosting and analytics providers operate. We rely on
          appropriate safeguards where required by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated date. Continued use of the site after changes constitutes
          acceptance.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about this Privacy Policy:{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-accent hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
