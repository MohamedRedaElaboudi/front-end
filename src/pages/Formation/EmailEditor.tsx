import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { sendInvitationMail, InvitationRequest } from "../../api/mailService";
import { getFormationById, Formation } from "../../api/formationService";

export default function EmailBuilder() {
  const { id } = useParams<{ id: string }>();
  const idFormation = id ? parseInt(id, 10) : NaN;

  const [formation, setFormation] = useState<Formation | null>(null);
  const [text, setText] = useState("");
  const [sujet, setSujet] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageStatus, setMessageStatus] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isNaN(idFormation)) {
      getFormationById(idFormation)
        .then(setFormation)
        .catch(() => setFormation(null));
    }
  }, [idFormation]);

  const dynamicAttributes = formation
    ? [
        { key: "Formation_Theme", label: "Thème", value: formation.theme ?? "" },
        { key: "Formation_Lieu", label: "Lieu", value: formation.lieu ?? "" },
        { key: "Formation_DateDebut", label: "Date début", value: formation.dateDebut ?? "" },
        { key: "Formation_DateFin", label: "Date fin", value: formation.dateFin ?? "" },
        { key: "Formation_Type", label: "Type", value: formation.type ?? "" },
        { key: "Formation_Statut", label: "Statut", value: formation.statut ?? "" },
        { key: "Formation_Formateur", label: "Formateur", value: formation.formateur?.nomFormateur ?? "" },
      ]
    : [];

  const insertTextAtCursor = (insertText: string) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = text.slice(0, start);
    const after = text.slice(end);
    setText(before + insertText + after);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + insertText.length;
    }, 0);
  };

  const handleInsertAttribute = (key: string) => insertTextAtCursor(`{{${key}}}`);

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>, key: string) => {
    e.dataTransfer.setData("text/plain", `{{${key}}}`);
  };

  const onDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    insertTextAtCursor(data);
  };

  const onDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => e.preventDefault();

  const renderWithValues = (input: string) => {
    const valuesMap = Object.fromEntries(dynamicAttributes.map(attr => [attr.key, attr.value]));
    return input.replace(/{{(.*?)}}/g, (_, key) => valuesMap[key] ?? `{{${key}}}`);
  };

  const handleSendInvitation = async () => {
    if (!formation) return setMessageStatus("Formation introuvable.");
    if (!sujet.trim()) return setMessageStatus("Veuillez saisir un sujet.");
    if (!text.trim()) return setMessageStatus("Le message ne peut pas être vide.");

    setLoading(true);
    setMessageStatus(null);

    try {
      const messageFinal = renderWithValues(text);
      const data: InvitationRequest = { idFormation, sujet, message: messageFinal };
      const res = await sendInvitationMail(data);
      console.log("Réponse API:", res);

      if (res.success) setMessageStatus("Invitation envoyée avec succès !");
      else setMessageStatus("Erreur : " + (res.message || "Erreur inconnue"));
    } catch (error: any) {
      setMessageStatus("Erreur : " + (error.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  };

  if (isNaN(idFormation)) return <p>ID de formation invalide dans l'URL.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Composez votre email</h2>

      {!formation ? (
        <p>Chargement de la formation...</p>
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="email-subject" className="block font-semibold mb-1">
              Sujet de l'email :
            </label>
            <input
              id="email-subject"
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              placeholder="Entrez le sujet ici"
            />
          </div>

          <div className="mb-6">
            <strong className="block mb-2">Insérer un attribut :</strong>
            <div className="flex flex-wrap gap-3">
              {dynamicAttributes.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  draggable
                  onClick={() => handleInsertAttribute(key)}
                  onDragStart={(e) => onDragStart(e, key)}
                  className="px-4 py-2 rounded-md border border-green-600 bg-green-600 text-white
                             hover:bg-green-700 transition-colors dark:border-green-400 dark:bg-green-400 dark:hover:bg-green-500"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            ref={textareaRef}
            rows={10}
            className="w-full p-4 rounded-md border border-gray-300 bg-gray-50 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            placeholder="Tapez votre texte ici, puis insérez des attributs..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />

          <h3 className="mt-8 mb-3 text-xl font-semibold">Aperçu :</h3>
          <div
            className="whitespace-pre-wrap p-4 rounded-md border border-gray-300 bg-gray-100 font-mono
                       dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 min-h-[120px]"
          >
            {renderWithValues(text)}
          </div>

          <button
            onClick={handleSendInvitation}
            disabled={loading}
            className="mt-6 mx-auto block rounded bg-blue-600 px-6 py-3 font-semibold text-white
             hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Envoi en cours..." : "Envoyer l'invitation"}
          </button>

          {messageStatus && (
            <p className="mt-4 font-semibold text-center text-red-600 dark:text-red-400">
              {messageStatus}
            </p>
          )}
        </>
      )}
    </div>
  );
}
