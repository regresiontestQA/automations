
import React from 'react';

interface TagInputProps {
  tags: string[];
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export default function TagInput({ tags, newTag, setNewTag, onAddTag, onRemoveTag }: TagInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
        Etiquetas
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          id="newTag"
          name="newTag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Agregar una nueva etiqueta"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onAddTag}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar Etiqueta
        </button>
      </div>
    </div>
  );
}