import React from 'react';

export default function Dialog({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'error' // 'error', 'success', 'warning', 'info'
}) {
  if (!isOpen) return null;

  // Define colors based on type
  const colors = {
    error: '#ff4d4f',
    success: '#21e6c1',
    warning: '#faad14',
    info: '#1890ff'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const dialogStyle = {
    backgroundColor: '#23252b',
    borderRadius: 8,
    padding: '1.5rem',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    color: '#fff'
  };

  const titleStyle = {
    color: colors[type],
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1.25rem',
    fontWeight: 600
  };

  const messageStyle = {
    marginBottom: '1.5rem',
    lineHeight: 1.5
  };

  const buttonStyle = {
    alignSelf: 'flex-end',
    backgroundColor: colors[type],
    color: type === 'success' ? '#18191d' : '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '.5rem 1.5rem',
    fontWeight: 700,
    cursor: 'pointer'
  };

  // Close when pressing Escape key
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={e => e.stopPropagation()}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={messageStyle}>{message}</p>
        <button style={buttonStyle} onClick={onClose}>OK</button>
      </div>
    </div>
  );
} 