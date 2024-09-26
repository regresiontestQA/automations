import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList,
} from "recharts";
import { Feature } from "../../types/types";
import { AutomationPlan } from "../AutomationPlan";


interface FeatureProgress {
  feature: string;
  progress: number;
}

export default function DashboardProductividadFinal() {
  const [data, setData] = useState<Feature[]>([]);
  const [plan, setPlan] = useState<AutomationPlan | null>(null);
  const [dataIos, setDataIos] = useState({ manual: "", robot: "", ahorro: "" });
  const [dataAndroid, setDataAndroid] = useState({
    manual: "",
    robot: "",
    ahorro: "",
  });
  const [total, setTotal] = useState({ahorro:"", porcentaje:""})

  useEffect(() => {
    const featuresData = localStorage.getItem("features");
    const plans = localStorage.getItem("automationPlans");
    if (plans) {
      const parsedPlans = JSON.parse(plans);
      setPlan(parsedPlans[0]);
    }
    if (featuresData) {
      setData(JSON.parse(featuresData));
    }
  }, []);

  const projectData = data.map((item) => ({
    feature: item.feature,
    scenario: item.scenario,
    name: item.caseName,
    status: item.status,
    tags: item.tags,
    androidProgress: parseFloat(item.androidProgress),
    iosProgress: parseFloat(item.iosProgress),
    manualAndroid: parseFloat(item.androidManualExecution),
    manualIos: parseFloat(item.iosManualExecution),
    robotAndroid: parseFloat(item.androidRobotExecution) || 0,
    robotIos: parseFloat(item.iosRobotExecution) || 0,
  }));

  const constructionStages = [
    {
      stage: "Estrategia",
      android:
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidStrategy, 10),
          0
        ) /
          (data.length * 100)) *
        100,
      ios:
        (data.reduce((sum, item) => sum + parseInt(item.iosStrategy, 10), 0) /
          (data.length * 100)) *
        100,
    },
    {
      stage: "Mapeo",
      android:
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidMapping, 10),
          0
        ) /
          (data.length * 100)) *
        100,
      ios:
        (data.reduce((sum, item) => sum + parseInt(item.iosMapping, 10), 0) /
          (data.length * 100)) *
        100,
    },
    {
      stage: "Construcción",
      android:
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidConstruction, 10),
          0
        ) /
          (data.length * 100)) *
        100,
      ios:
        (data.reduce(
          (sum, item) => sum + parseInt(item.iosConstruction, 10),
          0
        ) /
          (data.length * 100)) *
        100,
    },
    {
      stage: "Estabilización",
      android:
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidStabilization, 10),
          0
        ) /
          (data.length * 100)) *
        100,
      ios:
        (data.reduce(
          (sum, item) => sum + parseInt(item.iosStabilization, 10),
          0
        ) /
          (data.length * 100)) *
        100,
    },
  ];

  const sumarTiempos = (
    tiempos: number[]
  ): { horas: number; minutos: number } => {
    const totalMinutos = tiempos.reduce((total, tiempo) => total + tiempo, 0);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = Math.round(totalMinutos % 60);
    return { horas, minutos };
  };

  const calcularAhorroTiempo = (
    manualTiempo: number,
    robotTiempo: number
  ): { ahorro: number; porcentaje: number } => {
    const ahorro = Math.max(manualTiempo - robotTiempo, 0);
    const porcentaje = manualTiempo > 0 ? (ahorro / manualTiempo) * 100 : 0;
    return { ahorro, porcentaje: Math.round(porcentaje) };
  };

  const formatearTiempo = (tiempo: {
    horas: number;
    minutos: number;
  }): string => {
    return `${tiempo.horas}h ${tiempo.minutos}m`;
  };

  useEffect(() => {
    const androidManual = projectData.map(
      (item) => (item.status == "Finalizado" && item.manualAndroid) || 0
    );
    const iosManual = projectData.map(
      (item) => (item.status == "Finalizado" && item.manualIos) || 0
    );
    const androidRobot = projectData.map(
      (item) => (item.status == "Finalizado" && item.robotAndroid) || 0
    );
    const iosRobot = projectData.map(
      (item) => (item.status == "Finalizado" && item.robotIos) || 0
    );

    const androidManualTotal = sumarTiempos(androidManual);
    const iosManualTotal = sumarTiempos(iosManual);
    const androidRobotTotal = sumarTiempos(androidRobot);
    const iosRobotTotal = sumarTiempos(iosRobot);

    const androidAhorro = calcularAhorroTiempo(
      androidManualTotal.horas * 60 + androidManualTotal.minutos,
      androidRobotTotal.horas * 60 + androidRobotTotal.minutos
    );
    const iosAhorro = calcularAhorroTiempo(
      iosManualTotal.horas * 60 + iosManualTotal.minutos,
      iosRobotTotal.horas * 60 + iosRobotTotal.minutos
    );

    const totalManualMinutos =
      androidManualTotal.horas * 60 +
      androidManualTotal.minutos +
      iosManualTotal.horas * 60 +
      iosManualTotal.minutos;
    const totalRobotMinutos =
      androidRobotTotal.horas * 60 +
      androidRobotTotal.minutos +
      iosRobotTotal.horas * 60 +
      iosRobotTotal.minutos;

    const totalAhorro = calcularAhorroTiempo(
      totalManualMinutos,
      totalRobotMinutos
    );

    setTotal(totalAhorro)
    setDataIos({
      manual: formatearTiempo(androidManualTotal),
      robot: formatearTiempo(iosRobotTotal),
      ahorro: `${formatearTiempo({
        horas: Math.floor(androidAhorro.ahorro / 60),
        minutos: androidAhorro.ahorro % 60,
      })} (${androidAhorro.porcentaje}%)`,
    });

    setDataAndroid({
      manual: formatearTiempo(iosManualTotal),
      robot: formatearTiempo(androidRobotTotal),
      ahorro: `${formatearTiempo({
        horas: Math.floor(iosAhorro.ahorro / 60),
        minutos: iosAhorro.ahorro % 60,
      })} (${iosAhorro.porcentaje}%)`,
    });
  }, [projectData]);

  const totalCases = projectData.length;

  const totalManualAndroid =
    projectData.reduce((sum, item) => sum + item.manualAndroid, 0) / 60;
  const totalManualIos =
    projectData.reduce((sum, item) => sum + item.manualIos, 0) / 60;

  const totalRobotAndroid =
    projectData.reduce((sum, item) => sum + item.robotAndroid, 0) / 60;
  const totalRobotIos =
    projectData.reduce((sum, item) => sum + item.robotIos, 0) / 60;

  const progressDataAndroid = [
    {
      name: "Avance",
      value:
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidProgress, 10),
          0
        ) /
          (data.length * 100)) *
        100,
    },
    {
      name: "Restante",
      value:
        100 -
        (data.reduce(
          (sum, item) => sum + parseInt(item.androidProgress, 10),
          0
        ) /
          (data.length * 100)) *
          100,
    },
  ];

  const progressDataIos = [
    {
      name: "Avance",
      value:
        (data.reduce((sum, item) => sum + parseInt(item.iosProgress, 10), 0) /
          (data.length * 100)) *
        100,
    },
    {
      name: "Restante",
      value:
        100 -
        (data.reduce((sum, item) => sum + parseInt(item.iosProgress, 10), 0) /
          (data.length * 100)) *
          100,
    },
  ];

  const executionTimeData = [
    { name: "Manual Android", value: totalManualAndroid.toFixed(2) },
    { name: "Manual iOS", value: totalManualIos.toFixed(2) },
    { name: "Robot Android", value: totalRobotAndroid.toFixed(2) },
    { name: "Robot iOS", value: totalRobotIos.toFixed(2) },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const constructionProgressByFeature = useMemo(() => {
    const featureMap = new Map<string, number[]>();

    data.forEach((item) => {
      const progress = parseFloat(item.totalProgress);
      if (!isNaN(progress)) {
        if (!featureMap.has(item.feature)) {
          featureMap.set(item.feature, []);
        }
        featureMap.get(item.feature)!.push(progress);
      }
    });

    const result: FeatureProgress[] = Array.from(featureMap).map(
      ([feature, progresses]) => ({
        feature,
        progress: (
          progresses.reduce((sum, val) => sum + val, 0) / progresses.length
        ).toFixed(2),
      })
    );

    return result.sort((a, b) => b.progress - a.progress);
  }, [data]);

  const fecha = new Date();

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-green-500 text-transparent bg-clip-text">
        Informe de Seguimiento de Proyecto de Pruebas
      </h1>

      {/* Información General del Proyecto */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Información General Proyecto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium">Fecha Informe Cierre:</p>
            <p>{fecha.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium">Nombre Proyecto:</p>
            <p>{plan?.projectInfo.projectName}</p>
          </div>
          <div className="">
            <p className="font-medium">Equipo de trabajo:</p>
            <ul className="list-disc list-inside">
              <li>Chapter de QA: Luis Miguel Peralta Quispe</li>
              <li>Jefe de Aplicaciones: Joan Padilla Barrantes</li>
              <li>Tester Automations: Daniel Amaya Marín</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Información Detallada del Proyecto */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Información Detallada Proyecto
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
          <div className="bg-purple-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Total Casos</p>
            <p className="text-2xl font-bold">{totalCases}</p>
          </div>
          <div className="bg-indigo-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Total Manual Android (horas)</p>
            <p className="text-2xl font-bold">{dataAndroid.manual}</p>
          </div>
          <div className="bg-blue-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Total Manual iOS (horas)</p>
            <p className="text-2xl font-bold">{dataIos.manual}</p>
          </div>
          <div className="bg-green-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Total Robot Android (horas)</p>
            <p className="text-2xl font-bold">{dataAndroid.robot}</p>
          </div>
          <div className="bg-yellow-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Total Robot iOS (horas)</p>
            <p className="text-2xl font-bold">{dataIos.robot}</p>
          </div>
          <div className="bg-red-200 p-4 rounded-lg text-center flex flex-col justify-between">
            <p className="text-sm">Ahorro de Tiempo</p>
            <p className="text-2xl font-bold">{total.porcentaje}%</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Progreso Android</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={progressDataAndroid}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {progressDataAndroid.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Progreso iOS</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={progressDataIos}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {progressDataIos.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">
            Tiempo de Ejecución: Manual vs Robot
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={executionTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                <LabelList
                  dataKey="value"
                  position="insideBottom"
                  offset={25}
                  fill="#fff"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfica: Avance en cada etapa de construcción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Avance en Etapas de Construcción Android
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={constructionStages}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stage" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Android"
                dataKey="android"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />

              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Avance en Etapas de Construcción iOS
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart outerRadius={90} data={constructionStages}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stage" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="iOS"
                dataKey="ios"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />

              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nueva gráfica: Avance de construcción total por feature */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Avance de Construcción por Feature
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={constructionProgressByFeature}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="feature"
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
            <Tooltip />
            <Legend verticalAlign="top" height={86} />
            <Bar dataKey="progress" fill="#8884d8" name="Progreso (%)">
              <LabelList
                dataKey="progress"
                position="insideBottom"
                offset={25}
                fill="#fff"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Nueva gráfica: Ejecuciones por versión */}
      {/* <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Ejecuciones por Versión</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={executionsByVersion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="version" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Número de Ejecuciones" />
          </BarChart>
        </ResponsiveContainer>
      </div>
*/}
      {/* Gráfico de Tiempo de Ejecución */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Tiempo de Ejecución Android: Manual vs Robot
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={false} height={1} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="manualAndroid"
              stroke="#8884d8"
              name="Manual Android"
            />

            <Line
              type="monotone"
              dataKey="robotAndroid"
              stroke="#ffc658"
              name="Robot Android"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Tiempo de Ejecución */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Tiempo de Ejecución iOS: Manual vs Robot
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={false} height={1} />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="manualIos"
              stroke="#82ca9d"
              name="Manual iOS"
            />

            <Line
              type="monotone"
              dataKey="robotIos"
              stroke="#ff7300"
              name="Robot iOS"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
