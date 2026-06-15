import React from 'react';

export default function Navbar({ activeTab, setActiveTab, recordCount }) {
  return (
    <nav className="tab-nav animate-slide-down">
      <button 
        className={`tab-btn ${activeTab === 'enter' ? 'active' : ''}`}
        onClick={() => setActiveTab('enter')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Enter Marks
      </button>
      
      <button 
        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
        onClick={() => setActiveTab('list')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"  />
          <path d="M9 3v18" />
          <path d="M3 9h18" />
        </svg>
        Marks List
        <span className="tab-count">{recordCount}</span>
      </button>
      
      <button 
        className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
        onClick={() => setActiveTab('subjects')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        Manage Subjects
      </button>
    </nav>
  );
}
