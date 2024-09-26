import { useState, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

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

export default function AutomationPlanList() {
  const [plans, setPlans] = useState<FormData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPlans = localStorage.getItem("automationPlans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleDelete = (index: number) => {
    const newPlans = plans.filter((_, i) => i !== index);
    setPlans(newPlans);
    localStorage.setItem("automationPlans", JSON.stringify(newPlans));
  };

  const onEdit = (plan: FormData) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/automations-plan");
  };

  const onView = (client: string) => {
    navigate(`/automations-plan/list/${client}`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Planes de Automatización
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Líder de Pruebas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.projectInfo.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.projectInfo.projectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.projectInfo.testingProjectLeader}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    type="button"
                    onClick={() => onEdit(plan)}
                    variant="ghost"
                    size="sm"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleDelete(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onView(plan.projectInfo.client)}
                    variant="ghost"
                    size="sm"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
