import React, { useState, useEffect, useMemo } from "react";
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
  id: number; // id de la formation
};

const SupprimerParticipant: React.FC<ParticipantsTableProps> = ({ id }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);

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
    if (id) {
      fetchParticipants();
    }
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

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

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filtered.slice(startIndex, startIndex + entriesPerPage);

  async function handleDelete(employeId: number) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce participant ?")) return;

    try {
      await deleteParticipation(employeId, id);
      setParticipants(prev => prev.filter(p => p.id_employe !== employeId));
      if (editingRow === employeId) setEditingRow(null);
    } catch (err) {
      console.error("Erreur suppression participant", err);
      alert("Erreur lors de la suppression du participant.");
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow-md">
      {/* Barre de recherche */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-60 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <select
          value={entriesPerPage}
          onChange={e => setEntriesPerPage(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {[5, 10, 25, 50].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <th className="border px-4 py-2">Nom complet</th>
            <th className="border px-4 py-2">CNE</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Fonction</th>
            <th className="border px-4 py-2">Service</th>
            <th className="border px-4 py-2">Date recrutement</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aucun participant trouvé.
              </td>
            </tr>
          ) : (
            currentData.map(p => (
              <tr key={p.id_employe} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
                <td className="border px-4 py-2">{p.nom} {p.prenom}</td>
                <td className="border px-4 py-2">{p.cne}</td>
                <td className="border px-4 py-2">{p.email}</td>
                <td className="border px-4 py-2">{p.fonction ?? "-"}</td>
                <td className="border px-4 py-2">{p.service?.nom ?? "-"}</td>
                <td className="border px-4 py-2">{p.date_recrutement}</td>
                <td className="border px-4 py-2">
                  {editingRow === p.id_employe ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(p.id_employe)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Supprimer
                      </button>
                      <button className="px-2 py-1 bg-green-500 text-white rounded">Ajouter</button>
                      <button className="px-2 py-1 bg-gray-400 text-white rounded" onClick={() => setEditingRow(null)}>Annuler</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => setEditingRow(p.id_employe)}>Modifier</button>
                      <button
                        onClick={() => handleDelete(p.id_employe)}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          Affichage {startIndex + 1} - {Math.min(startIndex + entriesPerPage, filtered.length)} sur {filtered.length}
        </div>
        <div>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="mr-2 px-2 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            Précédent
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-2 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupprimerParticipant;
