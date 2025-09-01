// QcmPage.tsx
import React, { useState, useEffect } from "react";
import { QuestionsService, ReponsesUtilisateurService } from "../../api/formulaireService";

type Reponse = { id: number; texteReponse: string };
type Question = { id: number; texteQuestion: string; reponsesPossibles: Reponse[] };

interface QcmProps {
  employeeId: number;
  formulaireFormationId: number;
  formation?: any;
  employee?: any;
}

export default function Qcm({ employeeId, formulaireFormationId, formation, employee }: QcmProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { employeId: number; formulaireFormationId: number; questionFormulaireId: number; reponsePossibleId: number }[]
  >([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const allQuestions = await QuestionsService.getAll();
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
      }
    }
    fetchQuestions();
  }, []);

  const handleAnswer = async () => {
    if (selected === null) return;

    const newAnswer = {
      employeId: employeeId,
      formulaireFormationId,
      questionFormulaireId: questions[current].id,
      reponsePossibleId: selected,
    };

    const updatedAnswers = [
      ...answers.filter((a) => a.questionFormulaireId !== questions[current].id),
      newAnswer,
    ];

    setAnswers(updatedAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      // On envoie toutes les réponses y compris la dernière
      try {
        await ReponsesUtilisateurService.addMany(updatedAnswers);
        setFinished(true);
      } catch (error) {
        console.error("Erreur lors de l'envoi des réponses :", error);
      }
    }
  };

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Chargement des questions...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      
      {/* Carte infos formation & employé */}
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 p-6 mb-6 rounded-2xl shadow flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Formation : <span className="text-blue-600">{formation?.theme}</span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {formation?.description || "Formation professionnelle"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee?.nom} {employee?.prenom}
          </p>
          <p className="text-sm text-gray-500">CIN : {employee?.cne}</p>
        </div>
      </div>

      {!finished ? (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
          {/* Progression */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {current + 1} sur {questions.length}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold mb-4">{questions[current].texteQuestion}</h2>

          {/* Réponses */}
          <div className="space-y-3">
            {questions[current].reponsesPossibles.map((opt) => (
              <label
                key={opt.id}
                className={`block px-4 py-2 rounded-xl border cursor-pointer transition ${
                  selected === opt.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${questions[current].id}`}
                  value={opt.id}
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                  className="hidden"
                />
                {opt.texteReponse}
              </label>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={handleAnswer}
            disabled={selected === null}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {current + 1 < questions.length ? "Suivant →" : "📤 Terminer"}
          </button>
        </div>
      ) : (
        // Résumé final
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">✅ QCM Terminé</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Merci <span className="font-semibold">{employee?.prenom}</span> d’avoir complété le QCM.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Formation suivie : <span className="font-medium">{formation?.theme}</span>
          </p>
          <p className="text-sm text-gray-500">
            Nombre de réponses enregistrées : <span className="font-medium">{answers.length}</span> / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}
