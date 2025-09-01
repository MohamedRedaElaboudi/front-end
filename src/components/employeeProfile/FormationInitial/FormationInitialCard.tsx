// FormationInitialeCard.tsx
import React from "react";
import Button from "../../ui/button/Button";
import DiplomeModal from "../../modal/DiplomeModal";
import { useModal } from "../../../hooks/useModal";
import FormationInitialeComposant from "./FormationInitialCompenant";

interface FormationInitialeCardProps {
  employeId: number; // <-- tu passes l'id dynamiquement
}

export default function FormationInitialeCard({ employeId }: FormationInitialeCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSaveFormation = () => {
    // le modal va gérer l'ajout via API, donc ici juste fermer
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex flex-col gap-4">
        
        {/* Ligne titre gauche - bouton droite */}
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Formations initiales
          </h4>
          <Button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-primary-800 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white lg:inline-flex lg:w-auto"
          >
            Ajouter formation initiale
          </Button>
        </div>

        {/* Liste dynamique des diplômes */}
        <FormationInitialeComposant employeId={employeId} /> 
      </div>

      {/* Modal pour ajouter un diplôme */}
      <DiplomeModal
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleSaveFormation}
        employeId={employeId}
      />
    </>
  );
}
