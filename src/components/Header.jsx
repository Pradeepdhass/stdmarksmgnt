import React from 'react';

export default function Header() {
  return (
    <header className="site-header animate-slide-down">
      <div className="header-badge">🎓</div>
      <h1 className="site-title">
        Student Result
        <span>Management System</span>
      </h1>
      <p className="site-sub">Enter marks · Generate results · View saved records</p>
    </header>
  );
}
