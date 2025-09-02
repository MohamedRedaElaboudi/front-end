import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  getFormationById,
  updateFormation,
  getAllFormateurs,
} from "../../api/formationService";
import { FormulairesService } from "../../api/formulaireService";
import ParticipantsTable from "../../pages/Tables/ParticipantsTablefold/ParticipantsTable";
import SelectDataTable from "../../pages/Tables/SelctDataTable";
import { ajouterParticipation } from "../../api/participationService";

export default function FormationCard({ formationId }: { formationId: number }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [formation, setFormation] = useState<any>(null);
  const [formulaire, setFormulaire] = useState<any>(null);
  const [formateurs, setFormateurs] = useState<any[]>([]);

  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [editedFormation, setEditedFormation] = useState<any>({});

  // Ouvrir / fermer modals
  const openModal = () => { setEditedFormation({ ...formation }); setIsOpen(true); };
  const closeModal = () => setIsOpen(false);
  const openParticipantModal = () => setIsParticipantModalOpen(true);
  const closeParticipantModal = () => setIsParticipantModalOpen(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [formationData, formulaireData, formateursData] = await Promise.all([
          getFormationById(formationId),
          FormulairesService.getByFormationId(formationId),
          getAllFormateurs(),
        ]);

        setFormation(formationData);
        setFormulaire(formulaireData);
        setFormateurs(formateursData);
      } catch (error) {
        console.error("Erreur chargement formation ou formulaire", error);
      }
    }
    fetchData();
  }, [formationId]);

  const handleSave = async () => {
    try {
      const updated = await updateFormation(formationId, editedFormation);
      setFormation(updated);
      closeModal();
      alert("Formation mise à jour avec succès !");
    } catch (error: any) {
      console.error("Erreur sauvegarde formation", error);
      alert(`Erreur lors de la sauvegarde : ${error.message || error}`);
    }
  };

  const handleSaveParticipants = async () => {
    try {
      if (selectedParticipantIds.length === 0) {
        alert("Veuillez sélectionner au moins un participant.");
        return;
      }
      await Promise.all(
        selectedParticipantIds.map((participantId) =>
          ajouterParticipation({ employe: { id: participantId }, formation: { id: formationId } })
        )
      );
      alert("Participants ajoutés avec succès !");
      closeParticipantModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des participants", error);
      alert("Erreur lors de l'enregistrement des participants");
    }
  };

  if (!formation) return <div>Chargement...</div>;

  const statut = formation.statut?.toLowerCase() || "";

  const isFormationTomorrow = () => {
    if (!formation.dateDebut) return false;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const debutStr = new Date(formation.dateDebut).toISOString().split("T")[0];
    return debutStr === tomorrowStr;
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 space-y-6">
        {/* Header + boutons */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {formation.theme}
          </h4>

          <div className="flex flex-wrap gap-2">
            {(statut === "en_cours_de_validation" || statut === "non_valide" || statut === "valide") && (
              <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
                Modifier
              </Button>
            )}

            {statut === "valide" && (
              <>
                <Button
                  onClick={() => navigate("/emailBuilder/" + formationId)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Envoyer des invitations
                </Button>
                {isFormationTomorrow() && (
                  <Button
                    onClick={() => navigate(`/FichePresence/${formationId}`)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Liste de présence
                  </Button>
                )}
              </>
            )}

            {statut === "termine" && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <Button
                  onClick={() => navigate(`/listePresence/${formationId}`)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Voir la liste de présence
                </Button>
                <Button
                  onClick={() => navigate(`/statistiqueformation/${formationId}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Voir statistiques
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Infos formation */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {[
            { label: "Thème", value: formation.theme },
            { label: "Lieu", value: formation.lieu },
            { label: "Type", value: formation.type },
            { label: "Statut", value: formation.statut },
            { label: "Date début", value: formation.dateDebut },
            { label: "Date fin", value: formation.dateFin },
            { label: "Formateur", value: formation.formateur?.nomFormateur },
          ].map(({ label, value }, i) => (
            <div key={i}>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
            </div>
          ))}
        </div>

        {/* Formulaire formation si terminé */}
        {statut === "termine" && formulaire && (
          <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Label className="min-w-[150px]">Formulaire de la formation :</Label>
            <Input
              type="text"
              value={`${window.location.origin}/evaluationformationachaud/${formationId}`}
              disabled
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            />
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/evaluationformationachaud/${formationId}`);
                alert("Lien copié !");
              }}
            >
              Copier
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.open(`${window.location.origin}/evaluationformationachaud/${formationId}`, "_blank")}
            >
              Ouvrir
            </Button>
          </div>
        )}

        {/* Ajouter Participants */}
        {(statut === "valide" || statut === "en_cours_de_validation" || statut === "non_valide") && (
          <Button onClick={openParticipantModal} className="bg-green-600 hover:bg-green-700 mb-4">
            Ajouter Participants
          </Button>
        )}

        {/* Liste participants */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-6 mb-6">
          Liste des Participants
        </h2>
        <ParticipantsTable id={formationId} statut={formation.statut} />
      </div>

      {/* Modal update formation */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Modifier la formation
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Modifiez les informations ci-dessous.
          </p>

          <form
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
          >
            <div>
              <Label>Thème</Label>
              <Input
                value={editedFormation.theme || ""}
                onChange={(e) => setEditedFormation({ ...editedFormation, theme: e.target.value })}
              />
            </div>
            <div>
              <Label>Lieu</Label>
              <Input
                value={editedFormation.lieu || ""}
                onChange={(e) => setEditedFormation({ ...editedFormation, lieu: e.target.value })}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={editedFormation.type || ""}
                onChange={(e) => setEditedFormation({ ...editedFormation, type: e.target.value })}
              />
            </div>
            <div>
              <Label>Date début</Label>
              <Input
                type="date"
                value={editedFormation.dateDebut?.split("T")[0] || ""}
                onChange={(e) => setEditedFormation({ ...editedFormation, dateDebut: e.target.value })}
              />
            </div>
            <div>
              <Label>Date fin</Label>
              <Input
                type="date"
                value={editedFormation.dateFin?.split("T")[0] || ""}
                onChange={(e) => setEditedFormation({ ...editedFormation, dateFin: e.target.value })}
              />
            </div>
            <div>
              <Label>Formateur</Label>
              <select
                value={editedFormation.formateur?.id || ""}
                onChange={(e) =>
                  setEditedFormation({
                    ...editedFormation,
                    formateur: formateurs.find((f) => f.id === parseInt(e.target.value)),
                  })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Sélectionner un formateur --</option>
                {formateurs.map((f) => (
                  <option key={f.id} value={f.id}>{f.nomFormateur}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Statut</Label>
              <Input value={editedFormation.statut || ""} disabled />
            </div>

            <div className="flex items-center gap-3 mt-4 lg:col-span-2 justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>Annuler</Button>
              <Button size="sm">Enregistrer</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal ajout participants */}
      <Modal
        isOpen={isParticipantModalOpen}
        onClose={closeParticipantModal}
        className="max-w-[70%] min-h-[70%] m-auto p-0"
      >
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Sélectionner les participants
            </h3>
            <button
              onClick={closeParticipantModal}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6 flex-1 overflow-y-auto">
            <SelectDataTable onSelectionChange={setSelectedParticipantIds} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button size="sm" variant="outline" onClick={closeParticipantModal}>
              Annuler
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSaveParticipants}>
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
