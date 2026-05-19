import React, { useState, useEffect } from 'react';

function HomePage({ setCurrentPage }) {
  const [tours, setTours] = useState([]);
  const [hotTours, setHotTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Mock данные для демонстрации
    const mockTours = [
      {
        id: 1,
        title: 'Тур в Таиланд',
        description: 'Прекрасный отдых на пляжах Таиланда с посещением храмов и нац. парков',
        price: 45000,
        duration: '7 дней',
        image: '🏖️',
        isHot: true,
      },
      {
        id: 2,
        title: 'Экскурсия в Египет',
        description: 'Путешествие по древним пирамидам и истории фараонов',
        price: 55000,
        duration: '10 дней',
        image: '🏜️',
        isHot: true,
      },
      {
        id: 3,
        title: 'Отдых в Испании',
        description: 'Барселона, Мадрид и пляжи Средиземного моря',
        price: 50000,
        duration: '8 дней',
        image: '🏛️',
        isHot: false,
      },
      {
        id: 4,
        title: 'Тур в Швейцарию',
        description: 'Горы, озера и швейцарский шоколад',
        price: 65000,
        duration: '9 дней',
        image: '⛰️',
        isHot: false,
      },
      {
        id: 5,
        title: 'Путешествие в Италию',
        description: 'Венеция, Рим, Флоренция и итальянская кухня',
        price: 52000,
        duration: '8 дней',
        image: '🇮🇹',
        isHot: false,
      },
      {
        id: 6,
        title: 'Тур в Мексику',
        description: 'Древние храмы ацтеков и райские пляжи',
        price: 48000,
        duration: '7 дней',
        image: '🌴',
        isHot: true,
      },
    ];

    setHotTours(mockTours.filter(tour => tour.isHot));
    setTours(mockTours);
  }, []);

  const handleApplyClick = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.phone) {
      // Сохраняем заявку в localStorage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      applications.push({
        id: Date.now(),
        tourId: selectedTour.id,
        tourName: selectedTour.title,
        ...formData,
        date: new Date().toISOString(),
      });
      localStorage.setItem('applications', JSON.stringify(applications));
      
      alert('Ваша заявка успешно подана!');
      setShowModal(false);
      setFormData({ fullName: '', email: '', phone: '' });
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };

  return (
    <div className="home-page">
      <h1 className="page-title">Добро пожаловать в TourCompany</h1>
      
      {/* Горящие путевки */}
      {hotTours.length > 0 && (
        <>
          <h2 className="section-title">🔥 Горящие путевки</h2>
          <div className="tours-grid">
            {hotTours.map(tour => (
              <div key={tour.id} className="tour-card hot">
                <div className="tour-image">{tour.image}</div>
                <div className="tour-content">
                  <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>
                  <h3 className="tour-title">{tour.title}</h3>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-meta">
                    <span className="tour-duration">⏱️ {tour.duration}</span>
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
            <div className="tour-image">{tour.image}</div>
            <div className="tour-content">
              {tour.isHot && <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>}
              <h3 className="tour-title">{tour.title}</h3>
              <p className="tour-description">{tour.description}</p>
              <div className="tour-meta">
                <span className="tour-duration">⏱️ {tour.duration}</span>
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

      {/* Модальное окно для заявки */}
      <div className={`modal ${showModal ? 'active' : ''}`}>
        <div className="modal-content">
          <span 
            className="modal-close" 
            onClick={() => setShowModal(false)}
          >
            &times;
          </span>
          <h2>Заявка на тур: {selectedTour?.title}</h2>
          <form onSubmit={handleSubmitApplication}>
            <div className="form-group">
              <label className="form-label">ФИО</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleFormChange}
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
                onChange={handleFormChange}
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
                onChange={handleFormChange}
                placeholder="Введите ваш телефон"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Подать заявку
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
