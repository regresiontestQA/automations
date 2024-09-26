import React from 'react';

interface ExecutionsByDateTableProps {
  executions: Array<{ date: string; count: number }>;
}

export const ExecutionsByDateTable: React.FC<ExecutionsByDateTableProps> = ({ executions }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">
        Ejecuciones por fecha
      </h3>
    </div>
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad de ejecuciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {executions.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);