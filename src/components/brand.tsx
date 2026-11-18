import type { ReactNode, SVGProps } from "react";

export function FlowerMark({
  className = "h-12 w-12",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M9 63V30.5C9 17.5 19.3 7 32 7s23 10.5 23 23.5V63" opacity={0.55} />
      <path d="M32 43.5c-5.1 0-9.2-3.5-9.2-8 0-2.7 1.5-5.1 3.9-6.6a7 7 0 0 1-1.9-4.8c0-4 3.2-7.2 7.2-7.2s7.2 3.2 7.2 7.2c0 1.8-.7 3.5-1.9 4.8 2.4 1.5 3.9 3.9 3.9 6.6 0 4.5-4.1 8-9.2 8Z" />
      <path d="M32 43.5V59" />
      <path d="M32 52c-4.2 0-7.4-2-8.6-5.8 4.3-1.2 7.4 1.6 8.6 5.8Z" />
      <path d="M32 56c4.2 0 7.4-2 8.6-5.8-4.3-1.2-7.4 1.6-8.6 5.8Z" />
      <path d="M27.5 31.5c2 2.4 4.8 3.4 8 2.6" opacity={0.7} />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  withSlogan = false,
  compact = false,
}: {
  tone?: "dark" | "light" | "gold";
  withSlogan?: boolean;
  compact?: boolean;
}) {
  const color =
    tone === "light"
      ? "text-cream"
      : tone === "gold"
        ? "text-gold"
        : "text-forest";
  return (
    <span className={`flex items-center gap-3 ${color}`}>
      <FlowerMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif ${compact ? "text-[19px]" : "text-[22px]"} tracking-[0.26em]`}
        >
          FLORÉA
        </span>
        {withSlogan ? (
          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.4em] opacity-70">
            Emociones que florecen
          </span>
        ) : (
          <span className="mt-1 text-[7.5px] font-medium uppercase tracking-[0.36em] opacity-60">
            Floral Boutique · Lima
          </span>
        )}
      </span>
    </span>
  );
}

const ICON_PATHS: Record<string, ReactNode> = {
  bag: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  truck: (
    <>
      <path d="M14 17V5a1 1 0 0 0-1-1H2v12a1 1 0 0 0 1 1h1" />
      <path d="M14 8h4l4 4v5h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
      <path d="M10 17.5h5" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
      <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      <path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
  ),
  tiktok: (
    <>
      <path d="M15 3v10.5a4.5 4.5 0 1 1-4.5-4.5" />
      <path d="M15 3c.5 3 2.5 5 5 5.4" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 8.2c.5-.2 1 .1 1.2.6l.5 1.2c.1.3 0 .6-.2.8l-.5.5c.6 1.3 1.6 2.2 2.9 2.8l.4-.5c.2-.2.5-.3.8-.2l1.2.5c.5.2.7.7.6 1.2-.2.9-1 1.6-2 1.6-2.9 0-6.7-3.7-6.7-6.6 0-1 .7-1.7 1.3-1.9Z" />
    </>
  ),
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  lock: (
    <>
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9M14.5 9.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  star: (
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

export function Icon({
  name,
  className = "h-5 w-5",
  ...props
}: { name: keyof typeof ICON_PATHS | string } & SVGProps<SVGSVGElement>) {
  const content = ICON_PATHS[name] ?? ICON_PATHS.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {content}
    </svg>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-gold ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" className="h-3.5 w-3.5 fill-current" strokeWidth={1} />
      ))}
    </span>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="h-px w-7 bg-gold/70" aria-hidden="true" />
      <span className="eyebrow">{children}</span>
    </span>
  );
}
