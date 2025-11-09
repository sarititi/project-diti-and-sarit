
import { useState } from 'react';
import './FileManager.css';

function FileManager({ currentUser, currentDoc, onSave, onOpen }) {
  const [showFileList, setShowFileList] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);

  // טעינת רשימת קבצים מ-LocalStorage
  const loadFileList = () => {
    const allKeys = Object.keys(localStorage);
    const userFiles = allKeys.filter(key => key.startsWith(`${currentUser}_`));
    const fileNames = userFiles.map(key => key.replace(`${currentUser}_`, ''));
    setSavedFiles(fileNames);
    setShowFileList(true);
  };

  // שמירת קובץ עם בדיקת שם כפול
  const handleSave = () => {
    const fileName = prompt('שם הקובץ:');
    if (fileName && fileName.trim()) {
      const key = `${currentUser}_${fileName.trim()}`;
     
      // בדיקה אם הקובץ כבר קיים
      if (localStorage.getItem(key)) {
        const overwrite = window.confirm(
          `הקובץ "${fileName}" כבר קיים.\nלדרוס אותו?`
        );
        if (!overwrite) {
          return; // ביטול השמירה
        }
      }
     
      localStorage.setItem(key, JSON.stringify(currentDoc));
      alert('✅ הקובץ נשמר בהצלחה!');
      onSave(fileName.trim());
    }
  };

  // פתיחת קובץ
  const handleOpen = (fileName) => {
    const key = `${currentUser}_${fileName}`;
    const data = localStorage.getItem(key);
    if (data) {
      const loadedDoc = JSON.parse(data);
      onOpen(loadedDoc);
      setShowFileList(false);
      alert(`✅ הקובץ "${fileName}" נפתח!`);
    } else {
      alert('❌ לא נמצא קובץ!');
    }
  };

  // מחיקת קובץ
  const handleDelete = (fileName) => {
    if (window.confirm(`למחוק את "${fileName}"?`)) {
      const key = `${currentUser}_${fileName}`;
      localStorage.removeItem(key);
      alert('🗑️ הקובץ נמחק!');
      loadFileList(); // רענן רשימה
    }
  };

  return (
    <div className="file-manager">
      <h3>📁 ניהול קבצים</h3>
     
      <div className="file-buttons">
        <button className="file-btn save-btn" onClick={handleSave}>
          💾 שמור
        </button>
       
        <button className="file-btn open-btn" onClick={loadFileList}>
          📂 פתח קובץ
        </button>
      </div>

      {/* רשימת קבצים - Modal */}
      {showFileList && (
        <div className="file-list-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>📂 הקבצים שלי</h4>
              <button className="close-modal" onClick={() => setShowFileList(false)}>
                ✕
              </button>
            </div>
           
            <div className="files-container">
              {savedFiles.length === 0 ? (
                <p className="no-files">אין קבצים שמורים</p>
              ) : (
                savedFiles.map(fileName => (
                  <div key={fileName} className="file-item">
                    <span className="file-name">📄 {fileName}</span>
                    <div className="file-actions">
                      <button
                        className="open-file-btn"
                        onClick={() => handleOpen(fileName)}
                      >
                        פתח
                      </button>
                      <button
                        className="delete-file-btn"
                        onClick={() => handleDelete(fileName)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileManager;
