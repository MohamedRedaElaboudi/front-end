import React, { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/Table";
import Button from "./ui/Button";
import Select from "./ui/Select";
import SearchInput from "./ui/SearchInput";
import Pagination from "./ui/Pagination";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router";
import { getAllFormations, deleteFormation } from "../../api/formationService";

interface Formation {
  id: number;
  theme: string;
  lieu: string;
  type: string;
  formateur: {
    id: number;
    nomFormateur: string;
    [key: string]: any;
  } | null;
  statut: string;
  dateDebut: string;
  dateFin: string;
}

interface FormationDisplay {
  id: number;
  theme: string;
  lieu: string;
  type: string;
  formateurNom: string;
  statut: string;
  dateDebut: string;
  dateFin: string;
}

const FormationTable: React.FC = () => {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [formationData, setFormationData] = useState<FormationDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const entriesOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
  ];

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const formations: Formation[] = await getAllFormations();
        if (!Array.isArray(formations) || formations.length === 0) {
          setFormationData([]);
          return;
        }
        const formatted: FormationDisplay[] = formations.map((formation) => ({
          id: formation.id,
          theme: formation.theme,
          lieu: formation.lieu,
          type: formation.type,
          formateurNom: formation.formateur ? formation.formateur.nomFormateur : "N/A",
          statut: formation.statut,
          dateDebut: formation.dateDebut
            ? new Date(formation.dateDebut).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
          dateFin: formation.dateFin
            ? new Date(formation.dateFin).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
        }));
        setFormationData(formatted);
      } catch (error) {
        console.error("Erreur lors du chargement des formations :", error);
        setFormationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const filteredData = useMemo(() => {
    return formationData.filter((item) =>
      item.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.statut.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, formationData]);

  const totalPages = Math.ceil(filteredData.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  const showingText = `Affichage de ${startIndex + 1} à ${Math.min(endIndex, filteredData.length)} sur ${filteredData.length} entrées`;

  // Fonction suppression API + mise à jour UI
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette formation ?");
    if (!confirm) return;

    try {
      await deleteFormation(id);  // Appelle ton endpoint DELETE (à créer si pas encore fait)
      // Supprime localement sans recharger toute la liste
      setFormationData((prev) => prev.filter((formation) => formation.id !== id));
      alert("Formation supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression de la formation.");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/formationDetails/${id}`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  if (loading) {
    return (
      <div className="text-center text-gray-700 dark:text-white py-10">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Afficher</span>
            <Select value={entriesPerPage} onChange={setEntriesPerPage} options={entriesOptions} />
            <span className="text-sm text-gray-600 dark:text-gray-400">entrées</span>
          </div>

          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Recherche..."
            className="sm:w-80"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              {["Thème", "Lieu", "Type", "Formateur", "Statut", "Date début", "Date fin", "Actions"].map((head, i) => (
                <TableCell
                  isHeader
                  key={i}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((formation, index) => (
                <TableRow
                  key={formation.id}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-800/50"
                  }`}
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {formation.theme}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formation.lieu}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-blue-600 dark:text-blue-400">
                    {formation.type}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formation.formateurNom}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formation.statut}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formation.dateDebut}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formation.dateFin}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(formation.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(formation.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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

export default FormationTable;
