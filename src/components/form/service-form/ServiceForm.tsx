import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function ServiceForm({ onDataChange }: { onDataChange: (data: any) => void }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ nom?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ nom?: boolean; description?: boolean }>({});

  // Validation simple
  const validate = () => {
    const newErrors: { nom?: string; description?: string } = {};
    if (!nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!description.trim()) newErrors.description = "La description est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validate()) {
      onDataChange({ nom, description });
    } else {
      onDataChange(null);
    }
  }, [nom, description]);

  return (
    <ComponentCard title="Informations du service">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            type="text"
            id="nom"
            placeholder="Veuillez saisir le nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, nom: true }))}
          />
          {touched.nom && errors.nom && (
            <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            placeholder="Veuillez saisir la description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
          />
          {touched.description && errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
      </div>
    </ComponentCard>
  );
}
