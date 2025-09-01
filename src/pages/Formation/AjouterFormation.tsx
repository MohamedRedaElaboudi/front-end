import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormationForm from "../../components/form/formFormation/FormationForm"
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

      // Ajout des participations pour chaque employé sélectionné
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
    <div>
      <PageMeta title="Ajouter Formation" description="Page d'ajout de formation" />
      <PageBreadcrumb pageTitle="Ajouter Formation" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="text-center">
          <FormationForm
            onDataChange={setFormData}
            onSelectedEmployeesChange={setSelectedPersonnesConcernees}
          />
          <div className="my-4 mx-auto flex justify-center">
            <Button onClick={handleFormationSubmit}>Ajouter Formation</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
