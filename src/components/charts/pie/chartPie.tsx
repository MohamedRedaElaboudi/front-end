import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import EcommerceMetric from "../../ecommerce/EcommerceMetrics";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  getFormationStats,
  QuestionStats,
  getFormationParticipants,
  getFormationTauxReponse,
} from "../../../api/ServiceStats";
import { getFormationById, Formation } from "../../../api/formationService";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function ChartPiePage() {
  const { formationId } = useParams<{ formationId: string }>();
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [participants, setParticipants] = useState<number>(0);
  const [tauxParticipants, setTauxParticipants] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar" | "donut">("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (formationId) {
          const [statsData, formationData, participantsData, tauxData] =
            await Promise.all([
              getFormationStats(Number(formationId)),
              getFormationById(Number(formationId)),
              getFormationParticipants(Number(formationId)),
              getFormationTauxReponse(Number(formationId)),
            ]);

          setStats(statsData);
          setFormation(formationData);
          setParticipants(participantsData);
          setTauxParticipants(tauxData || 0);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formationId]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Statistiques de la Formation: ${formation?.theme || ""}`, 10, 10);
    stats.forEach((q, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${q.questionLibelle}`, 10, 20 + index * 20);
      Object.entries(q.reponsePourcentages).forEach(([label, value], i) => {
        doc.text(`${label}: ${value.toFixed(2)}%`, 20, 30 + index * 20 + i * 10);
      });
    });
    doc.save(`formation_stats_${formationId}.pdf`);
  };

  const memoizedStats = useMemo(
    () =>
      stats.map((q) => ({
        ...q,
        data: Object.entries(q.reponsePourcentages).map(([name, value]) => ({
          name,
          value,
        })),
      })),
    [stats]
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 dark:text-gray-300">
        ⏳ Chargement...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Réessayer
        </button>
      </div>
    );

  if (!memoizedStats.length)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        ⚠️ Aucune donnée disponible
      </div>
    );

  return (
    <div className="min-h-screen p-6 transition-colors duration-500 bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto text-center mb-12"
        {...({} as any)}
      >
        <h1 className="text-4xl font-extrabold mb-2 text-gray-800 dark:text-white">
          📊 Statistiques de la formation
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-300">
          Analyse interactive des réponses des participants
        </p>
      </motion.header>

      {/* Formation Info */}
      {formation && (
        <motion.div
          className="max-w-5xl mx-auto p-6 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition min-h-[150px]"
          {...({} as any)}
        >
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{formation.theme}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Lieu: {formation.lieu} | Du {formation.dateDebut} au {formation.dateFin} | Type: {formation.type}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Formateur: {formation.formateur?.nomFormateur || "Non défini"}
          </p>
        </motion.div>
      )}

      {/* Metrics */}
      <div className="max-w-5xl mx-auto mb-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <EcommerceMetric
          title="Participants"
          value={participants}
          badgeValue="100%"
          icon={<span className="text-2xl">👥</span>}
        />
        <EcommerceMetric
          title="Taux de réponse"
          value={`${tauxParticipants}%`}
          badgeValue={`${tauxParticipants}%`}
          icon={<span className="text-2xl">📊</span>}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <Download size={18} /> Exporter PDF
        </button>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "pie" | "bar" | "donut")}
          className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option value="pie">Graphique en anneau</option>
          <option value="bar">Graphique en barres</option>
          <option value="donut">Graphique en donut</option>
        </select>
      </div>

      {/* Charts */}
      <div className="max-w-5xl mx-auto space-y-10">
        <AnimatePresence>
          {memoizedStats.map((q) => (
            <motion.div
              key={q.questionId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition min-h-[400px]"
              {...({} as any)}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">{q.questionLibelle}</h3>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={q.data} barSize={30}>
                    <XAxis
                      dataKey="name"
                      stroke="#000"
                      tick={{ fill: "#000" }}
                      className="dark:stroke-white dark:[&_text]:fill-white"
                    />
                    <YAxis
                      stroke="#000"
                      tick={{ fill: "#000" }}
                      className="dark:stroke-white dark:[&_text]:fill-white"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      wrapperClassName="dark:!bg-gray-800 dark:!text-white"
                    />
                    <Bar dataKey="value">
                      {q.data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={q.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={chartType === "donut" ? 80 : 0}
                      outerRadius={120}
                      dataKey="value"
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {q.data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        color: "#000",
                      }}
                      wrapperClassName="dark:!bg-gray-800 dark:!text-white"
                    />
                    <Legend
                      wrapperStyle={{ color: "#000" }}
                      className="dark:!text-white"
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
