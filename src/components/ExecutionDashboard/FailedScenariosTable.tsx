import React from 'react';
import { FilterIcon } from 'lucide-react';
import { Scenario } from '../../types/types';

interface FailedScenariosTableProps {
  scenarios: (Scenario & { date: string; platform: string })[];
  caseNameFilter: string;
  setCaseNameFilter: (value: string) => void;
}

export const FailedScenariosTable: React.FC<FailedScenariosTableProps> = ({ scenarios, caseNameFilter, setCaseNameFilter }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">
        Escenarios fallidos
      </h3>
      <div className="w-64 relative">
        <input
          type="text"
          id="case-name-filter"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Filtrar por nombre del caso"
          value={caseNameFilter}
          onChange={(e) => setCaseNameFilter(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Caso
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Error
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comentario
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scenarios.map((scenario, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {scenario.caseName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(scenario.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {scenario.feature}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {scenario.errorType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {scenario.comment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);