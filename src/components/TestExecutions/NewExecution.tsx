// src/components/TestExecutions/NewExecution.tsx
import { useState } from 'react'
import { Input } from '../ui/InputDos'
import { Select } from '../ui/SelectDos'
import { Button } from '../ui/Button'

interface NewExecutionProps {
  onAddExecution: (version: string, release: string, platform: 'Android' | 'iOS') => void
}

export default function NewExecution({ onAddExecution }: NewExecutionProps) {
  const [version, setVersion] = useState('')
  const [release, setRelease] = useState('')
  const [platform, setPlatform] = useState<'Android' | 'iOS'>('Android')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddExecution(version, release, platform)
    setVersion('')
    setRelease('')
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Nueva Ejecución</h2>
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <Input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="Versión"
          required
        />
        <Input
          type="text"
          value={release}
          onChange={(e) => setRelease(e.target.value)}
          placeholder="Release"
          required
        />
        <Select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as 'Android' | 'iOS')}
          options={[
            { value: 'Android', label: 'Android' },
            { value: 'iOS', label: 'iOS' },
          ]}
        />
        <Button variant={'default'} size={'lg'} type="submit">Agregar Ejecución</Button>
      </form>
    </div>
  )
}