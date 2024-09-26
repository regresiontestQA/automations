// src/hooks/useFeatures.ts
import { useState, useEffect } from 'react';
import { Feature } from '../types/types';
import { calculateProgress, calculateTotalProgress } from '../utils/progressCalculations';

export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newFeature, setNewFeature] = useState<Feature>({
    id: 0,
    feature: "",
    scenario: "",
    caseName: "",
    status: "",
    description: "",
    gherkin: "",
    tagModule: "",
    tags: [],
    androidStrategy: "",
    iosStrategy: "",
    androidMapping: "",
    iosMapping: "",
    androidConstruction: "",
    iosConstruction: "",
    androidStabilization: "",
    iosStabilization: "",
    androidProgress: "",
    iosProgress: "",
    totalProgress: "",
    androidManualExecution: "",
    iosManualExecution: "",
    androidRobotExecution: "",
    iosRobotExecution: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const storedFeatures = localStorage.getItem("features");
    if (storedFeatures) {
      setFeatures(JSON.parse(storedFeatures));
      setFilteredFeatures(JSON.parse(storedFeatures));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewFeature((prev) => {
      const updated = { ...prev, [name]: value };
      return {
        ...updated,
        androidProgress: calculateProgress(updated, "android"),
        iosProgress: calculateProgress(updated, "ios"),
        totalProgress: calculateTotalProgress(updated),
      };
    });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilterValue(value);

    const filtered = features.filter(
      (feature) =>
        feature.scenario.toLowerCase().includes(value) ||
        feature.feature.toLowerCase().includes(value) ||
        feature.caseName.toLowerCase().includes(value) ||
        feature.tags.some((tag) => tag.toLowerCase().includes(value))
    );

    setFilteredFeatures(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedFeatures: Feature[];
    if (editingId !== null) {
      updatedFeatures = features.map((feature) =>
        feature.id === editingId ? { ...newFeature, id: editingId } : feature
      );
    } else {
      const maxId = features.reduce(
        (max, feature) => Math.max(max, feature.id),
        0
      );
      updatedFeatures = [...features, { ...newFeature, id: maxId + 1 }];
    }
    setFeatures(updatedFeatures);
    setFilteredFeatures(updatedFeatures);
    localStorage.setItem("features", JSON.stringify(updatedFeatures));
    setNewFeature({
      id: 0,
      feature: "",
      scenario: "",
      caseName: "",
      status: "",
      description: "",
      gherkin: "",
      tagModule: "",
      tags: [],
      androidStrategy: "",
      iosStrategy: "",
      androidMapping: "",
      iosMapping: "",
      androidConstruction: "",
      iosConstruction: "",
      androidStabilization: "",
      iosStabilization: "",
      androidProgress: "",
      iosProgress: "",
      totalProgress: "",
      androidManualExecution: "",
      iosManualExecution: "",
      androidRobotExecution: "",
      iosRobotExecution: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (id: number) => {
    const featureToEdit = features.find((feature) => feature.id === id);
    if (featureToEdit) {
      setShowForm(true);
      setNewFeature(featureToEdit);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    const updatedFeatures = features.filter((feature) => feature.id !== id);
    setFeatures(updatedFeatures);
    setFilteredFeatures(updatedFeatures);
    localStorage.setItem("features", JSON.stringify(updatedFeatures));
  };

  const handleAddTag = () => {
    if (newTag && !newFeature.tags.includes(newTag)) {
      setNewFeature(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewFeature(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return {
    features,
    filteredFeatures,
    newFeature,
    editingId,
    showForm,
    filterValue,
    newTag,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleFilterChange,
    setShowForm,
    handleAddTag,
    handleRemoveTag,
    setNewTag,
  };
}