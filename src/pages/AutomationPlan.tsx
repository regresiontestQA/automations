import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  FileText,
  Server,
  List,
  Target,
  Zap
} from "lucide-react";
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

export interface AutomationPlan {
    projectInfo: {
      client: string;
      projectName: string;
      projectDescription: string;
      clientRequest: string;
      clientProjectManager: string;
      testingProjectLeader: string;
    };
    documentationReceived: {
      type: string;
      received: boolean;
      comments: string;
    }[];
    risks: {
      description: string;
      severity: string;
      impact: string;
      contingency: string;
    }[];
    testTypes: { name: string; selected: boolean }[];
    testScope: string;
    workloadObservations: string[];
    devices: { name: string; os: string; version: string }[];
    assumptions: string[];
    generalRequirements: string;
    stepsToAutomate: string[];
    testStrategy: string;
    chronogram: {
      assignedDate: string;
      startDate: string;
      estimatedEndDate: string;
      clientApprovalDate: string;
    };
  }

export default function AutomationPlan() {
    const { client } = useParams();
  const [plan, setPlan] = useState<AutomationPlan | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plans = localStorage.getItem("automationPlans");
    if (plans) {
      const parsedPlans = JSON.parse(plans);
      const selectedPlan = parsedPlans.find(
        (plan: any) => plan.projectInfo.client === client
      );
      setPlan(selectedPlan || null);
    }
  }, [client]);

  const generateImage = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight
      });
      
      return canvas;
    }
    return null;
  };

  const downloadAsImage = async () => {
    const canvas = await generateImage();
    if (canvas) {
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = 'automation-plan.png';
      link.href = image;
      link.click();
    }
  };
  const downloadAsPDF = async () => {
    const canvas = await generateImage();
    if (canvas) {
      const imgWidth = 595.28; // A4 width in points
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'pt', [imgWidth, imgHeight]);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('automation-plan.pdf');
    }
  };

  if (!plan) {
    return <div>Plan not found</div>;
  }
  
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div ref={contentRef} className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">{plan.projectInfo.projectName}</h1>
          <p className="text-xl mt-2">{plan.projectInfo.client}</p>
        </div>

        <div className="p-8">
          {/* Project Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <Users className="mr-2" /> <span>Información del Proyecto</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Descripción del Proyecto</p>
                <p className="mt-1 text-lg">{plan.projectInfo.projectDescription}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Solicitud del Cliente</p>
                <p className="mt-1 text-lg">{plan.projectInfo.clientRequest}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Gestor de Proyectos para Clientes</p>
                <p className="mt-1 text-lg">{plan.projectInfo.clientProjectManager}</p>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Jefe de Proyecto de Pruebas</p>
                <p className="mt-1 text-lg">{plan.projectInfo.testingProjectLeader}</p>
              </div>
            </div>
          </section>

          {/* Documentation Received */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <FileText className="mr-2" /> Documentación Recibida
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plan.documentationReceived.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doc.received ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-4 w-4" /> Recibido
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="mr-1 h-4 w-4" /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{doc.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Test Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <List className="mr-2" /> Tipos de Pruebas
            </h2>
            <div className="flex flex-wrap gap-2">
              {plan.testTypes
                .filter((type) => type.selected)
                .map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
                  >
                    {type.name}
                  </span>
                ))}
            </div>
          </section>

          {/* Test Scope */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <Target className="mr-2" /> Alcance de las Pruebas
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{plan.testScope}</p>
            </div>
          </section>

          {/* Workload Observations */}
          {plan.workloadObservations[0] && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
                <Server className="mr-2" /> Observaciones sobre el Volumen de Trabajo
              </h2>
              <ul className="list-disc pl-5 space-y-2 bg-gray-50 p-4 rounded-lg">
                {plan.workloadObservations.map((observation, index) => (
                  <li key={index} className="text-gray-700">{observation}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Devices */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <Zap className="mr-2" /> Dispositivos
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sistema Operativo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plan.devices.map((device, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{device.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.os}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* General Requirements */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded tracking-wide">Requisitos Generales</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{plan.generalRequirements}</p>
            </div>
          </section>

          {/* Assumptions */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded tracking-wide">Supuestos</h2>
            <ul className="list-disc pl-5 space-y-2 bg-gray-50 p-4 rounded-lg">
              {plan.assumptions.map((assumption, index) => (
                <li key={index} className="text-gray-700">{assumption}</li>
              ))}
            </ul>
          </section>

          {/* Test Strategy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded tracking-wide">Estrategia de Prueba</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{plan.testStrategy}</p>
            </div>
          </section>

          {/* Scenarios to Automate */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded tracking-wide">Escenarios a Automatizar o Ejecutar</h2>
            <ul className="list-disc pl-5 space-y-2 bg-gray-50 p-4 rounded-lg">
              {plan.stepsToAutomate.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ul>
          </section>

          {/* Risk Analysis */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <AlertTriangle className="mr-2" /> Análisis de Riesgos
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impacto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contingencia</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plan.risks.map((risk, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{risk.description}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          risk.severity === "High" ? "bg-red-100 text-red-800" :
                          risk.severity === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {risk.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{risk.impact}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{risk.contingency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chronogram */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 bg-purple-200 p-2 rounded flex items-center tracking-wide">
              <Calendar className="mr-2" /> Cronograma
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Fecha Asignada</p>
                <p className="mt-1 text-lg">{plan.chronogram.assignedDate}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Fecha de Inicio</p>
                <p className="mt-1 text-lg">{plan.chronogram.startDate}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Fecha Estimada de Finalización</p>
                <p className="mt-1 text-lg">{plan.chronogram.estimatedEndDate}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Fecha de Aprobación del Cliente</p>
                <p className="mt-1 text-lg">{plan.chronogram.clientApprovalDate}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className='mt-6 flex gap-4'>
      <button
          onClick={downloadAsImage}
          className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Descargar como Imagen
        </button>
        <button
          onClick={downloadAsPDF}
          className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 shadow-lg"
        >
          Descargar como PDF
        </button>
      </div>
    </div>
  );
}