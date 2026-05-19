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
          Турист
        </div>
        {!isLoggedIn && (
          <div style={{ display: 'flex', gap: '1rem', marginRight: '1rem' }}>
            <button 
              onClick={() => setCurrentPage('home')}
              style={{
                background: currentPage === 'home' ? '#27ae60' : 'transparent',
                border: currentPage === 'home' ? 'none' : '1px solid #e0e0e0',
                color: currentPage === 'home' ? 'white' : '#2c2c2c',
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Главная
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              style={{
                background: currentPage === 'login' ? '#27ae60' : 'transparent',
                border: currentPage === 'login' ? 'none' : '1px solid #e0e0e0',
                color: currentPage === 'login' ? 'white' : '#2c2c2c',
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Вход
            </button>
            <button 
              onClick={() => setCurrentPage('register')}
              style={{
                background: currentPage === 'register' ? '#27ae60' : 'transparent',
                border: currentPage === 'register' ? 'none' : '1px solid #e0e0e0',
                color: currentPage === 'register' ? 'white' : '#2c2c2c',
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
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
            backgroundColor: '#f5f5f5',
            color: '#2c2c2c',
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: currentPage === 'home' ? '#e8f5e9' : 'transparent',
                  color: '#2c2c2c',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '500',
                  marginTop: '1rem'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: currentPage === 'sales-journal' ? '#e8f5e9' : 'transparent',
                  color: '#2c2c2c',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: currentPage === 'clients-journal' ? '#e8f5e9' : 'transparent',
                  color: '#2c2c2c',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: currentPage === 'tours-management' ? '#e8f5e9' : 'transparent',
                  color: '#2c2c2c',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: currentPage === 'statistics' ? '#e8f5e9' : 'transparent',
                  color: '#2c2c2c',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
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
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: '500',
                  marginTop: '1rem'
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
