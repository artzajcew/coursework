import React, { useState } from 'react';

function LoginPage({ onLogin, setCurrentPage }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Форматирование номера телефона в реальном времени
  const formatPhone = (value) => {
    // Оставляем только цифры
    const cleaned = value.replace(/\D/g, '');
    
    // Обрезаем до 11 цифр (7 + 10 цифр номера)
    const limited = cleaned.slice(0, 11);
    
    let formatted = '';
    
    if (limited.length === 0) {
      formatted = '';
    } else if (limited.length === 1) {
      formatted = '+7';
    } else if (limited.length <= 4) {
      formatted = `+7 (${limited.slice(1)})`;
    } else if (limited.length <= 7) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4)}`;
    } else if (limited.length <= 9) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
    } else if (limited.length <= 11) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9)}`;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Оставляем только цифры
    const cleaned = value.replace(/\D/g, '');
    
    // Обрезаем до 11 цифр (7 + 10 цифр номера)
    const limited = cleaned.slice(0, 11);
    
    let formatted = '';
    
    if (limited.length === 0) {
      formatted = '';
    } else if (limited.length === 1) {
      formatted = '+7';
    } else if (limited.length <= 4) {
      formatted = `+7 (${limited.slice(1)})`;
    } else if (limited.length <= 7) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4)}`;
    } else if (limited.length <= 9) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
    } else if (limited.length <= 11) {
      formatted = `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9)}`;
    }
    
    setPhone(formatted);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phone || !password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка авторизации');
        setLoading(false);
        return;
      }

      const userData = {
        id: data.user.id,
        phone: data.user.phone,
        fullName: data.user.full_name,
        type: data.user.type,
        role: data.user.role,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', 'simple-token-' + Date.now());
      
      onLogin(data.user.type);
    } catch (err) {
      console.error('Ошибка входа:', err);
      setError('Ошибка подключения к серверу. Проверьте, запущен ли бэкенд на порте 3000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Вход в аккаунт</h1>
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Номер телефона</label>
          <input
            type="tel"
            className="form-input"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (XXX) XX-XX-XX"
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка...' : 'Вход'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>
          Нет аккаунта?{' '}
          <span 
            className="form-link"
            onClick={() => setCurrentPage('register')}
            style={{ cursor: 'pointer' }}
          >
            Зарегистрируйтесь
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
