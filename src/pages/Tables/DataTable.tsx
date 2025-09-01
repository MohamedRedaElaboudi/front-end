import  { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/Table';
import Button from './ui/Button';
import Select from './ui/Select';
import SearchInput from './ui/SearchInput';
import Pagination from './ui/Pagination';
import { Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getAllEmployees, deleteEmployee } from '../../api/employeeService';

const DataTable = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState<any[]>([]);
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
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployeeData(data);
      } catch (err) {
        console.error('Erreur chargement employés', err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return employeeData.filter(emp =>
      (emp.nom + ' ' + emp.prenom).toLowerCase().includes(lower) ||
      emp.cne.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower) ||
      (emp.fonction ?? '').toLowerCase().includes(lower) ||
      (emp.service?.nom ?? '').toLowerCase().includes(lower)
    );
  }, [employeeData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  const showingText = `Affichage de ${startIndex + 1} à ${Math.min(endIndex, filteredData.length)} sur ${filteredData.length} employés`;

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cet employé ?")) {
      try {
        await deleteEmployee(id);
        setEmployeeData(prev => prev.filter(emp => emp.id !== id));
      } catch (err) {
        console.error('Erreur suppression', err);
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/employeProfile/${id}`);
  };

  return (
    <div className="bg-white transition-colors duration-200">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Afficher</span>
            <Select
              value={entriesPerPage}
              onChange={setEntriesPerPage}
              options={entriesOptions}
            />
            <span className="text-sm text-gray-600">entrées</span>
          </div>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Recherche..."
            className="sm:w-80"
          />
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                {["Nom complet", "CIN", "Email", "Fonction", "Service", "Date recrutement", "Actions"].map((col, i) => (
                  <TableCell
                    isHeader
                    key={i}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell  className="text-center py-4 text-gray-500">
                    Aucun employé trouvé.
                  </TableCell>
                </TableRow>
              ) : currentData.map(emp => (
                <TableRow
                  key={emp.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-900">
                    {emp.nom} {emp.prenom}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">{emp.cne}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">{emp.email}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">{emp.fonction ?? '-'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-blue-600">{emp.service?.nom ?? '-'}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600">{emp.dateRecrutement}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(emp.id)}
                        className="p-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(emp.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50"
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

        <div className="px-6 py-4 border-t border-gray-200">
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

export default DataTable;
