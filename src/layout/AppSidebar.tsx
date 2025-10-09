import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/loginService";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  Formation as FormationIcon,
  PlugInIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const isVisible = isExpanded || isHovered || isMobileOpen;

  const navItems = useMemo<NavItem[]>(() => [
    {
      icon: <GridIcon />,
      name: "Tableau de bord",
      subItems: [{ name: "Accueil", path: "/" }],
    },
    {
      icon: <UserCircleIcon />,
      name: "Employés",
      subItems: [{ name: "Liste des employés", path: "/employees" }],
    },
    {
      icon: <FormationIcon />,
      name: "Formations",
      subItems: [{ name: "Liste des formations", path: "/formation" }],
    },
    {
      icon: <CalenderIcon />,
      name: "Services",
      subItems: [{ name: "Liste des services", path: "/services" }],
    },
    {
      icon: <CalenderIcon />,
      name: "Calendrier",
      path: "/calendar",
    },
  ], []);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({ type: "main", index });
          submenuMatched = true;
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location.pathname, navItems, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { type: "main", index }));
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1 sm:gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isVisible ? "sm:justify-center" : "sm:justify-start"}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {isVisible && <span className="menu-item-text">{nav.name}</span>}
              {isVisible && (
                <ChevronDownIcon
                  className={`ml-auto w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                } ${!isVisible ? "sm:justify-center" : "sm:justify-start"}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {isVisible && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}

          {nav.subItems && isVisible && (
            <div
              ref={(el) => (subMenuRefs.current[`main-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-1 sm:mt-2 space-y-1 ml-6 sm:ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-14 sm:mt-16 md:mt-0 flex flex-col top-0 px-3 sm:px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isHovered ? "w-[240px] sm:w-[270px] md:w-[290px]" : "w-[70px] sm:w-[80px] md:w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
 <div className="flex items-center justify-center w-full border-b border-gray-200 dark:border-gray-800 py-1 sm:py-2">
  <Link to="/" className="flex items-center transition-all duration-300">
    {isVisible ? (
      // Sidebar ouverte → afficher logo image plus grand
      <img
        src="../images/logo/logo.png" // remplacer par ton image/SVG
        alt="Globex Instrumentation"
        className="h-25 sm:h-25 w-50" // agrandi
      />
    ) : (
      // Sidebar réduite → afficher G2I
      <div
        className={`w-15 h-15 sm:w-14 sm:h-14  rounded-full flex items-center justify-center flex-shrink-0
                    transition-transform duration-300 transform hover:scale-105`}
      >
        <span className="font-bold text-m sm:text-xl flex">
          <span className="text-orange-600">G</span>
          <span className="text-black dark:text-gray-100">2I</span>
        </span>
      </div>
    )}
  </Link>
</div>




      {/* Menu principal */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="flex-1">
          <h2
            className={`mb-3 sm:mb-4 text-[10px] sm:text-xs uppercase flex leading-[18px] sm:leading-[20px] text-gray-400 dark:text-gray-500 font-semibold ${
              !isVisible ? "sm:justify-center" : "justify-start"
            }`}
          >
            {isVisible ? "Menu Principal" : <HorizontaLDots className="size-5 sm:size-6" />}
          </h2>
          {renderMenuItems(navItems)}
        </nav>

        {/* Bouton Déconnexion responsive */}
        <div className="mt-auto pt-4 sm:pt-6 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={async () => {
              await logout();
              navigate("/signin");
            }}
            className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200 ${
              !isVisible ? "sm:justify-center" : "justify-start"
            }`}
            title="Déconnexion"
          >
            <PlugInIcon className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            {isVisible && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;