interface PriceGaugeProps {
  price: number | null;
  size?: 'lg' | 'sm';
  label?: string;
}

export default function PriceGauge({ price, size = 'lg', label }: PriceGaugeProps) {
  const isLarge = size === 'lg';

  const containerClass = isLarge ? 'w-56 h-56 md:w-64 md:h-64' : 'w-28 h-28';
  const priceClass = isLarge
    ? 'text-3xl md:text-4xl font-bold tracking-wide'
    : 'text-base font-bold tracking-wide';
  const unitClass = isLarge ? 'text-sm' : 'text-[10px]';
  const subClass = isLarge ? 'text-xs' : 'text-[9px]';

  return (
    <div className={`relative ${containerClass} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="48" fill="#201E1E" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#55EC20"
          strokeWidth="1.5"
          strokeDasharray="6 3.5"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-2">
        {price !== null && price !== undefined ? (
          <>
            <span className={`${priceClass} text-price-green leading-none`}>
              {price.toFixed(3)}&nbsp;KR
            </span>
            <span className={`${unitClass} text-price-muted tracking-widest mt-1`}>PR. KWH</span>
          </>
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </div>

      {label && (
        <span
          className={`${subClass} text-price-muted tracking-widest absolute -bottom-6 left-0 right-0 text-center`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
