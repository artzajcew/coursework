import React, { useState } from 'react';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    passportNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
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
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          password: formData.password,
          passport_number: formData.passportNumber || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      const user = {
        id: data.user.id,
        fullName: formData.fullName,
        phone: formData.phone,
        type: 'client',
        role: 'client',
        registrationDate: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      setSuccess('Регистрация успешна! Перенаправляем на главную...');
      setTimeout(() => {
        setCurrentPage('home');
      }, 2000);
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError(err.message || 'Ошибка при подключении к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Регистрация</h1>
      {error && <div className="form-error">{error}</div>}
      {success && <div style={{ color: '#27ae60', marginBottom: '1rem' }}>{success}</div>}
      
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">ФИО</label>
          <input
            type="text"
            name="fullName"
            className="form-input"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Введите ваше ФИО"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Номер телефона</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (XXX) XX-XX-XX"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Номер паспорта (опционально)</label>
          <input
            type="text"
            name="passportNumber"
            className="form-input"
            value={formData.passportNumber}
            onChange={handleChange}
            placeholder="Введите номер паспорта"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль (минимум 6 символов)"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Подтвердите пароль</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Подтвердите пароль"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>
          Уже есть аккаунт?{' '}
          <span 
            className="form-link"
            onClick={() => setCurrentPage('login')}
            style={{ cursor: 'pointer' }}
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
