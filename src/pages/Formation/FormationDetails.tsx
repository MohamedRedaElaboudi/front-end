// src/pages/FormationDetails.tsx
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormationCard from "../../components/FormationDetails/FormationCard";
export default function FormationDetails() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>ID de formation manquant dans l'URL.</p>;
  }

  const formationId = parseInt(id, 10);

  return (
    <>
      <PageMeta
        title={`Détails de la formation #${formationId}`}
        description={`Détails et modification de la formation ID ${formationId}`}
      />
      <PageBreadcrumb pageTitle="Détails Formation" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="space-y-6">
          <FormationCard formationId={formationId} />
        </div>
      </div>
    </>
  );
}
