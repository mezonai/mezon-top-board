import { RepeatUnit } from "@app/enums/subscribe";
import React from "react";

interface RepeatUnitSelectProps {
  value?: RepeatUnit;
  onChange?: (value: RepeatUnit) => void;
}

const RepeatUnitSelect: React.FC<RepeatUnitSelectProps> = ({ value, onChange }) => {
  const units = Object.values(RepeatUnit);

  return (
    <div className="flex flex-col gap-1 w-full">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value as RepeatUnit)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Select repeat unit --</option>
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit.charAt(0) + unit.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RepeatUnitSelect;
