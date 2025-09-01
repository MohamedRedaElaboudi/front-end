import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { getServiceById, updateService } from "../../api/serviceService";

export default function ServiceCard({ serviceId }: { serviceId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState<any>(null);
  const [form, setForm] = useState({ nom: "", description: "" });
  const [errors, setErrors] = useState<{ nom?: string; description?: string }>({});

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setErrors({});
    setIsOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const serviceData = await getServiceById(serviceId);
        setService(serviceData);
        setForm({
          nom: serviceData.nom,
          description: serviceData.description,
        });
      } catch (error) {
        console.error("Erreur chargement service", error);
      }
    }
    fetchData();
  }, [serviceId]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validation simple
  const validate = () => {
    const newErrors: { nom?: string; description?: string } = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!form.description.trim()) newErrors.description = "La description est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return; // Stop si invalid

    try {
      const updated = await updateService(serviceId, {
        nom: form.nom,
        description: form.description,
      });
      setService(updated);
      closeModal();
      alert("Service mis à jour avec succès !");
    } catch (error: any) {
      console.error("Erreur sauvegarde service", error);
      alert(`Erreur lors de la sauvegarde : ${error.message || error}`);
    }
  };

  if (!service) return <div>Chargement...</div>;

  return (
    <>
      {/* Carte service */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          {service.nom}
        </h4>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Nom</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{service.nom}</p>
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Description</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{service.description}</p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Modifier
        </button>
      </div>

      {/* Modal modification */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-8">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Modifier le service
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Mettez à jour les informations du service.
          </p>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-y-5">
              <div>
                <Label>Nom</Label>
                <Input
                  type="text"
                  value={form.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
