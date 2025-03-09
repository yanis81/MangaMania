import { useEffect, useState } from 'react';

// Types de notifications possibles
interface PWAPromptProps {
  type: 'update' | 'offline' | 'install';
  onClose?: () => void;
  onAction?: () => void;
}

// Interface pour les messages avec bouton d'action
interface MessageWithAction {
  title: string;
  action: string;
  color: string;
}

// Interface pour les messages sans bouton d'action
interface MessageWithoutAction {
  title: string;
  color: string;
  action?: never;
}

// Type union pour tous les types de messages
type Message = MessageWithAction | MessageWithoutAction;

const PWAPrompt = ({ type, onClose, onAction }: PWAPromptProps) => {
  // État pour contrôler la visibilité de la notification
  const [isVisible, setIsVisible] = useState(true);

  // Effet pour gérer la disparition automatique de la notification "offline"
  useEffect(() => {
    if (type === 'offline') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // Configuration des messages pour chaque type de notification
  const messages: Record<PWAPromptProps['type'], Message> = {
    update: {
      title: 'Mise à jour disponible !',
      action: 'Mettre à jour',
      color: '#4f46e5'
    },
    offline: {
      title: 'Application prête pour une utilisation hors ligne',
      color: '#10b981'
    },
    install: {
      title: 'Installer MangaMania',
      action: 'Installer',
      color: '#4f46e5'
    }
  };

  const currentMessage = messages[type];

  // Ne rend rien si la notification n'est pas visible
  if (!isVisible) return null;

  // Gestionnaire pour fermer la notification
  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: currentMessage.color,
        color: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
        minWidth: '300px'
      }}
    >
      {/* Bouton de fermeture (X) */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Titre de la notification */}
      <p style={{ margin: '0', paddingRight: '24px' }}>{currentMessage.title}</p>

      {/* Bouton d'action conditionnel */}
      {'action' in currentMessage && (
        <button
          onClick={() => {
            onAction?.();
            setIsVisible(false);
          }}
          style={{
            background: 'white',
            color: currentMessage.color,
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {currentMessage.action}
        </button>
      )}
    </div>
  );
};

export default PWAPrompt; 