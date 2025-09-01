import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {
  getResponsableMe,
  updateResponsable,
  Responsable,
} from "../../api/responsableService";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger les données du responsable connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResponsableMe();
        setResponsable(data);
      } catch (error) {
        console.error("Erreur récupération responsable:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gérer changements de formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!responsable) return;
    const { name, value } = e.target;
    setResponsable({ ...responsable, [name]: value });
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!responsable) return;
    try {
      const updated = await updateResponsable(responsable.id, responsable);
      setResponsable(updated);
      closeModal();
    } catch (error) {
      console.error("Erreur mise à jour responsable:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border rounded-2xl dark:border-gray-800 text-center shadow-md">
        Chargement...
      </div>
    );
  }

  if (!responsable) {
    return (
      <div className="p-6 border rounded-2xl dark:border-gray-800 text-center shadow-md">
        Aucune donnée trouvée
      </div>
    );
  }

  return (
    <>
      {/* --- Carte utilisateur --- */}
      <div className="p-6 border rounded-2xl dark:border-gray-800 shadow-md bg-white dark:bg-gray-900 flex items-center justify-between hover:shadow-lg transition">
        <div className="flex items-center gap-4">
          {/* Avatar avec initiale */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold shadow">
            {responsable.prenom.charAt(0)}
          </div>

          {/* Infos utilisateur */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
              {responsable.prenom} {responsable.nom}
            </h4>
            <p className="text-sm text-gray-500">{responsable.fonction || "Responsable"}</p>
            <p className="text-sm text-gray-500">{responsable.email}</p>
            <p className="text-sm text-gray-500">{responsable.telephone || "Non renseigné"}</p>
          </div>
        </div>

        <Button onClick={openModal}>Modifier</Button>
      </div>

      {/* --- Modal d’édition --- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl m-4 p-7">
        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Modifier mes informations
        </h4>
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input
                name="prenom"
                value={responsable.prenom}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input
                name="nom"
                value={responsable.nom}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={responsable.email}
              onChange={handleChange}
            />
          </div>

        
        </form>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={closeModal}>
            Annuler
          </Button>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </div>
      </Modal>
    </>
  );
}
