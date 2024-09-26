import { useState, useEffect } from 'react';
import { Feature, MobileFeature, WebApiFeature } from '../../types/pruebaType';


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
    developmentType: 'mobile',
    androidStrategy: "",
    androidMapping: "",
    androidConstruction: "",
    androidStabilization: "",
    iosStrategy: "",
    iosMapping: "",
    iosConstruction: "",
    iosStabilization: "",
    androidManualExecution: "",
    androidRobotExecution: "",
    iosManualExecution: "",
    iosRobotExecution: "",
    totalProgress: "0",
  } as MobileFeature);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const storedFeatures = localStorage.getItem("featuresp");
    if (storedFeatures) {
      const parsedFeatures = JSON.parse(storedFeatures);
      setFeatures(parsedFeatures);
      setFilteredFeatures(parsedFeatures);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewFeature((prev) => {
      let updated: Feature;
      if (name === 'developmentType') {
        if (value === 'mobile') {
          updated = {
            ...prev,
            developmentType: 'mobile',
            androidStrategy: "",
            androidMapping: "",
            androidConstruction: "",
            androidStabilization: "",
            iosStrategy: "",
            iosMapping: "",
            iosConstruction: "",
            iosStabilization: "",
            androidManualExecution: "",
            androidRobotExecution: "",
            iosManualExecution: "",
            iosRobotExecution: "",
          } as MobileFeature;
        } else {
          updated = {
            ...prev,
            developmentType: value as 'web' | 'api',
            strategy: "",
            mapping: "",
            construction: "",
            stabilization: "",
            manualExecution: "",
            robotExecution: "",
          } as WebApiFeature;
        }
      } else {
        updated = { ...prev, [name]: value };
      }
      const progress = calculateProgress(updated);
      return {
        ...updated,
        totalProgress: progress,
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
    localStorage.setItem("featuresp", JSON.stringify(updatedFeatures));
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
      developmentType: 'mobile',
      androidStrategy: "",
      androidMapping: "",
      androidConstruction: "",
      androidStabilization: "",
      iosStrategy: "",
      iosMapping: "",
      iosConstruction: "",
      iosStabilization: "",
      androidManualExecution: "",
      androidRobotExecution: "",
      iosManualExecution: "",
      iosRobotExecution: "",
      totalProgress: "0",
    } as MobileFeature);
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
    localStorage.setItem("featuresp", JSON.stringify(updatedFeatures));
  };

  const handleAddTag = () => {
    if (newTag && !newFeature.tags.includes(newTag)) {
      setNewFeature((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewFeature((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  function calculateProgress(feature: Feature): string {
    const fields = ['Strategy', 'Mapping', 'Construction', 'Stabilization'];
    if (feature.developmentType === 'api') {
      fields.splice(1, 1); // Remove 'Mapping' for API
    }
  
    let sum = 0;
    let count = 0;
  
    if (feature.developmentType === 'mobile') {
      const mobileFeature = feature as MobileFeature;
      fields.forEach(field => {
        sum += Number(mobileFeature[`android${field}` as keyof MobileFeature] || 0);
        sum += Number(mobileFeature[`ios${field}` as keyof MobileFeature] || 0);
        count += 2;
      });
    } else {
      const webApiFeature = feature as WebApiFeature;
      fields.forEach(field => {
        sum += Number(webApiFeature[field.toLowerCase() as keyof WebApiFeature] || 0);
        count += 1;
      });
    }
  
    return ((sum / count) || 0).toFixed(2);
  }

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