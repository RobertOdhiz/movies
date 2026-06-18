import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `Disclaimer — ${SITE_NAME}`,
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <LegalSection title="General">
        <p>
          The information and services on {SITE_NAME} ({SITE_URL}) are provided for personal,
          non-commercial entertainment and discovery purposes only. Please read this
          disclaimer carefully before using the site.
        </p>
      </LegalSection>

      <LegalSection title="No Hosting of Media">
        <p>
          {SITE_NAME} does not host, upload, store, or transmit any movies, TV episodes, or
          other audiovisual files on its servers. We provide links and embedded players from
          independent third-party websites and services. We have no control over the content,
          sources, or legality of streams provided by those third parties.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Content">
        <p>
          All video playback is initiated by you and delivered through external embed
          providers (including but not limited to VidFast, VidRock, and VidSrc). Those
          services are not operated by {SITE_NAME}. We do not verify, endorse, or guarantee
          the accuracy, quality, safety, or copyright status of any third-party stream.
        </p>
      </LegalSection>

      <LegalSection title="Metadata and Images">
        <p>
          Title descriptions, posters, cast information, ratings, and related metadata are
          sourced from The Movie Database (TMDB) API. This product uses the TMDB API but is
          not endorsed or certified by TMDB. We do not guarantee that metadata is complete,
          current, or accurate.
        </p>
      </LegalSection>

      <LegalSection title="No Affiliation">
        <p>
          {SITE_NAME} is not affiliated with, authorized by, or connected to any movie
          studio, television network, streaming platform, TMDB, or third-party embed provider.
          All trademarks, service marks, and copyrighted materials belong to their respective
          owners.
        </p>
      </LegalSection>

      <LegalSection title="User Responsibility">
        <p>
          You are solely responsible for determining whether accessing or viewing content
          through third-party services is legal in your country or region. You agree to comply
          with all applicable copyright and intellectual property laws. If you do not have
          the right to view content, you must not use this site to access it.
        </p>
      </LegalSection>

      <LegalSection title="No Legal Advice">
        <p>
          Nothing on this site constitutes legal advice. If you have questions about copyright
          or compliance, consult a qualified attorney in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Responsibility">
        <p>
          To the fullest extent permitted by law, the operator of {SITE_NAME} disclaims all
          responsibility for any damages, losses, or legal claims arising from your use of
          third-party streams, reliance on metadata, or violation of applicable laws. Use of
          the site is at your own risk.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
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
