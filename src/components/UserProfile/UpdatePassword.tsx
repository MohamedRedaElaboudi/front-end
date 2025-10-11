import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { getResponsableByEmail, updatePassword, Responsable } from "../../api/responsableService";

export default function ChangePasswordCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { email } = useAuth();
  const [responsable, setResponsable] = useState<Responsable | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ancienMotDePass, setAncienMotDePass] = useState("");
  const [nouveauMotDePass, setNouveauMotDePass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // ✅ Gérer la sauvegarde du mot de passe
  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!ancienMotDePass || !nouveauMotDePass) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      setSaving(true);

      // 🔹 Appel API pour changer le mot de passe
      await updatePassword(ancienMotDePass, nouveauMotDePass);
      setSuccess("Mot de passe mis à jour avec succès !");
      setAncienMotDePass("");
      setNouveauMotDePass("");
      setTimeout(closeModal, 1500);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", err);
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la mise à jour du mot de passe"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!responsable) return <p className="p-4 text-red-500">Aucun responsable trouvé</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Changer le mot de passe
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour votre mot de passe ici.
          </p>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 lg:w-auto"
        >
          Modifier le mot de passe
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Nouveau mot de passe
          </h4>

          {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
          {success && <p className="mb-2 text-sm text-green-600">{success}</p>}

          <div className="flex flex-col gap-4">
            <InputField
              label="Ancien mot de passe"
              value={ancienMotDePass}
              onChange={(e) => setAncienMotDePass(e.target.value)}
            />
            <InputField
              label="Nouveau mot de passe"
              value={nouveauMotDePass}
              onChange={(e) => setNouveauMotDePass(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 mt-6 justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Fermer
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ✅ Sous-composant Input
function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="password"
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
