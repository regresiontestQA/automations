
import FeatureForm from "../components/Inventario/FeatureForm";
import FeatureTable from "../components/Inventario/FeatureTable";
import { useFeatures } from "../hooks/useFeatures";

export default function Inventario() {
  const {
    filteredFeatures,
    newFeature,
    editingId,
    showForm,
    filterValue,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleFilterChange,
    setShowForm,
    handleAddTag,
    handleRemoveTag,
    newTag,
    setNewTag,
  } = useFeatures();

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Panel de gestión de escenarios
      </h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        {showForm ? "Ocultar Formulario" : "Agregar Nueva Feature"}
      </button>

      {showForm && (
        <FeatureForm
          newFeature={newFeature}
          editingId={editingId}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          newTag={newTag}
          setNewTag={setNewTag}
        />
      )}

      <FeatureTable
        filteredFeatures={filteredFeatures}
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}