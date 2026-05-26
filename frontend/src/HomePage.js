import React, { useState, useEffect } from 'react';

// Импорт изображений
import antalyaImg from './img/antalya.jpg';
import sochiImg from './img/sochi.jpg';
import barcelonaImg from './img/barcelona.jpg';
import parisImg from './img/paris.jpg';

function HomePage({ setCurrentPage, isLoggedIn }) {
  const [tours, setTours] = useState([]);
  const [hotTours, setHotTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Только эти 4 тура
    const mockTours = [
      {
        id: 1,
        name: 'Тур в Анталью',
        description: 'Прекрасный отдых на пляжах Антальи с посещением храмов и нац. парков',
        price: 45000,
        duration: '7 дней',
        city: 'Анталья',
        start_date: '2026-06-15',
        available_count: 12,
        image: antalyaImg,
        is_hot: true,
      },
      {
        id: 2,
        name: 'Экскурсия в Сочи',
        description: 'Путешествие по горам и побережью Черного моря',
        price: 35000,
        duration: '7 дней',
        city: 'Сочи',
        start_date: '2026-06-20',
        available_count: 8,
        image: sochiImg,
        is_hot: true,
      },
      {
        id: 3,
        name: 'Отдых в Барселоне',
        description: 'Саграда Фамилия, парк Гуэль и пляжи Средиземного моря',
        price: 55000,
        duration: '8 дней',
        city: 'Барселона',
        start_date: '2026-07-01',
        available_count: 5,
        image: barcelonaImg,
        is_hot: false,
      },
      {
        id: 4,
        name: 'Тур в Париж',
        description: 'Эйфелева башня, Лувр и шопинг на Елисейских полях',
        price: 70000,
        duration: '6 дней',
        city: 'Париж',
        start_date: '2026-07-10',
        available_count: 3,
        image: parisImg,
        is_hot: true,
      },
    ];

    setHotTours(mockTours.filter(tour => tour.is_hot));
    setTours(mockTours);
  }, []);

  const handleApplyClick = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleSubmitApplication = () => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в систему для подачи заявки');
      setCurrentPage('login');
      return;
    }
    alert('Ваша заявка успешно подана! Проверьте ваш личный кабинет.');
    setShowModal(false);
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Добро пожаловать в Турист</h1>
      
      {/* Горящие путевки */}
      {hotTours.length > 0 && (
        <>
          <h2 className="section-title">🔥 Горящие путевки</h2>
          <div className="tours-grid">
            {hotTours.map(tour => (
              <div key={tour.id} className="tour-card hot">
                <div className="tour-image">
                  <img 
                    src={tour.image} 
                    alt={tour.name}
                    className="tour-img"
                  />
                </div>
                <div className="tour-content">
                  <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>
                  <h3 className="tour-title">{tour.name || tour.title}</h3>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-meta">
                    <span className="tour-duration">{tour.duration}</span>
                  </div>
                  <div className="tour-price">₽ {tour.price.toLocaleString()}</div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleApplyClick(tour)}
                  >
                    Подать заявку
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Все путевки */}
      <h2 className="section-title">Все путевки</h2>
      <div className="tours-grid">
        {tours.map(tour => (
          <div key={tour.id} className={`tour-card ${tour.isHot ? 'hot' : ''}`}>
            <div className="tour-image">
              <img 
                src={tour.image} 
                alt={tour.name}
                className="tour-img"
              />
            </div>
            <div className="tour-content">
              {tour.isHot && <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>}
              <h3 className="tour-title">{tour.name || tour.title}</h3>
              <p className="tour-description">{tour.description}</p>
              <div className="tour-meta">
                <span className="tour-duration">{tour.duration}</span>
              </div>
              <div className="tour-price">₽ {tour.price.toLocaleString()}</div>
              <button 
                className="btn btn-primary"
                onClick={() => handleApplyClick(tour)}
              >
                Подать заявку
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно с информацией о туре */}
      <div className={`modal ${showModal ? 'active' : ''}`}>
        <div className="modal-content">
          <span 
            className="modal-close" 
            onClick={() => setShowModal(false)}
          >
            &times;
          </span>
          {selectedTour && (
            <div className="tour-details">
              <h2>{selectedTour.name || selectedTour.title}</h2>
              {selectedTour.is_hot && <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>}
              
              <div className="details-info">
                <div className="detail-row">
                  <span className="detail-label">Город:</span>
                  <span className="detail-value">{selectedTour.city}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Дата вылета:</span>
                  <span className="detail-value">
                    {new Date(selectedTour.start_date).toLocaleDateString('ru-RU', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Длительность:</span>
                  <span className="detail-value">{selectedTour.duration}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Доступные места:</span>
                  <span className="detail-value">{selectedTour.available_count} мест</span>
                </div>
                
                <div className="detail-row description-row">
                  <span className="detail-label">Описание:</span>
                  <p className="description-text">{selectedTour.description}</p>
                </div>
                
                <div className="detail-row price-row">
                  <span className="detail-label">Стоимость:</span>
                  <span className="detail-value price">₽ {selectedTour.price.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-large"
                onClick={handleSubmitApplication}
              >
                Подать заявку
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;