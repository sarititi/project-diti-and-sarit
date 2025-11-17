import { useState, useEffect } from 'react';
import './SearchReplace.css';

function SearchReplace({ currentDoc, onReplace, onReplaceAll, onClose }) {
  const [searchChar, setSearchChar] = useState('');
  const [replaceChar, setReplaceChar] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  // אפקט שמאפס את החיפוש אם המסמך משתנה
  useEffect(() => {
    handleClear();
  }, [currentDoc]);

  const handleSearch = () => {
    if (!searchChar) return;
    const results = currentDoc.content.reduce((acc, charObj, index) => {
      if (charObj.char === searchChar) acc.push(index);
      return acc;
    }, []);
    
    setSearchResults(results);
    if (results.length > 0) {
      setCurrentResultIndex(0);
    } else {
      setCurrentResultIndex(-1);
      alert(`לא נמצאו מופעים של "${searchChar}".`);
    }
  };

  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;
    const newIndex = (currentResultIndex + direction + searchResults.length) % searchResults.length;
    setCurrentResultIndex(newIndex);
  };

  const handleReplaceCurrent = () => {
    if (currentResultIndex === -1 || !replaceChar) return;
    onReplace(searchResults[currentResultIndex], replaceChar);
    
    // לאחר ההחלפה, נבצע חיפוש מחדש כדי לעדכן את האינדקסים
    // זו הדרך הבטוחה ביותר להתמודד עם שינויים בתוכן
    setTimeout(handleSearch, 50); 
  };

  const handleReplaceAllChars = () => {
    if (searchResults.length === 0 || !replaceChar) return;
    onReplaceAll(searchChar, replaceChar);
    onClose(); // סגירת החלון לאחר החלפה מלאה
  };

  const handleClear = () => {
    setSearchChar('');
    setReplaceChar('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="search-replace-modal">
        <div className="search-replace-header">
          <h3>🔍 חיפוש והחלפה</h3>
          <button className="close-search-btn" onClick={onClose}>×</button>
        </div>
        <div className="search-replace-body">
          <div className="input-group">
            <input
              type="text"
              maxLength="1"
              value={searchChar}
              onChange={(e) => setSearchChar(e.target.value)}
              placeholder="חפש תו..."
              className="char-input"
            />
            <button onClick={handleSearch} className="btn-search">חפש</button>
          </div>

          {searchResults.length > 0 && (
            <div className="search-info">
              <span className="result-count">
                נמצאו {searchResults.length} תוצאות (נוכחית: {currentResultIndex + 1})
              </span>
              <div className="navigation-btns">
                <button onClick={() => navigateResults(-1)} className="btn-nav">◀ קודם</button>
                <button onClick={() => navigateResults(1)} className="btn-nav">הבא ▶</button>
              </div>
            </div>
          )}

          <div className="input-group">
            <input
              type="text"
              maxLength="1"
              value={replaceChar}
              onChange={(e) => setReplaceChar(e.target.value)}
              placeholder="החלף בתו..."
              className="char-input"
            />
          </div>

          <div className="action-btns">
            <button onClick={handleReplaceCurrent} className="btn-replace" disabled={searchResults.length === 0}>החלף נוכחי</button>
            <button onClick={handleReplaceAllChars} className="btn-replace-all" disabled={searchResults.length === 0}>החלף הכל</button>
            <button onClick={handleClear} className="btn-clear">נקה</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchReplace;