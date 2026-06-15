import React, { useState, useEffect } from 'react';
import ResultCard from './ResultCard';

const PASS_MARK = 35;
const MAX_PER_SUBJECT = 100;
const TOPPER_THRESHOLD = 95;

const GRADE_THRESHOLDS = [
  { min: 90, grade: 'A+' },
  { min: 75, grade: 'A' },
  { min: 60, grade: 'B' },
  { min: 45, grade: 'C' },
  { min: 35, grade: 'D' },
];

export default function EnterMarks({ subjects, onSaveRecord, activeResult, setActiveResult }) {
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [marks, setMarks] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize marks state when subjects list loads
  useEffect(() => {
    const initialMarks = {};
    subjects.forEach(sub => {
      initialMarks[sub.id] = '';
    });
    setMarks(initialMarks);
    setErrors({});
  }, [subjects]);

  const validate = () => {
    const newErrors = {};
    if (!studentName.trim()) {
      newErrors.studentName = 'Please enter student name';
    }
    if (!regNo.trim()) {
      newErrors.regNo = 'Please enter register number';
    }

    subjects.forEach(sub => {
      const val = marks[sub.id];
      if (val === undefined || val === '' || isNaN(val) || Number(val) < 0 || Number(val) > 100) {
        newErrors[sub.id] = 'Valid marks (0–100)';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMarkChange = (subId, val) => {
    setMarks(prev => ({ ...prev, [subId]: val }));
    if (val !== '' && !isNaN(val) && Number(val) >= 0 && Number(val) <= 100) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[subId];
        return next;
      });
    }
  };

  const handleNameChange = (val) => {
    setStudentName(val);
    if (val.trim()) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.studentName;
        return next;
      });
    }
  };

  const handleRegChange = (val) => {
    setRegNo(val);
    if (val.trim()) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.regNo;
        return next;
      });
    }
  };

  const handleReset = () => {
    setStudentName('');
    setRegNo('');
    const resetMarks = {};
    subjects.forEach(sub => {
      resetMarks[sub.id] = '';
    });
    setMarks(resetMarks);
    setErrors({});
    setActiveResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrEl = document.querySelector('.error-field');
      if (firstErrEl) {
        firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const subjectResults = subjects.map(sub => {
        const score = Number(marks[sub.id]);
        return {
          label: sub.label,
          marks: score,
          passed: score >= PASS_MARK,
        };
      });

      const total = subjectResults.reduce((sum, item) => sum + item.marks, 0);
      const average = total / subjects.length;
      const percentage = (total / (subjects.length * MAX_PER_SUBJECT)) * 100;
      const overallPass = subjectResults.every(s => s.passed);

      let grade = 'F';
      if (overallPass) {
        const found = GRADE_THRESHOLDS.find(g => percentage >= g.min);
        grade = found ? found.grade : 'F';
      }

      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const today = new Date();
      const examDate = `${String(today.getDate()).padStart(2,'0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

      const calculatedResult = {
        name: studentName.trim(),
        regNo: regNo.trim(),
        subjectResults,
        total,
        average: parseFloat(average.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
        grade,
        overallPass,
        isTopper: overallPass && percentage >= TOPPER_THRESHOLD,
        examDate,
        savedAt: Date.now()
      };

      await onSaveRecord(calculatedResult);
      setActiveResult(calculatedResult);

      setTimeout(() => {
        const resSec = document.getElementById('resultSection');
        if (resSec) {
          resSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <section className="card input-card" style={{ pointerEvents: isSubmitting ? 'none' : 'auto' }}>
        <div className="card-header">
          <span className="step-badge">STEP 01</span>
          <h2>Student Information</h2>
        </div>
        
        <div className="field-row">
          <div className="field-group">
            <label htmlFor="studentName">Student Name</label>
            <input 
              type="text" 
              id="studentName" 
              placeholder="e.g. Aravind Kumar" 
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              className={errors.studentName ? 'error-field' : ''}
              autoComplete="off"
            />
            {errors.studentName && <span className="error-msg show">{errors.studentName}</span>}
          </div>
          
          <div className="field-group">
            <label htmlFor="regNumber">Register Number</label>
            <input 
              type="text" 
              id="regNumber" 
              placeholder="e.g. 2024CS001" 
              value={regNo}
              onChange={(e) => handleRegChange(e.target.value)}
              className={errors.regNo ? 'error-field' : ''}
              autoComplete="off"
            />
            {errors.regNo && <span className="error-msg show">{errors.regNo}</span>}
          </div>
        </div>

        <div className="card-header mt-24">
          <span className="step-badge">STEP 02</span>
          <h2>Subject Marks <span className="hint">(0 – 100)</span></h2>
        </div>

        <div className="marks-grid">
          {subjects.map(sub => (
            <div key={sub.id} className="mark-field">
              <div className="subject-icon">{sub.label.charAt(0).toUpperCase()}</div>
              <label htmlFor={sub.id}>{sub.label}</label>
              <input 
                type="number" 
                id={sub.id} 
                placeholder="0-100" 
                min="0" 
                max="100"
                value={marks[sub.id] ?? ''}
                onChange={(e) => handleMarkChange(sub.id, e.target.value)}
                className={errors[sub.id] ? 'error-field' : ''}
              />
              {errors[sub.id] && <span className="error-msg show">{errors[sub.id]}</span>}
            </div>
          ))}
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            <span>{isSubmitting ? 'Saving...' : 'Generate & Save Result'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </section>

      {activeResult && (
        <ResultCard 
          result={activeResult} 
          subjectsCount={subjects.length} 
          onNewStudent={handleReset} 
        />
      )}
    </div>
  );
}
