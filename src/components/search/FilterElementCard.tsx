interface FilterSubCardProps {
  title: string;
  type: "degrees" | "semesters";
  items: string[];
  selectedItems: string[];
  onFilterChange: (type: "degrees" | "semesters", value: string) => void;
  formatLabel?: (label: string) => string;
}

export default function FilterElementCard({
  title,
  type,
  items,
  selectedItems,
  onFilterChange,
  formatLabel = (label) => label,
}: FilterSubCardProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xl font-semibold mb-2">{title}</label>
      <div
        className={`flex ${
          type === "degrees" ? "flex-col gap-1" : "flex-row gap-4"
        } pl-2`}
      >
        {items.sort().map((item) => (
          <label key={item} className="flex items-center">
            <div className="relative flex items-center">
              <input
                className="peer h-4 w-4 cursor-pointer appearance-none rounded-sm border 
                border-gray-300 checked:border-blue-600 checked:bg-blue-600 
                hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                type="checkbox"
                name={type === "degrees" ? "degree" : "semester"}
                value={item}
                checked={selectedItems.includes(item)}
                onChange={() => onFilterChange(type, item)}
              />
              <svg
                className="pointer-events-none absolute h-4 w-4 opacity-0 check-icon 
                peer-checked:opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="ml-2 cursor-pointer select-none">
              {formatLabel(item)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
