import { useState, useEffect } from "react"
import { PlusCircleIcon, MinusCircleIcon } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { Input } from "../components/ui/InputDos"
import { Button } from "../components/ui/Button"

interface FormData {
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

const projectInfoLabels: Record<keyof FormData["projectInfo"], string> = {
  client: "Cliente",
  projectName: "Nombre del proyecto",
  projectDescription: "Descripción del proyecto",
  clientRequest: "Requerimiento del cliente",
  clientProjectManager: "Jefe de proyecto del cliente",
  testingProjectLeader: "Líder de pruebas",
};

const chronogramLabels: Record<keyof FormData['chronogram'], string> = {
  assignedDate: "Fecha de asignación",
  startDate: "Fecha de inicio",
  estimatedEndDate: "Fecha estimada de finalización",
  clientApprovalDate: "Fecha de aprobación del cliente",
};

const initialFormData: FormData = {
  projectInfo: {
    client: "",
    projectName: "",
    projectDescription: "",
    clientRequest: "",
    clientProjectManager: "",
    testingProjectLeader: "",
  },
  documentationReceived: [{ type: "", received: false, comments: "" }],
  risks: [{ description: "", severity: "", impact: "", contingency: "" }],
  testTypes: [
    { name: "Aplicación Nativa", selected: false },
    { name: "Aplicación Híbrida", selected: false },
    { name: "Aplicación Web", selected: false },
    { name: "Desarrollo Automatización", selected: false },
    { name: "Ejecución Automatización", selected: false },
  ],
  testScope: "",
  workloadObservations: [""],
  devices: [{ name: "", os: "", version: "" }],
  assumptions: [""],
  generalRequirements: "",
  stepsToAutomate: [""],
  testStrategy: "",
  chronogram: {
    assignedDate: "",
    startDate: "",
    estimatedEndDate: "",
    clientApprovalDate: "",
  },
};

export default function AutomationPlanForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [plans, setPlans] = useState<FormData[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedPlans = localStorage.getItem("automationPlans")
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    }

