// EmployeProfile.tsx
import React from "react";
import { useParams } from "react-router"; // <-- attention, c'est "react-router-dom"
import EmployeCard from "../../components/employeeProfile/EmployeCard";
import FormationInitialeCard from "../../components/employeeProfile/FormationInitial/FormationInitialCard";
import ExperienceProCard from "../../components/employeeProfile/ExperienceProCard/ExperienceProCard";

export default function EmployeProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Employé non trouvé</div>;

  const employeId = parseInt(id, 10); // <-- tu stockes l'id converti en number

  return (
    <>
      <div style={{ padding: 10 }}>
        <EmployeCard employeeId={employeId} />
      </div>

      <div style={{ padding: 10 }}>
        <FormationInitialeCard employeId={employeId} /> {/* corrigé */}
      </div>

      <div style={{ padding: 10 }}>
        <ExperienceProCard employeeId={employeId} /> {/* corrigé */}
      </div>
    </>
  );
}
