import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function ServiceForm({ onDataChange }: { onDataChange: (data: any) => void }) {
  const [nom, setNom] = useState("");
  const [domaine, setDomaine] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ nom?: string; domaine?: string; description?: string }>({});
  const [touched, setTouched] = useState<{ nom?: boolean; domaine?: boolean; description?: boolean }>({});

  // Validation simple
  const validate = () => {
    const newErrors: { nom?: string; domaine?: string; description?: string } = {};
    if (!nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!domaine.trim()) newErrors.domaine = "Le domaine est obligatoire.";
    if (!description.trim()) newErrors.description = "La description est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validate()) {
      onDataChange({ nom, domaine, description });
    } else {
      onDataChange(null);
    }
  }, [nom, domaine, description]);

  return (
    <ComponentCard title="Informations du service">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom */}
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            type="text"
            id="nom"
            placeholder="Veuillez saisir le nom du service"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, nom: true }))}
          />
          {touched.nom && errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
        </div>

        {/* Domaine */}
        <div>
          <Label htmlFor="domaine">Domaine</Label>
          <Input
            type="text"
            id="domaine"
            placeholder="Veuillez saisir le domaine"
            value={domaine}
            onChange={(e) => setDomaine(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, domaine: true }))}
          />
          {touched.domaine && errors.domaine && (
            <p className="text-red-500 text-sm mt-1">{errors.domaine}</p>
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
