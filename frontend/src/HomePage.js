import React, { useState, useEffect } from 'react';

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const isHotTour = (startDate) => {
  if (!startDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const daysUntilStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return daysUntilStart >= 0 && daysUntilStart <= 5;
};

function HomePage({ setCurrentPage }) {
  const [tours, setTours] = useState([]);
  const [hotTours, setHotTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/tours');
      if (!response.ok) throw new Error('Ошибка загрузки туров');
      const data = await response.json();
      
      setTours(data);
      setHotTours(data.filter(t => isHotTour(t.start_date)));
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки туров:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsClick = (tour) => {
    setSelectedTour(tour);
    setShowDetailsModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Пожалуйста, авторизуйтесь перед подачей заявки');
      setCurrentPage('login');
      return;
    }

    try {
      // Создаем запись в client_tour
      const clientTourResponse = await fetch('http://localhost:3000/api/client-tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: user.id,
          tour_id: selectedTour.id,
        }),
      });

      if (!clientTourResponse.ok) {
        const data = await clientTourResponse.json();
        alert('Ошибка при подаче заявки: ' + (data.error || 'неизвестная ошибка'));
        return;
      }

      // Создаем запись в sales
      const salesResponse = await fetch('http://localhost:3000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: user.id,
          tour_name: selectedTour.name,
          quantity: 1,
          sale_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!salesResponse.ok) {
        const data = await salesResponse.json();
        alert('Ошибка при создании продажи: ' + (data.error || 'неизвестная ошибка'));
        return;
      }

      // Проверяем статус клиента
      const clientResponse = await fetch(`http://localhost:3000/api/clients/${user.id}`);
      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        if (clientData.total_tours_purchased >= 3) {
          alert(`🎉 Поздравляем! Вы постоянный клиент и получили скидку 10%!`);
        } else {
          const remaining = 3 - clientData.total_tours_purchased;
          alert(`✅ Путевка успешно куплена!\nЕще ${remaining} путевок до статуса постоянного клиента.`);
        }
      } else {
        alert('✅ Путевка успешно куплена!');
      }

      setShowDetailsModal(false);
      setSelectedTour(null);
      fetchTours();
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка при подаче заявки: ' + err.message);
    }
  };

  const getActiveClientTours = () => {
    if (!user) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tours.filter(tour => {
      const endDate = new Date(tour.end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    });
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Добро пожаловать в TourCompany</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Ошибка: {error}</div>}
      
      {user && user.type === 'client' && getActiveClientTours().length > 0 && (
        <>
          <h2 className="section-title">📋 Мои актуальные путевки</h2>
          <div className="tours-grid">
            {getActiveClientTours().map(tour => (
              <div key={tour.id} className="tour-card">
                <div className="tour-image" style={{ backgroundColor: '#27ae60' }}>
                  {tour.city}
                </div>
                <div className="tour-content">
                  <h3 className="tour-title">{tour.name}</h3>
                  <p className="tour-description">Путешествие</p>
                  <div className="tour-meta">
                    <span>Начало: {new Date(tour.start_date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="tour-meta">
                    <span>Конец: {new Date(tour.end_date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="tour-price">₽ {tour.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {hotTours.length > 0 && (
        <>
          <h2 className="section-title">🔥 Горящие туры</h2>
          <div className="tours-grid">
            {hotTours.map(tour => (
              <div key={tour.id} className="tour-card hot">
                <div className="tour-image" style={{ backgroundColor: '#f5a623' }}>
                  {tour.city}
                </div>
                <div className="tour-content">
                  <span className="hot-badge">🔥 ГОРЯЩИЙ ТУР</span>
                  <h3 className="tour-title">{tour.name}</h3>
                  <p className="tour-description">Путешествие</p>
                  <div className="tour-meta">
                    <span>Дней: {calculateDuration(tour.start_date, tour.end_date)}</span>
                  </div>
                  <div className="tour-price">₽ {tour.price.toLocaleString()}</div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleDetailsClick(tour)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Все путевки</h2>
      <div className="tours-grid">
        {tours.map(tour => (
          <div key={tour.id} className={`tour-card ${hotTours.some(t => t.id === tour.id) ? 'hot' : ''}`}>
            <div className="tour-image" style={{ backgroundColor: '#3498db' }}>
              {tour.city}
            </div>
            <div className="tour-content">
              {hotTours.some(t => t.id === tour.id) && <span className="hot-badge">🔥 ГОРЯЩИЙ ТУР</span>}
              <h3 className="tour-title">{tour.name}</h3>
              <p className="tour-description">Путешествие</p>
              <div className="tour-meta">
                <span>Дней: {calculateDuration(tour.start_date, tour.end_date)}</span>
              </div>
              <div className="tour-price">₽ {tour.price.toLocaleString()}</div>
              <button 
                className="btn btn-primary"
                onClick={() => handleDetailsClick(tour)}
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`modal ${showDetailsModal ? 'active' : ''}`}>
        <div className="modal-content" style={{ maxWidth: '600px' }}>
          <span 
            className="modal-close" 
            onClick={() => setShowDetailsModal(false)}
          >
            &times;
          </span>
          {selectedTour && (
            <>
              <h2>{selectedTour.name}</h2>
              <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                <p><strong>Город:</strong> {selectedTour.city}</p>
                <p><strong>Цена:</strong> ₽ {selectedTour.price.toLocaleString()}</p>
                <p><strong>Длительность:</strong> {calculateDuration(selectedTour.start_date, selectedTour.end_date)} дней</p>
                <p><strong>Начало:</strong> {new Date(selectedTour.start_date).toISOString().split('T')[0]}</p>
                <p><strong>Окончание:</strong> {new Date(selectedTour.end_date).toISOString().split('T')[0]}</p>
                <p><strong>Услуги:</strong> {selectedTour.services || 'Не указаны'}</p>
                <p><strong>Доступно мест:</strong> {selectedTour.available_count || 0}</p>
              </div>
              
              <button 
                className="btn btn-success" 
                style={{ width: '100%', marginTop: '2rem' }}
                onClick={handleSubmitApplication}
              >
                Подать заявку
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
