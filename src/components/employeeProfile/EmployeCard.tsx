import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import { EnvelopeIcon } from "../../icons";
import { getEmployeeById, updateEmployee, getAllServices } from "../../api/employeeService";

// Fonction utilitaire pour formater les dates
const formatDate = (v: any) => {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(v);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function EmployeCard({ employeeId }: { employeeId: number }) {
  const { isOpen, openModal, closeModal } = useModal();

  const [employee, setEmployee] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    cne: "",
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: "",
    dateRecrutement: "",
    fonction: "",
    service: null as any | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!employeeId) return;

    (async () => {
      try {
        const emp = await getEmployeeById(employeeId);
        setEmployee(emp);

        const srvcs = await getAllServices();
        setServices(srvcs);

        setForm({
          cne: emp.cne,
          nom: emp.nom,
          prenom: emp.prenom,
          email: emp.email,
          dateNaissance: formatDate(emp.dateNaissance),
          dateRecrutement: formatDate(emp.dateRecrutement),
          fonction: emp.fonction ?? "",
          service: emp.service ?? null,
        });
      } catch (e) {
        console.error("Erreur chargement employé ou services", e);
      }
    })();
  }, [employeeId]);

  const handleChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Supprime l'erreur dès modification
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.cne.trim()) newErrors.cne = "Le CNE est obligatoire.";
    if (!form.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    if (!form.email.trim()) newErrors.email = "L'email est obligatoire.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) newErrors.email = "L'email n'est pas valide.";
    if (!form.dateNaissance) newErrors.dateNaissance = "La date de naissance est obligatoire.";
    if (!form.dateRecrutement) newErrors.dateRecrutement = "La date de recrutement est obligatoire.";
    if (!form.service) newErrors.service = "Le service est obligatoire.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateEmployee(employeeId, {
        ...form,
        service: form.service ? { id: form.service.id } : null,
      });
      setEmployee({ ...employee, ...form });
      closeModal();
      alert("✅ Employé mis à jour !");
    } catch (e) {
      console.error("Erreur sauvegarde employé", e);
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  if (!employee) return <div>Chargement...</div>;

  return (
    <>
      {/* Carte employé */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Informations Personnelles
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              {[
                { label: "CNE", value: employee.cne },
                { label: "Nom", value: employee.nom },
                { label: "Prénom", value: employee.prenom },
                { label: "Email", value: employee.email },
                { label: "Date de naissance", value: formatDate(employee.dateNaissance) },
                { label: "Date de recrutement", value: formatDate(employee.dateRecrutement) },
                { label: "Fonction", value: employee.fonction ?? "-" },
                { label: "Service", value: employee.service?.nom ?? "-" },
              ].map(({ label, value }, i) => (
                <div key={i}>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-primary-800 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white lg:inline-flex lg:w-auto"
          >
            Modifier
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Mettez à jour les informations de l'employé.
            </p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col"
          >
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                {/* CNE */}
                <div>
                  <Label>CNI<span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={form.cne}
                    onChange={e => handleChange("cne", e.target.value)}
                    className={errors.cne ? "border-red-500" : ""}
                  />
                  {errors.cne && <p className="mt-1 text-xs text-red-500">{errors.cne}</p>}
                </div>

                {/* Nom */}
                <div>
                  <Label>Nom<span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={form.nom}
                    onChange={e => handleChange("nom", e.target.value)}
                    className={errors.nom ? "border-red-500" : ""}
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
                </div>

                {/* Prénom */}
                <div>
                  <Label>Prénom<span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={form.prenom}
                    onChange={e => handleChange("prenom", e.target.value)}
                    className={errors.prenom ? "border-red-500" : ""}
                  />
                  {errors.prenom && <p className="mt-1 text-xs text-red-500">{errors.prenom}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label>Email<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      placeholder="info@gmail.com"
                      type="email"
                      className={`pl-[62px] ${errors.email ? "border-red-500" : ""}`}
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <EnvelopeIcon className="size-6" />
                    </span>
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Date de naissance */}
                <div>
                  <Label>Date de naissance<span className="text-red-500">*</span></Label>
                  <DatePicker
                    id="date-naissance"
                    defaultDate={form.dateNaissance ? new Date(form.dateNaissance) : undefined}
                    onChange={date => handleChange("dateNaissance", date[0])}
                  />
                  {errors.dateNaissance && <p className="mt-1 text-xs text-red-500">{errors.dateNaissance}</p>}
                </div>

                {/* Date de recrutement */}
                <div>
                  <Label>Date de recrutement<span className="text-red-500">*</span></Label>
                  <DatePicker
                    id="date-recrutement"
                    defaultDate={form.dateRecrutement ? new Date(form.dateRecrutement) : undefined}
                    onChange={date => handleChange("dateRecrutement", date[0])}
                  />
                  {errors.dateRecrutement && <p className="mt-1 text-xs text-red-500">{errors.dateRecrutement}</p>}
                </div>

                {/* Fonction */}
                <div>
                  <Label>Fonction<span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={form.fonction}
                    onChange={e => handleChange("fonction", e.target.value)}
                  />
                </div>

                {/* Service */}
                <div>
                  <Label>Service<span className="text-red-500">*</span></Label>
                  <Select
                    options={services.map(s => ({ value: s.id.toString(), label: s.nom }))}
                    defaultValue={form.service?.id?.toString() ?? ""}
                    placeholder="Choisir un service"
                    onChange={val => {
                      const s = services.find(serv => serv.id.toString() === val);
                      handleChange("service", s || null);
                    }}
                  />
                  {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Annuler
              </Button>
              <Button size="sm" >
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
