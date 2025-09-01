import  { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import ExperienceProComposant from "./ExperienceProComposant";
import ExperienceProModal from "../../modal/ExperienceProModal";
import { useModal } from "../../../hooks/useModal";
import {
  getExperiencesByEmploye,
  createExperience,

} from "../../../api/ExperienceProservice";

interface Experience {
  id: number;
  employeur: string;
  emploi_occupe: string;
  date_debut: string;
  date_fin: string;
  employe?: { id: number };
}

interface ExperienceProCardProps {
  employeeId: number;
}

export default function ExperienceProCard({ employeeId }: ExperienceProCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Charger les expériences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiencesByEmploye(employeeId);
        setExperiences(data);
      } catch (error) {
        console.error("Erreur récupération expériences :", error);
      }
    };
    fetchExperiences();
  }, [employeeId]);

  // Ajouter une nouvelle expérience
  const handleAddExperience = async (newExp: Omit<Experience, "id">) => {
    try {
      const saved = await createExperience({ ...newExp, employe: { id: employeeId } });
      setExperiences(prev => [...prev, saved]);
      closeModal();
    } catch (error) {
      console.error("Erreur ajout expérience :", error);
    }
  };

  // Mettre à jour une expérience existante
  const handleUpdateExperience = (updatedExp: Experience) => {
    setExperiences(prev => prev.map(exp => (exp.id === updatedExp.id ? updatedExp : exp)));
  };

  // Supprimer une expérience
  const handleDeleteExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Expériences professionnelles
          </h4>
          <Button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-primary-800 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white lg:inline-flex lg:w-auto"
          >
            Ajouter expérience
          </Button>
        </div>

        {experiences.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Aucune expérience enregistrée pour cet employé.</p>
        )}

        {experiences.map(exp => (
          <ExperienceProComposant
            key={exp.id}
            experience={exp}
            employeeId={employeeId}
            onUpdateList={handleUpdateExperience}
            onDelete={(id: number) => handleDeleteExperience(id)}
          />
        ))}
      </div>

      <ExperienceProModal
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleAddExperience}
      />
    </>
  );
}
