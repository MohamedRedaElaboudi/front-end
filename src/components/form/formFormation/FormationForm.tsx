import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker";
import SelectDataTable from "../../../pages/Tables/SelctDataTable";
import { getAllServices, Service } from "../../../api/serviceService";
import { getAllFormateurs } from "../../../api/formationService";

export default function FormationForm({
  onDataChange,
  onSelectedEmployeesChange,
}: {
  onDataChange: (data: any) => void;
  onSelectedEmployeesChange: (ids: number[]) => void;
}) {
  const [theme, setTheme] = useState("");
  const [lieu, setLieu] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("EN_COURS_DE_VALIDATION");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  // Service
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [serviceOptions, setServiceOptions] = useState<{ value: number; label: string }[]>([]);

  // Formateur
  const [formateurId, setFormateurId] = useState<number | null>(null);
  const [formateurOptions, setFormateurOptions] = useState<{ value: number; label: string }[]>([]);
  const [cneFormateur, setCneFormateur] = useState("");
  const [nomFormateur, setNomFormateur] = useState("");
  const [typeFormateur, setTypeFormateur] = useState("");
  const [useExistingFormateur, setUseExistingFormateur] = useState(true); // switch

  const formateurTypeOptions = [
    { value: "interne", label: "Interne" },
    { value: "externe", label: "Externe" },
  ];

  // Récupération services et formateurs
  useEffect(() => {
    async function fetchData() {
      try {
        const services: Service[] = await getAllServices();
        setServiceOptions(
          services.map((s) => ({ value: s.id, label: `${s.nom} - ${s.domaine}` }))
        );

        const formateurs = await getAllFormateurs();
        setFormateurOptions(
          formateurs.map((f) => ({
            value: f.id,
            label: `${f.nomFormateur} (${f.typeFormateur})`,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // Mise à jour parent
  useEffect(() => {
    onDataChange({
      theme,
      lieu,
      type,
      statut,
      dateDebut,
      dateFin,
      service: serviceId ? { id: serviceId } : null,
      formateur: useExistingFormateur
        ? formateurId
          ? { id: formateurId }
          : null
        : cneFormateur && nomFormateur && typeFormateur
        ? { cneFormateur, nomFormateur, typeFormateur }
        : null,
    });
  }, [
    theme,
    lieu,
    type,
    statut,
    dateDebut,
    dateFin,
    serviceId,
    formateurId,
    cneFormateur,
    nomFormateur,
    typeFormateur,
    useExistingFormateur,
    onDataChange,
  ]);

  return (
    <ComponentCard title="Informations de la formation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thème */}
        <div>
          <Label htmlFor="theme">Thème</Label>
          <Input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Veuillez saisir le thème"
            required
          />
        </div>

        {/* Lieu */}
        <div>
          <Label htmlFor="lieu">Lieu</Label>
          <Input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            placeholder="ex: Casablanca"
            required
          />
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            required
          />
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Input type="text" value={statut} disabled />
        </div>

        {/* Dates */}
        <div>
          <DatePicker id="date-debut" label="Date de début" onChange={(_, val) => setDateDebut(val)} />
        </div>
        <div>
          <DatePicker id="date-fin" label="Date de fin" onChange={(_, val) => setDateFin(val)} />
        </div>

        {/* Service */}
        <div>
          <Label htmlFor="service">Service</Label>
          <Select
            options={serviceOptions}
            value={serviceId || ""}
            onChange={(val) => setServiceId(val)}
            placeholder="Choisir un service"
            required
          />
        </div>

        {/* Switch Formateur */}
        <div className="col-span-1 md:col-span-2 flex gap-4 mt-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              useExistingFormateur ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setUseExistingFormateur(true)}
          >
            Formateur existant
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              !useExistingFormateur ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setUseExistingFormateur(false)}
          >
            Ajouter nouveau formateur
          </button>
        </div>

        {/* Formateur existant */}
        {useExistingFormateur && (
          <div>
            <Label>Choisir formateur</Label>
            <Select
              options={formateurOptions}
              value={formateurId || ""}
              onChange={(val) => setFormateurId(val)}
              placeholder="Sélectionner un formateur"
            />
          </div>
        )}

        {/* Nouveau formateur */}
        {!useExistingFormateur && (
          <>
            <div>
              <Label>CNE Formateur</Label>
              <Input
                value={cneFormateur}
                onChange={(e) => setCneFormateur(e.target.value)}
                placeholder="CNE"
                required
              />
            </div>
            <div>
              <Label>Nom Formateur</Label>
              <Input
                value={nomFormateur}
                onChange={(e) => setNomFormateur(e.target.value)}
                placeholder="Nom"
                required
              />
            </div>
            <div>
              <Label>Type Formateur</Label>
              <Select
                options={formateurTypeOptions}
                value={typeFormateur}
                onChange={(val) => setTypeFormateur(val)}
                placeholder="Interne ou Externe"
                required
              />
            </div>
          </>
        )}

        {/* Personnes concernées */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <SelectDataTable onSelectionChange={onSelectedEmployeesChange} />
        </div>
      </div>
    </ComponentCard>
  );
}
