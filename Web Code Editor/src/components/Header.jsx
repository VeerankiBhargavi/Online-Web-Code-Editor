//--------------------------------------------------------------------------------

// import { useContext, useEffect, useState } from 'react';
// import { AppBar, Toolbar, styled, Button, Box, Dialog, DialogTitle, DialogContent, List, ListItem, Typography } from '@mui/material';
// import { DataContext } from '../context/DataProvider';
// import { auth, db } from './firebase';
// import { useNavigate } from 'react-router-dom';
// import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

// const Container = styled(AppBar)`
//   background: #060606;
//   height: 9vh;
// `;

// const UserName = styled(Box)`
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: #ffcc00;
//   text-transform: capitalize;
//   flex-grow: 1;
// `;

// const StyledButton = styled(Button)`
//   text-transform: none;
//   font-size: 1rem;
//   font-weight: 500;
// `;

// const Header = () => {
//   const { html, setHtml, css, setCss, js, setJs } = useContext(DataContext);
//   const navigate = useNavigate();
//   const [historyOpen, setHistoryOpen] = useState(false);
//   const [downloadHistory, setDownloadHistory] = useState([]);
//   const [userName, setUserName] = useState('Your Web Space');

//   useEffect(() => {
//     auth.onAuthStateChanged((user) => {
//       if (!user) {
//         navigate('/login');
//       } else {
//         const emailName = user.email ? user.email.split('@')[0] : 'User';
//         setUserName(`${emailName}'s Web Space`);
//       }
//     });
//   }, [navigate]);

//   const handleDownload = async () => {
//     const combinedCode = `
//       <html>
//         <head>
//           <style>${css}</style>
//         </head>
//         <body>
//           ${html}
//           <script>${js}</script>
//         </body>
//       </html>
//     `;

//     const element = document.createElement('a');
//     const file = new Blob([combinedCode], { type: 'text/html' });
//     element.href = URL.createObjectURL(file);
//     element.download = 'code.html';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);

//     const user = auth.currentUser;
//     if (user) {
//       const historyRef = collection(db, `users/${user.uid}/history`);
//       await addDoc(historyRef, {
//         code: combinedCode,
//         timestamp: new Date().toISOString()
//       });
//     }
//   };

//   const fetchHistory = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       const historyRef = collection(db, `users/${user.uid}/history`);
//       const q = query(historyRef, orderBy("timestamp", "asc"));
//       const snapshot = await getDocs(q);
//       const historyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setDownloadHistory(historyList);
//       setHistoryOpen(true);
//     }
//   };

//   const loadCodeFromHistory = (code) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(code, 'text/html');
//     setHtml(doc.body.innerHTML);
//     setCss(doc.querySelector('style')?.innerHTML || '');
//     setJs(doc.querySelector('script')?.innerHTML || '');
//     setHistoryOpen(false);
//   };

//   return (
//     <Container position="static">
//       <Toolbar>
//         <UserName>{userName}</UserName>
//         <Box display="flex">
//           <Box mr={2}>
//             <StyledButton onClick={handleDownload} variant="contained" color="primary">
//               Download Code
//             </StyledButton>
//           </Box>
//           <Box mr={2}>
//             <StyledButton onClick={fetchHistory} variant="contained" color="info">
//               History
//             </StyledButton>
//           </Box>
//           <Box>
//             <StyledButton onClick={() => auth.signOut().then(() => navigate('/login'))} variant="contained" color="secondary">
//               Sign Out
//             </StyledButton>
//           </Box>
//         </Box>
//       </Toolbar>

//       <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}>
//         <DialogTitle>Download History</DialogTitle>
//         <DialogContent>
//           {downloadHistory.length === 0 ? (
//             <Typography>No download history available.</Typography>
//           ) : (
//             <List>
//               {downloadHistory.map((entry, index) => (
//                 <ListItem key={index} button onClick={() => loadCodeFromHistory(entry.code)}>
//                   Downloaded on: {new Date(entry.timestamp).toLocaleString()}
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Container>
//   );
// };

// export default Header;

import { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, styled, Button, Box, Dialog, DialogTitle, DialogContent, List, ListItem, Typography } from '@mui/material';
import { DataContext } from '../context/DataProvider';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

const Container = styled(AppBar)`
  background: #060606;
  height: 9vh;
`;

const UserName = styled(Box)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
  text-transform: capitalize;
  flex-grow: 1;
`;

const StyledButton = styled(Button)`
  text-transform: none;
  font-size: 1rem;
  font-weight: 500;
`;

const Header = () => {
  const { html, setHtml, css, setCss, js, setJs } = useContext(DataContext);
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [userName, setUserName] = useState('Your Web Space');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        const displayName = user.displayName || 'User'; // Fetching display name
        setUserName(`${displayName}'s Web Space`);
      }
    });
  }, [navigate]);

  const handleDownload = async () => {
    const combinedCode = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;

    const element = document.createElement('a');
    const file = new Blob([combinedCode], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'code.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    const user = auth.currentUser;
    if (user) {
      const historyRef = collection(db, `users/${user.uid}/history`);
      await addDoc(historyRef, {
        code: combinedCode,
        timestamp: new Date().toISOString()
      });
    }
  };

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (user) {
      const historyRef = collection(db, `users/${user.uid}/history`);
      const q = query(historyRef, orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      const historyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDownloadHistory(historyList);
      setHistoryOpen(true);
    }
  };

  const loadCodeFromHistory = (code) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    setHtml(doc.body.innerHTML);
    setCss(doc.querySelector('style')?.innerHTML || '');
    setJs(doc.querySelector('script')?.innerHTML || '');
    setHistoryOpen(false);
  };

  return (
    <Container position="static">
      <Toolbar>
        <UserName>{userName}</UserName>
        <Box display="flex">
          <Box mr={2}>
            <StyledButton onClick={handleDownload} variant="contained" color="primary">
              Download Code
            </StyledButton>
          </Box>
          <Box mr={2}>
            <StyledButton onClick={fetchHistory} variant="contained" color="info">
              History
            </StyledButton>
          </Box>
          <Box>
            <StyledButton onClick={() => auth.signOut().then(() => navigate('/login'))} variant="contained" color="secondary">
              Sign Out
            </StyledButton>
          </Box>
        </Box>
      </Toolbar>

      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <DialogTitle>Download History</DialogTitle>
        <DialogContent>
          {downloadHistory.length === 0 ? (
            <Typography>No download history available.</Typography>
          ) : (
            <List>
              {downloadHistory.map((entry, index) => (
                <ListItem key={index} button onClick={() => loadCodeFromHistory(entry.code)}>
                  Downloaded on: {new Date(entry.timestamp).toLocaleString()}
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Header;
