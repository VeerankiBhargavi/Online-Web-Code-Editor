import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const Sidebar = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'downloadHistory'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const handleDownload = async (filename) => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'downloadHistory'), {
        userId: user.uid,
        filename,
        timestamp: Timestamp.now(),
      });
      fetchHistory();
    }
  };

  return (
    <div className="sidebar">
      <button onClick={handleSignOut}>Sign Out</button>
      <h3>Download History</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>{item.filename} - {item.timestamp.toDate().toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
