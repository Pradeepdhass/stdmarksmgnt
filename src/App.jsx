import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

import Header from './components/Header';
import Navbar from './components/Navbar';
import EnterMarks from './components/EnterMarks';
import MarksList from './components/MarksList';
import ManageSubjects from './components/ManageSubjects';

export default function App() {
  const [activeTab, setActiveTab] = useState('enter');
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Subjects and Records from Firestore
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load Subjects
        const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
        let loadedSubjects = [];
        subjectsSnapshot.forEach((doc) => {
          loadedSubjects.push(doc.data());
        });

        // Seed default subjects if Firestore is empty
        if (loadedSubjects.length === 0) {
          const defaults = [
            { id: 'tamil', label: 'Tamil' },
            { id: 'english', label: 'English' },
            { id: 'maths', label: 'Maths' },
            { id: 'science', label: 'Science' },
            { id: 'social', label: 'Social Science' }
          ];
          for (const sub of defaults) {
            await setDoc(doc(db, 'subjects', sub.id), sub);
          }
          loadedSubjects = defaults;
        }
        setSubjects(loadedSubjects);

        // Load Records
        const recordsQuery = query(collection(db, 'records'), orderBy('savedAt', 'desc'));
        const recordsSnapshot = await getDocs(recordsQuery);
        const loadedRecords = [];
        recordsSnapshot.forEach((doc) => {
          loadedRecords.push(doc.data());
        });
        setRecords(loadedRecords);
      } catch (err) {
        console.error('Error loading data from Firestore:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Save Record
  const handleSaveRecord = async (result) => {
    try {
      const docId = result.regNo.toLowerCase();
      await setDoc(doc(db, 'records', docId), result);
      
      // Update local state, placing newest at the top
      setRecords((prev) => {
        const filtered = prev.filter((r) => r.regNo.toLowerCase() !== docId);
        return [result, ...filtered];
      });
    } catch (err) {
      console.error('Error saving record to Firestore:', err);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (regNo) => {
    try {
      const docId = regNo.toLowerCase();
      await deleteDoc(doc(db, 'records', docId));
      
      // Update local state
      setRecords((prev) => prev.filter((r) => r.regNo.toLowerCase() !== docId));
      
      // Reset active card if it's the deleted student
      if (activeResult && activeResult.regNo.toLowerCase() === docId) {
        setActiveResult(null);
      }
    } catch (err) {
      console.error('Error deleting record from Firestore:', err);
    }
  };

  // Clear All Records
  const handleClearAll = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'records'));
      const batch = writeBatch(db);
      snapshot.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();

      setRecords([]);
      setActiveResult(null);
    } catch (err) {
      console.error('Error clearing all records from Firestore:', err);
    }
  };

  // Add Subject
  const handleAddSubject = async (sub) => {
    try {
      await setDoc(doc(db, 'subjects', sub.id), sub);
      setSubjects((prev) => [...prev, sub]);
    } catch (err) {
      console.error('Error adding subject to Firestore:', err);
    }
  };

  // Delete Subject
  const handleDeleteSubject = async (id) => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting subject from Firestore:', err);
    }
  };

  return (
    <>
      <div className="bg-overlay"></div>
      <div className="wrapper">
        <Header />
        
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          recordCount={records.length} 
        />
        
        {loading ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--teal-neon)', fontWeight: '600' }}>
            <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '10px' }}>⚡ Loading Database Sync...</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please wait while we connect to Firebase Firestore.</p>
          </div>
        ) : (
          <>
            {activeTab === 'enter' && (
              <EnterMarks 
                subjects={subjects} 
                onSaveRecord={handleSaveRecord} 
                activeResult={activeResult}
                setActiveResult={setActiveResult}
              />
            )}
            
            {activeTab === 'list' && (
              <MarksList 
                records={records} 
                subjects={subjects} 
                onDeleteRecord={handleDeleteRecord} 
                onClearAll={handleClearAll}
                setActiveTab={setActiveTab}
              />
            )}
            
            {activeTab === 'subjects' && (
              <ManageSubjects 
                subjects={subjects} 
                onAddSubject={handleAddSubject} 
                onDeleteSubject={handleDeleteSubject} 
              />
            )}
          </>
        )}

        <footer className="site-footer">
          Built for &nbsp;·&nbsp; Student Result Management System
        </footer>
      </div>
    </>
  );
}