    const selectedPlan = localStorage.getItem("selectedPlan")
    if (selectedPlan) {
      setFormData(JSON.parse(selectedPlan))
      setIsEditing(true)
      localStorage.removeItem("selectedPlan")
    }
  }, [])

  const savePlan = () => {
    let newPlans: FormData[]
    if (plans.some(plan => plan.projectInfo.client === formData.projectInfo.client)) {
      newPlans = plans.map(plan => 
        plan.projectInfo.client === formData.projectInfo.client ? formData : plan
      )
    } else {
      newPlans = [...plans, formData]
    }
    setPlans(newPlans)
    localStorage.setItem("automationPlans", JSON.stringify(newPlans))
    setFormData(initialFormData)
    navigate('/automations-plan/list')
  }

  const handleCancel = () => {
    localStorage.removeItem('selectedPlan')
    setIsEditing(false)
    navigate('/automations-plan/list')
  }

  const handleArrayInputChange = (
    section: keyof FormData,
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const sectionData = prev[section];
      if (Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: sectionData.map((item, i) => {
            if (i === index) {
              if (typeof item === "string") {
                return value as string;
              } else if (typeof item === "object") {
                return { ...item, [field]: value };
              }
            }
            return item;
          }),
        };
      }
      return prev;
    });
  };

  const addArrayItem = (section: keyof FormData) => {
    setFormData((prev) => {
      const sectionData = prev[section];
      if (Array.isArray(sectionData)) {
        let newItem;
        switch (section) {
          case "documentationReceived":
            newItem = { type: "", received: false, comments: "" };
            break;
          case "risks":
            newItem = { description: "", severity: "", impact: "", contingency: "" };
            break;
          case "devices":
            newItem = { name: "", os: "", version: "" };
            break;
          default:
            newItem = "";
        }
        return {
          ...prev,
          [section]: [...sectionData, newItem],
        };
      }
      return prev;
    });
  };

  const removeArrayItem = (section: keyof FormData, index: number) => {
    setFormData((prev) => {
      const sectionData = prev[section];
      if (Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: sectionData.filter((_, i) => i !== index),
        };
      }
      return prev;
    });
  };

  const handleProjectInfoChange = (key: keyof FormData['projectInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      projectInfo: {
        ...prev.projectInfo,
        [key]: value
      }
    }))
  }

  const handleChronogramChange = (key: keyof FormData['chronogram'], value: string) => {
    setFormData(prev => ({
      ...prev,
      chronogram: {
        ...prev.chronogram,
        [key]: value
      }
    }))
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {formData.projectInfo.client ? 'Editar' : 'Crear'} Plan de Automatización
        </h1>
        <Link to="/automations-plan/list">
          <Button variant="outline">Listar</Button>
        </Link>
      </div>
      <form className="bg-white shadow-md rounded-lg p-8 mb-4">
        {/* Project Info */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Información del Proyecto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(formData.projectInfo) as Array<keyof FormData["projectInfo"]>).map((key) => (
              <Input
                key={key}
                label={projectInfoLabels[key]}
                value={formData.projectInfo[key]}
                onChange={(e) => handleProjectInfoChange(key, e.target.value)}
              />
            ))}
          </div>
        </section>

        {/* Documentation Received */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Documentación Recibida
          </h2>
          {formData.documentationReceived.map((doc, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Input
                className=" mr-2"
                value={doc.type}
                onChange={(e) => handleArrayInputChange("documentationReceived", index, "type", e.target.value)}
                placeholder="Tipo de Documento"
              />
              <label className="mr-2 flex ">
                <input
                  type="checkbox"
                  checked={doc.received}
                  onChange={(e) => handleArrayInputChange("documentationReceived", index, "received", e.target.checked)}
                  className="mr-1"
                />
                Recibido
              </label>
              <Input
                className=" mr-2"
                value={doc.comments}
                onChange={(e) => handleArrayInputChange("documentationReceived", index, "comments", e.target.value)}
                placeholder="Comentarios"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("documentationReceived", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("documentationReceived")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Documento
          </Button>
        </section>

        {/* Risks */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Análisis de Riesgos
          </h2>
          {formData.risks.map((risk, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Input
                className=" mr-2"
                value={risk.description}
                onChange={(e) => handleArrayInputChange("risks", index, "description", e.target.value)}
                placeholder="Descripción"
              />
              <Input
                className=" mr-2"
                value={risk.severity}
                onChange={(e) => handleArrayInputChange("risks", index, "severity", e.target.value)}
                placeholder="Severidad"
              />
              <Input
                className=" mr-2"
                value={risk.impact}
                onChange={(e) => handleArrayInputChange("risks", index, "impact", e.target.value)}
                placeholder="Impacto"
              />
              <Input
                className=" mr-2"
                value={risk.contingency}
                onChange={(e) => handleArrayInputChange("risks", index, "contingency", e.target.value)}
                placeholder="Contingencia"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("risks", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("risks")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Riesgo
          </Button>
        </section>

        {/* Test Types */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Tipos de pruebas a ejecutar
          </h2>
          <div className="flex flex-wrap">
            {formData.testTypes.map((type, index) => (
              <label key={type.name} className="inline-flex items-center mr-4 mb-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={type.selected}
                  onChange={(e) => handleArrayInputChange("testTypes", index, "selected", e.target.checked)}
                />
                <span className="ml-2 text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Test Scope */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Alcance de la prueba
          </h2>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={formData.testScope}
            onChange={(e) => setFormData((prev) => ({ ...prev, testScope: e.target.value }))}
          />
        </section>

        {/* Workload Observations */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Observaciones sobre el Workload
          </h2>
          {formData.workloadObservations.map((observation, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                className="w-full mr-2"
                value={observation}
                onChange={(e) => handleArrayInputChange("workloadObservations", index, "", e.target.value)}
                placeholder="Observación"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("workloadObservations", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("workloadObservations")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Observación
          </Button>
        </section>

        {/* Devices */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dispositivos
          </h2>
          {formData.devices.map((device, index) => (
            <div key={index} className="flex items-center gap-4 mb-2">
              <Input
                className=" mr-2"
                value={device.name}
                onChange={(e) => handleArrayInputChange("devices", index, "name", e.target.value)}
                placeholder="Dispositivo"
              />
              <Input
                className=" mr-2"
                value={device.os}
                onChange={(e) => handleArrayInputChange("devices", index, "os", e.target.value)}
                placeholder="Sistema Operativo"
              />
              <Input
                className=" mr-2"
                value={device.version}
                onChange={(e) => handleArrayInputChange("devices", index, "version", e.target.value)}
                placeholder="Versión"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("devices", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("devices")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Dispositivo
          </Button>
        </section>

        {/* Assumptions */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Supuestos
          </h2>
          {formData.assumptions.map((assumption, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                className="w-full mr-2"
                value={assumption}
                onChange={(e) => handleArrayInputChange("assumptions", index, "", e.target.value)}
                placeholder="Supuesto"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("assumptions", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("assumptions")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Supuesto
          </Button>
        </section>

        {/* General Requirements */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Requerimientos Generales
          </h2>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={formData.generalRequirements}
            onChange={(e) => setFormData((prev) => ({ ...prev, generalRequirements: e.target.value }))}
          />
        </section>

        {/* Steps to Automate */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Escenarios a automatizar o ejecutar
          </h2>
          {formData.stepsToAutomate.map((step, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                className="w-full mr-2"
                value={step}
                onChange={(e) => handleArrayInputChange("stepsToAutomate", index, "", e.target.value)}
                placeholder="Paso"
              />
              <Button
                type="button"
                onClick={() => removeArrayItem("stepsToAutomate", index)}
                variant="ghost"
                size="sm"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayItem("stepsToAutomate")}
            variant="outline"
            size="sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Agregar Paso
          </Button>
        </section>

        {/* Test Strategy */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Estrategia de prueba o ejecucion
          </h2>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={formData.testStrategy}
            onChange={(e) => setFormData((prev) => ({ ...prev, testStrategy: e.target.value }))}
          />
        </section>

        {/* Chronogram */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Cronograma
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(formData.chronogram) as Array<keyof FormData['chronogram']>).map((key) => (
              <Input
                key={key}
                type="date"
                label={chronogramLabels[key]}
                value={formData.chronogram[key]}
                onChange={(e) => handleChronogramChange(key, e.target.value)}
              />
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <Button onClick={savePlan}>
            {isEditing ? 'Actualizar' : 'Guardar'} Plan
          </Button>
          {isEditing && (
            <Button onClick={handleCancel} variant="destructive">
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}