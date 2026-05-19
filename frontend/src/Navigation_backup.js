import React, { useState } from 'react';

function Navigation({ currentPage, setCurrentPage, isLoggedIn, userRole, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isLoggedIn ? (
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              marginLeft: '1rem'
            }}
          >
            ☰
          </button>
        ) : (
          <div style={{ width: '24px' }}></div>
        )}
        <div className="nav-brand" onClick={() => setCurrentPage('home')}>
          TourCompany
        </div>
        {!isLoggedIn && (
          <div style={{ display: 'flex', gap: '1rem', marginRight: '1rem' }}>
            <button 
              onClick={() => setCurrentPage('home')}
              style={{
                background: currentPage === 'home' ? '#3498db' : '#ecf0f1',
                border: '1px solid #bdc3c7',
                color: '#2c3e50',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
              }}
            >
              Главная
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              style={{
                background: currentPage === 'login' ? '#3498db' : '#ecf0f1',
                border: '1px solid #bdc3c7',
                color: '#2c3e50',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
              }}
            >
              Вход
            </button>
            <button 
              onClick={() => setCurrentPage('register')}
              style={{
                background: currentPage === 'register' ? '#3498db' : '#ecf0f1',
                border: '1px solid #bdc3c7',
                color: '#2c3e50',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
              }}
            >
              Регистрация
            </button>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div 
          className="sidebar"
          style={{
            position: 'fixed',
            left: 0,
            top: '60px',
            width: '250px',
            height: 'calc(100vh - 60px)',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s',
            zIndex: 1000,
            overflowY: 'auto',
          }}
        >
          {userRole === 'client' ? (
            <>
              <div 
                className="nav-link" 
                onClick={() => setCurrentPage('home')}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: currentPage === 'home' ? '#34495e' : 'transparent',
                }}
              >
                Путевки
              </div>
              <div 
                className="nav-link" 
                onClick={() => onLogout()}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: '#e74c3c',
                }}
              >
                Выход
              </div>
            </>
          ) : (
            <>
              <div 
                className="nav-link" 
                onClick={() => setCurrentPage('sales-journal')}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: currentPage === 'sales-journal' ? '#34495e' : 'transparent',
                }}
              >
                Журнал продаж
              </div>
              <div 
                className="nav-link" 
                onClick={() => setCurrentPage('clients-journal')}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: currentPage === 'clients-journal' ? '#34495e' : 'transparent',
                }}
              >
                Журнал клиентов
              </div>
              <div 
                className="nav-link" 
                onClick={() => setCurrentPage('tours-management')}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: currentPage === 'tours-management' ? '#34495e' : 'transparent',
                }}
              >
                Управление турами
              </div>
              <div 
                className="nav-link" 
                onClick={() => setCurrentPage('statistics')}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: currentPage === 'statistics' ? '#34495e' : 'transparent',
                }}
              >
                Статистика
              </div>
              <div 
                className="nav-link" 
                onClick={() => onLogout()}
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #34495e',
                  backgroundColor: '#e74c3c',
                }}
              >
                Выход
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navigation;
