import React, { useState, useEffect } from "react";
import { getServiceById, createService } from "../../api/serviceService";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { X } from "lucide-react"; // icône croix pour supprimer

export default function ServiceCard({ serviceId }: { serviceId: number }) {
  const [service, setService] = useState<any>(null);
  const [newDomaines, setNewDomaines] = useState<string[]>([""]);

  useEffect(() => {
    async function fetchData() {
      try {
        const serviceData = await getServiceById(serviceId);
        setService(serviceData);
      } catch (error) {
        console.error("Erreur chargement service", error);
      }
    }
    fetchData();
  }, [serviceId]);

  const handleAddDomaineInput = () => setNewDomaines([...newDomaines, ""]);

  const handleNewDomaineChange = (index: number, value: string) => {
    const updated = [...newDomaines];
    updated[index] = value;
    setNewDomaines(updated);
  };

  const handleRemoveDomaine = (index: number) => {
    const updated = [...newDomaines];
    updated.splice(index, 1);
    setNewDomaines(updated.length ? updated : [""]); // toujours au moins un input vide
  };

  const handleCreateNewServices = async () => {
    if (!service) return;
    const domainesValides = newDomaines.filter(d => d.trim() !== "");
    if (domainesValides.length === 0) {
      alert("Veuillez saisir au moins un domaine.");
      return;
    }

    try {
      for (const domaine of domainesValides) {
        await createService({
          nom: service.nom,
          description: service.description,
          domaine: domaine,
        });
      }
      alert("Nouveau(x) service(s) créé(s) avec succès !");
      setNewDomaines([""]);
    } catch (error) {
      console.error("Erreur création service", error);
      alert("Erreur lors de la création des services");
    }
  };

  if (!service) return <div>Chargement...</div>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-700">
      {/* Nom et description */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{service.nom}</h3>
      <p className="text-gray-500 dark:text-gray-300 mb-4">{service.description}</p>

      {/* Domaines existants */}
      {service.domaine && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Domaines existants :</h4>
          <div className="flex flex-wrap gap-2">
            {service.domaine.split(",").map((d: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-white"
              >
                {d.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nouveaux domaines */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Ajouter de nouveaux domaines :</h4>
        <div className="flex flex-col gap-2 mb-3">
          {newDomaines.map((domaine, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={`Nouveau domaine ${index + 1}`}
                value={domaine}
                onChange={(e) => handleNewDomaineChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveDomaine(index)}
                className="p-2 text-gray-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAddDomaineInput}>
            + Ajouter un domaine
          </Button>
          <Button size="sm" onClick={handleCreateNewServices}>
            Créer Services
          </Button>
        </div>
      </div>
    </div>
  );
}
