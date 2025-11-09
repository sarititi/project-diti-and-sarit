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
import Document from './components/Document';
import VirtualKeyboard from './components/VirtualKeyboard';

function App() {
  const [language, setLanguage] = useState('hebrew');
  const [documents, setDocuments] = useState([{
    id: 1,
    name: "מסמך ניסיון",
    content: []
  }]);

  const addChar = (char) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === 1) {
        return {
          ...doc,
          content: [...doc.content, {
            text: char,
            style: { font: 'Arial', size: 20, color: '#000' }
          }]
        };
      }
      return doc;
    }));
  };

  return (
    <div className="app">
      <h1 style={{textAlign: 'center', padding: '20px', color: 'white'}}>
        📝 עורך טקסט
      </h1>
     
      <main style={{maxWidth: '900px', margin: '20px auto', padding: '20px'}}>
        <Document
          doc={documents[0]}
          isActive={true}
          onSwitch={() => {}}
          onClose={() => {}}
        />
       
        <div style={{marginTop: '30px'}}>
          <VirtualKeyboard
            language={language}
            onKeyPress={addChar}
            onLanguageChange={setLanguage}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
