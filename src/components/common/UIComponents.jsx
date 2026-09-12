import React, { useEffect } from 'react';

export const Badge = ({ type = "beginner", children }) => (
  <span className={`badge badge-${type}`}>{children}</span>
);

export const ProgressBar = ({ value = 0 }) => (
  <div className="progress-bar">
    <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
);

export const Avatar = ({ initials, size = 40, color }) => (
  <div
    className="avatar"
    style={{
      width: size,
      height: size,
      fontSize: Math.round(size * 0.36),
      background: color || `linear-gradient(135deg, var(--primary-light), var(--accent))`
    }}
  >
    {initials || "SB"}
  </div>
);

export const Tag = ({ children }) => <span className="tag">{children}</span>;

export const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return <div className="toast">{message}</div>;
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, color: "var(--text)" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ fontSize: 18, color: "var(--text-muted)", cursor: "pointer", padding: "4px 8px" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
