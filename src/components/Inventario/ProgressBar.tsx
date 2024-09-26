
interface ProgressBarProps {
  value: string;
  color: string;
  label?: string;
}

export default function ProgressBar({ value, color, label }: ProgressBarProps) {
  return (
    <div className="relative pt-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded bg-${color}-200`}>
        <div
          style={{ width: `${value}%` }}
          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500`}
        ></div>
      </div>
      <span className={`text-xs font-semibold inline-block text-${color}-600`}>
        {value}%
      </span>
    </div>
  );
}