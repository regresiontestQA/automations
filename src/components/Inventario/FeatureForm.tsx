// src/components/Inventario/FeatureForm.tsx
import React from "react";
import { Feature } from "../../types/types";
import { Input } from "./../ui/Input";
import { Select } from "./../ui/Select";
import TagInput from "./TagInput";
import ProgressBar from "./ProgressBar";

const statusOptions = [
  "En Construcción",
  "Finalizado",
  "Sin Iniciar",
  "Bloqueado",
  "Desestimado",
  "No Ejecutar"
];

const progressOptions = [
  "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100",
];

interface FeatureFormProps {
  newFeature: Feature;
  editingId: number | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
}

export default function FeatureForm({
  newFeature,
  editingId,
  handleInputChange,
  handleSubmit,
  handleAddTag,
  handleRemoveTag,
  newTag,
  setNewTag
}: FeatureFormProps) {
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {editingId !== null ? "Editar feature" : "Añadir nueva feature"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Input
          label="Feature"
          name="feature"
          value={newFeature.feature}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Escenario"
          name="scenario"
          value={newFeature.scenario}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Nombre del caso"
          name="caseName"
          value={newFeature.caseName}
          onChange={handleInputChange}
          required
        />
        <Select
          label="Estado"
          name="status"
          value={newFeature.status}
          onChange={handleInputChange}
          options={statusOptions}
        />
        <Input
          label="Descripción"
          name="description"
          value={newFeature.description}
          onChange={handleInputChange}
        />
        <Input
          label="Gherkin"
          name="gherkin"
          value={newFeature.gherkin}
          onChange={handleInputChange}
        />
        <Input
          label="Tag Module"
          name="tagModule"
          value={newFeature.tagModule}
          onChange={handleInputChange}
        />
      </div>

      <TagInput
        tags={newFeature.tags}
        newTag={newTag}
        setNewTag={setNewTag}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Progreso Android</h3>
          {['Strategy', 'Mapping', 'Construction', 'Stabilization'].map((item) => (
            <Select
              key={item}
              label={item}
              name={`android${item}`}
              value={newFeature[`android${item}` as keyof Feature]}
              onChange={handleInputChange}
              options={progressOptions}
            />
          ))}
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Progreso iOS</h3>
          {['Strategy', 'Mapping', 'Construction', 'Stabilization'].map((item) => (
            <Select
              key={item}
              label={item}
              name={`ios${item}`}
              value={newFeature[`ios${item}` as keyof Feature]}
              onChange={handleInputChange}
              options={progressOptions}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Input
          label="Ejecución manual Android"
          name="androidManualExecution"
          value={newFeature.androidManualExecution}
          onChange={handleInputChange}
        />
        <Input
          label="Ejecución manual iOS"
          name="iosManualExecution"
          value={newFeature.iosManualExecution}
          onChange={handleInputChange}
        />
        <Input
          label="Ejecución robot Android"
          name="androidRobotExecution"
          value={newFeature.androidRobotExecution}
          onChange={handleInputChange}
        />
        <Input
          label="Ejecución robots iOS"
          name="iosRobotExecution"
          value={newFeature.iosRobotExecution}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4">
        <ProgressBar value={newFeature.androidProgress} color="blue" label="Progreso Android" />
        <ProgressBar value={newFeature.iosProgress} color="green" label="Progreso iOS" />
        <ProgressBar value={newFeature.totalProgress} color="red" label="Progreso total" />
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {editingId !== null ? "Actualizar Feature" : "Agregar Feature"}
      </button>
    </form>
  );
}