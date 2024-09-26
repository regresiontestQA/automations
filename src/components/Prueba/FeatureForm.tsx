import React from "react";
import { Feature } from "../../types/types";
import { Input } from "./../ui/Input";
import { Select } from "./../ui/Select";
import TagInput from "../Inventario/TagInput";
import ProgressBar from "../Inventario/ProgressBar";
import { MobileFeature } from "../../types/pruebaType";


const statusOptions = [
    "En Construcción",
    "Finalizado",
    "Sin Iniciar",
    "Bloqueado",
    "Desestimado",
    "No Ejecutar"
  ];
  
  const progressOptions = [
    "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
  ];
  
  const developmentTypes = ["mobile", "web", "api"];
  
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
    const renderProgressFields = () => {
      const fields = ['Strategy', 'Mapping', 'Construction', 'Stabilization'];
      if (newFeature.developmentType === 'api') {
        fields.splice(1, 1); // Remove 'Mapping' for API
      }
  
      if (newFeature.developmentType === 'mobile') {
        const mobileFeature = newFeature as MobileFeature;
        return (
          <>
            <div className="flex gap-4">
            <div className="w-full bg-blue-50 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Progreso Android</h3>
              {fields.map((field) => (
                <Select
                  key={`android${field}`}
                  label={field}
                  name={`android${field}`}
                  value={mobileFeature[`android${field}` as keyof MobileFeature] as string || ""}
                  onChange={handleInputChange}
                  options={progressOptions}
                />
              ))}
            </div>
            <div className="w-full bg-purple-50 p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Progreso iOS</h3>
              {fields.map((field) => (
                <Select
                  key={`ios${field}`}
                  label={field}
                  name={`ios${field}`}
                  value={mobileFeature[`ios${field}` as keyof MobileFeature] as string || ""}
                  onChange={handleInputChange}
                  options={progressOptions}
                />
              ))}
            </div>
            </div>
          </>
        );
      } else {
        const webApiFeature = newFeature as WebApiFeature;
        return (
          <div className={`bg-${newFeature.developmentType === 'web' ? 'green' : 'yellow'}-50 p-6 rounded-lg shadow-md mb-8`}>
            <h3 className={`text-xl font-semibold text-${newFeature.developmentType === 'web' ? 'green' : 'yellow'}-800 mb-4`}>
              Progreso {newFeature.developmentType.toUpperCase()}
            </h3>
            {fields.map((field) => (
              <Select
                key={field.toLowerCase()}
                label={field}
                name={field.toLowerCase()}
                value={webApiFeature[field.toLowerCase() as keyof WebApiFeature] as string || ""}
                onChange={handleInputChange}
                options={progressOptions}
              />
            ))}
          </div>
        );
      }
    };
  
    const renderExecutionFields = () => {
      if (newFeature.developmentType === 'mobile') {
        const mobileFeature = newFeature as MobileFeature;
        return (
          <>
            <Input
              label="Ejecución manual Android"
              name="androidManualExecution"
              value={mobileFeature.androidManualExecution || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Ejecución manual iOS"
              name="iosManualExecution"
              value={mobileFeature.iosManualExecution || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Ejecución robot Android"
              name="androidRobotExecution"
              value={mobileFeature.androidRobotExecution || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Ejecución robots iOS"
              name="iosRobotExecution"
              value={mobileFeature.iosRobotExecution || ""}
              onChange={handleInputChange}
            />
          </>
        );
      } else {
        const webApiFeature = newFeature as WebApiFeature;
        return (
          <>
            <Input
              label={`Ejecución manual ${newFeature.developmentType}`}
              name="manualExecution"
              value={webApiFeature.manualExecution || ""}
              onChange={handleInputChange}
            />
            <Input
              label={`Ejecución robot ${newFeature.developmentType}`}
              name="robotExecution"
              value={webApiFeature.robotExecution || ""}
              onChange={handleInputChange}
            />
          </>
        );
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {editingId !== null ? "Editar feature" : "Añadir nueva feature"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Input label="Feature" name="feature" value={newFeature.feature || ""} onChange={handleInputChange} required />
          <Input label="Escenario" name="scenario" value={newFeature.scenario || ""} onChange={handleInputChange} required />
          <Input label="Nombre del caso" name="caseName" value={newFeature.caseName || ""} onChange={handleInputChange} required />
          <Select label="Estado" name="status" value={newFeature.status || ""} onChange={handleInputChange} options={statusOptions} />
          <Input label="Descripción" name="description" value={newFeature.description || ""} onChange={handleInputChange} />
          <Input label="Gherkin" name="gherkin" value={newFeature.gherkin || ""} onChange={handleInputChange} />
          <Input label="Tag Module" name="tagModule" value={newFeature.tagModule || ""} onChange={handleInputChange} />
          <Select
            label="Tipo de desarrollo"
            name="developmentType"
            value={newFeature.developmentType || "mobile"}
            onChange={handleInputChange}
            options={developmentTypes}
          />
        </div>
        <TagInput
          tags={newFeature.tags || []}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
        {renderProgressFields()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {renderExecutionFields()}
        </div>
        <div className="mt-10">
          <ProgressBar value={newFeature.totalProgress || "0"} color="blue" label="Progreso total" />
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