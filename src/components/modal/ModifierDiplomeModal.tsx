import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useState, useEffect } from "react";

interface ModifierFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    diplome: string;
    etablissement: string;
    lieu: string;
    periode: string;
    employeId: number;
  }) => void;
  employeId: number;
  initialData: {
    diplome: string;
    etablissement: string;
    lieu: string;
    periode: string;
  };
}

export default function ModifierFormationModal({
  isOpen,
  onClose,
  onSave,
  employeId,
  initialData,
}: ModifierFormationModalProps) {
  const [diplome, setDiplome] = useState("");
  const [etablissement, setEtablissement] = useState("");
  const [lieu, setLieu] = useState("");
  const [periode, setPeriode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDiplome(initialData.diplome);
      setEtablissement(initialData.etablissement);
      setLieu(initialData.lieu);
      setPeriode(initialData.periode);
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!etablissement.trim() || !lieu.trim() || !diplome.trim() || !periode.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    onSave({ diplome, etablissement, lieu, periode, employeId });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Modifier la formation
        </h4>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Établissement
            </label>
            <Input
              value={etablissement}
              onChange={(e) => setEtablissement(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Lieu
            </label>
            <Input
              value={lieu}
              onChange={(e) => setLieu(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Diplôme obtenu
            </label>
            <Input
              value={diplome}
              onChange={(e) => setDiplome(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Période
            </label>
            <Input
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-3 justify-end md:col-span-2 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Fermer
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
