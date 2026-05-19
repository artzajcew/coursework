import React, { useState, useEffect } from 'react';

// Импорт изображений
import antalyaImg from './img/antalya.jpg';
import sochiImg from './img/sochi.jpg';
import barcelonaImg from './img/barcelona.jpg';
import parisImg from './img/paris.jpg';

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
    // Только эти 4 тура
    const mockTours = [
      {
        id: 1,
        title: 'Тур в Анталью',
        description: 'Прекрасный отдых на пляжах Антальи с посещением храмов и нац. парков',
        price: 45000,
        duration: '7 дней',
        image: antalyaImg,
        isHot: true,
      },
      {
        id: 2,
        title: 'Экскурсия в Сочи',
        description: 'Путешествие по горам и побережью Черного моря',
        price: 35000,
        duration: '7 дней',
        image: sochiImg,
        isHot: true,
      },
      {
        id: 3,
        title: 'Отдых в Барселоне',
        description: 'Саграда Фамилия, парк Гуэль и пляжи Средиземного моря',
        price: 55000,
        duration: '8 дней',
        image: barcelonaImg,
        isHot: false,
      },
      {
        id: 4,
        title: 'Тур в Париж',
        description: 'Эйфелева башня, Лувр и шопинг на Елисейских полях',
        price: 70000,
        duration: '6 дней',
        image: parisImg,
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
                    alt={tour.title}
                    className="tour-img"
                  />
                </div>
                <div className="tour-content">
                  <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>
                  <h3 className="tour-title">{tour.title}</h3>
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
                alt={tour.title}
                className="tour-img"
              />
            </div>
            <div className="tour-content">
              {tour.isHot && <span className="hot-badge">ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ</span>}
              <h3 className="tour-title">{tour.title}</h3>
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