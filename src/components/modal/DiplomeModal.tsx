// src/components/modals/DiplomeModal.tsx
import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createDiplome } from "../../api/DiplomeService";

interface DiplomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void; // callback de succès (rafraîchir la liste)
  employeId: number;  // ID employé
}

interface DiplomeForm {
  etablissement: string;
  lieu: string;
  diplomeObtenu: string;
  anneeObtention: string;
}

export default function DiplomeModal({ isOpen, onClose, onSave, employeId }: DiplomeModalProps) {
  const [formData, setFormData] = useState<DiplomeForm>({
    etablissement: "",
    lieu: "",
    diplomeObtenu: "",
    anneeObtention: "",
  });

  const [error, setError] = useState<string>("");

  // Mettre à jour le state quand on tape dans les inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envoi du formulaire avec validation
  const handleSave = async () => {
    setError("");

    const { etablissement, lieu, diplomeObtenu, anneeObtention } = {
      etablissement: formData.etablissement.trim(),
      lieu: formData.lieu.trim(),
      diplomeObtenu: formData.diplomeObtenu.trim(),
      anneeObtention: formData.anneeObtention.trim(),
    };

    // Validation des champs
    if (!etablissement) {
      setError("Veuillez renseigner l'établissement.");
      return;
    }
    if (!lieu) {
      setError("Veuillez renseigner le lieu.");
      return;
    }
    if (!diplomeObtenu) {
      setError("Veuillez renseigner le diplôme obtenu.");
      return;
    }
    if (!anneeObtention) {
      setError("Veuillez renseigner l'année d'obtention.");
      return;
    }

    // Validation année
    const annee = parseInt(anneeObtention, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(annee) || annee < 1900 || annee > currentYear) {
      setError(`L'année d'obtention doit être un nombre entre 1900 et ${currentYear}.`);
      return;
    }

    try {
      const payload = {
        etablissement,
        lieu,
        diplomeObtenu,
        anneeObtention,
        employe: { id: employeId },
      };
      console.log("Payload envoyé :", payload);

      await createDiplome(payload);
      onSave();  // Rafraîchir la liste
      onClose(); // Fermer modal
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement :", err);
      setError(err.response?.data?.message || "Une erreur est survenue !");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 lg:p-6">
        <div className="px-1 pr-10">
          <h4 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Ajouter ou modifier un diplôme
          </h4>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations de votre diplôme pour que votre profil soit complet.
          </p>
        </div>

        {error && <p className="mb-2 text-red-500">{error}</p>}

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="custom-scrollbar max-h-[400px] overflow-y-auto px-1 pb-2">
            <div className="mt-4">
              <h5 className="mb-3 text-lg font-medium text-gray-800 dark:text-white/90">
                Détails du diplôme
              </h5>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Établissement</Label>
                  <Input
                    name="etablissement"
                    type="text"
                    placeholder="Entrez le nom de l'établissement"
                    value={formData.etablissement}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Lieu</Label>
                  <Input
                    name="lieu"
                    type="text"
                    placeholder="Entrez la ville ou le pays"
                    value={formData.lieu}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Diplôme obtenu</Label>
                  <Input
                    name="diplomeObtenu"
                    type="text"
                    placeholder="Entrez le diplôme obtenu"
                    value={formData.diplomeObtenu}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Année d'obtention</Label>
                  <Input
                    name="anneeObtention"
                    type="text"
                    placeholder="Entrez l'année d'obtention"
                    value={formData.anneeObtention}
                    onChange={handleChange}
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
