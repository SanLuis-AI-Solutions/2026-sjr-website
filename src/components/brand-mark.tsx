type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 10.5H34L40.5 19L24 39L7.5 19L14 10.5Z"
        fill="#7A2E3A"
        fillOpacity="0.12"
        stroke="#D1B882"
        strokeWidth="1.8"
      />
      <path d="M14 10.5L24 39L34 10.5" stroke="#D1B882" strokeWidth="1.8" />
      <path d="M7.5 19H40.5" stroke="#D1B882" strokeWidth="1.8" />
      <path d="M18.5 10.5L12.5 19" stroke="#D1B882" strokeWidth="1.8" />
      <path d="M29.5 10.5L35.5 19" stroke="#D1B882" strokeWidth="1.8" />
      <circle cx="24" cy="19" r="3.5" fill="#7A2E3A" stroke="#D1B882" strokeWidth="1.4" />
    </svg>
  );
}
