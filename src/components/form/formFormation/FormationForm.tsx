import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker";
import SelectDataTable from "../../../pages/Tables/SelctDataTable";

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

  const [cneFormateur, setCneFormateur] = useState("");
  const [nomFormateur, setNomFormateur] = useState("");
  const [typeFormateur, setTypeFormateur] = useState("");

  const formateurTypeOptions = [
    { value: "interne", label: "Interne" },
    { value: "externe", label: "Externe" },
  ];

  useEffect(() => {
    onDataChange({
      theme,
      lieu,
      type,
      statut,
      dateDebut,
      dateFin,
      cneFormateur,
      nomFormateur,
      typeFormateur,
    });
  }, [
    theme,
    lieu,
    type,
    statut,
    dateDebut,
    dateFin,
    cneFormateur,
    nomFormateur,
    typeFormateur,
    onDataChange,
  ]);

  return (
    <ComponentCard title="Informations de la formation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="theme">Thème</Label>
          <Input
            type="text"
            id="theme"
            placeholder="Veuillez saisir le thème"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="lieu">Lieu</Label>
          <Input
            type="text"
            id="lieu"
            placeholder="ex: Casablanca"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            type="text"
            id="type"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="statut">Statut</Label>
          <Input
            type="text"
            id="statut"
            placeholder="EN_COURS_DE_VALIDATION"
            disabled
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            required
          />
        </div>

        <div>
          <DatePicker
            id="date-debut"
            label="Date de début"
            placeholder="Sélectionner une date"
            onChange={(dates, currentDateString) => setDateDebut(currentDateString)}
            required
          />
        </div>

        <div>
          <DatePicker
            id="date-fin"
            label="Date de fin"
            placeholder="Sélectionner une date"
            onChange={(dates, currentDateString) => setDateFin(currentDateString)}
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 relative">
          <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 text-md font-semibold text-gray-700 dark:text-gray-200">
            Informations du Formateur
          </span>
        </div>

        <div>
          <Label htmlFor="cne_formateur">CNE Formateur</Label>
          <Input
            type="text"
            id="cne_formateur"
            placeholder="Veuillez saisir le CNE du formateur"
            value={cneFormateur}
            onChange={(e) => setCneFormateur(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="nom_formateur">Nom Formateur</Label>
          <Input
            type="text"
            id="nom_formateur"
            placeholder="Veuillez saisir le nom du formateur"
            value={nomFormateur}
            onChange={(e) => setNomFormateur(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="type_formateur">Type Formateur</Label>
          <Select
            options={formateurTypeOptions}
            onChange={(value) => setTypeFormateur(value)}
            placeholder="Choisir le type de formateur"
            value={typeFormateur}
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 relative">
          <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 text-md font-semibold text-gray-700 dark:text-gray-200">
            Personnes concernées
          </span>
        </div>
      </div>

      <SelectDataTable onSelectionChange={onSelectedEmployeesChange} />
    </ComponentCard>
  );
}
