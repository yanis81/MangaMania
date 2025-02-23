import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Library,
  Eye,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthModal } from "../auth/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">
              MangaCollect
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/decouvrir"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <Search className="w-6 h-6" />
              <span className="text-xs">Découvrir</span>
            </Link>
            <Link
              to="/collection"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <Library className="w-6 h-6" />
              <span className="text-xs">Collection</span>
            </Link>
            <Link
              to="/lecture"
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <Eye className="w-6 h-6" />
              <span className="text-xs">Lecture</span>
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-xs">Déconnexion</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
              >
                <UserCircle className="w-6 h-6" />
                <span className="text-xs">Connexion</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
