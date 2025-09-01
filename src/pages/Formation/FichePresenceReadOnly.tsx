import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { getAllParticipants } from '../../api/participationService';
import { getPresencesByFormation } from '../../api/presenceFormationService';
import { getFormationById } from '../../api/formationService';

interface Participant {
  id: number;
  name: string;
  fonction: string;
  presence: { [date: string]: boolean }; // true = présent, false = absent
}

// Génère toutes les dates entre deux dates
function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Calcul durée en jours
function getDurationDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

const FichePresenceReadOnly = () => {
  const { id } = useParams<{ id: string }>();
  const idFormation = id ? parseInt(id, 10) : 0;

  const [formation, setFormation] = useState<any>(null);
  const [presenceDates, setPresenceDates] = useState<string[]>([]);
  const [participantData, setParticipantData] = useState<Participant[]>([]);

  // Récupération formation
  useEffect(() => {
    if (!idFormation) return;

    getFormationById(idFormation).then(data => {
      setFormation(data);
      const dates = getDatesBetween(data.dateDebut, data.dateFin);
      setPresenceDates(dates);
    });
  }, [idFormation]);

  // Récupération participants et présences
  useEffect(() => {
    if (!idFormation || presenceDates.length === 0) return;

    Promise.all([
      getAllParticipants(idFormation),
      getPresencesByFormation(idFormation)
    ]).then(([participants, presences]) => {
      const presenceMap: { [key: string]: boolean } = {};
      presences.forEach((p: any) => {
        presenceMap[`${p.employe.id}-${p.datePresence}`] = p.statut === "PRESENT";
      });

      const formatted: Participant[] = participants.map((p: any) => {
        const presence: { [date: string]: boolean } = {};
        presenceDates.forEach(date => {
          presence[date] = presenceMap[`${p.employe.id}-${date}`] ?? true;
        });
        return {
          id: p.employe.id,
          name: `${p.employe.nom} ${p.employe.prenom}`,
          fonction: p.employe.fonction ?? "-",
          presence
        };
      });

      setParticipantData(formatted);
    });
  }, [idFormation, presenceDates]);

  if (!idFormation) return <div className="text-gray-800 dark:text-gray-200">Formation non spécifiée.</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      {/* Infos formation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-4">
        {formation ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fiche de présence (Lecture seule)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Type : {formation.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Titre : {formation.theme}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Organisme / Animateur : {formation.organisme} / {formation.formateur?.nomFormateur}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Durée : {getDurationDays(formation.dateDebut, formation.dateFin)} jour(s)</p>
          </>
        ) : <p className="text-gray-600 dark:text-gray-300">Chargement...</p>}
      </div>

      {/* Tableau lecture seule */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700">
              <TableCell isHeader className="px-4 py-2">Nom</TableCell>
              <TableCell isHeader className="px-4 py-2">Fonction</TableCell>
              {presenceDates.map(date => (
                <TableCell isHeader key={date} className="px-4 py-2">{date}</TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {participantData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={presenceDates.length + 2} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Aucun participant trouvé.
                </TableCell>
              </TableRow>
            ) : participantData.map(part => (
              <TableRow key={part.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="px-4 py-2 text-gray-900 dark:text-white">{part.name}</TableCell>
                <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-300">{part.fonction}</TableCell>
                {presenceDates.map(date => (
                  <TableCell key={date} className="px-4 py-2 text-center text-sm font-medium">
                    <span className={part.presence[date] ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                      {part.presence[date] ? "PRESENT" : "ABSENT"}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FichePresenceReadOnly;
