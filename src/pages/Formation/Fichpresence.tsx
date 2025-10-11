import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <== corrigé
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import Button from "../Tables/ui/Button";
import { getAllParticipants } from "../../api/participationService";
import { createPresence, getPresencesByFormation, PresenceFormation } from "../../api/presenceFormationService";
import { getFormationById } from "../../api/formationService";

interface Participant {
  id: number;
  name: string;
  fonction: string;
  presence: { [date: string]: boolean }; // true = absent, false = présent
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

const FichePresence = () => {
  const { id } = useParams<{ id: string }>();
  const idFormation = id ? parseInt(id, 10) : 0;

  const [formation, setFormation] = useState<any>(null);
  const [presenceDates, setPresenceDates] = useState<string[]>([]);
  const [participantData, setParticipantData] = useState<Participant[]>([]);

  // Récupération formation
  useEffect(() => {
    if (!idFormation) return;

    getFormationById(idFormation).then((data) => {
      setFormation(data);
      setPresenceDates(getDatesBetween(data.dateDebut, data.dateFin));
    });
  }, [idFormation]);

  // Récupération participants et présences existantes
  useEffect(() => {
    if (!idFormation || presenceDates.length === 0) return;

    Promise.all([getAllParticipants(idFormation), getPresencesByFormation(idFormation)]).then(
      ([participants, presences]) => {
        const presenceMap: { [key: string]: boolean } = {};
        presences.forEach((p: any) => {
          presenceMap[`${p.employe.id}-${p.datePresence}`] = p.statut === "ABSENT";
        });

        const formatted: Participant[] = participants.map((p: any) => {
          const presence: { [date: string]: boolean } = {};
          presenceDates.forEach((date) => {
            presence[date] = presenceMap[`${p.employe.id}-${date}`] ?? false;
          });
          return {
            id: p.employe.id,
            name: `${p.employe.nom} ${p.employe.prenom}`,
            fonction: p.employe.fonction ?? "-",
            presence,
          };
        });

        setParticipantData(formatted);
      }
    );
  }, [idFormation, presenceDates]);

  // Met à jour localement la présence
  const handlePresenceChange = (participantId: number, date: string, isAbsent: boolean) => {
    setParticipantData((prev) =>
      prev.map((part) =>
        part.id === participantId
          ? { ...part, presence: { ...part.presence, [date]: isAbsent } }
          : part
      )
    );
  };

 const handleSaveAllPresences = async () => {
  if (!idFormation) return;

  try {
    for (const participant of participantData) {
      for (const date of presenceDates) {
        const statut = participant.presence[date] ? "ABSENT" : "PRESENT";

        // Solution simple : ne garder que l'id
        const payload = {
          employe: { id: participant.id },
          formation: { id: idFormation },
          datePresence: date,
          statut,
        };

        await createPresence(payload as PresenceFormation);
      }
    }

    alert("Présences enregistrées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des présences :", error);
    alert("Erreur lors de l'enregistrement.");
  }
};


  if (!idFormation)
    return <div className="text-gray-800 dark:text-gray-200">Formation non spécifiée.</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen flex flex-col ">
      {/* Infos formation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-4">
        {formation ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Fiche de présence
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Type : {formation.type}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">• Titre : {formation.theme}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              • Organisme / Animateur : {formation.organisme} / {formation.formateur?.nomFormateur}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              • Durée : {getDurationDays(formation.dateDebut, formation.dateFin)} jour(s)
            </p>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-700">
              <TableCell isHeader className="px-4 py-2 text-gray-600 dark:text-gray-300">Nom</TableCell>
              <TableCell isHeader className="px-4 py-2 text-gray-600 dark:text-gray-300">Fonction</TableCell>
              {presenceDates.map((date) => (
                <TableCell key={date} isHeader className="px-4 py-2 text-gray-600 dark:text-gray-300">{date}</TableCell>
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
            ) : (
              participantData.map((part) => (
                <TableRow key={part.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <TableCell className="px-4 py-2 text-gray-900 dark:text-white">{part.name}</TableCell>
                  <TableCell className="px-4 py-2 text-gray-700 dark:text-gray-300 text-center">{part.fonction}</TableCell>
                  {presenceDates.map((date) => (
                    <TableCell key={date} className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={part.presence[date]}
                        onChange={(e) => handlePresenceChange(part.id, date, e.target.checked)}
                        className="cursor-pointer"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bouton enregistrer */}
      <div className="mt-4 flex justify-center items-end">
        <Button variant="primary" onClick={handleSaveAllPresences}>
          Enregistrer
        </Button>
        
      </div>
    </div>
  );
};

export default FichePresence;
