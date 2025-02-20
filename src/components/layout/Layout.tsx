import React from 'react';
import { Header } from './Header';

/**
 * Props du composant Layout
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Composant Layout
 * Définit la structure globale de l'application avec l'en-tête et le contenu principal
 * @param {LayoutProps} props - Les propriétés du composant
 */
export function Layout({ children }: LayoutProps) {
  return (
    // Conteneur principal avec fond gris clair
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de l'application */}
      <Header />
      {/* Contenu principal avec padding pour l'en-tête fixe */}
      <main className="pt-16 pb-20">
        {children}
      </main>
    </div>
  );
}