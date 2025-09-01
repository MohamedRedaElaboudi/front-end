import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect } from "react";

interface ModifierExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    employeur: string;
    emploi_occupe: string;
    date_debut: string;
    date_fin: string;
  }) => void;
  initialData: {
    employeur: string;
    emploi_occupe: string;
    date_debut: string;
    date_fin: string;
  };
}

export default function ModifierExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ModifierExperienceModalProps) {
  const [employeur, setEmployeur] = useState("");
  const [emploi, setEmploi] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmployeur(initialData.employeur);
      setEmploi(initialData.emploi_occupe);
      setDateDebut(initialData.date_debut);
      setDateFin(initialData.date_fin);
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    // Validation
    if (!employeur.trim() || !emploi.trim() || !dateDebut.trim() || !dateFin.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // Vérifier que dateFin >= dateDebut
    if (new Date(dateFin) < new Date(dateDebut)) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    onSave({
      employeur: employeur.trim(),
      emploi_occupe: emploi.trim(),
      date_debut: dateDebut,
      date_fin: dateFin,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Modifier l'expérience professionnelle
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Mettez à jour les informations de votre expérience.
        </p>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div className="col-span-2 lg:col-span-1">
            <Label>Employeur</Label>
            <Input type="text" value={employeur} onChange={(e) => setEmployeur(e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Emploi occupé</Label>
            <Input type="text" value={emploi} onChange={(e) => setEmploi(e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Date début</Label>
            <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <Label>Date fin</Label>
            <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button size="sm" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
