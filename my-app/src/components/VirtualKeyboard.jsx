import { useState } from 'react';

function VirtualKeyboard({ onCharacterClick }) {
  const keyboards = {
    hebrew: [
      ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
      ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
      ['ז', 'ס', 'ב', 'ה', 'ן', 'מ', 'צ', 'ת', 'ץ']
    ],
    english: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ],
    numbers: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')']
    ]
  };

  const [currentKeyboard, setCurrentKeyboard] = useState('hebrew');
  const keysToShow = keyboards[currentKeyboard];

  return (
    <div className="virtual-keyboard">
      <div className="language-buttons">
        {Object.keys(keyboards).map((lang) => (
          <button
            key={lang}
            onClick={() => setCurrentKeyboard(lang)}
            className={currentKeyboard === lang ? 'active' : ''}
          >
            {lang === 'hebrew' ? 'עברית' : lang === 'english' ? 'English' : '123'}
          </button>
        ))}
        <button onClick={() => onCharacterClick(' ')}>רווח</button>
      </div>

      <div className="keyboard-rows">
        {keysToShow.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                className="key-button"
                onClick={() => onCharacterClick(key)}
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
