
import { useState } from 'react';
import './VirtualKeyboard.css';

function VirtualKeyboard({ onCharacterClick }) {
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
      ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃'],
      ['😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
      ['😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
      ['🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥'],
      ['😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮'],
      ['🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
      ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔'],
      ['💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💬', '👁️', '🗨️'],
      ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘'],
      ['👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️'],
      ['Space']
    ]
  };

  const languageIcons = {
    hebrew: '🇮🇱',
    english: '🇺🇸',
    numbers: '🔢',
    emoji: '😀'
  };

  const languageNames = {
    hebrew: 'עברית',
    english: 'English',
    numbers: 'מספרים',
    emoji: 'אימוג׳ים'
  };

  const keysToShow = keyboards[currentKeyboard];

  const handleKeyClick = (key) => {
    if (key === 'רווח' || key === 'Space') {
      onCharacterClick(' ');
    } else {
      onCharacterClick(key);
    }
  };

  const handleLanguageSelect = (lang) => {
    setCurrentKeyboard(lang);
    setShowLanguageMenu(false);
  };

  return (
    <div className="virtual-keyboard">
      {/* כפתור בחירת שפה */}
      <div className="keyboard-header">
        <div className="language-selector">
          <button
            className="current-language-btn"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <span className="language-icon">{languageIcons[currentKeyboard]}</span>
            <span className="language-name">{languageNames[currentKeyboard]}</span>
            <span className="dropdown-arrow">{showLanguageMenu ? '▲' : '▼'}</span>
          </button>

          {/* תפריט בחירת שפה */}
          {showLanguageMenu && (
            <div className="language-menu">
              {Object.keys(keyboards).map(lang => (
                <button
                  key={lang}
                  className={`language-option ${currentKeyboard === lang ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <span className="language-icon">{languageIcons[lang]}</span>
                  <span className="language-name">{languageNames[lang]}</span>
                  {currentKeyboard === lang && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* המקלדת */}
      <div className="keyboard-rows">
        {keysToShow.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                className={`key-button ${key === 'רווח' || key === 'Space' ? 'space-key' : ''} ${currentKeyboard === 'emoji' ? 'emoji-key' : ''}`}
                onClick={() => handleKeyClick(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualKeyboard;