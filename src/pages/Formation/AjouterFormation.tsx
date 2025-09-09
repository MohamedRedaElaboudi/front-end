import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormationForm from "../../components/form/formFormation/FormationForm";
import Button from "../../components/ui/button/Button";
import { ajouterFormateur, ajouterFormation } from "../../api/formationService";
import { ajouterParticipation } from "../../api/participationService";

export default function AjouterFormation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [selectedPersonnesConcernees, setSelectedPersonnesConcernees] = useState<number[]>([]);

  const handleFormationSubmit = async () => {
    if (!formData) {
      alert("Veuillez remplir le formulaire avant de soumettre.");
      return;
    }

    try {
      let formateurId = formData.formateur?.id;

      // Création du formateur si nouveau
      if (!formateurId) {
        const formateur = await ajouterFormateur({
          cneFormateur: formData.formateur.cneFormateur,
          nomFormateur: formData.formateur.nomFormateur,
          typeFormateur: formData.formateur.typeFormateur,
        });
        formateurId = formateur.id;
      }

      // Création de la formation
      const formation = await ajouterFormation({
        theme: formData.theme,
        lieu: formData.lieu,
        type: formData.type,
        statut: formData.statut,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        formateur: { id: formateurId },
        service: { id: formData.service.id },
      });

      // Ajouter participations
      if (selectedPersonnesConcernees.length > 0) {
        await Promise.all(
          selectedPersonnesConcernees.map((id) =>
            ajouterParticipation({ employe: { id }, formation: { id: formation.id } })
          )
        );
      }

      alert("Formation ajoutée avec succès !");
      navigate("/formation");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout de la formation");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <PageMeta title="Ajouter Formation" description="Page d'ajout de formation" />
      <PageBreadcrumb pageTitle="Ajouter Formation" />

      <div className="max-w-4xl mx-auto mt-6 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <FormationForm
          onDataChange={setFormData}
          onSelectedEmployeesChange={setSelectedPersonnesConcernees}
        />

        <div className="m-6 flex justify-center">
          <Button onClick={handleFormationSubmit}>Ajouter Formation</Button>
        </div>
      </div>
    </div>
  );
}
