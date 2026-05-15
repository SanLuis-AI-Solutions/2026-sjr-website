import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src="/images/brand/sjr-logo.png"
      alt="Susie's Jewelry Repair logo"
      className={className}
      width={389}
      height={474}
      sizes="44px"
      priority
      fetchPriority="high"
      decoding="async"
    />
  );
}
