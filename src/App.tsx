import Inicio from "./pages/Inicio";
import ROITimeChart from "./pages/ROITimeChart";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AutomationPlanList from "./pages/AutomationPlanList";
import AutomationPlan from "./pages/AutomationPlan";
import NavigationMenu from "./components/NavigationMenu";
import TestExecutions from "./pages/TestExecutions";
import DashboardProductividad from "./pages/DashboardProductividad";
import Inventario from "./pages/Inventario";
import ExecutionDashboard from "./pages/ExecutionDashboard";
import AutomationPlanForm from "./pages/AutomationPlanForm";





function App() {

  return (
    <Router>
    <div className="bg-gray-100 min-h-screen flex flex-col">
    <NavigationMenu />
      <main className="container mx-auto px-6 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/informe-ejecucion" element={<ExecutionDashboard/>} />
          <Route path="/ejecucion" element={<TestExecutions />} />
          <Route path="/roi" element={<ROITimeChart />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/informe-tecnico" element={<DashboardProductividad />} />
          <Route path="/automations-plan" element={<AutomationPlanForm />} />
          <Route path="/automations-plan/list" element={<AutomationPlanList />} />
          <Route path="/automations-plan/list/:client" element={<AutomationPlan />} />
        </Routes>
      </main>
    </div>
  </Router>
  )
}

export default App
