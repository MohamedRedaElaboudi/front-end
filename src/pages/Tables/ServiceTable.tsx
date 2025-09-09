import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/Table';
import Button from './ui/Button';
import Select from './ui/Select';
import SearchInput from './ui/SearchInput';
import Pagination from './ui/Pagination';
import { Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getAllServices, deleteService } from '../../api/serviceService';

const ServiceTable = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<{id:number, nom:string, description:string, domaine?:string}[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const entriesOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServiceData(data);
      } catch (err) {
        console.error('Erreur chargement services', err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return serviceData.filter(s =>
      s.nom.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower)
    );
  }, [serviceData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  const showingText = `Affichage de ${startIndex + 1} à ${Math.min(endIndex, filteredData.length)} sur ${filteredData.length} services`;

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer ce service ?")) {
      try {
        await deleteService(id);
        setServiceData(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error('Erreur suppression', err);
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/serviceDetails/${id}`);
  };

  return (
    <div className={`transition-colors duration-200 dark:bg-gray-900 bg-gray-50`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Afficher</span>
            <Select
              value={entriesPerPage}
              onChange={setEntriesPerPage}
              options={entriesOptions}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">entrées</span>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Recherche par nom ou description..."
            className="sm:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                {["Nom", "Description", "Actions"].map((col, i) => (
                  <TableCell
                    isHeader
                    key={i}
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
                  <TableCell className="text-center py-4 text-gray-500 dark:text-gray-400" colSpan={3}>
                    Aucun service trouvé.
                  </TableCell>
                </TableRow>
              ) : currentData.map(s => (
                <TableRow
                  key={s.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Nom + Domaine */}
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {s.nom} - {s.domaine && s.domaine.trim() !== "" ? s.domaine : "Général"}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {s.description}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(s.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
};

export default ServiceTable;
