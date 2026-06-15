import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function MarksList({ records, subjects, onDeleteRecord, onClearAll, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showClearModal, setShowClearModal] = useState(false);

  // Filter and Sort Records
  const getFilteredAndSortedRecords = () => {
    let result = [...records];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.regNo.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter === 'pass') {
      result = result.filter(r => r.overallPass);
    } else if (statusFilter === 'fail') {
      result = result.filter(r => !r.overallPass);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return (b.savedAt || 0) - (a.savedAt || 0);
      if (sortBy === 'date-asc') return (a.savedAt || 0) - (b.savedAt || 0);
      if (sortBy === 'perc-desc') return b.percentage - a.percentage;
      if (sortBy === 'perc-asc') return a.percentage - b.percentage;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  };

  const processedRecords = getFilteredAndSortedRecords();

  // Statistics Calculations
  const total = records.length;
  const passed = records.filter(r => r.overallPass).length;
  const failed = total - passed;
  const toppers = records.filter(r => r.isTopper).length;
  const avgPerc = total
    ? (records.reduce((sum, r) => sum + r.percentage, 0) / total).toFixed(1)
    : 0;
  const highest = total
    ? Math.max(...records.map(r => r.percentage))
    : 0;

  // Percentage Color
  const percentColor = (pct) => {
    if (pct >= 75) return 'var(--pass-emerald)';
    if (pct >= 45) return 'var(--warn-gold)';
    return 'var(--fail-rose)';
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('No records to export.');
      return;
    }

    const subjectHeaders = subjects.map(s => s.label);
    const headers = [
      'S.No', 'Name', 'Register No.',
      ...subjectHeaders,
      'Total', 'Average', 'Percentage', 'Grade', 'Result', 'Date'
    ];

    const rows = records.map((r, i) => {
      const marks = subjects.map(sub => {
        const sRes = r.subjectResults.find(sr => sr.label === sub.label);
        return sRes ? sRes.marks : '-';
      });
      return [
        i + 1,
        `"${r.name}"`,
        `"${r.regNo}"`,
        ...marks,
        r.total,
        r.average,
        r.percentage + '%',
        r.grade,
        r.overallPass ? 'Pass' : 'Fail',
        `"${r.examDate}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `student_results_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAllConfirm = () => {
    onClearAll();
    setShowClearModal(false);
  };

  return (
    <div className="animate-slide-up">
      <section className="card list-card">
        <div className="list-header">
          <div>
            <h2 className="list-title">Saved Marks List</h2>
            <p className="list-sub">
              {total} student{total !== 1 ? 's' : ''} saved
              {processedRecords.length !== total ? ` · ${processedRecords.length} shown` : ''}
            </p>
          </div>
          <div className="list-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowClearModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear All
            </button>
          </div>
        </div>

        <div className="search-bar">
          <div className="search-input-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by name or register number…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Results</option>
            <option value="pass">Pass Only</option>
            <option value="fail">Fail Only</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="perc-desc">Highest %</option>
            <option value="perc-asc">Lowest %</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </div>

        {total > 0 && (
          <div className="stats-bar">
            <div className="stat-chip">
              <span>Total</span>
              <span className="chip-num">{total}</span>
            </div>
            <div className="stat-chip green">
              <span>Pass</span>
              <span className="chip-num">{passed}</span>
            </div>
            <div className="stat-chip red">
              <span>Fail</span>
              <span className="chip-num">{failed}</span>
            </div>
            <div className="stat-chip amber">
              <span>Class Avg</span>
              <span className="chip-num">{avgPerc}%</span>
            </div>
            <div className="stat-chip">
              <span>Highest</span>
              <span className="chip-num">{highest}%</span>
            </div>
            <div className="stat-chip amber">
              <span>Toppers</span>
              <span className="chip-num">{toppers}</span>
            </div>
          </div>
        )}

        {processedRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No student records found.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('enter')}>
              Enter First Student
            </button>
          </div>
        ) : (
          <div className="table-wrap list-table-wrap">
            <table className="marks-table list-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Name</th>
                  <th>Reg. No.</th>
                  {subjects.map(sub => (
                    <th key={sub.id}>{sub.label}</th>
                  ))}
                  <th>Total</th>
                  <th>%</th>
                  <th>Grade</th>
                  <th>Result</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {processedRecords.map((r, idx) => (
                  <tr key={r.regNo} className={r.isTopper ? 'topper-row' : ''}>
                    <td>{idx + 1}</td>
                    <td className="col-name">{r.name}</td>
                    <td className="col-reg">{r.regNo}</td>
                    {subjects.map(sub => {
                      const sRes = r.subjectResults.find(sr => sr.label === sub.label);
                      return sRes ? (
                        <td key={sub.id} className={!sRes.passed ? 'low-mark' : ''}>
                          {sRes.marks}
                        </td>
                      ) : (
                        <td key={sub.id} style={{ color: 'var(--text-muted)' }}>-</td>
                      );
                    })}
                    <td><strong>{r.total}</strong></td>
                    <td className="col-pct" style={{ color: percentColor(r.percentage) }}>
                      {r.percentage}%
                    </td>
                    <td><strong>{r.grade}</strong></td>
                    <td className={r.overallPass ? 'status-pass' : 'status-fail'}>
                      {r.overallPass ? '✔ Pass' : '✘ Fail'}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {r.examDate}
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => onDeleteRecord(r.regNo)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmationModal
        show={showClearModal}
        title="Clear All Records?"
        message="This will permanently delete all saved student records from Firebase Firestore. This action cannot be undone."
        confirmText="Yes, Delete All"
        onConfirm={handleClearAllConfirm}
        onCancel={() => setShowClearModal(false)}
      />
    </div>
  );
}
