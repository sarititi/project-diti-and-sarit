
// src/components/SearchReplace.jsx
import { useState } from 'react';
import './SearchReplace.css';

function SearchReplace({ currentDoc, onHighlight, onReplace, onReplaceAll }) {
  const [searchChar, setSearchChar] = useState('');
  const [replaceChar, setReplaceChar] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  // חיפוש תו
  const handleSearch = () => {
    if (!searchChar) {
      alert('⚠️ נא להזין תו לחיפוש');
      return;
    }

    const results = [];
    currentDoc.content.forEach((char, index) => {
      if (char.text === searchChar) {
        results.push(index);
      }
    });

    setSearchResults(results);
   
    if (results.length === 0) {
      alert(`❌ לא נמצא "${searchChar}"`);
      setCurrentResultIndex(-1);
    } else {
      setCurrentResultIndex(0);
      onHighlight(results[0]);
      alert(`✅ נמצאו ${results.length} תוצאות`);
    }
  };

  // המשך לתוצאה הבאה
  const handleNext = () => {
    if (searchResults.length === 0) return;
   
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);
    onHighlight(searchResults[nextIndex]);
  };

  // חזור לתוצאה הקודמת
  const handlePrev = () => {
    if (searchResults.length === 0) return;
   
    const prevIndex = currentResultIndex === 0
      ? searchResults.length - 1
      : currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    onHighlight(searchResults[prevIndex]);
  };

  // החלפת תו בודד
  const handleReplaceCurrent = () => {
    if (!replaceChar) {
      alert('⚠️ נא להזין תו להחלפה');
      return;
    }
   
    if (currentResultIndex === -1 || searchResults.length === 0) {
      alert('⚠️ חפש תחילה!');
      return;
    }

    onReplace(searchResults[currentResultIndex], replaceChar);
   
    // מצא את התוצאה הבאה
    const newResults = searchResults.filter((_, i) => i !== currentResultIndex);
    setSearchResults(newResults);
   
    if (newResults.length === 0) {
      alert('✅ הושלמה ההחלפה!');
      setCurrentResultIndex(-1);
    } else {
      const nextIndex = currentResultIndex >= newResults.length
        ? 0
        : currentResultIndex;
      setCurrentResultIndex(nextIndex);
      onHighlight(newResults[nextIndex]);
    }
  };

  // החלפת כל המופעים
  const handleReplaceAllChars = () => {
    if (!searchChar || !replaceChar) {
      alert('⚠️ נא למלא שני השדות');
      return;
    }

    if (searchResults.length === 0) {
      alert('⚠️ חפש תחילה!');
      return;
    }

    if (window.confirm(`להחליף את כל ${searchResults.length} המופעים של "${searchChar}" ב-"${replaceChar}"?`)) {
      onReplaceAll(searchChar, replaceChar);
      setSearchResults([]);
      setCurrentResultIndex(-1);
      alert(`✅ הוחלפו ${searchResults.length} תווים!`);
    }
  };

  // איפוס
  const handleClear = () => {
    setSearchChar('');
    setReplaceChar('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
  };

  return (
    <div className="search-replace">
      <h3>🔍 חיפוש והחלפה</h3>
     
      <div className="search-replace-content">
        {/* שדה חיפוש */}
        <div className="input-group">
          <label>חפש תו:</label>
          <input
            type="text"
            maxLength="1"
            value={searchChar}
            onChange={(e) => setSearchChar(e.target.value)}
            placeholder="הזן תו אחד"
            className="char-input"
          />
          <button onClick={handleSearch} className="btn-search">
            🔍 חפש
          </button>
        </div>

        {/* תוצאות חיפוש */}
        {searchResults.length > 0 && (
          <div className="search-info">
            <span className="result-count">
              תוצאה {currentResultIndex + 1} מתוך {searchResults.length}
            </span>
            <div className="navigation-btns">
              <button onClick={handlePrev} className="btn-nav">◀ קודם</button>
              <button onClick={handleNext} className="btn-nav">הבא ▶</button>
            </div>
          </div>
        )}

        {/* שדה החלפה */}
        <div className="input-group">
          <label>החלף ב:</label>
          <input
            type="text"
            maxLength="1"
            value={replaceChar}
            onChange={(e) => setReplaceChar(e.target.value)}
            placeholder="הזן תו אחד"
            className="char-input"
          />
        </div>

        {/* כפתורי פעולה */}
        <div className="action-btns">
          <button
            onClick={handleReplaceCurrent}
            className="btn-replace"
            disabled={searchResults.length === 0}
          >
            🔄 החלף נוכחי
          </button>
          <button
            onClick={handleReplaceAllChars}
            className="btn-replace-all"
            disabled={searchResults.length === 0}
          >
            🔄 החלף הכל
          </button>
          <button onClick={handleClear} className="btn-clear">
            ✕ נקה
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchReplace;
