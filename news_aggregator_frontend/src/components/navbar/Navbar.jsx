import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link to="/" className="navbar-brand">Главная</Link>
      
      <button 
        className="navbar-toggler" 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-controls="navbarNav" 
        aria-expanded={isOpen} 
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {user ? (
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-outline-light">
                Выход ({user.username})
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Вход</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Регистрация</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
