// src/components/Document.jsx
import './Document.css';

function Document({ doc, isActive, onSwitch, onClose }) {
  return (
    <div
      className={`document ${isActive ? 'active' : ''}`}
      onClick={onSwitch}
    >
      <div className="document-header">
        <span className="document-name">{doc.name}</span>
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose(doc.id);
          }}
        >
          ✕
        </button>
      </div>
     
      <div className="document-display">
        {doc.content && doc.content.length > 0 ? (
          doc.content.map((char, index) => (
            <span
              key={index}
              style={{
                fontFamily: char.style.font,
                fontSize: char.style.size + 'px',
                color: char.style.color
              }}
            >
              {char.text}
            </span>
          ))
        ) : (
          <span className="placeholder">ריק...</span>
        )}
      </div>
     
      {isActive && <div className="active-indicator">✏️ פעיל</div>}
    </div>
  );
}

export default Document;