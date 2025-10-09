import SelectDataTable from "../../../pages/Tables/SelctDataTable";
import Label from "../Label";

interface Employee {
  id: number;
  nom: string;
}

interface EmployeeSelectorProps {
  selected: Employee[];
  setSelected: (emps: Employee[]) => void;
}

export default function EmployeeSelector({ selected, setSelected }: EmployeeSelectorProps) {
  return (
    <div className="col-span-1 md:col-span-2 mt-4">
      <Label>Participants</Label>
      <div className="border border-gray-300 rounded-lg bg-gray-50">
        <SelectDataTable selected={selected} onSelectionChange={setSelected} />
      </div>
    </div>
  );
}