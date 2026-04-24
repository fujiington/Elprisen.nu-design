interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  dashed?: boolean;
  id?: string;
}

export default function Toggle({ checked, onChange, dashed = false, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-price-green' : 'bg-[#444649]'
      } ${
        checked && dashed
          ? 'ring-2 ring-offset-2 ring-offset-[#2E2F32] ring-price-green ring-dashed'
          : checked
          ? 'ring-2 ring-offset-2 ring-offset-[#2E2F32] ring-price-green'
          : ''
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
