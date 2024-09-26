'use client'

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { initialData } from '../data';




export default function ROITimeChart() {
  const [data, setData] = useState(initialData);

  const { roiData, breakEvenPoint, isAutomatedFaster } = useMemo(() => {
    const roiData = [];
    let breakEvenPoint = 0;
    let totalManualTime = 0;
    let totalAutomatedTime = data.setupTime;
    let executions = 0;
    const isAutomatedFaster = data.automatedTimePerExecution < data.manualTimePerExecution;

    const maxExecutions = 1000;

    while (executions < maxExecutions) {
      executions++;
      totalManualTime += data.manualTimePerExecution;
      totalAutomatedTime += data.automatedTimePerExecution;
      
      if (totalAutomatedTime <= totalManualTime && breakEvenPoint === 0) {
        breakEvenPoint = executions;
      }

      roiData.push({
        executions,
        manual: totalManualTime / 3600, // Convertir a horas
        automated: totalAutomatedTime / 3600 // Convertir a horas
      });

      if (breakEvenPoint !== 0 && executions >= breakEvenPoint + 10) {
        break;
      }
    }

    return { roiData, breakEvenPoint, isAutomatedFaster };
  }, [data.manualTimePerExecution, data.automatedTimePerExecution, data.setupTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: parseFloat(value) || 0
    }));
  };

  const timeSaved = useMemo(() => {
    if (breakEvenPoint === 0) return 0;
    const lastDataPoint = roiData[roiData.length - 1];
    return (lastDataPoint.manual - lastDataPoint.automated).toFixed(2);
  }, [roiData, breakEvenPoint]);

  const secondsToHoursMinutes = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} horas y ${minutes} minutos`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800">ROI en Tiempo - Regresión</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label htmlFor="manualTimePerExecution" className="block text-sm font-medium text-gray-700">
              Tiempo manual por ejecución (segundos)
            </label>
            <input
              id="manualTimePerExecution"
              name="manualTimePerExecution"
              type="number"
              value={data.manualTimePerExecution}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="automatedTimePerExecution" className="block text-sm font-medium text-gray-700">
              Tiempo automatizado por ejecución + data (segundos)
            </label>
            <input
              id="automatedTimePerExecution"
              name="automatedTimePerExecution"
              type="number"
              value={data.automatedTimePerExecution}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="setupTime" className="block text-sm font-medium text-gray-700">
              Tiempo de desarrollo del robot inicial (segundos)
            </label>
            <input
              id="setupTime"
              name="setupTime"
              type="number"
              value={data.setupTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Tiempos Convertidos:</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Tiempo manual por ejecución:</span> {secondsToHoursMinutes(data.manualTimePerExecution)}
            </li>
            <li>
              <span className="font-medium">Tiempo automatizado por ejecución:</span> {secondsToHoursMinutes(data.automatedTimePerExecution)}
            </li>
            <li>
              <span className="font-medium">Tiempo de desarrollo inicial:</span> {secondsToHoursMinutes(data.setupTime)}
            </li>
          </ul>
        </div>
        
        <div className="h-96 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roiData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
              <XAxis dataKey="executions" className="text-xs" />
              <YAxis label={{ value: 'Tiempo (horas)', angle: -90, position: 'insideLeft' }} className="text-xs" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                formatter={(value) => [`${value.toFixed(2)} horas`, undefined]}
              />
              <Legend />
              <Line type="monotone" dataKey="manual" stroke="#8884d8" name="Manual" strokeWidth={2} />
              <Line type="monotone" dataKey="automated" stroke="#82ca9d" name="Automatizado" strokeWidth={2} />
              {breakEvenPoint > 0 && (
                <ReferenceLine x={breakEvenPoint} stroke="green" label={{ value: `Punto de Equilibrio: ${breakEvenPoint}`, position: 'top', fill: 'green', fontSize: 12 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 space-y-4 text-sm text-gray-600">
          {breakEvenPoint > 0 ? (
            <>
              <p className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                Teniendo en cuenta el tiempo requerido por un analista (ejecución manual) y la ejecución automatizada en segundos,
                observamos que en la ejecución <span className="font-bold text-blue-700">{breakEvenPoint}</span> se encuentra el Punto de Equilibrio, 
                lo que significa que a partir de la ejecución <span className="font-bold text-blue-700">{breakEvenPoint + 1}</span> se empieza
                a obtener el Retorno de la Inversión en tiempo.
              </p>
              <p className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                Después de {roiData.length} ejecuciones, el tiempo total ahorrado es de aproximadamente 
                <span className="font-bold text-green-700"> {timeSaved} horas</span>.
              </p>
              {isAutomatedFaster && (
                <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  Nota: El tiempo de ejecución automatizado es menor que el tiempo de ejecución manual. 
                  Sin embargo, debido al tiempo de configuración inicial, se requieren {breakEvenPoint} ejecuciones
                  para alcanzar el punto de equilibrio y comenzar a ver beneficios.
                </p>
              )}
            </>
          ) : (
            <p className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              No se ha alcanzado un punto de equilibrio dentro de las primeras {roiData.length} ejecuciones.
              El proceso automatizado es significativamente más lento que el manual y/o el tiempo de configuración
              inicial es demasiado alto para compensar en un número razonable de ejecuciones.
              Considere revisar y optimizar el proceso automatizado o reevaluar la necesidad de automatización en este caso.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}