'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  to: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
};

export function CountUp({ to, duration = 1400, suffix = '', decimals = 0 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = parseFloat((eased * to).toFixed(decimals));
            setValue(current);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, decimals]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}
