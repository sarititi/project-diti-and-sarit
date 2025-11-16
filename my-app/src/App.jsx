
import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import DocumentsContainer from './components/DocumentsContainer';
import VirtualKeyboard from './components/VirtualKeyboard';
import StyleControls from './components/StyleControls';
import ActionButtons from './components/ActionButtons';
import FileManager from './components/FileManager';
import SearchReplace from './components/SearchReplace';

// import { useState } from 'react';
// import './App_FINAL.css';
// import Header from './components/Header';
// import DocumentsContainer from './components/DocumentsContainer';
// import VirtualKeyboard from './components/VirtualKeyboard';
// import StyleControls from './components/StyleControls';
// import ActionButtons from './components/ActionButtons';
// import FileManager from './components/FileManager';
// import SearchReplace from './components/SearchReplace';

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
    fontFamily: 'Arial',
    fontSize: '20px',
    color: '#000000',
    applyMode: 'forward' // 'forward' או 'selected'
  });

  // ⭐ היסטוריה נפרדת לכל מסמך!
  const [history, setHistory] = useState({
    1: []  // מסמך 1 מתחיל עם היסטוריה ריקה
  });

  // מציאת המסמך הפעיל
  const activeDoc = documents.find(d => d.id === activeDocId);
  const otherDocs = documents.filter(d => d.id !== activeDocId);

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
                char: char,
                fontFamily: currentStyle.fontFamily,
                fontSize: currentStyle.fontSize,
                color: currentStyle.color
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
 
  // שינוי סטייל (כולל מצב החלה)
  const handleStyleChange = (newStyle) => {
    setCurrentStyle(prev => ({ ...prev, ...newStyle }));
    
    // אם במצב "לקטע מסומן" ויש טקסט מסומן - החל על המסומן
    // (זה ידרש הוספת selection state בעתיד)
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
            content: doc.content.map(charObj => ({
              ...charObj,
              fontFamily: newStyle.fontFamily || charObj.fontFamily,
              fontSize: newStyle.fontSize || charObj.fontSize,
              color: newStyle.color || charObj.color
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
         
          while (content.length > 0 && content[content.length - 1].char === ' ') {
            content.pop();
          }
         
          while (content.length > 0 && content[content.length - 1].char !== ' ') {
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
  // פונקציות - חיפוש והחלפה
  // ===============================
 
  // הדגשת תו (אופציונלי - אם רוצה אפקט ויזואלי)
  const handleHighlight = (index) => {
    console.log(`מדגיש תו במיקום ${index}`);
    // אפשר להוסיף אפקט ויזואלי בעתיד
  };

  // החלפת תו בודד
  const handleReplace = (index, newChar) => {
    setDocuments(prev => {
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {
          const newContent = [...doc.content];
          newContent[index] = {
            ...newContent[index],
            char: newChar
          };
          return { ...doc, content: newContent };
        }
        return doc;
      });
    });
  };

  // החלפת כל המופעים
  const handleReplaceAll = (searchChar, replaceChar) => {
    setDocuments(prev => {
      setHistory(h => ({
        ...h,
        [activeDocId]: [...(h[activeDocId] || []), prev]
      }));
     
      return prev.map(doc => {
        if (doc.id === activeDocId) {
          const newContent = doc.content.map(charObj =>
            charObj.char === searchChar
              ? { ...charObj, char: replaceChar }
              : charObj
          );
          return { ...doc, content: newContent };
        }
        return doc;
      });
    });
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
  // תצוגה - מבנה חדש!
  // ===============================
 
  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />
     
      <div className="main-container">
        {/* אזור המסך - 60% */}
        <div className="screen-area">
          {/* מסמך פעיל גדול */}
          <div className="main-document">
            {activeDoc && (
              <>
                <div className="document-header">
                  <div className="document-name">{activeDoc.name}</div>
                  <button 
                    className="close-btn"
                    onClick={() => handleCloseDoc(activeDoc.id)}
                  >
                    ×
                  </button>
                </div>
                <div className="document-display">
                  {activeDoc.content.length === 0 ? (
                    <span className="placeholder">התחילי לכתוב...</span>
                  ) : (
                    activeDoc.content.map((charObj, index) => (
                      <span
                        key={index}
                        style={{
                          fontFamily: charObj.fontFamily,
                          fontSize: charObj.fontSize,
                          color: charObj.color
                        }}
                      >
                        {charObj.char}
                      </span>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* רשימת מסמכים בצד */}
          <div className="documents-sidebar">
            <div className="sidebar-header">
              <h3>המסמכים שלי</h3>
              <button className="new-doc-btn" onClick={handleNewDoc}>
                + מסמך חדש
              </button>
            </div>
            
            <div className="documents-scroll-list">
              {otherDocs.length === 0 ? (
                <div className="no-documents">אין מסמכים נוספים</div>
              ) : (
                otherDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="sidebar-doc"
                    onClick={() => handleSwitchDoc(doc.id)}
                  >
                    <div className="document-header">
                      <div className="document-name">{doc.name}</div>
                      <button 
                        className="close-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseDoc(doc.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div className="document-display">
                      {doc.content.length === 0 ? (
                        <span className="placeholder">ריק</span>
                      ) : (
                        doc.content.slice(0, 20).map((charObj, i) => (
                          <span
                            key={i}
                            style={{
                              fontFamily: charObj.fontFamily,
                              fontSize: charObj.fontSize,
                              color: charObj.color
                            }}
                          >
                            {charObj.char}
                          </span>
                        ))
                      )}
                      {doc.content.length > 20 && '...'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* אזור המקלדת - 40% */}
        <div className="keyboard-area">
          {/* מקלדת ראשית - 65% */}
          <div className="keyboard-main">
            <VirtualKeyboard
              onCharacterClick={handleCharacterClick}
              onDeleteChar={handleDeleteChar}
              onDeleteWord={handleDeleteWord}
              onDeleteAll={handleDeleteAll}
              onUndo={handleUndo}
              canUndo={(history[activeDocId] || []).length > 0}
              onSave={handleSaveFile}
              onOpen={handleOpenFile}
              currentUser={currentUser}
              currentDoc={activeDoc}
              onHighlight={handleHighlight}
              onReplace={handleReplace}
              onReplaceAll={handleReplaceAll}
            />
          </div>
          
          {/* פאנל עיצוב - 35% */}
          <div className="style-panel">
            <StyleControls
              currentStyle={currentStyle}
              onStyleChange={handleStyleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;