// EmployeProfile.tsx
import React from "react";
import { useParams } from "react-router-dom"; // ✅ correction ici
import EmployeCard from "../../components/employeeProfile/EmployeCard";
import FormationInitialeCard from "../../components/employeeProfile/FormationInitial/FormationInitialCard";
import ExperienceProCard from "../../components/employeeProfile/ExperienceProCard/ExperienceProCard";
import FormationParticipationCard from "../../components/employeeProfile/FormationOrganiseCard/FormationParticipationCard";

export default function EmployeProfile() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Employé non trouvé</div>;

  const employeId = parseInt(id, 10);

  return (
    <>
      <div style={{ padding: 10 }}>
        <EmployeCard employeeId={employeId} />
      </div>

      <div style={{ padding: 10 }}>
        <FormationInitialeCard employeId={employeId} />
      </div>

      <div style={{ padding: 10 }}>
        <ExperienceProCard employeeId={employeId} />
      </div>

      <div style={{ padding: 10 }}>
        <FormationParticipationCard employeeId={employeId} />
      </div>
    </>
  );
}
