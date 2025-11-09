import './Header.css';

function Header({ currentUser, onUserChange }) {
  const users = ['user1', 'user2', 'user3'];

  return (
    <header className="header">
      <div className="header-content">
        {/* לוגו */}
        <div className="logo">
          <span className="logo-icon">📝</span>
          <h1>עורך טקסט</h1>
        </div>

        {/* בחירת משתמש */}
        <div className="user-selector">
          <label>משתמש:</label>
          <select value={currentUser} onChange={(e) => onUserChange(e.target.value)}>
            {users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* מידע נוסף */}
        <div className="header-info">
          <span>👤 {currentUser}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;