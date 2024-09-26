// src/components/TestExecutions/index.tsx
'use client'

import { useTestExecutions } from "../hooks/useTestExecutions"
import NewExecution from "../components/TestExecutions/NewExecution"
import CurrentExecution from "../components/TestExecutions/CurrentExecution"
import PreviousExecutions from "../components/TestExecutions/PreviousExecutions"
import EditExecutionModal from "../components/TestExecutions/EditExecutionModal"

export default function TestExecutions() {
  const {
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
  } = useTestExecutions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Performance Digital</h1>
          
          <NewExecution onAddExecution={handleAddExecution} />

          {currentExecution && (
            <CurrentExecution
              currentExecution={currentExecution}
              onScenarioChange={handleScenarioChange}
              onFinishExecution={handleFinishExecution}
              onSaveInProgress={handleSaveInProgress}
            />
          )}

          <PreviousExecutions
            executions={executions}
            onOpenModal={handleOpenModal}
            onContinueExecution={handleContinueExecution}
            onDeleteExecution={handleDeleteExecution}
          />
        </div>
      </div>

      {isModalOpen && editingExecution && (
        <EditExecutionModal
          execution={editingExecution}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
        />
      )}
    </div>
  )
}