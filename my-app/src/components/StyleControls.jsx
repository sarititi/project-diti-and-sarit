import './StyleControls.css';

function StyleControls({ currentStyle, onStyleChange, onApplyToAll }) {
  const colors = [
    '#000000', // שחור
    '#e74c3c', // אדום
    '#3498db', // כחול
    '#2ecc71', // ירוק
    '#9b59b6', // סגול
    '#f39c12', // כתום
    '#1abc9c', // טורקיז
    '#e91e63'  // ורוד
  ];

  const fonts = ['Arial', 'Tahoma', 'Courier New', 'David', 'Times New Roman', 'Verdana'];
  const sizes = ['14px', '16px', '18px', '20px', '24px', '28px', '32px'];

  const handleModeChange = (mode) => {
    if (mode === 'all') {
      // החל על כל הטקסט
      if (onApplyToAll) {
        onApplyToAll({
          fontFamily: currentStyle.fontFamily,
          fontSize: currentStyle.fontSize,
          color: currentStyle.color
        });
      }
    }
    // עדכן את המצב
    onStyleChange({ applyMode: mode });
  };

  return (
    <>
      <h4>⚙️ עיצוב</h4>
      
      {/* בחירת מצב */}
      <div className="apply-mode">
        <label className="mode-option">
          <input 
            type="radio" 
            name="mode" 
            value="forward"
            checked={currentStyle.applyMode === 'forward' || !currentStyle.applyMode}
            onChange={(e) => handleModeChange(e.target.value)}
          />
          <span>מכאן והלאה</span>
        </label>
        
        <label className="mode-option">
          <input 
            type="radio" 
            name="mode" 
            value="all"
            checked={currentStyle.applyMode === 'all'}
            onChange={(e) => handleModeChange(e.target.value)}
          />
          <span>החל על כל הטקסט</span>
        </label>
      </div>

      {/* צבעים */}
      <div className="colors-section">
        <label>🎨 צבע:</label>
        <div className="color-grid">
          {colors.map(color => (
            <button
              key={color}
              className={`panel-color-btn ${currentStyle.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onStyleChange({ color })}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* פונט */}
      <div className="style-section">
        <label>📝 פונט:</label>
        <select 
          value={currentStyle.fontFamily}
          onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
        >
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* גודל */}
      <div className="style-section">
        <label>📏 גודל:</label>
        <select 
          value={currentStyle.fontSize}
          onChange={(e) => onStyleChange({ fontSize: e.target.value })}
        >
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* תצוגה מקדימה */}
      <div className="preview-section">
        <label>👁️ תצוגה מקדימה:</label>
        <div className="preview-box">
          <span style={{
            fontFamily: currentStyle.fontFamily,
            fontSize: currentStyle.fontSize,
            color: currentStyle.color
          }}>
            דוגמה ABC
          </span>
        </div>
      </div>
    </>
  );
}

export default StyleControls;
