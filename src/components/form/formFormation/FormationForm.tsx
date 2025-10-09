import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { FaClipboardList, FaCalendarAlt, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Select from "../Select";
import DatePicker from "../date-picker";
import Label from "../Label";
import { getAllServices, Service } from "../../../api/serviceService";
import EmployeeSelector from "./EmployeeSelector";
import FormateurSelector from "./FormateurSelector";
import { motion, AnimatePresence } from "framer-motion";

export interface FormationFormRef {
  getFormData: () => any;
}

interface FormationFormProps {
  onSubmit?: () => void;
}

interface Employee {
  id: number;
  nom: string;
}

const FormationForm = forwardRef<FormationFormRef, FormationFormProps>((props, ref) => {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("");
  const [lieu, setLieu] = useState("");
  const [type, setType] = useState("");
  const [statut, setStatut] = useState("EN_COURS_DE_VALIDATION");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [serviceOptions, setServiceOptions] = useState<{ value: number; label: string }[]>([]);
  const [formateur, setFormateur] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [autoPresenceStep, setAutoPresenceStep] = useState(false);

  // --- Récupérer tous les services ---
  useEffect(() => {
    async function fetchData() {
      try {
        const services: Service[] = await getAllServices();
        setServiceOptions(
          services.map((s) => ({ value: s.id, label: `${s.nom} - ${s.domaine}` }))
        );
      } catch (err) {
        console.error("Erreur récupération services:", err);
      }
    }
    fetchData();
  }, []);

  // --- Vérifier si la date de fin est passée ---
  useEffect(() => {
    if (dateFin) {
      const today = new Date();
      const fin = new Date(dateFin);
      if (fin < today && employees.length > 0) {
        setAutoPresenceStep(true);
      } else {
        setAutoPresenceStep(false);
      }
    }
  }, [dateFin, employees]);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      theme,
      lieu,
      type,
      statut,
      dateDebut,
      dateFin,
      service: serviceId ? { id: serviceId } : null,
      formateur,
      employees,
    }),
  }));

  const steps = [
    { label: "Infos", icon: <FaClipboardList size={20} /> },
    { label: "Dates", icon: <FaCalendarAlt size={20} /> },
    { label: "Formateur", icon: <FaChalkboardTeacher size={20} /> },
    { label: "Participants", icon: <FaUsers size={20} /> },
  ];

  if (autoPresenceStep && !steps.find((s) => s.label === "Présences Automatiques")) {
    steps.push({ label: "Présences Automatiques", icon: <FaUsers size={20} /> });
  }

  return (
    <ComponentCard className="p-4 md:p-8 bg-white rounded-2xl shadow-lg w-full">
      {/* Progress bar */}
      <div className="relative flex items-center mb-8 flex-wrap">
        <div className="absolute top-5 left-5 right-5 h-1 bg-gray-300 z-0 rounded"></div>
        <motion.div
          className="absolute top-5 left-5 h-1 bg-blue-500 z-0 rounded"
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        {steps.map((s, index) => {
          const isActive = step === index + 1;
          const isCompleted = step > index;
          return (
            <div
              key={s.label}
              className="flex-1 flex flex-col items-center relative z-10 min-w-[60px]"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted || isActive
                    ? "bg-blue-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-600"
                }`}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {s.icon}
              </motion.div>
              <motion.span
                className="text-center text-sm font-medium text-gray-700 dark:text-gray-400 break-words"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {s.label}
              </motion.span>
            </div>
          );
        })}
      </div>

      {/* Formulaire animé */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Thème *</Label>
              <Input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Saisir le thème"
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Lieu *</Label>
              <Input
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                placeholder="ex: Casablanca"
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Type *</Label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Type de formation"
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Statut</Label>
              <Input value={statut} disabled className="w-full" />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Date de début *</Label>
              <DatePicker
                id="dateDebut"
                defaultDate={dateDebut || undefined}
                onChange={(_, val) => setDateDebut(val)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="flex flex-col w-full">
              <Label className="text-gray-700 dark:text-gray-400">Date de fin *</Label>
              <DatePicker
                id="dateFin"
                defaultDate={dateFin || undefined}
                onChange={(_, val) => setDateFin(val)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="flex flex-col md:col-span-2 w-full">
              <Label className="text-gray-700 dark:text-gray-400">Service *</Label>
              <Select
                options={serviceOptions}
                defaultValue={serviceId ? serviceId.toString() : ""}
                onChange={(val: string) => setServiceId(Number(val))}
                placeholder="Choisir un service"
                className="w-full"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <FormateurSelector formateur={formateur} setFormateur={setFormateur} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <EmployeeSelector selected={employees} setSelected={setEmployees} />
          </motion.div>
        )}

        {step === 5 && autoPresenceStep && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex flex-col gap-4"
          >
            <p className="text-gray-700">
              La date de fin de formation est passée. Les employés sélectionnés ci-dessous seront marqués comme présents pour toutes les séances une fois la formation ajoutée :
            </p>
            <ul className="list-disc list-inside text-gray-700">
              {employees.map((emp) => (
                <li key={emp.id}>{emp.nom}</li>
              ))}
            </ul>
            <p className="text-gray-700">
              La formation sera maintenant ajoutée au CV interne de ces employés.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 flex-wrap gap-2">
        {step > 1 && (
          <motion.button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
            onClick={() => setStep(step - 1)}
            whileHover={{ scale: 1.05 }}
          >
            Précédent
          </motion.button>
        )}

        <div className="ml-auto flex gap-4 flex-wrap w-full sm:w-auto">
          {step < (autoPresenceStep ? 5 : 4) && (
            <motion.button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
              onClick={() => setStep(step + 1)}
              whileHover={{ scale: 1.05 }}
            >
              Suivant
            </motion.button>
          )}

          {props.onSubmit && step === (autoPresenceStep ? 5 : 4) && (
            <motion.button
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={props.onSubmit}
              whileHover={{ scale: 1.05 }}
            >
              Ajouter Formation
            </motion.button>
          )}
        </div>
      </div>
    </ComponentCard>
  );
});

export default FormationForm;