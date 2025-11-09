import './StyleControls.css';

function StyleControls({ currentStyle, onStyleChange }) {
 
  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];
  const sizes = [12, 14, 16, 18, 20, 24, 28, 32];
  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFA500', '#800080'];

  return (
    <div className="style-controls">
      <h3>🎨 עיצוב טקסט</h3>
     
      <div className="controls-row">
        {/* בחירת גופן */}
        <div className="control-group">
          <label>גופן:</label>
          <select
            value={currentStyle.font}
            onChange={(e) => onStyleChange({ font: e.target.value })}
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* בחירת גודל */}
        <div className="control-group">
          <label>גודל:</label>
          <select
            value={currentStyle.size}
            onChange={(e) => onStyleChange({ size: Number(e.target.value) })}
          >
            {sizes.map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        {/* בחירת צבע */}
        <div className="control-group">
          <label>צבע:</label>
          <div className="color-picker">
            {colors.map(color => (
              <button
                key={color}
                className={`color-btn ${currentStyle.color === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onStyleChange({ color: color })}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* תצוגה מקדימה */}
      <div className="preview">
        <span>תצוגה מקדימה: </span>
        <span style={{
          fontFamily: currentStyle.font,
          fontSize: currentStyle.size + 'px',
          color: currentStyle.color
        }}>
          דוגמה ABC 123
        </span>
      </div>
    </div>
  );
}

export default StyleControls;