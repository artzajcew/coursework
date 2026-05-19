import React, { useState } from 'react';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
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

    // Сохраняем пользователя в localStorage
    const user = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      registrationDate: new Date().toISOString(),
      role: 'client',
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    setSuccess('Регистрация успешна! Перенаправляем...');
    setTimeout(() => {
      setCurrentPage('login');
    }, 2000);
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
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите ваш email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Телефон</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Введите ваш телефон"
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
            placeholder="Введите пароль"
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
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Зарегистрироваться
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>
          Уже есть аккаунт?{' '}
          <span 
            className="form-link"
            onClick={() => setCurrentPage('login')}
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
