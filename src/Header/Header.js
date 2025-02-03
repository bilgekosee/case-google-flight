import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaPlane,
  FaHotel,
  FaHome,
  FaGlobe,
  FaSuitcase,
} from "react-icons/fa";

const Header = ({ toggleDarkMode, darkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Flights");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    const currentTab = menuItems.find(
      (item) => item.route === location.pathname
    );
    setActiveTab(currentTab ? currentTab.name : "");
  }, [location.pathname]);

  const menuItems = [
    { name: "Travel", icon: <FaGlobe />, route: "/" },
    { name: "Explore", icon: <FaSuitcase />, route: "/explore" },
    { name: "Flights", icon: <FaPlane />, route: "/flights" },
    { name: "Hotels", icon: <FaHotel />, route: "/hotels" },
    { name: "Holiday rentals", icon: <FaHome />, route: "/holiday" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-5 py-5 shadow-md bg-white dark:bg-gray-700 transition-all duration-300 border-b border-gray-300 dark:border-gray-700 h-16 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMenu}
          className="text-gray-600 dark:text-white text-xl md:hidden"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="text-xl font-semibold">
          <span className="text-blue-600 dark:text-blue-300">Google</span>
          <span className="text-gray-900 dark:text-white"> Flight</span>
        </div>
      </div>

      <nav className="hidden md:flex gap-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.route)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 transition-colors
                    ${
                      activeTab === item.name
                        ? "bg-blue-100 text-blue-600 border-gray-500 dark:bg-blue-800 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
          >
            {item.icon} {item.name}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-white text-xl"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-md md:hidden">
          <nav className="flex flex-col items-center gap-4 p-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-2 px-4 py-2 w-full text-left rounded-lg border   border-gray-300 dark:border-gray-600 transition-colors
                    ${
                      activeTab === item.name
                        ? "bg-blue-100 text-blue-600 border-gray-500 dark:bg-blue-800 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
