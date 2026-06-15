import React, { useState } from 'react';

export default function ManageSubjects({ subjects, onAddSubject, onDeleteSubject }) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [error, setError] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const label = newSubjectName.trim();
    if (!label) {
      setError('Please enter a valid subject name');
      return;
    }

    const id = label.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (subjects.some(s => s.id === id)) {
      setError('Subject already exists!');
      return;
    }

    setError('');
    onAddSubject({ id, label });
    setNewSubjectName('');
    setShowWarningModal(true);
  };

  return (
    <div className="animate-slide-up">
      <section className="card list-card">
        <div className="list-header">
          <div>
            <h2 className="list-title">Manage Custom Subjects</h2>
            <p className="list-sub">Add or remove subjects. Changes will update the "Enter Marks" form in real-time.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="field-row">
          <div className="field-group">
            <label htmlFor="newSubjectName">New Subject Name</label>
            <input 
              type="text" 
              id="newSubjectName" 
              placeholder="e.g. Computer Science" 
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={error ? 'error-field' : ''}
              autoComplete="off"
            />
            {error && <span className="error-msg show">{error}</span>}
          </div>
          <div className="field-group" style={{ justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Add Subject
            </button>
          </div>
        </form>

        <div className="table-wrap list-table-wrap mt-24">
          <table className="marks-table list-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Subject Name</th>
                <th style={{ width: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, index) => (
                <tr key={sub.id}>
                  <td>{index + 1}</td>
                  <td className="col-name">{sub.label}</td>
                  <td>
                    <button className="btn-delete" onClick={() => onDeleteSubject(sub.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showWarningModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowWarningModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Warning</h3>
            <p>Changing subjects may cause misalignment with existing student records. Consider clearing old records if you make structural changes.</p>
            <div className="modal-btns">
              <button className="btn btn-ghost" onClick={() => setShowWarningModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
