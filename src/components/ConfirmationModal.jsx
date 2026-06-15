import React from 'react';

export default function ConfirmationModal({ show, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }) {
  if (!show) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">{type === 'danger' ? '⚠️' : 'ℹ️'}</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-btns">
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
