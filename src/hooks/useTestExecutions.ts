// src/hooks/useTestExecutions.ts
import { useState, useEffect } from 'react'
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

export function useTestExecutions() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [executions, setExecutions] = useState<Execution[]>([])
  const [currentExecution, setCurrentExecution] = useState<Execution | null>(null)
  const [editingExecution, setEditingExecution] = useState<Execution | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const storedScenarios = JSON.parse(localStorage.getItem('features') || '[]')
    setScenarios(storedScenarios.filter((scenario: Scenario) => 
      scenario.status === 'Finalizado' || scenario.status === 'Ejecutar'
    ).map((scenario: Scenario) => ({
      ...scenario,
      executionCount: 0
    })))
    const storedExecutions = JSON.parse(localStorage.getItem('executions') || '[]')
    setExecutions(storedExecutions)
  }, [])

  const handleAddExecution = (version: string, release: string, platform: 'Android' | 'iOS') => {
    if (!version || !release) {
      alert('Por favor, ingrese una versión y un release')
      return
    }

    const finishedScenarios = scenarios.filter(scenario => scenario.status === 'Finalizado')

    if (finishedScenarios.length === 0) {
      alert('No hay escenarios finalizados para agregar a la ejecución')
      return
    }

    const existingExecutionIndex = executions.findIndex(exec => exec.version === version)

    if (existingExecutionIndex !== -1) {
      const updatedExecutions = [...executions]
      const existingExecution = updatedExecutions[existingExecutionIndex]

      existingExecution.releases = [...existingExecution.releases, release]
      existingExecution.executionCount += 1
      existingExecution.scenarios = existingExecution.scenarios.map(scenario => ({
        ...scenario,
        executionCount: scenario.executionCount + 1
      }))
      existingExecution.startDate = new Date().toISOString()
      existingExecution.endDate = null

      setExecutions(updatedExecutions)
      setCurrentExecution(existingExecution)
    } else {
      const newExecution: Execution = {
        version,
        releases: [release],
        platform,
        scenarios: scenarios.map(scenario => ({
          ...scenario,
          status: 'Pendiente',
          errorType: 'Ninguno',
          comment: '',
          executionCount: 1
        })),
        startDate: new Date().toISOString(),
        endDate: null,
        executionCount: 1
      }
      setExecutions([...executions, newExecution])
      setCurrentExecution(newExecution)
    }
  }

  const handleScenarioChange = (id: number, field: keyof Scenario, value: string | number) => {
    if (currentExecution) {
      const updatedScenarios = currentExecution.scenarios.map(scenario =>
        scenario.id === id ? { ...scenario, [field]: value } : scenario
      )
      setCurrentExecution({ ...currentExecution, scenarios: updatedScenarios })
    }
  }

  const handleDeleteExecution = (executionToDelete: Execution) => {
    const updatedExecutions = executions.filter(exec => exec.version !== executionToDelete.version)
    setExecutions(updatedExecutions)
    localStorage.setItem('executions', JSON.stringify(updatedExecutions))
  }

  const handleFinishExecution = () => {
    if (currentExecution) {
      const updatedExecution = {
        ...currentExecution,
        endDate: new Date().toISOString()
      }
      const updatedExecutions = executions.map(exec => 
        exec.version === updatedExecution.version ? updatedExecution : exec
      )
      setExecutions(updatedExecutions)
      localStorage.setItem('executions', JSON.stringify(updatedExecutions))
      setScenarios(updatedExecution.scenarios)
      setCurrentExecution(null)
    }
  }

  const handleSaveInProgress = () => {
    if (currentExecution) {
      const updatedExecution = {
        ...currentExecution,
        status: 'En Proceso'
      }
      const updatedExecutions = executions.map(exec => 
        exec.version === updatedExecution.version ? updatedExecution : exec
      )
      setExecutions(updatedExecutions)
      localStorage.setItem('executions', JSON.stringify(updatedExecutions))
      setCurrentExecution(null)
    }
  }

  const handleContinueExecution = (execution: Execution) => {
    setCurrentExecution(execution)
  }

  const handleOpenModal = (execution: Execution) => {
    setEditingExecution(execution)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingExecution(null)
  }

  const handleSaveModal = (updatedExecution: Execution) => {
    const updatedExecutions = executions.map(exec => 
      exec.version === updatedExecution.version ? updatedExecution : exec
    )
    setExecutions(updatedExecutions)
    localStorage.setItem('executions', JSON.stringify(updatedExecutions))
    handleCloseModal()
  }

  return {
    scenarios,
    executions,
    currentExecution,
    editingExecution,
    isModalOpen,
    handleAddExecution,
    handleScenarioChange,
    handleDeleteExecution,
    handleFinishExecution,
    handleSaveInProgress,
    handleContinueExecution,
    handleOpenModal,
    handleCloseModal,
    handleSaveModal,
  }
}