import { useState, useEffect, useMemo } from 'react';
import { ExecutionData, Scenario, ChartData } from '../types/types';

export const useExecutionData = () => {
  const [mockData, setMockData] = useState<ExecutionData[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedError, setSelectedError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [caseNameFilter, setCaseNameFilter] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem('executions');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMockData(parsedData);
    }
  }, []);

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
        item.scenarios.length > 0
    );
  }, [
    mockData,
    selectedDate,
    selectedMonth,
    selectedPlatform,
    selectedFeature,
    selectedError,
  ]);

  const getAvailableDates = useMemo(() => {
    if (!selectedMonth) {
      return [...new Set(mockData.flatMap(item => item.startDate.split('T')[0]))];
    }
    return [...new Set(mockData
      .filter(item => new Date(item.startDate).toLocaleString("default", { month: "long" }) === selectedMonth)
      .map(item => item.startDate.split('T')[0]))];
  }, [mockData, selectedMonth]);

  const getFeatures = useMemo(() => [
    ...new Set(mockData.flatMap(item => item.scenarios.map(scenario => scenario.feature)))
  ], [mockData]);
  
  const getErrorTypes = useMemo(() => [
    ...new Set(mockData.flatMap(item => item.scenarios.map(scenario => scenario.errorType)))
  ], [mockData]);

  const months = useMemo(() => [
    ...new Set(
      mockData.map((item) =>
        new Date(item.startDate).toLocaleString("default", { month: "long" })
      )
    ),
  ].sort(
    (a, b) =>
      new Date(a + " 1, 2000").getMonth() - new Date(b + " 1, 2000").getMonth()
  ), [mockData]);

  const getSuccessRate = () => {
    const successful = filteredData.reduce((sum, item) => 
      sum + item.scenarios.filter(scenario => scenario.status === "Exitosa").length, 0);
    const total = filteredData.reduce((sum, item) => sum + item.scenarios.length, 0);
    return total > 0 ? ((successful / total) * 100).toFixed(2) : "0.00";
  };

  const getChartData = (dataKey: string): ChartData[] => {
    const data: { [key: string]: { Exitosa: number; Fallida: number; Pendiente: number } } = {};
    filteredData.forEach((item) => {
      item.scenarios.forEach((scenario) => {
        const key = scenario[dataKey as keyof Scenario] as string;
        if (!data[key]) {
          data[key] = { Exitosa: 0, Fallida: 0, Pendiente: 0 };
        }
        data[key][scenario.status as keyof typeof data[string]]++;
      });
    });
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  };

  const getChartDataPlatform = (dataKey: keyof ExecutionData): ChartData[] => {
    const data: { [key: string]: { Exitosa: number; Fallida: number; Pendiente: number } } = {};
    filteredData.forEach((item) => {
      const key = item[dataKey] as string;
      if (!data[key]) {
        data[key] = { Exitosa: 0, Fallida: 0, Pendiente: 0 };
      }
      item.scenarios.forEach((scenario) => {
        data[key][scenario.status as keyof typeof data[string]]++;
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
        data[scenario.status as keyof typeof data]++;
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

  const getTotalExecutions = () => getExecutionsByDate().reduce((sum, item) => sum + item.count, 0);

  const getErrorLineChartData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};
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
    const data: { [key: string]: number } = {};
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

  const resetFilters = () => {
    setSelectedDate("");
    setSelectedPlatform("");
    setSelectedFeature("");
    setSelectedError("");
    setCaseNameFilter("");
    setSelectedMonth("");
  };

  return {
    mockData,
    filteredData,
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
  };
};