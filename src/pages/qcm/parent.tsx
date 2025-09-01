import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getEmployeeByCne } from "../../api/employeeService";
import { getFormationById, Formation } from "../../api/formationService";
import { getPresenceById } from "../../api/presenceFormationService";
import Qcm from "./QcmPage";

function CinForm({ onValid }: { onValid: (cin: string, emp: any) => void }) {
  const [cin, setCin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!cin.trim()) {
      setError("Veuillez entrer un CIN valide");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const emp = await getEmployeeByCne(cin);
      if (emp) {
        onValid(cin, emp);
      } else {
        setError("CIN invalide !");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la vérification du CIN.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Entrez votre CIN</h2>
      <input
        type="text"
        value={cin}
        onChange={(e) => setCin(e.target.value)}
        className="border px-4 py-2 rounded-lg mb-4 w-64"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Vérification..." : "Valider"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

// Générer toutes les dates entre dateDebut et dateFin (format YYYY-MM-DD)
function getAllDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function PageQcmParent() {
  const { formationId } = useParams<{ formationId: string }>();
  const [cin, setCin] = useState<string | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasAllPresences, setHasAllPresences] = useState(false);

  // Charger la formation
  useEffect(() => {
    async function fetchFormation() {
      try {
        if (!formationId) {
          setError("ID formation manquant dans l'URL");
          return;
        }
        const f = await getFormationById(Number(formationId));
        if (f) setFormation(f);
        else setError("Formation introuvable");
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement de la formation");
      } finally {
        setLoading(false);
      }
    }
    fetchFormation();
  }, [formationId]);

  // Vérifier la présence pour toutes les dates de la formation
  useEffect(() => {
    async function checkPresences() {
      if (!employee || !formation) return;

      try {
        const allDates = getAllDatesBetween(formation.dateDebut, formation.dateFin);
        let allPresent = true;

        for (const date of allDates) {
          const presence = await getPresenceById(employee.id, formation.id, date);
          if (!presence || presence.statut !== "PRESENT") {
            allPresent = false;
            break;
          }
        }

        setHasAllPresences(allPresent);
        if (!allPresent) {
          setError("Vous devez être présent à toutes les séances pour accéder au QCM.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la vérification des présences.");
      }
    }

    checkPresences();
  }, [employee, formation]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  if (!cin || !employee) return <CinForm onValid={(validatedCin, emp) => { setCin(validatedCin); setEmployee(emp); }} />;
  if (!hasAllPresences) return <div className="flex items-center justify-center min-h-screen text-red-500">Accès refusé : vous n'avez pas assisté à toutes les séances.</div>;

  return (
    <Qcm
      employeeId={employee.id}
      formulaireFormationId={formation?.formulaire?.id || 0}
      formation={formation}
      employee={employee}
    />
  );
}
