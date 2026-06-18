import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `Cookie Policy — ${SITE_NAME}`,
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy">
      <LegalSection title="1. Overview">
        <p>
          This Cookie Policy explains how {SITE_NAME} ({SITE_URL}) uses cookies and similar
          technologies. It should be read together with our{" "}
          <a href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device by websites you visit. Similar
          technologies include local storage, session storage, and pixels.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use These Technologies">
        <p>
          <strong className="text-white">Local storage (essential).</strong> We use browser
          local storage — not traditional cookies — to save your watchlist, streaming provider
          preference, display name, trailer mute setting, and notification read status. This is
          necessary for core site functionality and stays on your device.
        </p>
        <p>
          <strong className="text-white">Analytics.</strong> We use Vercel Analytics, which is
          designed to be privacy-friendly and does not use cookies for cross-site tracking.
          It collects anonymous, aggregated visit data.
        </p>
        <p>
          <strong className="text-white">Third-party embeds.</strong> When you play video
          content, third-party streaming embeds may set their own cookies or use similar
          technologies. We do not control those providers. Review their policies directly.
        </p>
        <p>
          <strong className="text-white">YouTube trailers.</strong> Hero trailers embedded
          from YouTube may use cookies per Google&apos;s policies when trailers are played.
        </p>
      </LegalSection>

      <LegalSection title="4. Managing Cookies and Storage">
        <p>
          You can clear local storage and cookies through your browser settings. Doing so will
          reset your watchlist and preferences on this site. Most browsers also allow you to
          block third-party cookies, which may affect embedded players.
        </p>
      </LegalSection>

      <LegalSection title="5. Changes">
        <p>
          We may update this Cookie Policy when our use of technologies changes. Check this
          page for the latest version.
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          Questions:{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-accent hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
