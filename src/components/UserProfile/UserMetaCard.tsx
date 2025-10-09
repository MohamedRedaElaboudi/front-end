import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";

import {
  getResponsableByEmail,
  updateResponsable,
  Responsable,
} from "../../api/responsableService";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { email } = useAuth(); // Récupère l'email depuis le contexte

  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger le responsable connecté par email
  useEffect(() => {
    if (!email) {
      console.error("Email non disponible");
      setLoading(false);
      return;
    }

    const fetchResponsable = async () => {
      try {
        const data = await getResponsableByEmail(email);
        setResponsable(data);
      } catch (err) {
        console.error("Erreur récupération responsable:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsable();
  }, [email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!responsable) return;
    setResponsable({ ...responsable, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!responsable) return;
    try {
      setSaving(true);
      const updated = await updateResponsable(responsable.id, responsable);
      setResponsable(updated);
      closeModal();
    } catch (err) {
      console.error("Erreur mise à jour responsable:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4 text-center">Chargement...</p>;
  if (!responsable) return <p className="p-4 text-center text-red-500">Aucun responsable trouvé</p>;

  return (
    <>
      {/* Carte utilisateur */}
      <div className="p-6 border rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold shadow">
            {responsable.prenom.charAt(0)}
          </div>
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

      {/* Modal édition */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl m-4 p-7">
        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Modifier mes informations</h4>
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input name="prenom" value={responsable.prenom} onChange={handleChange} />
            </div>
            <div>
              <Label>Nom</Label>
              <Input name="nom" value={responsable.nom} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={responsable.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input name="telephone" value={responsable.telephone || ""} onChange={handleChange} />
          </div>
          <div>
            <Label>Fonction</Label>
            <Input name="fonction" value={responsable.fonction || ""} onChange={handleChange} />
          </div>
        </form>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={closeModal}>Annuler</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement..." : "Sauvegarder"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
