import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Moon, Sun } from "lucide-react";
import { QuestionsService } from "../../api/formulaireService";

interface ReponsePossible {
  id: number;
  texteReponse: string;
}

interface Question {
  id: number;
  texteQuestion: string;
  reponsesPossibles: ReponsePossible[];
}

const QuestionConfig = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Question>({
    id: 0,
    texteQuestion: "",
    reponsesPossibles: [
      { id: 0, texteReponse: "" },
      { id: 0, texteReponse: "" },
    ],
  });

  // Charger les questions depuis l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await QuestionsService.getAll();
        setQuestions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: 0,
      texteQuestion: "",
      reponsesPossibles: [
        { id: 0, texteReponse: "" },
        { id: 0, texteReponse: "" },
      ],
    });
  };

  const handleAdd = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (question: Question) => {
    setFormData({ ...question });
    setEditingId(question.id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.texteQuestion.trim() || formData.reponsesPossibles.some((r) => !r.texteReponse.trim())) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (formData.reponsesPossibles.length < 2) {
      alert("Veuillez ajouter au moins 2 réponses");
      return;
    }

    try {
      const payload = {
        texteQuestion: formData.texteQuestion,
        reponsesPossibles: formData.reponsesPossibles.map((r) => r.texteReponse),
      };

      if (editingId) {
        const updated = await QuestionsService.update(editingId, payload);
        setQuestions((prev) => prev.map((q) => (q.id === editingId ? updated : q)));
      } else {
        const created = await QuestionsService.create(payload);
        setQuestions((prev) => [...prev, created]);
      }

      setIsModalOpen(false);
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) return;
    try {
      await QuestionsService.delete(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const updateQuestion = (value: string) => {
    setFormData({ ...formData, texteQuestion: value });
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...formData.reponsesPossibles];
    newAnswers[index] = { ...newAnswers[index], texteReponse: value };
    setFormData({ ...formData, reponsesPossibles: newAnswers });
  };

  const addAnswer = () => {
    setFormData({
      ...formData,
      reponsesPossibles: [...formData.reponsesPossibles, { id: 0, texteReponse: "" }],
    });
  };

  const removeAnswer = (index: number) => {
    if (formData.reponsesPossibles.length <= 2) {
      alert("Vous devez avoir au moins 2 réponses");
      return;
    }
    const newAnswers = formData.reponsesPossibles.filter((_, i) => i !== index);
    setFormData({ ...formData, reponsesPossibles: newAnswers });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">
        Chargement des questions...
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestionnaire des Questions</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-110 transition"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </button>
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow hover:scale-105 transition mb-6"
        >
          <Plus className="w-5 h-5" /> Ajouter une question
        </button>

        {/* Liste des questions */}
        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{q.texteQuestion}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:scale-110 transition"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 bg-red-100 dark:bg-red-900 rounded-lg hover:scale-110 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                  </button>
                </div>
              </div>

              <ul className="space-y-2">
                {q.reponsesPossibles.map((rep, i) => (
                  <li
                    key={rep.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    {String.fromCharCode(65 + i)}. {rep.texteReponse}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center" 
          style={{ zIndex: 99999 }}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingId ? "Modifier la question" : "Nouvelle question"}
            </h2>

            <input
              type="text"
              value={formData.texteQuestion}
              onChange={(e) => updateQuestion(e.target.value)}
              placeholder="Texte de la question"
              className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Réponses possibles (minimum 2)
                </label>
                <button
                  onClick={addAnswer}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>

              {formData.reponsesPossibles.map((r, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={r.texteReponse}
                    onChange={(e) => updateAnswer(i, e.target.value)}
                    placeholder={`Réponse ${String.fromCharCode(65 + i)}`}
                    className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  {formData.reponsesPossibles.length > 2 && (
                    <button
                      onClick={() => removeAnswer(i)}
                      className="p-3 bg-red-100 dark:bg-red-900 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      <X className="w-4 h-4 text-red-600 dark:text-red-300" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                <X className="inline w-4 h-4 mr-1" /> Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="inline w-4 h-4 mr-1" /> Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionConfig;