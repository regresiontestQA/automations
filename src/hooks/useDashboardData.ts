import { useState, useEffect, useMemo } from "react";
import { Feature } from "../types/types";
import { AutomationPlan } from "../pages/AutomationPlan";


interface ProjectData {
  feature: string;
  scenario: string;
  name: string;
  status: string;
  tags: string[];
  androidProgress: number;
  iosProgress: number;
  manualAndroid: number;
  manualIos: number;
  robotAndroid: number;
  robotIos: number;
}

interface ConstructionStage {
  stage: string;
  android: number;
  ios: number;
  [key: string]: number | string;
}

interface FeatureProgress {
  name: string;
  progress: string;
}

export const useDashboardData = () => {
  const [data, setData] = useState<Feature[]>([]);
  const [plan, setPlan] = useState<AutomationPlan | null>(null);
  const [dataIos, setDataIos] = useState({ manual: "", robot: "", ahorro: "" });
  const [dataAndroid, setDataAndroid] = useState({
    manual: "",
    robot: "",
    ahorro: "",
  });
  const [total, setTotal] = useState({ahorro:"", porcentaje:""});

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

  const projectData: ProjectData[] = useMemo(() => data.map((item) => ({
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
  })), [data]);

  const constructionStages: ConstructionStage[] = useMemo(() => [
    {
      stage: "Estrategia",
      android: (data.reduce((sum, item) => sum + parseInt(item.androidStrategy, 10), 0) / (data.length * 100)) * 100,
      ios: (data.reduce((sum, item) => sum + parseInt(item.iosStrategy, 10), 0) / (data.length * 100)) * 100,
    },
    {
      stage: "Mapeo",
      android: (data.reduce((sum, item) => sum + parseInt(item.androidMapping, 10), 0) / (data.length * 100)) * 100,
      ios: (data.reduce((sum, item) => sum + parseInt(item.iosMapping, 10), 0) / (data.length * 100)) * 100,
    },
    {
      stage: "Construcción",
      android: (data.reduce((sum, item) => sum + parseInt(item.androidConstruction, 10), 0) / (data.length * 100)) * 100,
      ios: (data.reduce((sum, item) => sum + parseInt(item.iosConstruction, 10), 0) / (data.length * 100)) * 100,
    },
    {
      stage: "Estabilización",
      android: (data.reduce((sum, item) => sum + parseInt(item.androidStabilization, 10), 0) / (data.length * 100)) * 100,
      ios: (data.reduce((sum, item) => sum + parseInt(item.iosStabilization, 10), 0) / (data.length * 100)) * 100,
    },
  ], [data]);

  console.log(constructionStages)

  const progressDataAndroid = useMemo(() => [
    {
      name: "Avance",
      value: (data.reduce((sum, item) => sum + parseInt(item.androidProgress, 10), 0) / (data.length * 100)) * 100,
    },
    {
      name: "Restante",
      value: 100 - (data.reduce((sum, item) => sum + parseInt(item.androidProgress, 10), 0) / (data.length * 100)) * 100,
    },
  ], [data]);

  const progressDataIos = useMemo(() => [
    {
      name: "Avance",
      value: (data.reduce((sum, item) => sum + parseInt(item.iosProgress, 10), 0) / (data.length * 100)) * 100,
    },
    {
      name: "Restante",
      value: 100 - (data.reduce((sum, item) => sum + parseInt(item.iosProgress, 10), 0) / (data.length * 100)) * 100,
    },
  ], [data]);

  const executionTimeData = useMemo(() => [
    { name: "Manual Android", value: (projectData.reduce((sum, item) => item.status === "Finalizado" ?  sum + item.manualAndroid : sum, 0) / 60).toFixed(2)},
    { name: "Manual iOS", value: (projectData.reduce((sum, item) => item.status === "Finalizado" ?  sum + item.manualIos : sum, 0) / 60).toFixed(2) },
    { name: "Robot Android", value: (projectData.reduce((sum, item) => item.status === "Finalizado" ?  sum + item.robotAndroid : sum, 0) / 60).toFixed(2) },
    { name: "Robot iOS", value: (projectData.reduce((sum, item) => item.status === "Finalizado" ? sum + item.robotIos : sum, 0) / 60).toFixed(2) },
  ], [projectData]);

  const constructionProgressByFeature: FeatureProgress[] = useMemo(() => {
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

    const result = Array.from(featureMap).map(([feature, progresses]) => ({
      name: feature,
      progress: (progresses.reduce((sum, val) => sum + val, 0) / progresses.length).toFixed(2),
    }));

    return result.sort((a, b) => parseFloat(b.progress) - parseFloat(a.progress));
  }, [data]);

  useEffect(() => {
    const calculateTimeData = () => {
      const androidManual = projectData.map((item) => (item.status === "Finalizado" ? item.manualAndroid : 0));
      const iosManual = projectData.map((item) => (item.status === "Finalizado" ? item.manualIos : 0));
      const androidRobot = projectData.map((item) => (item.status === "Finalizado" ? item.robotAndroid : 0));
      const iosRobot = projectData.map((item) => (item.status === "Finalizado" ? item.robotIos : 0));

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

      const totalAhorro = calcularAhorroTiempo(totalManualMinutos, totalRobotMinutos);

      setTotal(totalAhorro);
      setDataIos({
        manual: formatearTiempo(iosManualTotal),
        robot: formatearTiempo(iosRobotTotal),
        ahorro: `${formatearTiempo({
          horas: Math.floor(parseInt(iosAhorro.ahorro) / 60),
          minutos: parseInt(iosAhorro.ahorro) % 60,
        })} (${iosAhorro.porcentaje}%)`,
      });

      setDataAndroid({
        manual: formatearTiempo(androidManualTotal),
        robot: formatearTiempo(androidRobotTotal),
        ahorro: `${formatearTiempo({
          horas: Math.floor(parseInt(androidAhorro.ahorro) / 60),
          minutos: parseInt(androidAhorro.ahorro) % 60,
        })} (${androidAhorro.porcentaje}%)`,
      });
    };

    calculateTimeData();
  }, [projectData]);

  return {
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
  };
};

const sumarTiempos = (tiempos: number[]): { horas: number; minutos: number } => {
  const totalMinutos = tiempos.reduce((total, tiempo) => total + tiempo, 0);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = Math.round(totalMinutos % 60);
  return { horas, minutos };
};

const calcularAhorroTiempo = (
  manualTiempo: number,
  robotTiempo: number
): { ahorro: string; porcentaje: string } => {
  const ahorro = Math.max(manualTiempo - robotTiempo, 0);
  const porcentaje = manualTiempo > 0 ? (ahorro / manualTiempo) * 100 : 0;
  return { 
    ahorro: ahorro.toString(), 
    porcentaje: Math.round(porcentaje).toString() 
  };
};

const formatearTiempo = (tiempo: { horas: number; minutos: number }): string => {
  return `${tiempo.horas}h ${tiempo.minutos}m`;
};