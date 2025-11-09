
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import DocumentsContainer from './components/DocumentsContainer';  // ← הוסיפי!
import VirtualKeyboard from './components/VirtualKeyboard';
import StyleControls from './components/StyleControls';
import ActionButtons from './components/ActionButtons';
import FileManager from './components/FileManager';

function App() {
  const [currentUser, setCurrentUser] = useState('user1');
 
  // ⭐ עכשיו יש מערך של מסמכים + מסמך פעיל
  const [documents, setDocuments] = useState([{
    id: 1,
    name: "מסמך 1",
    content: []
  }]);
  const [activeDocId, setActiveDocId] = useState(1);  // ← ID של המסמך הפעיל

  const [currentStyle, setCurrentStyle] = useState({
    font: 'Arial',
    size: 20,
    color: '#000000'
  });

  const [history, setHistory] = useState([]);

  // ⭐ מציאת המסמך הפעיל
  const activeDoc = documents.find(d => d.id === activeDocId);

  // ===============================
  // פונקציות - ניהול מסמכים
  // ===============================

  // יצירת מסמך חדש
  const handleNewDoc = () => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    const newDoc = {
      id: newId,
      name: `מסמך ${newId}`,
      content: []
    };
    setDocuments([...documents, newDoc]);
    setActiveDocId(newId);  // עבור למסמך החדש
  };

  // סגירת מסמך
  const handleCloseDoc = (id) => {
    if (documents.length === 1) {
      alert('⚠️ לא ניתן לסגור את המסמך האחרון!');
      return;
    }

    if (window.confirm('לסגור את המסמך? (שמור אותו לפני!)')) {
      setDocuments(docs => docs.filter(d => d.id !== id));
     
      // אם סגרנו את המסמך הפעיל, עבור למסמך הראשון
      if (id === activeDocId) {
        const remainingDocs = documents.filter(d => d.id !== id);
        setActiveDocId(remainingDocs[0].id);
      }
    }
  };

  // מעבר בין מסמכים
  const handleSwitchDoc = (id) => {
    setActiveDocId(id);
  };

  // ===============================
  // פונקציות - מקלדת
  // ===============================
 
  const handleCharacterClick = (char) => {
    setDocuments(prev => {
      setHistory(h => [...h, prev]);
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {  // ← רק למסמך הפעיל!
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
      });
    });
  };

  // ===============================
  // פונקציות - עיצוב
  // ===============================
 
  const handleStyleChange = (newStyle) => {
    setCurrentStyle(prev => ({ ...prev, ...newStyle }));
  };

  // ===============================
  // פונקציות - משתמש
  // ===============================
 
  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
    setDocuments([{
      id: 1,
      name: "מסמך 1",
      content: []
    }]);
    setActiveDocId(1);
    setHistory([]);
  };

  // ===============================
  // פונקציות - פעולות מחיקה
  // ===============================
 
  const handleDeleteChar = () => {
    setDocuments(prev => {
      setHistory(h => [...h, prev]);
     
      return prev.map(doc => {
        if (doc.id === activeDocId && doc.content.length > 0) {
          return {
            ...doc,
            content: doc.content.slice(0, -1)
          };
        }
        return doc;
      });
    });
  };

  const handleDeleteWord = () => {
    setDocuments(prev => {
      setHistory(h => [...h, prev]);
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {
          let content = [...doc.content];
         
          while (content.length > 0 && content[content.length - 1].text === ' ') {
            content.pop();
          }
         
          while (content.length > 0 && content[content.length - 1].text !== ' ') {
            content.pop();
          }
         
          return { ...doc, content };
        }
        return doc;
      });
    });
  };

  const handleDeleteAll = () => {
    if (window.confirm('למחוק את כל הטקסט?')) {
      setDocuments(prev => {
        setHistory(h => [...h, prev]);
       
        return prev.map(doc => {
          if (doc.id === activeDocId) {
            return { ...doc, content: [] };
          }
          return doc;
        });
      });
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setDocuments(lastState);
      setHistory(h => h.slice(0, -1));
    }
  };

  // ===============================
  // פונקציות - ניהול קבצים
  // ===============================
 
  const handleSaveFile = (fileName) => {
    console.log(`נשמר: ${fileName}`);
  };

  const handleOpenFile = (loadedDoc) => {
    // פתיחת קובץ כמסמך חדש
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    const newDoc = {
      ...loadedDoc,
      id: newId
    };
    setDocuments([...documents, newDoc]);
    setActiveDocId(newId);
    setHistory([]);
  };

  // ===============================
  // תצוגה
  // ===============================
 
  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />
     
      <main style={{maxWidth: '1200px', margin: '20px auto', padding: '20px'}}>
       
        {/* ⭐ מכל המסמכים */}
        <DocumentsContainer
          documents={documents}
          activeId={activeDocId}
          onSwitch={handleSwitchDoc}
          onClose={handleCloseDoc}
          onNewDoc={handleNewDoc}
        />
       
        {/* ניהול קבצים */}
        <FileManager
          currentUser={currentUser}
          currentDoc={activeDoc}  // ← המסמך הפעיל
          onSave={handleSaveFile}
          onOpen={handleOpenFile}
        />
       
        {/* כפתורי פעולות */}
        <ActionButtons
          onDeleteChar={handleDeleteChar}
          onDeleteWord={handleDeleteWord}
          onDeleteAll={handleDeleteAll}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
       
        {/* כפתורי עיצוב */}
        <StyleControls
          currentStyle={currentStyle}
          onStyleChange={handleStyleChange}
        />
       
        {/* מקלדת */}
        <VirtualKeyboard
          onCharacterClick={handleCharacterClick}
        />
       
      </main>
    </div>
  );
}

export default App;