import React, { useState, useEffect } from 'react';

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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
      
      const hotResponse = await fetch('http://localhost:3000/api/tours');
      if (hotResponse.ok) {
        const allTours = await hotResponse.json();
        setHotTours(allTours.filter(t => t.is_hot === true));
      }
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
          tour_id: selectedTour.id,
          quantity: 1,
          available_left: selectedTour.available_slots - 1 || 0,
          sale_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (salesResponse.ok) {
        alert('Ваша заявка успешно подана!');
        setShowDetailsModal(false);
        setSelectedTour(null);
      } else {
        const data = await salesResponse.json();
        alert('Ошибка при создании продажи: ' + (data.error || 'неизвестная ошибка'));
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('Ошибка при подаче заявки: ' + err.message);
    }
  };

  if (loading) {
    return <div className="home-page"><p>Загрузка туров...</p></div>;
  }

  return (
    <div className="home-page">
      <h1 className="page-title">Добро пожаловать в TourCompany</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Ошибка: {error}</div>}
      
      {hotTours.length > 0 && (
        <>
          <h2 className="section-title">Выгодные путевки</h2>
          <div className="tours-grid">
            {hotTours.map(tour => (
              <div key={tour.id} className="tour-card hot">
                <div className="tour-image" style={{ backgroundColor: '#f5a623' }}>
                  {tour.city}
                </div>
                <div className="tour-content">
                  <span className="hot-badge">ВЫГОДНОЕ ПРЕДЛОЖЕНИЕ</span>
                  <h3 className="tour-title">{tour.name}</h3>
                  <p className="tour-description">{tour.description || 'Путешествие'}</p>
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
              {hotTours.some(t => t.id === tour.id) && <span className="hot-badge">ВЫГОДНОЕ ПРЕДЛОЖЕНИЕ</span>}
              <h3 className="tour-title">{tour.name}</h3>
              <p className="tour-description">{tour.description || 'Путешествие'}</p>
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
                <p><strong>Длительность:</strong> {selectedTour.duration || 7} дней</p>
                <p><strong>Начало:</strong> {new Date(selectedTour.start_date).toISOString().split('T')[0]}</p>
                <p><strong>Окончание:</strong> {new Date(selectedTour.end_date).toISOString().split('T')[0]}</p>
                <p><strong>Описание:</strong> {selectedTour.description || 'Описание отсутствует'}</p>
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
