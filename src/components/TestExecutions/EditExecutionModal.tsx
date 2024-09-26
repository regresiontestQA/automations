// src/components/TestExecutions/EditExecutionModal.tsx
import { useState } from 'react'
import { Input } from '../ui/InputDos'
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

interface EditExecutionModalProps {
  execution: Execution
  onClose: () => void
  onSave: (updatedExecution: Execution) => void
}

export default function EditExecutionModal({ execution, onClose, onSave }: EditExecutionModalProps) {
  const [editingExecution, setEditingExecution] = useState(execution)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditingExecution(prev => ({
      ...prev,
      [name]: name === 'releases' ? value.split(', ') : value
    }))
  }

  const handleSave = () => {
    onSave(editingExecution)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Editar Ejecución</h2>
        <div className="space-y-4">
          <Input
            label="Versión"
            name="version"
            value={editingExecution.version}
            onChange={handleChange}
          />
          <Input
            label="Releases"
            name="releases"
            value={editingExecution.releases.join(', ')}
            onChange={handleChange}
          />
          <Input
            label="Fecha de inicio"
            name="startDate"
            type="datetime-local"
            value={new Date(editingExecution.startDate).toISOString().slice(0, 16)}
            onChange={handleChange}
          />
          <Input
            label="Fecha de fin"
            name="endDate"
            type="datetime-local"
            value={editingExecution.endDate ? new Date(editingExecution.endDate).toISOString().slice(0, 16) : ''}
            onChange={handleChange}
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onClose} variant="secondary">Cancelar</Button>
          <Button onClick={handleSave} variant="default">Guardar</Button>
        </div>
      </div>
    </div>
  )
}