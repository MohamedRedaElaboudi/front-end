import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router";
import { getAllServices, addEmployee } from "../../../api/employeeService";

import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Select from "../Select.tsx";
import DatePicker from "../date-picker.tsx";
import { EnvelopeIcon } from "../../../icons/index.ts";

export interface EmployeeFormHandles {
  submit: () => Promise<void>;
}

const initialFormData = {
  cni: "",
  nom: "",
  prenom: "",
  email: "",
  date_naissance: "",
  date_recrutement: "",
  fonction: "",
  serviceId: 0,
};

const EmployeeForm = forwardRef<EmployeeFormHandles>((_props, ref) => {
  const [formData, setFormData] = useState(initialFormData);
  const [services, setServices] = useState<{ value: number; label: string }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const servicesData: Service[] = await getAllServices();
        const options = servicesData.map((service) => ({
          value: service.id,
          label: service.nom,
        }));
        setServices(options);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des services :", error);
      }
    }
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: number) => {
    setFormData((prev) => ({ ...prev, serviceId: value }));
  };

  const handleDateChange = (id: string, dateString: string) => {
    setFormData((prev) => ({ ...prev, [id]: dateString }));
  };

  // ✅ Validation des champs
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.cni.trim()) newErrors.cni = "Le cni est obligatoire.";
    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format d'email invalide.";
      }
    }
    if (!formData.date_naissance) newErrors.date_naissance = "La date de naissance est obligatoire.";
    if (!formData.date_recrutement) newErrors.date_recrutement = "La date de recrutement est obligatoire.";
    if (!formData.fonction.trim()) newErrors.fonction = "La fonction est obligatoire.";
    if (formData.serviceId === 0) newErrors.serviceId = "Veuillez choisir un service.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      id: 0,
      cne: formData.cni,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      dateNaissance: formData.date_naissance,
      dateRecrutement: formData.date_recrutement,
      fonction: formData.fonction,
      service: {
        id: formData.serviceId,
      },
    };

    try {
      const response = await addEmployee(payload);
      alert("✅ Employé ajouté avec succès !");
      console.log("Employé ajouté :", response);
      navigate("/employees");
    } catch (error) {
      alert("❌ Erreur lors de l’ajout de l’employé.");
      console.error(error);
    }
  };

  useImperativeHandle(ref, () => ({
    submit,
  }));

  return (
    <ComponentCard title="Informations de l'employé">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="cni">CNI de l'employé</Label>
            <Input
              type="text"
              id="cni"
              placeholder="x123456"
              value={formData.cni}
              onChange={handleChange}
            />
            {errors.cni && <p className="text-red-500 text-sm">{errors.cni}</p>}
          </div>

          <div>
            <Label htmlFor="nom">Nom de l'employé</Label>
            <Input
              type="text"
              id="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
            />
            {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
          </div>

          <div>
            <Label htmlFor="prenom">Prénom de l'employé</Label>
            <Input
              type="text"
              id="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
            />
            {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <div className="relative">
              <Input
                placeholder="info@gmail.com"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-[62px]"
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <EnvelopeIcon className="size-6" />
              </span>
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <DatePicker
              id="date_naissance"
              label="Date de naissance"
              placeholder="Sélectionner une date"
              onChange={(dates, dateString) => handleDateChange("date_naissance", dateString)}
              value={formData.date_naissance}
            />
            {errors.date_naissance && <p className="text-red-500 text-sm">{errors.date_naissance}</p>}
          </div>

          <div>
            <DatePicker
              id="date_recrutement"
              label="Date de recrutement"
              placeholder="Sélectionner une date"
              onChange={(dates, dateString) => handleDateChange("date_recrutement", dateString)}
              value={formData.date_recrutement}
            />
            {errors.date_recrutement && <p className="text-red-500 text-sm">{errors.date_recrutement}</p>}
          </div>

          <div>
            <Label htmlFor="fonction">Fonction</Label>
            <Input
              type="text"
              id="fonction"
              placeholder="Développeur"
              value={formData.fonction}
              onChange={handleChange}
            />
            {errors.fonction && <p className="text-red-500 text-sm">{errors.fonction}</p>}
          </div>

          <div>
            <Label htmlFor="service">Service</Label>
            <Select
              options={services}
              onChange={handleSelectChange}
              placeholder="Choisir un service"
              value={formData.serviceId}
            />
            {errors.serviceId && <p className="text-red-500 text-sm">{errors.serviceId}</p>}
          </div>
        </div>
      </form>
    </ComponentCard>
  );
});

export default EmployeeForm;
