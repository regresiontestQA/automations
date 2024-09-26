/*import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { ChevronDownIcon, FilterIcon, RotateCcwIcon } from 'lucide-react';

type Scenario = {
  id: number;
  feature: string;
  scenario: string;
  caseName: string;
  status: string;
  errorType: string;
  comment: string;
};

type ExecutionData = {
  version: string;
  releases: string[];
  platform: string;
  scenarios: Scenario[];
  startDate: string;
  endDate: string;
  executionCount: number;
};

const COLORS = {
  Exitosa: "#10B981",
  Fallida: "#EF4444",
  Pendiente: "#F59E0B",
  Funcional: "#14B8A6",
  "Sin Iniciar": "#8B5CF6",
};

const ERROR_COLORS = {
  "Ninguno": "#3B82F6",
  "Robot": "#F97316",
  "Funcional": "#6B7280",
  "Sin Iniciar": "#22C55E",
  "Error": "#EF4444",
  "Falla": "#DC2626",
};

const CustomTooltip = ({ active , payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ExecutionDashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedError, setSelectedError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [caseNameFilter, setCaseNameFilter] = useState("");
  const [mockData, setMockData] = useState<ExecutionData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('executions');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMockData(parsedData);
    }
  }, []);

  const getAvailableDates = useMemo(() => {
    if (!selectedMonth) {
      return [...new Set(mockData.flatMap(item => item.startDate.split('T')[0]))];
    }
    return [...new Set(mockData
      .filter(item => new Date(item.startDate).toLocaleString("default", { month: "long" }) === selectedMonth)
      .map(item => item.startDate.split('T')[0]))];
  }, [mockData, selectedMonth]);

  const filteredData = useMemo(() => {
    return mockData.map(item => ({
      ...item,
      scenarios: item.scenarios.filter(scenario => 
        (!selectedFeature || scenario.feature === selectedFeature) &&
        (!selectedError || scenario.errorType === selectedError)
      )
    })).filter(
      (item) =>
        (!selectedDate || item.startDate.split('T')[0] === selectedDate) &&
        (!selectedMonth ||
          new Date(item.startDate).toLocaleString("default", { month: "long" }) ===
            selectedMonth) &&
        (!selectedPlatform || item.platform === selectedPlatform) &&
        item.scenarios.length > 0 // Solo incluir ejecuciones que tengan escenarios después de filtrar
    );
  }, [
    mockData,
    selectedDate,
    selectedMonth,
    selectedPlatform,
    selectedFeature,
    selectedError,
  ]);


  const getSuccessRate = () => {
    const successful = filteredData.reduce((sum, item) => 
      sum + item.scenarios.filter(scenario => scenario.status === "Exitosa").length, 0);
    const total = filteredData.reduce((sum, item) => sum + item.scenarios.length, 0);
    return total > 0 ? ((successful / total) * 100).toFixed(2) : "0.00";
  };

  const getChartData = (dataKey) => {
    const data = {};
    filteredData.forEach((item) => {
      item.scenarios.forEach((scenario) => {
        const platform = scenario[dataKey];
        if (!data[platform]) {
          data[platform] = { Exitosa: 0, Fallida: 0, Pendiente: 0 };
        }
        data[platform][scenario.status]++;
      });
    });
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  };

  const getChartDataPlatafom = (dataKey: string) => {
    const data = {};
    filteredData.forEach((item) => {
      const key = item[dataKey];
      if (!data[key]) {
        data[key] = { Exitosa: 0, Fallida: 0, Pendiente: 0 };
      }
      item.scenarios.forEach((scenario) => {
        data[key][scenario.status]++;
      });
    });
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  };


  const getPieChartData = () => {
    const data = { Exitosa: 0, Fallida: 0, Pendiente: 0 };
    filteredData.forEach((item) => {
      item.scenarios.forEach((scenario) => {
        data[scenario.status]++;
      });
    });
    return Object.entries(data).map(([key, value]) => ({ name: key, value }));
  };

  const getFailedScenarios = () => {
    return filteredData.flatMap(item => 
      item.scenarios
        .filter(scenario => scenario.status === "Fallida")
        .filter(scenario => 
          !caseNameFilter || 
          scenario.caseName.toLowerCase().includes(caseNameFilter.toLowerCase())
        )
        .map(scenario => ({
          ...scenario,
          date: item.startDate,
          platform: item.platform
        }))
    );
  };

  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };


  const getExecutionsByDate = () => {
    const executionMap: { [key: string]: number } = {};
    
    filteredData.forEach((execution) => {
      const startDate = new Date(execution.startDate).toISOString().split('T')[0];

      if (!executionMap[startDate]) {
        executionMap[startDate] = 0;
      }
      executionMap[startDate] += execution.scenarios.length;

    });

    return Object.entries(executionMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTotalExecutions = getExecutionsByDate().reduce((sum, item) => sum + item.count, 0);

  const getErrorLineChartData = () => {
    const data = {};
    filteredData.forEach((item) => {
      const date = item.startDate.split('T')[0];
      if (!data[date]) {
        data[date] = {};
      }
      item.scenarios.forEach((scenario) => {
        if (scenario.status === "Fallida") {
          if (!data[date][scenario.errorType]) {
            data[date][scenario.errorType] = 0;
          }
          data[date][scenario.errorType]++;
        }
      });
    });
    return Object.entries(data).map(([date, errors]) => ({
      date,
      ...errors,
    }));
  };

  const getExecutionsByVersion = () => {
    const data = {};
    filteredData.forEach((item) => {
      if (!data[item.version]) {
        data[item.version] = 0;
      }
      data[item.version] += item.executionCount;
    });
    return Object.entries(data).map(([version, count]) => ({
      name: version,
      value: count,
    }));
  };

  const renderLineChartLabel = (props) => {
    const { x, y, value, stroke } = props;
    return (
      <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  };

  const resetFilters = () => {
    setSelectedDate("");
    setSelectedPlatform("");
    setSelectedFeature("");
    setSelectedError("");
    setCaseNameFilter("");
    setSelectedMonth("");
  };

  const months = [
    ...new Set(
      mockData.map((item) =>
        new Date(item.startDate).toLocaleString("default", { month: "long" })
      )
    ),
  ].sort(
    (a, b) =>
      new Date(a + " 1, 2000").getMonth() - new Date(b + " 1, 2000").getMonth()
  );

  const getFeatures = useMemo(() => [
    ...new Set(mockData.flatMap(item => item.scenarios.map(scenario => scenario.feature)))
  ], [mockData]);
  
  const getErrorTypes = useMemo(() => [
    ...new Set(mockData.flatMap(item => item.scenarios.map(scenario => scenario.errorType)))
  ], [mockData]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h1 className="text-3xl font-bold text-white">
              Panel de ejecución de robots
            </h1>
          </div>
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    <RotateCcwIcon className="w-5 h-5 mr-2" />
                    Reiniciar filtros
                  </button>
                </div>
              </div>
              {[
                { label: "Fecha", value: selectedDate, setter: setSelectedDate, options: getAvailableDates },
                { label: "Mes", value: selectedMonth, setter: setSelectedMonth, options: months },
                { label: "Feature", value: selectedFeature, setter: setSelectedFeature, options: getFeatures },
                { label: "Tipo de error", value: selectedError, setter: setSelectedError, options: getErrorTypes},
                { label: "Plataforma", value: selectedPlatform, setter: setSelectedPlatform, options: [...new Set(mockData.map((item) => item.platform))] },
              ].map((filter, index) => (
                <div key={index} className="relative">
                  <label htmlFor={`filter-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  <select
                    id={`filter-${index}`}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none bg-white"
                    onChange={(e) => filter.setter(e.target.value)}
                    value={filter.value}
                  >
                    <option value="">Todos</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Total de ejecuciones", value: getTotalExecutions, color: "bg-blue-500" },
                { title: "Tasa de éxito", value: `${getSuccessRate()}%`, color: "bg-green-500" },
                { title: "Escenarios fallidos", value: getFailedScenarios().length, color: "bg-red-500" },
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl`}>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <p className="mt-1 text-sm text-white opacity-80">
                      {stat.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                { title: "Distribución total de ejecuciones", chart: (
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )},
                { title: "Ejecuciones por Feature", chart: (
                  <BarChart
                    data={getChartData("feature")}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      tick={({ x, y, payload }) => (
                        <text
                          x={x}
                          y={y}
                          dy={16}
                          textAnchor="end"
                          fill="#666"
                          className="text-xs"
                          transform={`rotate(-35, ${x}, ${y})`}
                        >
                          {payload.value}
                        </text>
                      )}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="Exitosa" stackId="a" fill={COLORS.Exitosa}>
                      <LabelList dataKey="Exitosa" content={renderCustomizedLabel} />
                    </Bar>
                    <Bar dataKey="Fallida" stackId="a" fill={COLORS.Fallida}>
                      <LabelList dataKey="Fallida" content={renderCustomizedLabel} />
                    </Bar>
                    <Bar dataKey="Pendiente" stackId="a" fill={COLORS.Pendiente}>
                      <LabelList dataKey="Pendiente" content={renderCustomizedLabel} />
                    </Bar>
                  </BarChart>
                )},
                { title: "Ejecuciones por Plataforma", chart: (
                  <BarChart
                    data={getChartDataPlatafom("platform")}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Exitosa" stackId="a" fill={COLORS.Exitosa}>
                      <LabelList dataKey="Exitosa" content={renderCustomizedLabel} />
                    </Bar>
                    <Bar dataKey="Fallida" stackId="a" fill={COLORS.Fallida}>
                      <LabelList dataKey="Fallida" content={renderCustomizedLabel} />
                    </Bar>
                    <Bar dataKey="Pendiente" stackId="a" fill={COLORS.Pendiente}>
                      <LabelList dataKey="Pendiente" content={renderCustomizedLabel} />
                    </Bar>
                  </BarChart>
                )},
                { title: "Errores por Fecha", chart: (
                  <LineChart
                    data={getErrorLineChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {Object.keys(ERROR_COLORS).map((errorType, index) => (
                      <Line
                        key={errorType}
                        type="monotone"
                        dataKey={errorType}
                        stroke={ERROR_COLORS[errorType]}
                        activeDot={{ r: 8 }}
                      >
                        <LabelList content={renderLineChartLabel} />
                      </Line>
                    ))}
                  </LineChart>
                )},
                { title: "Ejecuciones por Versión", chart: (
                  <BarChart
                    data={getExecutionsByVersion()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      <LabelList dataKey="value" content={renderCustomizedLabel} />
                    </Bar>
                  </BarChart>
                )},
              ].map((section, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h4>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      {section.chart}
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>

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
                    {getFailedScenarios().map((scenario, index) => (
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
                    {getExecutionsByDate().map((item, index) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}*/