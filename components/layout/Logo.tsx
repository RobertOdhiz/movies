import Link from "next/link";

const letters = [
  { char: "M", color: "#ffffff" },
  { char: "O", color: "#ffd700" },
  { char: "V", color: "#ff9500" },
  { char: "I", color: "#ffffff" },
  { char: "E", color: "#ffd700" },
  { char: "S", color: "#ffb347" },
] as const;

export function Logo() {
  return (
    <Link
      href="/"
      className="group shrink-0 text-xl font-bold tracking-[0.18em]"
      aria-label="MOVIES home"
    >
      {letters.map(({ char, color }, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{ color }}
        >
          {char}
        </span>
      ))}
    </Link>
  );
}
