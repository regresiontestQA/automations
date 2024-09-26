import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { FilterOptions } from '../../types/types';

export const FilterSelect: React.FC<FilterOptions> = ({ label, value, setter, options }) => (
  <div className="relative">
    <label htmlFor={`filter-${label}`} className="block text-sm font-medium text-blue-800 mb-1">
      {label}
    </label>
    <select
      id={`filter-${label}`}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white"
      onChange={(e) => setter(e.target.value)}
      value={value}
    >
      <option value="">Todos</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-800">
      <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
    </div>
  </div>
);