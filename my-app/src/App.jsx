
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import DocumentsContainer from './components/DocumentsContainer';
import VirtualKeyboard from './components/VirtualKeyboard';
import StyleControls from './components/StyleControls';
import ActionButtons from './components/ActionButtons';
import FileManager from './components/FileManager';

function App() {
  // ===============================
  // State ראשי
  // ===============================
 
  const [currentUser, setCurrentUser] = useState('user1');
 
  const [documents, setDocuments] = useState([{
    id: 1,
    name: "מסמך 1",
    content: []
  }]);
 
  const [activeDocId, setActiveDocId] = useState(1);

  const [currentStyle, setCurrentStyle] = useState({
    font: 'Arial',
    size: 20,
    color: '#000000'
  });

  // ⭐ היסטוריה נפרדת לכל מסמך!
  const [history, setHistory] = useState({
    1: []  // מסמך 1 מתחיל עם היסטוריה ריקה
  });

  // מציאת המסמך הפעיל
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
    setActiveDocId(newId);
   
    // ⭐ יצירת היסטוריה ריקה למסמך החדש
    setHistory(prev => ({
      ...prev,
      [newId]: []
    }));
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
     
      // ⭐ מחיקת היסטוריה של המסמך שנסגר
      setHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[id];
        return newHistory;
      });
    }
  };

  // מעבר בין מסמכים
  const handleSwitchDoc = (id) => {
    setActiveDocId(id);
    // ⭐ לא מוחקים כלום! כל מסמך שומר את ההיסטוריה שלו
  };

  // ===============================
  // פונקציות - מקלדת
  // ===============================
 
  const handleCharacterClick = (char) => {
    setDocuments(prev => {
      // ⭐ שמור את המצב הנוכחי להיסטוריה של המסמך הפעיל
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {
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
 
  // שינוי סטייל לתווים חדשים בלבד
  const handleStyleChange = (newStyle) => {
    setCurrentStyle(prev => ({ ...prev, ...newStyle }));
  };

  // החלת סטייל על כל הטקסט הקיים
  const handleApplyStyleToAll = (newStyle) => {
    setDocuments(prev => {
      // ⭐ שמור להיסטוריה של המסמך הפעיל
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {
          return {
            ...doc,
            content: doc.content.map(char => ({
              ...char,
              style: { ...char.style, ...newStyle }
            }))
          };
        }
        return doc;
      });
    });
   
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
    // ⭐ איפוס כל ההיסטוריה
    setHistory({ 1: [] });
  };

  // ===============================
  // פונקציות - פעולות מחיקה
  // ===============================
 
  // מחיקת תו אחרון
  const handleDeleteChar = () => {
    setDocuments(prev => {
      // ⭐ שמור להיסטוריה של המסמך הפעיל
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
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

  // מחיקת מילה אחרונה
  const handleDeleteWord = () => {
    setDocuments(prev => {
      // ⭐ שמור להיסטוריה של המסמך הפעיל
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
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

  // מחיקת כל הטקסט
  const handleDeleteAll = () => {
    if (window.confirm('למחוק את כל הטקסט?')) {
      setDocuments(prev => {
        // ⭐ שמור להיסטוריה של המסמך הפעיל
        setHistory(h => ({
          ...h,
          [activeDocId]: [...(h[activeDocId] || []), prev]
        }));
       
        return prev.map(doc => {
          if (doc.id === activeDocId) {
            return { ...doc, content: [] };
          }
          return doc;
        });
      });
    }
  };

  // Undo - ביטול פעולה אחרונה
  const handleUndo = () => {
    const docHistory = history[activeDocId] || [];
   
    if (docHistory.length > 0) {
      const lastState = docHistory[docHistory.length - 1];
      setDocuments(lastState);
     
      // ⭐ הסר רק מההיסטוריה של המסמך הפעיל
      setHistory(h => ({
        ...h,
        [activeDocId]: docHistory.slice(0, -1)
      }));
    }
  };

  // ===============================
  // פונקציות - ניהול קבצים
  // ===============================
 
  const handleSaveFile = (fileName) => {
    console.log(`נשמר: ${fileName}`);
  };

  const handleOpenFile = (loadedDoc) => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    const newDoc = {
      ...loadedDoc,
      id: newId
    };
    setDocuments([...documents, newDoc]);
    setActiveDocId(newId);
   
    // ⭐ יצירת היסטוריה ריקה למסמך הנפתח
    setHistory(prev => ({
      ...prev,
      [newId]: []
    }));
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
       
        <DocumentsContainer
          documents={documents}
          activeId={activeDocId}
          onSwitch={handleSwitchDoc}
          onClose={handleCloseDoc}
          onNewDoc={handleNewDoc}
        />
       
        <FileManager
          currentUser={currentUser}
          currentDoc={activeDoc}
          onSave={handleSaveFile}
          onOpen={handleOpenFile}
        />
       
        <ActionButtons
          onDeleteChar={handleDeleteChar}
          onDeleteWord={handleDeleteWord}
          onDeleteAll={handleDeleteAll}
          onUndo={handleUndo}
          canUndo={(history[activeDocId] || []).length > 0}  // ⭐ בדיקה לפי המסמך הפעיל
        />
       
        <StyleControls
          currentStyle={currentStyle}
          onStyleChange={handleStyleChange}
          onApplyToAll={handleApplyStyleToAll}
        />
       
        <VirtualKeyboard
          onCharacterClick={handleCharacterClick}
        />
       
      </main>
    </div>
  );
}

export default App;
