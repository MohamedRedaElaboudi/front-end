import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ModifierExperienceModal from "../../modal/ModifierExperienceModal";
import { updateExperience, deleteExperience } from "../../../api/ExperienceProservice";

interface Experience {
  id: number;
  employeur: string;
  emploi_occupe: string;
  date_debut: string;
  date_fin: string;
  employe?: { id: number };
}

interface ExperienceProComposantProps {
  experience: Experience;
  onUpdateList: (updatedExp: Experience) => void;
  onDelete: (id: number) => void;
  employeeId: number;
}

export default function ExperienceProComposant({ experience, onUpdateList, onDelete, employeeId }: ExperienceProComposantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => setIsModalOpen(true);

  const handleSave = async (updatedData: { employeur: string; emploi_occupe: string; date_debut: string; date_fin: string }) => {
    try {
      const updated = await updateExperience(experience.id, { ...updatedData, employe: { id: employeeId } });
      onUpdateList(updated);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur mise à jour expérience :", err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette expérience ?");
    if (!confirmed) return;
    try {
      await deleteExperience(experience.id);
      onDelete(experience.id);
    } catch (err) {
      console.error("Erreur suppression expérience :", err);
    }
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-3 px-2 hover:bg-gray-50 rounded-lg">
      <div>
        <p className="font-semibold text-gray-800">{experience.emploi_occupe}</p>
        <p className="text-sm text-gray-600">
          {experience.employeur} | {experience.date_debut} - {experience.date_fin}
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-200">
          <PencilIcon className="w-5 h-5 text-blue-600" />
        </button>
        <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-200">
          <TrashIcon className="w-5 h-5 text-red-600" />
        </button>
      </div>

      <ModifierExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={experience}
      />
    </div>
  );
}
