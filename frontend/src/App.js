import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SalesJournalPage from './SalesJournalPage';
import ClientsJournalPage from './ClientsJournalPage';
import StatisticsPage from './StatisticsPage';
import ToursManagementPage from './ToursManagementPage';
import Navigation from './Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const savedUser = localStorage.getItem('user');
      
      if (!savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        
        // Попытка проверить на бэке, актуален ли пользователь
        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          // Токен валиден
          const role = user.type;
          setIsLoggedIn(true);
          setUserRole(role);
          setCurrentPage(role === 'employee' ? 'sales-journal' : 'home');
        } else {
          // Токен невалиден
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          setUserRole(null);
          setCurrentPage('home');
        }
      } catch (e) {
        console.error('Session validation error:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentPage('home');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('home');
  };

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage(role === 'employee' ? 'sales-journal' : 'home');
  };

  return (
    <div className="App">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>
        ) : !isLoggedIn ? (
          <>
            {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
            {currentPage === 'login' && <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />}
            {currentPage === 'register' && <RegisterPage setCurrentPage={setCurrentPage} />}
          </>
        ) : (
          <>
            {userRole === 'client' && (
              <>
                {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
              </>
            )}
            {userRole === 'employee' && (
              <>
                {currentPage === 'clients-journal' && <ClientsJournalPage />}
                {currentPage === 'statistics' && <StatisticsPage />}
                {currentPage === 'tours-management' && <ToursManagementPage />}
                {(currentPage === 'sales-journal' || !['clients-journal', 'statistics', 'tours-management'].includes(currentPage)) && <SalesJournalPage />}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
