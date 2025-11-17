import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import VirtualKeyboard from './components/VirtualKeyboard';
import StyleControls from './components/StyleControls';
import SearchReplace from './components/SearchReplace'; // ייבוא רכיב החיפוש

function App() {
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
    applyMode: 'forward'
  });
  const [history, setHistory] = useState({ 1: [] });

  // State חדש לניהול המודאלים
  const [showFileModal, setShowFileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);

  const activeDoc = documents.find(d => d.id === activeDocId);

  // טעינת קבצים שמורים כאשר המשתמש משתנה
  useEffect(() => {
    loadSavedFiles();
  }, [currentUser]);

  const loadSavedFiles = () => {
    const allKeys = Object.keys(localStorage);
    const userFiles = allKeys
      .filter(key => key.startsWith(`${currentUser}_`))
      .map(key => key.replace(`${currentUser}_`, ''));
    setSavedFiles(userFiles);
  };

  const handleNewDoc = () => {
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    const newDoc = { id: newId, name: `מסמך ${newId}`, content: [] };
    setDocuments([...documents, newDoc]);
    setActiveDocId(newId);
    setHistory(prev => ({ ...prev, [newId]: [] }));
  };

// בתוך App.jsx, החלף את handleCloseDoc בגרסה זו:
const handleCloseDoc = (id) => {
    if (documents.length === 1) {
        alert('⚠️ לא ניתן לסגור את המסמך האחרון!');
        return;
    }

    // כאן הוספנו את ההצעה לשמירה
    if (window.confirm(`לסגור את המסמך "${documents.find(d => d.id === id).name}"?`)) {
        // אם המשתמש רוצה לסגור, נמשיך עם הלוגיקה הקיימת
        const remainingDocs = documents.filter(d => d.id !== id);
        setDocuments(remainingDocs);
        if (id === activeDocId) {
            setActiveDocId(remainingDocs[0].id);
        }
        setHistory(prev => {
            const newHistory = { ...prev };
            delete newHistory[id];
            return newHistory;
        });
    }
};

  const handleSwitchDoc = (id) => setActiveDocId(id);

  const updateActiveDocContent = (newContent) => {
    setDocuments(prevDocs => {
      setHistory(h => ({ ...h, [activeDocId]: [...(h[activeDocId] || []), prevDocs] }));
      return prevDocs.map(doc =>
        doc.id === activeDocId ? { ...doc, content: newContent } : doc
      );
    });
  };

  const handleCharacterClick = (char) => {
    const newCharObject = {
      char: char,
      fontFamily: currentStyle.fontFamily,
      fontSize: currentStyle.fontSize,
      color: currentStyle.color
    };
    updateActiveDocContent([...activeDoc.content, newCharObject]);
  };

  const handleStyleChange = (newStyle) => {
    const updatedStyle = { ...currentStyle, ...newStyle };
    setCurrentStyle(updatedStyle);
    if (updatedStyle.applyMode === 'all') {
      handleApplyStyleToAll(updatedStyle);
    }
  };

  const handleApplyStyleToAll = (styleToApply) => {
    const newContent = activeDoc.content.map(charObj => ({
      ...charObj,
      fontFamily: styleToApply.fontFamily || charObj.fontFamily,
      fontSize: styleToApply.fontSize || charObj.fontSize,
      color: styleToApply.color || charObj.color,
    }));
    updateActiveDocContent(newContent);
  };

  const handleUserChange = (newUser) => {
    setCurrentUser(newUser);
    setDocuments([{ id: 1, name: "מסמך 1", content: [] }]);
    setActiveDocId(1);
    setHistory({ 1: [] });
  };

  const handleDeleteChar = () => {
    if (activeDoc.content.length > 0) {
      updateActiveDocContent(activeDoc.content.slice(0, -1));
    }
  };

  const handleDeleteWord = () => {
    let contentStr = activeDoc.content.map(c => c.char).join('');
    let lastSpaceIndex = contentStr.trimEnd().lastIndexOf(' ');
    const newContent = lastSpaceIndex === -1 ? [] : activeDoc.content.slice(0, lastSpaceIndex + 1);
    updateActiveDocContent(newContent);
  };
  
  const handleDeleteAll = () => {
    if (window.confirm('למחוק את כל הטקסט?')) {
      updateActiveDocContent([]);
    }
  };

  const handleUndo = () => {
    const docHistory = history[activeDocId] || [];
    if (docHistory.length > 0) {
      const lastState = docHistory[docHistory.length - 1];
      setDocuments(lastState);
      setHistory(h => ({ ...h, [activeDocId]: docHistory.slice(0, -1) }));
    }
  };

  const handleReplace = (index, newChar) => {
    const newContent = [...activeDoc.content];
    newContent[index] = { ...newContent[index], char: newChar };
    updateActiveDocContent(newContent);
  };

  const handleReplaceAll = (searchChar, replaceChar) => {
    const newContent = activeDoc.content.map(charObj =>
      charObj.char === searchChar ? { ...charObj, char: replaceChar } : charObj
    );
    updateActiveDocContent(newContent);
  };

  const handleSaveFile = () => {
    if (!activeDoc || activeDoc.content.length === 0) {
      alert('⚠️ המסמך ריק! אין מה לשמור.');
      return;
    }
    const fileName = prompt('📝 שם הקובץ:', activeDoc.name);
    if (fileName && fileName.trim()) {
      const docToSave = { ...activeDoc, name: fileName.trim() };
      const key = `${currentUser}_${fileName.trim()}`;
      localStorage.setItem(key, JSON.stringify(docToSave));
      alert(`✅ נשמר בהצלחה: ${fileName}`);
      setDocuments(docs => docs.map(d => d.id === activeDocId ? { ...d, name: fileName.trim() } : d));
      loadSavedFiles();
    }
  };

  const handleOpenFile = (fileName) => {
    const key = `${currentUser}_${fileName}`;
    const data = localStorage.getItem(key);
    if (data) {
      const loadedDoc = JSON.parse(data);
      const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
      const newDoc = { ...loadedDoc, id: newId };
      setDocuments([...documents, newDoc]);
      setActiveDocId(newId);
      setHistory(prev => ({ ...prev, [newId]: [] }));
      setShowFileModal(false);
    }
  };
    
  const handleDeleteFile = (fileName) => {
      if (window.confirm(`למחוק את הקובץ "${fileName}"?`)) {
          const key = `${currentUser}_${fileName}`;
          localStorage.removeItem(key);
          loadSavedFiles(); // רענון הרשימה
      }
  };


  return (
    <div className="app">
      <Header currentUser={currentUser} onUserChange={handleUserChange} />
      
      <div className="main-container">
        <div className="screen-area">
          <div className="main-document">
            {activeDoc && (
              <>
                <div className="document-header">
                  <span className="document-name">{activeDoc.name}</span>
                  <button className="close-btn" onClick={() => handleCloseDoc(activeDoc.id)}>×</button>
                </div>
                <div className="document-display">
                  {activeDoc.content.length === 0 ? (
                    <span className="placeholder">התחל לכתוב...</span>
                  ) : (
                    activeDoc.content.map((charObj, index) => (
                      <span key={index} style={{ fontFamily: charObj.fontFamily, fontSize: charObj.fontSize, color: charObj.color }}>
                        {charObj.char}
                      </span>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="documents-sidebar">
            <div className="sidebar-header">
              <h3>📄 המסמכים שלי</h3>
              <button className="new-doc-btn" onClick={handleNewDoc}>➕ מסמך חדש</button>
            </div>
             <div className="sidebar-file-actions">
                <button className="sidebar-btn" onClick={handleSaveFile}>💾 שמור</button>
                <button className="sidebar-btn" onClick={() => { loadSavedFiles(); setShowFileModal(true); }}>📂 פתח</button>
            </div>
            <div className="documents-scroll-list">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`sidebar-doc ${doc.id === activeDocId ? 'active' : ''}`}
                  onClick={() => handleSwitchDoc(doc.id)}
                >
                  <span className="doc-name-side">{doc.name}</span>
                  <button className="close-btn-small" onClick={(e) => { e.stopPropagation(); handleCloseDoc(doc.id); }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="keyboard-area">
          <div className="keyboard-main">
            <VirtualKeyboard
              onCharacterClick={handleCharacterClick}
              onDeleteChar={handleDeleteChar}
              onDeleteWord={handleDeleteWord}
              onDeleteAll={handleDeleteAll}
              onUndo={handleUndo}
              canUndo={(history[activeDocId] || []).length > 0}
              onToggleSearch={() => setShowSearchModal(true)}
            />
          </div>
          <div className="style-panel">
            <StyleControls currentStyle={currentStyle} onStyleChange={handleStyleChange} onApplyToAll={handleApplyStyleToAll}/>
          </div>
        </div>
      </div>

      {/* Modal רשימת קבצים */}
      {showFileModal && (
        <div className="modal-overlay" onClick={() => setShowFileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>📂 הקבצים שלי</h4>
              <button className="close-modal" onClick={() => setShowFileModal(false)}>×</button>
            </div>
            <div className="files-container">
              {savedFiles.length === 0 ? (
                <p className="no-files">אין קבצים שמורים</p>
              ) : (
                savedFiles.map(fileName => (
                  <div key={fileName} className="file-item">
                    <span className="file-name">📄 {fileName}</span>
                    <div className="file-actions">
                      <button className="open-file-btn" onClick={() => handleOpenFile(fileName)}>פתח</button>
                      <button className="delete-file-btn" onClick={() => handleDeleteFile(fileName)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal חיפוש והחלפה */}
      {showSearchModal && (
          <SearchReplace
            currentDoc={activeDoc}
            onReplace={handleReplace}
            onReplaceAll={handleReplaceAll}
            onClose={() => setShowSearchModal(false)}
          />
      )}
    </div>
  );
}

export default App;