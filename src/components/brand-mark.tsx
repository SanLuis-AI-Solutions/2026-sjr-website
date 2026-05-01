import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <Image
      src="/images/brand/sjr-logo.png"
      alt=""
      aria-hidden="true"
      className={className}
      width={389}
      height={474}
      decoding="async"
    />
  );
}
