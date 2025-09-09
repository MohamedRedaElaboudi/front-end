import { useState, useEffect, useMemo } from "react";
import { getAllParticipants, deleteParticipation } from "../../../api/participationService";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../pages/Tables/ui/Table";
import Button from "../../../pages/Tables/ui/Button";
import Select from "../../../pages/Tables/ui/Select";
import SearchInput from "../../../pages/Tables/ui/SearchInput";
import Pagination from "../../../pages/Tables/ui/Pagination";
import { Trash2 } from "lucide-react";

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
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);

  const entriesOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" }
  ];

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
  useEffect(() => setCurrentPage(1), [searchTerm, entriesPerPage]);

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

  const totalPages = Math.ceil(filtered.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const currentData = filtered.slice(startIndex, startIndex + parseInt(entriesPerPage));
  const showActions = statut?.toLowerCase() !== "termine" && statut?.toLowerCase() !== "valide";
  const showingText = `Affichage de ${startIndex + 1} à ${Math.min(startIndex + parseInt(entriesPerPage), filtered.length)} sur ${filtered.length} participant${filtered.length > 1 ? "s" : ""}`;

  return (
    <div className="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-lg shadow-sm">
      {/* Recherche et sélection */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Afficher</span>
          <Select value={entriesPerPage} onChange={setEntriesPerPage} options={entriesOptions} />
          <span className="text-sm text-gray-600 dark:text-gray-400">entrées</span>
        </div>
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Recherche..." className="sm:w-80" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              {["Nom complet", "CNE", "Email", "Fonction", "Service", "Date recrutement", showActions ? "Actions" : ""].filter(Boolean).map((col, i) => (
                <TableCell
                  key={i}
                  isHeader
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 7 : 6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Aucun participant trouvé.
                </TableCell>
              </TableRow>
            ) : currentData.map((p, index) => (
              <TableRow
                key={p.id_employe}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-800/50"}`}
              >
                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.nom} {p.prenom}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.cne}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.email}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.fonction ?? "-"}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400">{p.service?.nom ?? "-"}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{p.date_recrutement}</TableCell>
                {showActions && (
                  <TableCell className="px-6 py-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(p.id_employe)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={showingText}
        />
      </div>
    </div>
  );
};

export default ParticipantsTable;
