import React from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ServiceCard from "../../components/ServiceDetails/ServiceCard"; // <-- ton nouveau composant ServiceCard

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>ID de service manquant dans l'URL.</p>;
  }

  const serviceId = parseInt(id, 10);

  return (
    <>
      <PageMeta
        title={`Détails du service #${serviceId}`}
        description={`Détails et modification du service ID ${serviceId}`}
      />
      <PageBreadcrumb pageTitle="Détails Service" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="space-y-6">
          <ServiceCard serviceId={serviceId} />
        </div>
      </div>
    </>
  );
}
