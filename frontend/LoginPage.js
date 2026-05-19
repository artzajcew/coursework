import React, { useState } from 'react';

function LoginPage({ onLogin, setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Проверка роли пользователя
    let role = 'client';
    
    // Для демонстрации: если email содержит "employee", то это сотрудник
    if (email.includes('employee') || email.includes('admin')) {
      role = 'employee';
    }

    // Сохраняем пользователя в localStorage
    const user = {
      email,
      role,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    onLogin(role);
  };

  return (
    <div className="form-container">
      <h1>Вход в аккаунт</h1>
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Вход
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>
          Нет аккаунта?{' '}
          <span 
            className="form-link"
            onClick={() => setCurrentPage('register')}
          >
            Зарегистрируйтесь
          </span>
        </p>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#7f8c8d', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
        <p><strong>Тестовые учетные данные:</strong></p>
        <p>Клиент: client@example.com / password123</p>
        <p>Сотрудник: employee@example.com / password123</p>
      </div>
    </div>
  );
}

export default LoginPage;
