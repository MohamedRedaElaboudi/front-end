import { useRef } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormationForm, { FormationFormRef } from "../../components/form/formFormation/FormationForm";
import { ajouterFormateur, ajouterFormation } from "../../api/formationService";
import { ajouterParticipation } from "../../api/participationService";
import { autoMarkPresences } from "../../api/presenceFormationService";

export default function AjouterFormation() {
  const navigate = useNavigate();
  const formRef = useRef<FormationFormRef>(null);

  const handleSubmit = async () => {
    if (!formRef.current) return alert("Formulaire incomplet");
    const data = formRef.current.getFormData();

    if (!data || !data.theme || !data.lieu || !data.type || !data.service) {
      return alert("Veuillez remplir toutes les informations obligatoires");
    }

    try {
      let formateurId = data.formateur?.id || null;

      // Ajouter formateur si nouveau
      if (!formateurId && data.formateur) {
        const formateur = await ajouterFormateur(data.formateur);
        formateurId = formateur.id;
      }

      // Ajouter formation
      const formation = await ajouterFormation({
        theme: data.theme,
        lieu: data.lieu,
        type: data.type,
        statut: data.statut,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        formateur: formateurId ? { id: formateurId } : null,
        service: { id: data.service.id },
      });

      // Ajouter participations
      if (data.employees?.length > 0) {
        await Promise.all(
          data.employees.map((emp: { id: number }) =>
            ajouterParticipation({ employe: { id: emp.id }, formation: { id: formation.id } })
          )
        );
      }

      // Marquer automatiquement les présences pour toutes les dates de la formation
const today = new Date();
const dateDebutFormation = new Date(data.dateDebut);
const dateFinFormation = new Date(data.dateFin);

if (dateFinFormation < today && data.employees?.length > 0) {
  const employeIds = data.employees.map((emp: { id: number }) => emp.id);

  const currentDate = new Date(dateDebutFormation);
  while (currentDate <= dateFinFormation) {
    const dateStr = currentDate.toISOString().split("T")[0]; // format YYYY-MM-DD
    await autoMarkPresences({
      formationId: formation.id,
      datePresence: dateStr,
      employeIds,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
}


      alert("Formation ajoutée avec succès !");
      navigate("/formation");
    } catch (err) {
      console.error("Erreur ajout formation:", err);
      alert("Erreur lors de l'ajout de la formation");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <PageMeta title="Ajouter Formation" description="Page d'ajout de formation" />
      <PageBreadcrumb pageTitle="Ajouter Formation" />

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <FormationForm ref={formRef} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}