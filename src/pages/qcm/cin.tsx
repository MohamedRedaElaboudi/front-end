import React, { useState } from "react";
import { getEmployeeByCne } from "../../api/employeeService";

export default function CinInput() {
  const [cin, setCin] = useState("");
  const [employee, setEmployee] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = await getEmployeeByCne(cin);
      setEmployee(data);
    } catch (error) {
      setEmployee(null);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 dark:bg-gray-950">
      <h2 className="text-2xl font-bold text-gray-800 ">
        Entrer votre CIN
      </h2>

      {/* Champ CIN */}
      <input
        type="text"
        value={cin}
        onChange={(e) => setCin(e.target.value.toUpperCase())}
        placeholder="Ex: AB123456"
        className="w-64 px-4 py-2 border-2 rounded-xl text-center 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase
                   bg-white text-gray-900 border-gray-300
                   dark:bg-gray-800  dark:border-gray-600"
      />

      {/* Bouton Enregistrer */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 font-semibold rounded-xl shadow transition
                   bg-blue-600 text-white hover:bg-blue-700
                   dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Enregistrer
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-96 text-center">
            {employee ? (
              <>
                <h3 className="text-lg font-bold text-gray-800  mb-4">
                  Employé trouvé
                </h3>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Nom :</strong> {employee.nom}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Prénom :</strong> {employee.prenom}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>CIN :</strong> {employee.cne}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  <strong>Email :</strong> {employee.email}
                </p>
              </>
            ) : (
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                Employé introuvable
              </h3>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition
                         dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
