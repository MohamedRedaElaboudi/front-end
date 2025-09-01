import { useState, useEffect, useMemo } from "react";
import { getAllParticipants, deleteParticipation } from "../../../api/participationService";

type Participant = {
  id_employe: number;
  nom: string;
  prenom: string;
  cne: string;
  email: string;
  fonction?: string;
  service?: { nom: string };
  date_recrutement?: string;
};

type ParticipantsTableProps = {
  id: number; // id formation
  statut?: string; // statut de la formation
};

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({ id, statut }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les participants
  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getAllParticipants(id);
        const mapped = (Array.isArray(data) ? data : data.data ?? []).map((item: any) => ({
          id_employe: item.employe.id,
          nom: item.employe.nom,
          prenom: item.employe.prenom,
          cne: item.employe.cne,
          email: item.employe.email,
          fonction: item.employe.fonction,
          service: item.employe.service,
          date_recrutement: item.employe.dateRecrutement
        }));
        setParticipants(mapped);
      } catch (err) {
        console.error("Erreur chargement participants", err);
      }
    }
    if (id) fetchParticipants();
  }, [id]);

  // Reset page si filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  // Supprimer un participant
  const handleDelete = async (employeId: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce participant ?")) return;
    try {
      await deleteParticipation(employeId, id);
      setParticipants(prev => prev.filter(p => p.id_employe !== employeId));
    } catch (error) {
      console.error("Erreur suppression participant", error);
      alert("Erreur lors de la suppression.");
    }
  };

  // Filtrage
  const filtered = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return participants.filter(
      (p) =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(lower) ||
        (p.cne ?? "").toLowerCase().includes(lower) ||
        (p.email ?? "").toLowerCase().includes(lower) ||
        (p.fonction ?? "").toLowerCase().includes(lower) ||
        (p.service?.nom ?? "").toLowerCase().includes(lower)
    );
  }, [participants, searchTerm]);

  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filtered.slice(startIndex, startIndex + entriesPerPage);

  const showActions = statut?.toLowerCase() !== "termine" && statut?.toLowerCase() !== "valide";

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow-md">
      {/* Recherche et pagination */}
      <div className="flex justify-between mb-2">
        <input
          type="text"
          placeholder="Rechercher..."
          className="border px-2 py-1 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[5, 10, 20, 50].map(n => (
            <option key={n} value={n}>{n} par page</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nom complet</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">CNE</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Fonction</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Service</th>
            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Date recrutement</th>
            {showActions && (
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 7 : 6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucun participant trouvé.
              </td>
            </tr>
          ) : (
            currentData.map(p => (
              <tr
                key={p.id_employe}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
              >
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.nom} {p.prenom}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.cne}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.email}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.fonction ?? "-"}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.service?.nom ?? "-"}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{p.date_recrutement}</td>
                {showActions && (
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    <button
                      onClick={() => handleDelete(p.id_employe)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination basique */}
      <div className="flex justify-between mt-2 items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          {filtered.length} participant{filtered.length > 1 ? "s" : ""}
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            disabled={startIndex + entriesPerPage >= filtered.length}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTable;
