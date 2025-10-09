import { useEffect, useState } from "react";
import Input from "../input/InputField";
import Select from "../Select";
import { getAllFormateurs } from "../../../api/formationService";
import Label from "../Label";

interface Formateur {
  id?: number;
  cneFormateur?: string;
  nomFormateur?: string;
  typeFormateur?: string;
  label?: string; // pour Select existant
}

interface FormateurSelectorProps {
  formateur: Formateur | null;
  setFormateur: (f: Formateur | null) => void;
}

const formateurTypeOptions = [
  { value: "interne", label: "Interne" },
  { value: "externe", label: "Externe" },
];

export default function FormateurSelector({ formateur, setFormateur }: FormateurSelectorProps) {
  const [useExisting, setUseExisting] = useState(true);
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

  const [selectedId, setSelectedId] = useState<number | "">(
    formateur?.id ?? ""
  );
  const [cne, setCne] = useState(formateur?.cneFormateur || "");
  const [nom, setNom] = useState(formateur?.nomFormateur || "");
  const [typeForm, setTypeForm] = useState(formateur?.typeFormateur || "");

  // Charger les formateurs existants
  useEffect(() => {
    async function fetchFormateurs() {
      try {
        const f = await getAllFormateurs();
        setOptions(
          f.map((formateur: any) => ({
            value: formateur.id,
            label: `${formateur.nomFormateur} (${formateur.typeFormateur})`,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }
    fetchFormateurs();
  }, []);

  // Mettre à jour le formateur sélectionné ou nouveau
  useEffect(() => {
    if (useExisting) {
      const selected = options.find((opt) => opt.value === selectedId);
      setFormateur(selected ? { id: selected.value, label: selected.label } : null);
    } else {
      if (cne && nom && typeForm) {
        setFormateur({ cneFormateur: cne, nomFormateur: nom, typeFormateur: typeForm });
      } else {
        setFormateur(null);
      }
    }
  }, [useExisting, selectedId, cne, nom, typeForm, options, setFormateur]);

  return (
    <div className="col-span-1 md:col-span-2 mt-4 mb-4">
      <Label>Formateur</Label>

      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            useExisting ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setUseExisting(true)}
        >
          Formateur existant
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg ${
            !useExisting ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setUseExisting(false)}
        >
          Nouveau formateur
        </button>
      </div>

      {useExisting ? (
        <div className="mb-4">
          <Label>Choisir formateur</Label>
          <Select
            options={options}
            value={selectedId}
            onChange={(val) => setSelectedId(Number(val))}
            placeholder="Sélectionner un formateur"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Label>CIN Formateur</Label>
            <Input
              value={cne}
              onChange={(e) => setCne(e.target.value)}
              placeholder="Saisir le CNE"
            />
          </div>
          <div className="mb-4">
            <Label>Nom Formateur</Label>
            <Input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Saisir le nom"
            />
          </div>
          <div className="mb-4">
            <Label>Type Formateur</Label>
            <Select
              options={formateurTypeOptions}
              value={typeForm}
              onChange={(val) => setTypeForm(String(val))}
              placeholder="Sélectionner le type"
            />
          </div>
        </div>
      )}
    </div>
  );
}
