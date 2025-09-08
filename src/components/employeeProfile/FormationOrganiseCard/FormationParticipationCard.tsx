import { useEffect, useState } from "react";
import { getGroupedPresencesByEmploye, FormationParticipation } from "../../../api/presenceFormationService";
import FormationParticipationComposant from "./FormationParticipationComposant";

interface FormationComposantProps {
  employeeId: number;
}

export default function FormationComposant({ employeeId }: FormationComposantProps) {
  const [formations, setFormations] = useState<FormationParticipation[]>([]);

  useEffect(() => {
    async function fetchFormations() {
      try {
        const data = await getGroupedPresencesByEmploye(employeeId);

        // Filtrer uniquement les formations où l'employé est présent à toutes les séances
        const formationsComplete = data.filter(f =>
          f.presences.every(p => p.statut === "PRESENT")
        );

        setFormations(formationsComplete);
      } catch (err) {
        console.error("Erreur récupération formations :", err);
      }
    }

    fetchFormations();
  }, [employeeId]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex flex-col gap-4">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Formation Interne
          </h4>
      {formations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Aucune formation complète pour cet employé.
        </p>
      ) : (
        formations.map(f => (
          <FormationParticipationComposant key={f.formationId} formation={f} />
        ))
      )}
    </div>
  );
}
