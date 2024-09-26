import { useDashboardData } from "../hooks/useDashboardData";
import {
  PieChartComponent,
  BarChartComponent,
  RadarChartComponent,
  LineChartComponent,
} from "./../components/ChartComponents";

const DashboardProductividad = () => {
  const {
    projectData,
    plan,
    dataIos,
    dataAndroid,
    total,
    constructionStages,
    progressDataAndroid,
    progressDataIos,
    executionTimeData,
    constructionProgressByFeature,
  } = useDashboardData();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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
          <InfoCard
            title="Total Casos"
            value={projectData.length}
            bgColor="bg-purple-200"
          />
          <InfoCard
            title="Total Manual Android (horas)"
            value={dataAndroid.manual}
            bgColor="bg-indigo-200"
          />
          <InfoCard
            title="Total Manual iOS (horas)"
            value={dataIos.manual}
            bgColor="bg-blue-200"
          />
          <InfoCard
            title="Total Robot Android (horas)"
            value={dataAndroid.robot}
            bgColor="bg-green-200"
          />
          <InfoCard
            title="Total Robot iOS (horas)"
            value={dataIos.robot}
            bgColor="bg-yellow-200"
          />
          <InfoCard
            title="Ahorro de Tiempo"
            value={`${total.porcentaje}%`}
            bgColor="bg-red-200"
          />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ChartCard title="Progreso Android">
          <PieChartComponent data={progressDataAndroid} colors={COLORS} />
        </ChartCard>
        <ChartCard title="Progreso iOS">
          <PieChartComponent data={progressDataIos} colors={COLORS} />
        </ChartCard>
        <ChartCard title="Tiempo de Ejecución: Manual vs Robot">
          <BarChartComponent
            data={executionTimeData}
            dataKey="value"
            fill="#8884d8"
          />
        </ChartCard>
      </div>

      {/* Gráfica: Avance en cada etapa de construcción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  
        <ChartCard title="Avance en Etapas de Construcción Android">
          <RadarChartComponent
            data={constructionStages}
            dataKey="android"
            name="Android"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </ChartCard>
        <ChartCard title="Avance en Etapas de Construcción iOS">
          <RadarChartComponent
            data={constructionStages}
            dataKey="ios"
            name="iOS"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
        </ChartCard>
      </div>

      {/* Nueva gráfica: Avance de construcción total por feature */}
      <ChartCard title="Avance de Construcción por Feature">
        <BarChartComponent
          data={constructionProgressByFeature}
          dataKey="progress"
          fill="#8884d8"
        />
      </ChartCard>

      {/* Gráfico de Tiempo de Ejecución Android */}
      <ChartCard title="Tiempo de Ejecución Android: Manual vs Robot">
        <LineChartComponent
          data={projectData}
          lines={[
            {
              dataKey: "manualAndroid",
              stroke: "#8884d8",
              name: "Manual Android",
            },
            {
              dataKey: "robotAndroid",
              stroke: "#ffc658",
              name: "Robot Android",
            },
          ]}
        />
      </ChartCard>

      {/* Gráfico de Tiempo de Ejecución iOS */}
      <ChartCard title="Tiempo de Ejecución iOS: Manual vs Robot">
        <LineChartComponent
          data={projectData}
          lines={[
            { dataKey: "manualIos", stroke: "#82ca9d", name: "Manual iOS" },
            { dataKey: "robotIos", stroke: "#ff7300", name: "Robot iOS" },
          ]}
        />
      </ChartCard>
    </div>
  );
};

export default DashboardProductividad;

interface InfoCardProps {
  title: string;
  value: string | number;
  bgColor: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, bgColor }) => (
  <div
    className={`${bgColor} p-4 rounded-lg text-center flex flex-col justify-between`}
  >
    <p className="text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);
