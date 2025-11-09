
import Document from './Document';
import './DocumentsContainer.css';

function DocumentsContainer({ documents, activeId, onSwitch, onClose, onNewDoc }) {
  return (
    <div className="documents-container">
      <div className="documents-header">
        <h2>📄 המסמכים שלי</h2>
        <button className="new-doc-btn" onClick={onNewDoc}>
          ➕ מסמך חדש
        </button>
      </div>

      <div className="documents-list">
        {documents.map(doc => (
          <Document
            key={doc.id}
            doc={doc}
            isActive={doc.id === activeId}
            onSwitch={() => onSwitch(doc.id)}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

export default DocumentsContainer;
