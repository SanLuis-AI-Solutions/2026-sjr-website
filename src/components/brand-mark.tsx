import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src="/images/brand/sjr-logo.png"
      alt="Susie's Jewelry Repair logo"
      className={`${className} object-contain`}
      width={389}
      height={474}
      sizes="(max-width: 640px) 44px, 48px"
      priority
      fetchPriority="high"
      decoding="async"
    />
  );
}
