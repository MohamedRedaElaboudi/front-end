import { FormationParticipation } from "../../../api/presenceFormationService";

interface FormationParticipationComposantProps {
  formation: FormationParticipation;
}

export default function FormationParticipationComposant({ formation }: FormationParticipationComposantProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
      <div>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{formation.theme}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formation.lieu} | {formation.type}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formation.dateDebut} → {formation.dateFin}
        </p>
      </div>
    </div>
  );
}
