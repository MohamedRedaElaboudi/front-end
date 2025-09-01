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
      // Création du formateur
      const formateur = await ajouterFormateur({
        cneFormateur: formData.cneFormateur,
        nomFormateur: formData.nomFormateur,
        typeFormateur: formData.typeFormateur,
      });

      // Création de la formation
      const formation = await ajouterFormation({
        theme: formData.theme,
        lieu: formData.lieu,
        type: formData.type,
        statut: formData.statut,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        formateur: { id: formateur.id },
      });

      // Ajout des participations
      if (selectedPersonnesConcernees.length > 0) {
        const promises = selectedPersonnesConcernees.map((participantId) =>
          ajouterParticipation({
            employe: { id: participantId },
            formation: { id: formation.id },
          })
        );
        await Promise.all(promises);
      }

      alert("Formation, formateur et participations ajoutés avec succès !");
      navigate("/formation");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <PageMeta title="Ajouter Formation" description="Page d'ajout de formation" />

      {/* Breadcrumb en haut de page */}
      <PageBreadcrumb pageTitle="Ajouter Formation" />

      {/* Carte contenant le formulaire */}
      <div className="max-w-4xl mx-auto mt-6 rounded-2xl border border-gray-200 bg-white  shadow-lg dark:border-gray-800 dark:bg-gray-900">
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
