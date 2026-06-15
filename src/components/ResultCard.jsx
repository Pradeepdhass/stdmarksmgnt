import React, { useEffect, useState } from 'react';

export default function ResultCard({ result, subjectsCount, onNewStudent }) {
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    // Triggers micro-animation for progress fill on card mount
    const timer = setTimeout(() => {
      setProgressWidth(`${Math.min(result.percentage, 100)}%`);
    }, 200);
    return () => clearTimeout(timer);
  }, [result]);

  const getProgressBackground = (pct) => {
    if (pct >= 75) return 'linear-gradient(90deg, var(--teal-neon), var(--pass-emerald))';
    if (pct >= 50) return 'linear-gradient(90deg, var(--indigo-deep), var(--warn-gold))';
    return 'linear-gradient(90deg, var(--indigo-deep), var(--fail-rose))';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="card result-card animate-slide-up" id="resultSection">
      {result.isTopper && (
        <div className="topper-banner">
          ✨ OUTSTANDING PERFORMANCE · TOPPER STATUS ACHIEVED! ✨
        </div>
      )}
      
      <div className="result-header">
        <div className="school-info">
          <div className="school-logo">🎓</div>
          <div>
            <p className="school-name">Excellence Academy</p>
            <p className="school-sub">Official Academic Record · 2026–27</p>
          </div>
        </div>
        <div className="grade-badge-wrap">
          <div className="grade-badge">{result.grade}</div>
          <p className="grade-label">GRADE</p>
        </div>
      </div>

      <div className="student-meta">
        <div className="meta-item">
          <span className="meta-label">Student Name</span>
          <span className="meta-value">{result.name}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Register No.</span>
          <span className="meta-value">{result.regNo}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Exam Date</span>
          <span className="meta-value">{result.examDate}</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="marks-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Subject</th>
              <th>Max Marks</th>
              <th>Marks Obtained</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.subjectResults.map((sub, idx) => (
              <tr key={idx}>
                <td>{String(idx + 1).padStart(2, '0')}</td>
                <td>{sub.label}</td>
                <td>100</td>
                <td className={!sub.passed ? 'low-mark' : ''}>{sub.marks}</td>
                <td className={sub.passed ? 'status-pass' : 'status-fail'}>
                  {sub.passed ? '✔ Pass' : '✘ Fail'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-grid">
        <div className="summary-item">
          <span className="s-label">Total Marks</span>
          <span className="s-value">{result.total}</span>
          <span className="s-out">/ {subjectsCount * 100}</span>
        </div>
        <div className="summary-item">
          <span className="s-label">Average</span>
          <span className="s-value">{result.average}</span>
        </div>
        <div className="summary-item">
          <span className="s-label">Percentage</span>
          <span className="s-value">{result.percentage}</span>
          <span className="s-out">%</span>
        </div>
        <div className="summary-item">
          <span className="s-label">Result</span>
          <span className={`s-value status-value ${result.overallPass ? 'pass' : 'fail'}`}>
            {result.overallPass ? 'PASS' : 'FAIL'}
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Performance Meter</span>
          <span>{result.percentage}%</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ 
              width: progressWidth,
              background: getProgressBackground(result.percentage)
            }}
          />
        </div>
        <div className="progress-ticks">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handlePrint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Result
        </button>
        <button className="btn btn-ghost" onClick={onNewStudent}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Student
        </button>
      </div>
    </section>
  );
}
