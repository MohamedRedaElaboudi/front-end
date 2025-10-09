// src/helpers/presenceHelper.ts
import { createPresence } from "../../../api/presenceFormationService";

export interface EmployeeMinimal {
  id: number;
  nom: string;
}

/**
 * Crée automatiquement la présence pour tous les employés sur toutes les dates de la formation.
 */
export const markPresencesAutomatically = async (
  employees: EmployeeMinimal[],
  formationId: number,
  dateDebut: string,
  dateFin: string
) => {
  if (!employees || employees.length === 0) {
    console.warn("Aucun employé sélectionné pour marquer les présences.");
    return;
  }

  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  const dates: string[] = [];

  while (start <= end) {
    dates.push(start.toISOString().slice(0, 10));
    start.setDate(start.getDate() + 1);
  }

  const promises: Promise<any>[] = [];

  employees.forEach((emp) => {
    dates.forEach((date) => {
      promises.push(
        createPresence({
          employe: { id: emp.id },
          formation: { id: formationId },
          statut: "PRESENT",
          datePresence: date,
        }).catch((err) =>
          console.error(`Erreur présence pour ${emp.nom} le ${date}:`, err)
        )
      );
    });
  });

  await Promise.all(promises);
  console.log("Présences marquées automatiquement !");
};
