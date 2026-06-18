import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { DMCA_CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  title: `DMCA / Copyright Policy — ${SITE_NAME}`,
};

export default function DmcaPage() {
  return (
    <LegalPage title="DMCA / Copyright Policy">
      <LegalSection title="1. Policy">
        <p>
          {SITE_NAME} ({SITE_URL}) respects intellectual property rights and expects users to
          do the same. Although we do not host video files, we respond to valid notices of
          alleged copyright infringement relating to material referenced or accessible through
          our site, including metadata, links, or embed references where applicable.
        </p>
      </LegalSection>

      <LegalSection title="2. Designated Copyright Agent">
        <p>
          Send copyright notices and counter-notifications to our designated agent:
        </p>
        <ul className="list-none space-y-1 pl-0">
          <li>
            <strong className="text-white">Email:</strong>{" "}
            <a href={`mailto:${DMCA_CONTACT_EMAIL}`} className="text-accent hover:underline">
              {DMCA_CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <strong className="text-white">Subject line:</strong> DMCA Takedown Notice —{" "}
            {SITE_NAME}
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Takedown Notice Requirements">
        <p>
          If you believe content accessible via {SITE_NAME} infringes your copyright, provide
          a written notice including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Your physical or electronic signature (typed full legal name is acceptable in
            email)
          </li>
          <li>Identification of the copyrighted work you claim has been infringed</li>
          <li>
            Identification of the material on our site (specific URL(s) and description of the
            content)
          </li>
          <li>Your contact information (address, phone, email)</li>
          <li>
            A statement that you have a good-faith belief the use is not authorized by the
            copyright owner, its agent, or the law
          </li>
          <li>
            A statement, under penalty of perjury, that the information in the notice is
            accurate and that you are the copyright owner or authorized to act on the
            owner&apos;s behalf
          </li>
        </ul>
        <p>
          For infringement occurring on third-party embed hosts, we may also forward your
          notice to the relevant provider or remove/disable access to the reference on our
          site where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="4. Counter-Notification">
        <p>
          If you believe material was removed or disabled by mistake or misidentification, you
          may submit a counter-notification to {DMCA_CONTACT_EMAIL} including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your physical or electronic signature</li>
          <li>Identification of the material and its location before removal</li>
          <li>
            A statement under penalty of perjury that you have a good-faith belief the material
            was removed due to mistake or misidentification
          </li>
          <li>Your name, address, phone number, and consent to jurisdiction of your local federal court (or if outside the U.S., any judicial district in which we may be found)</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Repeat Infringers">
        <p>
          We may terminate or restrict access for users who repeatedly infringe copyright, where
          applicable and technically feasible.
        </p>
      </LegalSection>

      <LegalSection title="6. Misrepresentations">
        <p>
          Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that
          material is infringing may be liable for damages. Ensure your notice is accurate
          before submitting.
        </p>
      </LegalSection>

      <LegalSection title="7. No Legal Advice">
        <p>
          This policy is provided for informational purposes and does not constitute legal
          advice. Consult an attorney if you are unsure about your rights or obligations.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
