import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { 
  FaChalkboardTeacher, 
  FaCheckCircle, 
  FaRegClock, 
  FaChartLine 
} from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import FormationTable from "../Tables/formationTable";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

type StatsResponse = {
  [key: string]: number;
};

export default function Formation() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsResponse>({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get(`${API_BASE_URL}/formations/stats`);
        const data: StatsResponse = {};

        Object.entries(response.data).forEach(([key, value]) => {
          if (key === "Valide") return; // ignorer le doublon
          data[key] = value || 0;
        });

        setStats(data);
      } catch (error) {
        console.error("Erreur récupération stats :", error);
      }
    }

    fetchStats();
  }, []);

  const totalFormations =
    (stats["VALIDE"] || 0) +
    (stats["Non_valide"] || 0) +
    (stats["EN_COURS_DE_VALIDATION"] || 0) +
    (stats["TERMINE"] || 0);

  const cards = [
    { title: "Total Formations", value: totalFormations, icon: <FaChartLine size={28} />, color: "from-purple-400 to-purple-600" },
    { title: "Formations Validées", value: stats["VALIDE"] || 0, icon: <FaCheckCircle size={28} />, color: "from-green-400 to-green-600" },
    { title: "Formations Non Validées", value: stats["Non_valide"] || 0, icon: <FaRegClock size={28} />, color: "from-red-400 to-red-600" },
    { title: "Formations en Validation", value: stats["EN_COURS_DE_VALIDATION"] || 0, icon: <FaChalkboardTeacher size={28} />, color: "from-yellow-400 to-yellow-600" },
    { title: "Formations Terminées", value: stats["TERMINE"] || 0, icon: <FaRegClock size={28} />, color: "from-blue-400 to-blue-600" },
  ];

  return (
    <>
      <PageMeta title="Gestionnaire des Formations" />
      <PageBreadcrumb pageTitle="Gestionnaire des Formations" />

<div className="w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300 lg:ml-0">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Liste des Formations</h1>
          <Button onClick={() => navigate("/ajouterFormation")}>+ Ajouter Formation</Button>
        </div>

        {/* Cards dynamiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 w-full">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative overflow-hidden rounded-2xl shadow-lg p-6 flex flex-col justify-between text-white bg-gradient-to-br ${card.color} transform transition duration-300 hover:scale-105 hover:shadow-2xl min-h-[140px]`}
            >
              <div className="absolute top-4 right-4 opacity-20">{card.icon}</div>
              <h3 className="text-lg font-medium z-10">{card.title}</h3>
              <p className="mt-4 text-3xl font-bold z-10">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tableau des formations */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md w-full overflow-hidden">
          <FormationTable />
        </div>
      </div>
    </>
  );
}
