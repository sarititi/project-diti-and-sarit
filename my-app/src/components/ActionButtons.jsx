import './ActionButtons.css';

function ActionButtons({ onDeleteChar, onDeleteWord, onDeleteAll, onUndo, canUndo }) {
  return (
    <div className="action-buttons">
      <h3>⚡ פעולות</h3>
     
      <div className="buttons-row">
        <button
          className="action-btn delete-char"
          onClick={onDeleteChar}
          title="מחיקת תו אחרון"
        >
          ⌫ מחק תו
        </button>

        <button
          className="action-btn delete-word"
          onClick={onDeleteWord}
          title="מחיקת מילה אחרונה"
        >
          🗑️ מחק מילה
        </button>

        <button
          className="action-btn undo"
          onClick={onUndo}
          disabled={!canUndo}
          title="ביטול פעולה אחרונה"
        >
          ↶ Undo
        </button>

        <button
          className="action-btn delete-all"
          onClick={onDeleteAll}
          title="מחיקת כל הטקסט"
        >
          🗑️ מחק הכל
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
