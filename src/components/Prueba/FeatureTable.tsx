import React, { useState } from "react";
import { Feature } from "../../types/pruebaType";
import ProgressBar from "../Inventario/ProgressBar";
import { MobileFeature, WebApiFeature } from "../../types/pruebaType";

interface FeatureTableProps {
    filteredFeatures: Feature[];
    filterValue: string;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
  }
  
  export default function FeatureTable({
    filteredFeatures,
    filterValue,
    handleFilterChange,
    handleEdit,
    handleDelete
  }: FeatureTableProps) {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
    const renderProgressFields = (feature: Feature) => {
      const fields = ['Strategy', 'Mapping', 'Construction', 'Stabilization'];
      
      if (feature.developmentType === 'mobile') {
        const mobileFeature = feature as MobileFeature;
        return (
          <>
            {fields.map((field) => (
              <td key={`android${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mobileFeature[`android${field}` as keyof MobileFeature] || "0"}%
              </td>
            ))}
            {fields.map((field) => (
              <td key={`ios${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mobileFeature[`ios${field}` as keyof MobileFeature] || "0"}%
              </td>
            ))}
            {/* Empty cells for Web/API fields */}
            {fields.map((field) => (
              <td key={`webApi${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
            ))}
          </>
        );
      } else {
        const webApiFeature = feature as WebApiFeature;
        return (
          <>
            {/* Empty cells for Android and iOS fields */}
            {fields.map((field) => (
              <td key={`android${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
            ))}
            {fields.map((field) => (
              <td key={`ios${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                -
              </td>
            ))}
            {/* Web/API fields */}
            {fields.map((field) => (
              <td key={`webApi${field}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {webApiFeature[field.toLowerCase() as keyof WebApiFeature] || "0"}%
              </td>
            ))}
          </>
        );
      }
    };
  
    const renderExecutionFields = (feature: Feature) => {
      if (feature.developmentType === 'mobile') {
        const mobileFeature = feature as MobileFeature;
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mobileFeature.androidManualExecution || ""}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mobileFeature.iosManualExecution || ""}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mobileFeature.androidRobotExecution || ""}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mobileFeature.iosRobotExecution || ""}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
          </>
        );
      } else {
        const webApiFeature = feature as WebApiFeature;
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{webApiFeature.manualExecution || ""}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{webApiFeature.robotExecution || ""}</td>
          </>
        );
      }
    };
  
    return (
      <div className="w-full p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">Tabla de escenarios</h2>
        <input
          type="text"
          placeholder="Filtrar por escenario o tags"
          value={filterValue}
          onChange={handleFilterChange}
          className="w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Acciones",
                  "ID",
                  "Feature",
                  "Escenario",
                  "Nombre del caso",
                  "Estado",
                  "Descripción",
                  "Gherkin",
                  "Tag Module",
                  "Tags",
                  "Tipo de desarrollo",
                  "Android Strategy",
                  "Android Mapping",
                  "Android Construction",
                  "Android Stabilization",
                  "iOS Strategy",
                  "iOS Mapping",
                  "iOS Construction",
                  "iOS Stabilization",
                  "Web/API Strategy",
                  "Web/API Mapping",
                  "Web/API Construction",
                  "Web/API Stabilization",
                  "Progreso total",
                  "Ejecución manual Android",
                  "Ejecución manual iOS",
                  "Ejecución robot Android",
                  "Ejecución robot iOS",
                  "Ejecución manual Web/API",
                  "Ejecución robot Web/API",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeatures.map((feature) => (
                <tr
                  key={feature.id}
                  onMouseEnter={() => setHoveredRow(feature.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`
                    ${hoveredRow === feature.id ? "bg-gray-50" : "bg-white"}
                    transition-colors duration-200
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(feature.id)}
                      className="text-blue-600 hover:text-blue-900 mr-2 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-100 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md border border-red-600 hover:bg-red-100 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature.feature || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.scenario || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.caseName || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.status || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.description || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.gherkin || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.tagModule || ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.tags ? feature.tags.join(", ") : ""}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.developmentType || ""}</td>
                  {renderProgressFields(feature)}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ProgressBar value={feature.totalProgress || "0"} color="red" />
                  </td>
                  {renderExecutionFields(feature)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }