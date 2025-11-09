// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useState } from 'react';
import './App.css';
import Header from './components/Header';  // ← הוסיפי!
import Document from './components/Document';
import VirtualKeyboard from './components/VirtualKeyboard';
import StyleControls from './components/StyleControls';

function App() {
  const [currentUser, setCurrentUser] = useState('user1');  // ← הוסיפי!
 
  const [documents, setDocuments] = useState([{
    id: 1,
    name: "מסמך ניסיון",
    content: []
  }]);

  const [currentStyle, setCurrentStyle] = useState({
    font: 'Arial',
    size: 20,
    color: '#000000'
  });

  const handleCharacterClick = (char) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === 1) {
        return {
          ...doc,
          content: [
            ...doc.content,
            {
              text: char,
              style: { ...currentStyle }
            }
          ]
        };
      }
      return doc;
    }));
  };

  const handleStyleChange = (newStyle) => {
    setCurrentStyle(prev => ({ ...prev, ...newStyle }));
  };

  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
    // בעתיד: כאן נטען את המסמכים של המשתמש החדש מ-LocalStorage
  };

  return (
    <div className="app">
      {/* הכותרת החדשה! */}
      <Header
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />
     
      <main style={{maxWidth: '900px', margin: '20px auto', padding: '20px'}}>
        <Document
          doc={documents[0]}
          isActive={true}
          onSwitch={() => {}}
          onClose={() => {}}
        />
       
        <StyleControls
          currentStyle={currentStyle}
          onStyleChange={handleStyleChange}
        />
       
        <VirtualKeyboard
          onCharacterClick={handleCharacterClick}
        />
      </main>
    </div>
  );
}

export default App;