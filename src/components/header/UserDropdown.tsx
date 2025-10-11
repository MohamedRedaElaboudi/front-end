import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../context/AuthContext";
import { getResponsableByEmail, Responsable } from "../../api/responsableService";
import { logout } from "../../api/loginService";

import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Responsable | null>(null);
  const navigate = useNavigate();
  const { email } = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    if (!email) return;

    const fetchUser = async () => {
      try {
        const data = await getResponsableByEmail(email);
        setUser(data);
      } catch (error) {
        console.error("Erreur récupération responsable:", error);
      }
    };

    fetchUser();
  }, [email]);

  const initial = user ? user.prenom?.charAt(0).toUpperCase() : "R";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 flex items-center justify-center rounded-full h-11 w-11 bg-blue-600 text-white font-semibold text-lg">
          {initial}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user ? `${user.prenom} ${user.nom}` : "Chargement..."}
        </span>

        {/* Icône flèche moderne */}
        <FiChevronDown
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user ? `${user.prenom} ${user.nom}` : "Chargement..."}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user ? user.email : "Chargement..."}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <FiUser className="text-gray-500 group-hover:text-blue-600" />
              Modifier le Profil
            </DropdownItem>

            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/configurations"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              <FiSettings className="text-gray-500 group-hover:text-blue-600" />
              Configurations
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 w-full font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          <FiLogOut className="text-gray-500 group-hover:text-red-500" />
          Déconnexion
        </button>
      </Dropdown>
    </div>
  );
}
