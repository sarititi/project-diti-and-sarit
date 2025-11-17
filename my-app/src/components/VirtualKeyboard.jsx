import { useState } from 'react';
import './VirtualKeyboard.css';

// הרכיב כבר לא צריך את כל הלוגיקה של הקבצים
function VirtualKeyboard({ 
  onCharacterClick,
  onDeleteChar,
  onDeleteWord,
  onDeleteAll,
  onUndo,
  canUndo,
  onToggleSearch // Prop חדש לפתיחת מודאל החיפוש
}) {
  const [currentKeyboard, setCurrentKeyboard] = useState('hebrew');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const keyboards = {
    hebrew: [
      ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
      ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
      ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
      ['רווח']
    ],
    english: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
      ['Space']
    ],
    numbers: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
      ['-', '_', '=', '+', '[', ']', '{', '}'],
      ['Space']
    ],
    emoji: [
      ['😀', '❤️', '👍', '😂', '😍', '🤔', '🎉', '🔥', '🙏', '💯'],
      ['😊', '😭', '😡', '😱', '😴', '😎', '🤢', '🤯', '🥳', '🥺'],
      ['👋', '👌', '✌️', '🤞', '🤟', '🤙', '👀', '🧠', '👑', '🚀'],
      ['Space']
    ]
  };

  const languageIcons = { hebrew: '🇮🇱', english: '🇺🇸', numbers: '🔢', emoji: '😀' };
  const languageNames = { hebrew: 'עברית', english: 'English', numbers: 'מספרים', emoji: 'אימוג׳ים' };

  const handleKeyClick = (key) => {
    onCharacterClick((key === 'רווח' || key === 'Space') ? ' ' : key);
  };

  const handleLanguageSelect = (lang) => {
    setCurrentKeyboard(lang);
    setShowLanguageMenu(false);
  };

  return (
    <div className="virtual-keyboard">
      <div className="actions-panel">
        <div className="actions-column">
          <button className="action-btn language-btn" onClick={() => setShowLanguageMenu(true)} title="בחר שפה">🌐</button>
          <button className="action-btn undo-btn" onClick={onUndo} disabled={!canUndo} title="ביטול">↩️</button>
          <button className="action-btn search-btn" onClick={onToggleSearch} title="חיפוש">🔍</button>
        </div>
        <div className="actions-column">
          <button className="action-btn delete-char-btn" onClick={onDeleteChar} title="מחק תו">⌫</button>
          <button className="action-btn delete-word-btn" onClick={onDeleteWord} title="מחק מילה">⌫📝</button>
          <button className="action-btn delete-all-btn" onClick={onDeleteAll} title="מחק הכל">🗑️</button>
        </div>
      </div>

      <div className="keyboard-rows">
        {keyboards[currentKeyboard].map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className={`key-button ${key.includes(' ') ? 'space-key' : ''} ${currentKeyboard === 'emoji' ? 'emoji-key' : ''}`}
                onClick={() => handleKeyClick(key)}
              >
                {key === 'Space' ? 'רווח' : key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {showLanguageMenu && (
        <div className="language-menu-overlay" onClick={() => setShowLanguageMenu(false)}>
          <div className="language-menu" onClick={(e) => e.stopPropagation()}>
            {Object.keys(keyboards).map(lang => (
              <button key={lang} className={`language-option ${currentKeyboard === lang ? 'active' : ''}`} onClick={() => handleLanguageSelect(lang)}>
                <span className="language-icon">{languageIcons[lang]}</span>
                <span className="language-name">{languageNames[lang]}</span>
                {currentKeyboard === lang && <span className="check-mark">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VirtualKeyboard;