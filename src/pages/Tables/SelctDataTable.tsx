import React, { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/Table";
import Select from "./ui/Select";
import SearchInput from "./ui/SearchInput";
import Pagination from "./ui/Pagination";
import { getAllEmployees } from "../../api/employeeService";

type SelectDataTableProps = {
  onSelectionChange?: (selectedIds: number[]) => void;
};

const SelectDataTable = ({ onSelectionChange }: SelectDataTableProps) => {
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const entriesOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        const employeesArray = Array.isArray(data) ? data : data.data ?? [];
        setEmployeeData(employeesArray);
      } catch (err) {
        console.error("Erreur chargement employés", err);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, entriesPerPage]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds);
    }
  }, [selectedIds, onSelectionChange]);

  const filteredData = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return employeeData.filter(
      (emp) =>
        `${emp.nom} ${emp.prenom}`.toLowerCase().includes(lower) ||
        (emp.cne ?? "").toLowerCase().includes(lower) ||
        (emp.email ?? "").toLowerCase().includes(lower) ||
        (emp.fonction ?? "").toLowerCase().includes(lower) ||
        (emp.service?.nom ?? "").toLowerCase().includes(lower)
    );
  }, [employeeData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  const showingText = `Affichage de ${startIndex + 1} à ${Math.min(
    endIndex,
    filteredData.length
  )} sur ${filteredData.length} employés`;

  const allSelected =
    selectedIds.length === currentData.length && currentData.length > 0;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(currentData.map((emp) => emp.id));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm">Afficher</span>
          <Select
            value={entriesPerPage}
            onChange={setEntriesPerPage}
            options={entriesOptions}
          />
          <span className="text-gray-600 dark:text-gray-400 text-sm">entrées</span>
        </div>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Recherche..."
          className="sm:w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-300 dark:border-gray-700">
              <TableCell className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-blue-600"
                />
              </TableCell>
              {[
                "Nom complet",
                "CNE",
                "Email",
                "Fonction",
                "Service",
                "Date recrutement",
              ].map((col, idx) => (
                <TableCell
                  key={idx}
                  isHeader
                  className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left"
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  Aucun employé trouvé.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((emp) => (
                <TableRow
                  key={emp.id}
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(emp.id)}
                      onChange={() => toggleSelectOne(emp.id)}
                      className="accent-blue-600"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                    {emp.nom} {emp.prenom}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {emp.cne}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {emp.email}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {emp.fonction ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-blue-600 dark:text-blue-400">
                    {emp.service?.nom ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-gray-600 dark:text-gray-300">
                    {emp.dateRecrutement}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 border-t border-gray-300 dark:border-gray-700 px-6 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">{showingText}</div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SelectDataTable;
