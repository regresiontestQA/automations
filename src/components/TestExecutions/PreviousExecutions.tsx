// src/components/TestExecutions/PreviousExecutions.tsx
import { ChevronDownIcon, PlayIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/Button'

export interface Scenario {
    id: number
    feature: string
    caseName: string
    status: string
    errorType: string
    comment: string
    executionCount: number
  }

export interface Execution {
    version: string
    releases: string[]
    platform: 'Android' | 'iOS'
    scenarios: Scenario[]
    startDate: string
    endDate: string | null
    executionCount: number
  }

interface PreviousExecutionsProps {
  executions: Execution[]
  onOpenModal: (execution: Execution) => void
  onContinueExecution: (execution: Execution) => void
  onDeleteExecution: (execution: Execution) => void
}

export default function PreviousExecutions({
  executions,
  onOpenModal,
  onContinueExecution,
  onDeleteExecution
}: PreviousExecutionsProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ejecuciones Anteriores</h2>
      {executions.map((execution, index) => (
        <div key={index} className="mb-4 p-4 border rounded bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-blue-600">Versión: {execution.version}</h3>
            <span className="text-sm text-gray-500">Plataforma: {execution.platform}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Releases: {execution.releases && execution.releases.length > 0 ? execution.releases.join(', ') : 'N/A'} | 
            Total ejecuciones: {execution.executionCount}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Inicio: {new Date(execution.startDate).toLocaleString()}
            {execution.endDate && ` | Fin: ${new Date(execution.endDate).toLocaleString()}`}
          </p>
          <div className="flex space-x-2 mb-2">
            <Button onClick={() => onOpenModal(execution)} variant="default" size="sm">
              Editar
            </Button>
            {!execution.endDate && (
              <Button onClick={() => onContinueExecution(execution)} variant="success" size="sm">
                <PlayIcon className="mr-1 h-4 w-4" />
                Continuar
              </Button>
            )}
            <Button onClick={() => onDeleteExecution(execution)} variant="danger" size="sm">
              <TrashIcon className="mr-1 h-4 w-4" />
            </Button>
          </div>
          <details>
            <summary className="cursor-pointer text-blue-500 hover:text-blue-600 flex items-center">
              Ver detalles
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </summary>
            <ul className="mt-2 space-y-1">
              {execution.scenarios.map((scenario, scenarioIndex) => (
                <li key={scenarioIndex} className="text-sm">
                  {scenario.caseName} - {scenario.status} 
                  {scenario.errorType !== 'Ninguno' && ` (${scenario.errorType})`}
                  {scenario.comment && `: ${scenario.comment}`}
                  <span className="ml-2 text-gray-500">Ejecuciones: {scenario.executionCount}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  )
}