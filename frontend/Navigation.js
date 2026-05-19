import React from 'react';

function Navigation({ currentPage, setCurrentPage, isLoggedIn, userRole, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setCurrentPage('home')}>
          ✈️ Турист
        </div>
        <ul className="nav-links">
          {!isLoggedIn ? (
            <>
              <li 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                Главная
              </li>
              <li 
                className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentPage('login')}
              >
                Вход
              </li>
              <li 
                className={`nav-link ${currentPage === 'register' ? 'active' : ''}`}
                onClick={() => setCurrentPage('register')}
              >
                Регистрация
              </li>
            </>
          ) : userRole === 'client' ? (
            <>
              <li 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                Путевки
              </li>
              <li className="nav-link" onClick={onLogout}>
                Выход
              </li>
            </>
          ) : (
            <>
              <li 
                className={`nav-link ${currentPage === 'sales-journal' ? 'active' : ''}`}
                onClick={() => setCurrentPage('sales-journal')}
              >
                Журнал продаж
              </li>
              <li 
                className={`nav-link ${currentPage === 'clients-journal' ? 'active' : ''}`}
                onClick={() => setCurrentPage('clients-journal')}
              >
                Журнал клиентов
              </li>
              <li 
                className={`nav-link ${currentPage === 'statistics' ? 'active' : ''}`}
                onClick={() => setCurrentPage('statistics')}
              >
                Статистика
              </li>
              <li className="nav-link" onClick={onLogout}>
                Выход
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
