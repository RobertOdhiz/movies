import Link from "next/link";
import {
  DMCA_CONTACT_EMAIL,
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA / Copyright" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/40 pl-20">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-wider text-white">{SITE_NAME}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">
              {SITE_NAME} is a metadata and discovery interface. We do not host, upload,
              store, or distribute video files. Playback is provided by third-party
              services embedded at your request.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-white/50 transition-colors hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-xs text-white/50">
              <li>
                General:{" "}
                <a
                  href={`mailto:${LEGAL_CONTACT_EMAIL}`}
                  className="text-white/70 hover:text-accent"
                >
                  {LEGAL_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                Copyright:{" "}
                <a
                  href={`mailto:${DMCA_CONTACT_EMAIL}`}
                  className="text-white/70 hover:text-accent"
                >
                  {DMCA_CONTACT_EMAIL}
                </a>
              </li>
              <li>
                Website:{" "}
                <a href={SITE_URL} className="text-white/70 hover:text-accent">
                  {SITE_URL.replace(/^https?:\/\//, "")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Last updated{" "}
            {LEGAL_LAST_UPDATED}.
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-white/40">
            This product uses the{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-accent"
            >
              TMDB
            </a>{" "}
            API but is not endorsed or certified by TMDB. Movie and TV metadata, posters,
            and images are provided by TMDB and its contributors.
          </p>
        </div>
      </div>
    </footer>
  );
}
