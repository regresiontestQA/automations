// src/components/TestExecutions/CurrentExecution.tsx
import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '../ui/InputDos'
import { Select } from '../ui/SelectDos'
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

interface CurrentExecutionProps {
  currentExecution: Execution
  onScenarioChange: (id: number, field: keyof Scenario, value: string | number) => void
  onFinishExecution: () => void
  onSaveInProgress: () => void
}

export default function CurrentExecution({
  currentExecution,
  onScenarioChange,
  onFinishExecution,
  onSaveInProgress
}: CurrentExecutionProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredScenarios = currentExecution.scenarios.filter(scenario =>
    scenario.caseName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-800">
        Escenarios a ejecutar - Versión {currentExecution.version}
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Releases: {currentExecution.releases.join(', ')} | 
        Total ejecuciones: {currentExecution.executionCount} |
        Inicio: {new Date(currentExecution.startDate).toLocaleString()}
      </p>
      <div className="mb-4 flex items-center">
        <SearchIcon className="text-gray-400 mr-2" />
        <Input
          type="text"
          placeholder="Buscar escenarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-blue-800">Caso</th>
              <th className="px-4 py-2 text-left text-blue-800">Estado</th>
              <th className="px-4 py-2 text-left text-blue-800">Tipo de Error</th>
              <th className="px-4 py-2 text-left text-blue-800">Comentario</th>
              <th className="px-4 py-2 text-left text-blue-800">Ejecuciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredScenarios.map((scenario) => (
              <tr key={scenario.id} className="border-b">
                <td className="px-4 py-2">{scenario.caseName}</td>
                <td className="px-4 py-2">
                  <Select
                    value={scenario.status}
                    onChange={(e) => onScenarioChange(scenario.id, 'status', e.target.value)}
                    options={[
                      { value: 'Pendiente', label: 'Pendiente' },
                      { value: 'Exitosa', label: 'Exitosa' },
                      { value: 'Fallida', label: 'Fallida' },
                    ]}
                  />
                </td>
                <td className="px-4 py-2">
                  <Select
                    value={scenario.errorType}
                    onChange={(e) => onScenarioChange(scenario.id, 'errorType', e.target.value)}
                    options={[
                      { value: 'Ninguno', label: 'Ninguno' },
                      { value: 'Sin Iniciar', label: 'Sin Iniciar' },
                      { value: 'Funcional', label: 'Funcional' },
                      { value: 'Hallazgo', label: 'Hallazgo' },
                      { value: 'No Funcional', label: 'No Funcional' },
                      { value: 'Robot', label: 'Robot' },
                    ]}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="text"
                    value={scenario.comment}
                    onChange={(e) => onScenarioChange(scenario.id, 'comment', e.target.value)}
                    placeholder="Comentario"
                  />
                </td>
                <td className="px-4 py-2 text-center">{scenario.executionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex space-x-4">
        <Button onClick={onFinishExecution} variant="success">
          Finalizar Ejecución
        </Button>
        <Button onClick={onSaveInProgress} variant="warning">
          Guardar en Proceso
        </Button>
      </div>
    </div>
  )
}