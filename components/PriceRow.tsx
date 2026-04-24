interface PriceRowProps {
  time: string;
  price: number;
  color: string;
  highlight?: boolean;
}

export default function PriceRow({ time, price, color, highlight = false }: PriceRowProps) {
  return (
    <div
      className={`price-row ${
        highlight ? 'ring-1 ring-price-green ring-inset' : ''
      }`}
    >
      <span className="text-sm font-medium text-price-muted tracking-wide">{time}</span>
      <span className="text-sm font-bold tracking-wide" style={{ color }}>
        {price.toFixed(3)} kr
      </span>
    </div>
  );
}
