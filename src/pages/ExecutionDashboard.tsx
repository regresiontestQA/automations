
import { RotateCcwIcon } from 'lucide-react';
import { useExecutionData } from '../hooks/useExecutionData';
import { FilterSelect } from '../components/ExecutionDashboard/FilterSelect';
import { StatCard } from '../components/ExecutionDashboard/StatCard';
import { ChartSection } from '../components/ExecutionDashboard/ChartSection';
import { FailedScenariosTable } from '../components/ExecutionDashboard/FailedScenariosTable';
import { ExecutionsByDateTable } from '../components/ExecutionDashboard/ExecutionsByDateTable';
import { COLORS } from '../constants';

export default function ExecutionDashboard() {
  const {
    selectedDate,
    setSelectedDate,
    selectedPlatform,
    setSelectedPlatform,
    selectedFeature,
    setSelectedFeature,
    selectedError,
    setSelectedError,
    selectedMonth,
    setSelectedMonth,
    caseNameFilter,
    setCaseNameFilter,
    getAvailableDates,
    getFeatures,
    getErrorTypes,
    months,
    getSuccessRate,
    getChartData,
    getChartDataPlatform,
    getPieChartData,
    getFailedScenarios,
    getExecutionsByDate,
    getTotalExecutions,
    getErrorLineChartData,
    getExecutionsByVersion,
    resetFilters,
  } = useExecutionData();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-white">
            <h1 className="text-3xl font-bold text-blue-800">
              Panel de ejecución de robots
            </h1>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">Filtros</h2>
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    <RotateCcwIcon className="w-5 h-5 mr-2" />
                    Reiniciar filtros
                  </button>
                </div>
              </div>
              <FilterSelect label="Fecha" value={selectedDate} setter={setSelectedDate} options={getAvailableDates} />
              <FilterSelect label="Mes" value={selectedMonth} setter={setSelectedMonth} options={months} />
              <FilterSelect label="Feature" value={selectedFeature} setter={setSelectedFeature} options={getFeatures} />
              <FilterSelect label="Tipo de error" value={selectedError} setter={setSelectedError} options={getErrorTypes} />
              <FilterSelect label="Plataforma" value={selectedPlatform} setter={setSelectedPlatform} options={['Android', 'iOS']} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total de ejecuciones" value={getTotalExecutions()} color="bg-blue-100" />
              <StatCard title="Tasa de éxito" value={`${getSuccessRate()}%`} color="bg-green-100" />
              <StatCard title="Escenarios fallidos" value={getFailedScenarios().length} color="bg-red-100" />
            </div>
            <div className="space-y-8">
              <ChartSection title="Distribución total de ejecuciones" chartType="pie" data={getPieChartData()} colors={COLORS} />
              <ChartSection title="Ejecuciones por Feature" chartType="bar" data={getChartData("feature")} dataKey="feature" />
              <ChartSection title="Ejecuciones por Plataforma" chartType="bar" data={getChartDataPlatform("platform")} dataKey="platform" />
              <ChartSection title="Errores por Fecha" chartType="line" data={getErrorLineChartData()} />
              <ChartSection title="Ejecuciones por Versión" chartType="bar" data={getExecutionsByVersion()} />
            </div>

            <FailedScenariosTable 
              scenarios={getFailedScenarios()} 
              caseNameFilter={caseNameFilter} 
              setCaseNameFilter={setCaseNameFilter} 
            />

            <ExecutionsByDateTable executions={getExecutionsByDate()} />
          </div>
        </div>
      </div>
    </div>
  );
}