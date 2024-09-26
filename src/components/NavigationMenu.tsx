import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  PieChart,
  FileText,
  Package,
  FileSearch,
  ClipboardList,
  Activity,
} from "lucide-react";

export default function NavigationMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "ROI", href: "/roi", icon: PieChart },
    { name: "Inventario", href: "/inventario", icon: Package },
    { name: "Informe Inventario", href: "/informe-tecnico", icon: FileSearch },
    { name: "Ejecuciónes", href: "/ejecucion", icon: Activity },
    { name: "Informe Ejecución", href: "/informe-ejecucion", icon: FileText },
    { name: "Plan de prueba", href: "/automations-plan", icon: ClipboardList },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-xl flex gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">R</span>
            </div>
            <h1 className="text-xl font-bold">Informe Robot scp</h1>
          </div>
          <div className="hidden md:flex space-x-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`text-white hover:text-blue-200 flex items-center space-x-1 text-base px-3 py-2 rounded-md transition duration-300`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={`text-white hover:bg-white hover:bg-opacity-20 hover:text-white flex items-center space-x-2 rounded-md px-3 py-2 transition duration-300 ${
                      window.location.pathname === item.href
                        ? "bg-white bg-opacity-20"
                        : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
