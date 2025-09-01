import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState, useEffect } from "react";

interface ExperienceProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: {
    employeur: string;
    emploi_occupe: string;
    date_debut: string;
    date_fin: string;
  }) => void;
}

export default function ExperienceProModal({ isOpen, onClose, onSave }: ExperienceProModalProps) {
  const [employeur, setEmployeur] = useState("");
  const [emploi, setEmploi] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmployeur("");
      setEmploi("");
      setDateDebut("");
      setDateFin("");
      setError("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!employeur.trim() || !emploi.trim() || !dateDebut || !dateFin) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <div className="px-1 pr-10">
          <h4 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Ajouter une expérience professionnelle
          </h4>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations de votre expérience pour que votre profil soit complet.
          </p>
        </div>

        {error && <p className="mb-2 text-red-500">{error}</p>}

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="custom-scrollbar max-h-[400px] overflow-y-auto px-1 pb-2">
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Employeur</Label>
                  <Input
                    name="employeur"
                    type="text"
                    placeholder="Entrez le nom de l'employeur"
                    value={employeur}
                    onChange={(e) => setEmployeur(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Emploi occupé</Label>
                  <Input
                    name="emploi"
                    type="text"
                    placeholder="Entrez le poste occupé"
                    value={emploi}
                    onChange={(e) => setEmploi(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Date début</Label>
                  <Input
                    name="dateDebut"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Date fin</Label>
                  <Input
                    name="dateFin"
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-1 mt-4 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button size="sm" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
