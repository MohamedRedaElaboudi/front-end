import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ServiceForm from "../../components/form/service-form/ServiceForm";
import Button from "../../components/ui/button/Button";
import { createService } from "../../api/serviceService";
import { useNavigate } from "react-router";

export default function AjouterService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ nom: string; description: string } | null>(null);

  const handleServiceSubmit = async () => {
    if (!formData?.nom || !formData?.description) {
      alert("Veuillez remplir tous les champs avant de soumettre.");
      return;
    }

    try {
      await createService({
        nom: formData.nom,
        domaine: "Général", 
        description: formData.description,
      });

      alert("Service ajouté avec succès !");
      navigate("/services"); // Redirection vers la liste des services
    } catch (error) {
      console.error("Erreur lors de l'ajout du service :", error);
      alert("Erreur lors de l'ajout du service");
    }
  };

  return (
    <div>
      <PageMeta title="Ajouter Service" description="Page d'ajout d'un service" />
      <PageBreadcrumb pageTitle="Ajouter Service" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="text-center">
          <ServiceForm onDataChange={(data) => setFormData(data)} />
          <div className="my-4 mx-auto flex justify-center">
            <Button onClick={handleServiceSubmit}>Ajouter Service</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
