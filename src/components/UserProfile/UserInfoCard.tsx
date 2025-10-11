import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext"; 
import { getResponsableByEmail, updateResponsable, Responsable } from "../../api/responsableService";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { email } = useAuth();
  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Charger le responsable connecté
  useEffect(() => {
    if (email) {
      getResponsableByEmail(email)
        .then(setResponsable)
        .catch((err) => console.error("Erreur chargement responsable:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [email]);

  // ✅ Gérer le changement des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!responsable) return;
    setResponsable({ ...responsable, [e.target.name]: e.target.value });
  };

  // ✅ Sauvegarder avec le même rôle
  const handleSave = async () => {
    if (responsable && responsable.id) {
      try {
        setSaving(true);

        const updatedResponsable = {
          cne: responsable.cne || "",
          nom: responsable.nom,
          prenom: responsable.prenom,
          username: responsable.username,
          email: responsable.email,
          motDePasse:  "123456", // ca est ignoree
          role: "ROLE_RESPONSABLE", // 🔥 garde le même rôle
        };

        await updateResponsable(responsable.id, updatedResponsable);
        closeModal();
      } catch (err) {
        console.error("Erreur lors de la sauvegarde:", err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!responsable) return <p className="p-4 text-red-500">Aucun responsable trouvé</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informations personnelles
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <InfoItem label="Nom" value={responsable.nom} />
            <InfoItem label="Prénom" value={responsable.prenom} />
            <InfoItem label="Email" value={responsable.email} />
            <InfoItem label="Nom d'utilisateur" value={responsable.username || "N/A"} />
            <InfoItem label="Rôle" value={"ROLE_RESPONSABLE"} />
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 lg:w-auto"
        >
          Modifier
        </button>
      </div>

      {/* ✅ MODAL MODIFICATION */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Vous pouvez mettre à jour vos données personnelles ici.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <InputField label="Nom" name="nom" value={responsable.nom} onChange={handleChange} />
              <InputField label="Prénom" name="prenom" value={responsable.prenom} onChange={handleChange} />
              <InputField label="Email" name="email" value={responsable.email} onChange={handleChange} />
              <InputField label="Nom d'utilisateur" name="username" value={responsable.username || ""} onChange={handleChange} />
            </div>

            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Fermer
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

// ✅ Sous-composant d’affichage
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}

// ✅ Sous-composant pour les champs input
function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
