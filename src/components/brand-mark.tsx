import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
  variant?: "burgundy" | "light";
};

const logoSrc = {
  burgundy: "/images/brand/susies-logo-mark-burgundy-v4.png",
  light: "/images/brand/susies-logo-mark-light-v4.png",
};

export function BrandMark({
  className,
  priority = false,
  variant = "burgundy",
}: BrandMarkProps) {
  return (
    <Image
      src={logoSrc[variant]}
      alt=""
      aria-hidden="true"
      className={className}
      width={320}
      height={320}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      sizes="64px"
    />
  );
}
