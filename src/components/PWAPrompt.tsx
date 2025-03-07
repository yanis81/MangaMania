import { useEffect, useState } from 'react';

interface PWAPromptProps {
  type: 'update' | 'offline' | 'install';
  onClose?: () => void;
  onAction?: () => void;
}

const PWAPrompt = ({ type, onClose, onAction }: PWAPromptProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type === 'offline') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const messages = {
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

  if (!isVisible) return null;

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
      <p style={{ margin: 0 }}>{currentMessage.title}</p>
      {currentMessage.action && (
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