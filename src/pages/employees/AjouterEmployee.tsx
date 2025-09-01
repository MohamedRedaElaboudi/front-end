import { useRef } from "react";
import EmployeeForm, { EmployeeFormHandles } from "../../components/form/formperso/EmployeeForm";

export default function AjouterEmployee() {
  const formRef = useRef<EmployeeFormHandles>(null);

  const handleClick = () => {
    formRef.current?.submit();
  };

  return (
    <>
      <EmployeeForm ref={formRef} />
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ajouter l'employé
        </button>
      </div>
    </>
  );
}
