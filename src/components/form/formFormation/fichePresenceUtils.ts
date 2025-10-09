// src/components/form/fichePresenceUtils.ts
import { createPresence } from "../../../api/presenceFormationService";

export const markPresencesForEmployees = async (
  employees: { id: number; nom: string }[],
  dateDebut: string,
  dateFin: string,
  formationId: number
) => {
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  const dates: string[] = [];

  while (start <= end) {
    dates.push(start.toISOString().slice(0, 10));
    start.setDate(start.getDate() + 1);
  }

  const allPromises: Promise<any>[] = [];

  for (const emp of employees) {
    for (const d of dates) {
      allPromises.push(
        createPresence({
          employe: { id: emp.id },
          formation: { id: formationId },
          statut: "PRESENT",
          datePresence: d,
        })
      );
    }
  }

  await Promise.all(allPromises);
};
