import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ModifierFormationModal from "../../modal/ModifierDiplomeModal";
import { getDiplomesByEmploye, updateDiplome, deleteDiplome } from "../../../api/DiplomeService";

interface FormationInitialeComposantProps {
  employeId: number;
}

interface Diplome {
  id: number;
  diplomeObtenu: string;
  etablissement: string;
  anneeObtention: string;
  lieu: string;
  employe?: { id: number };
}

export default function FormationInitialeComposant({ employeId }: FormationInitialeComposantProps) {
  const [diplomes, setDiplomes] = useState<Diplome[]>([]);
  const [selectedDiplome, setSelectedDiplome] = useState<Diplome | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiplomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDiplomesByEmploye(employeId);
      setDiplomes(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les diplômes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomes();
  }, [employeId]);

  const handleEdit = (diplome: Diplome) => {
    setSelectedDiplome(diplome);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedData: {
    diplome: string;
    etablissement: string;
    lieu: string;
    periode: string;
    employeId: number;
  }) => {
    if (!selectedDiplome) return;

    try {
      await updateDiplome(selectedDiplome.id, {
        diplomeObtenu: updatedData.diplome,
        etablissement: updatedData.etablissement,
        lieu: updatedData.lieu,
        anneeObtention: updatedData.periode,
        employe: { id: updatedData.employeId },
      });

      setDiplomes((prev) =>
        prev.map((d) =>
          d.id === selectedDiplome.id
            ? {
                ...d,
                diplomeObtenu: updatedData.diplome,
                etablissement: updatedData.etablissement,
                lieu: updatedData.lieu,
                anneeObtention: updatedData.periode,
                employe: { id: updatedData.employeId },
              }
            : d
        )
      );

      setIsModalOpen(false);
      setSelectedDiplome(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };
const handleDelete = async (id: number) => {
  const confirmed = window.confirm("Voulez-vous vraiment supprimer ce diplôme ?");
  if (!confirmed) return;

  try {
    await deleteDiplome(id);
    setDiplomes((prev) => prev.filter((d) => d.id !== id));
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
};
  return (
    <div className="space-y-4">
      {loading && <p className="text-gray-700 dark:text-gray-300">Chargement des diplômes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && diplomes.length === 0 && !error && (
        <p className="text-gray-500 dark:text-gray-400">Aucun diplôme enregistré pour cet employé.</p>
      )}

      {diplomes.map((diplome) => (
        <div
          key={diplome.id}
          className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
        >
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{diplome.diplomeObtenu}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {diplome.etablissement} | {diplome.anneeObtention} | {diplome.lieu}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(diplome)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={() => handleDelete(diplome.id)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      ))}

      {selectedDiplome && (
        <ModifierFormationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          employeId={employeId}
          initialData={{
            diplome: selectedDiplome.diplomeObtenu,
            etablissement: selectedDiplome.etablissement,
            periode: selectedDiplome.anneeObtention,
            lieu: selectedDiplome.lieu,
          }}
        />
      )}
    </div>
  );
}
