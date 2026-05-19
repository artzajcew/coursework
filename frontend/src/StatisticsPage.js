import React, { useState, useEffect } from 'react';

function StatisticsPage() {
  const [hotTours, setHotTours] = useState([]);
  const [losses, setLosses] = useState(null);
  const [mostExpensive, setMostExpensive] = useState(null);
  const [topDemand, setTopDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  // Поиск клиентов по городу
  const [searchCity, setSearchCity] = useState('');
  const [clientsByCity, setClientsByCity] = useState([]);
  const [searchCityLoading, setSearchCityLoading] = useState(false);

  // Поиск путевок по дате
  const [searchDate, setSearchDate] = useState('');
  const [toursByDate, setToursByDate] = useState([]);
  const [searchDateLoading, setSearchDateLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      const [hotRes, lossRes, expensiveRes, demandRes] = await Promise.all([
        fetch('http://localhost:3000/api/tours/hot'),
        fetch('http://localhost:3000/api/loss-from-discounts'),
        fetch('http://localhost:3000/api/tours/most-expensive'),
        fetch('http://localhost:3000/api/tours/top-demand'),
      ]);

      if (hotRes.ok) setHotTours(await hotRes.json());
      if (lossRes.ok) setLosses(await lossRes.json());
      if (expensiveRes.ok) setMostExpensive(await expensiveRes.json());
      if (demandRes.ok) setTopDemand(await demandRes.json());
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;

    try {
      setSearchCityLoading(true);
      const response = await fetch(`http://localhost:3000/api/clients/by-city/${encodeURIComponent(searchCity)}`);
      if (response.ok) {
        setClientsByCity(await response.json());
      } else {
        setClientsByCity([]);
      }
    } catch (err) {
      console.error('Ошибка поиска клиентов:', err);
    } finally {
      setSearchCityLoading(false);
    }
  };

  const handleSearchDate = async (e) => {
    e.preventDefault();
    if (!searchDate) return;

    try {
      setSearchDateLoading(true);
      const response = await fetch(`http://localhost:3000/api/tours/by-date/${searchDate}`);
      if (response.ok) {
        setToursByDate(await response.json());
      } else {
        setToursByDate([]);
      }
    } catch (err) {
      console.error('Ошибка поиска путевок:', err);
    } finally {
      setSearchDateLoading(false);
    }
  };

  if (loading) return <div><h1>Загрузка...</h1></div>;

  return (
    <div className="statistics-page">
      <h1 className="page-title">Статистика</h1>

      <div className="stats-container">
        
        {/* Поиск клиентов по городу */}
        <section className="stats-section">
          <h2>Клиенты по городу</h2>
          <form onSubmit={handleSearchCity} className="search-form">
            <input
              type="text"
              placeholder="Введите город..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button type="submit" disabled={searchCityLoading}>
              {searchCityLoading ? 'Поиск...' : 'Найти'}
            </button>
          </form>
          {clientsByCity.length > 0 && (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Телефон</th>
                  <th>Город</th>
                  <th>Тур</th>
                </tr>
              </thead>
              <tbody>
                {clientsByCity.map((client, idx) => (
                  <tr key={idx}>
                    <td>{client.full_name}</td>
                    <td>{client.phone}</td>
                    <td>{client.city}</td>
                    <td>{client.tour_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {clientsByCity.length === 0 && searchCity && <p>Клиентов не найдено</p>}
        </section>

        {/* Поиск путевок по дате */}
        <section className="stats-section">
          <h2>Путевки с заданной датой начала</h2>
          <form onSubmit={handleSearchDate} className="search-form">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button type="submit" disabled={searchDateLoading}>
              {searchDateLoading ? 'Поиск...' : 'Найти'}
            </button>
          </form>
          {toursByDate.length > 0 && (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Город</th>
                  <th>Дата начала</th>
                  <th>Дата конца</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                {toursByDate.map((tour) => (
                  <tr key={tour.id}>
                    <td>{tour.name}</td>
                    <td>{tour.city}</td>
                    <td>{new Date(tour.start_date).toLocaleDateString('ru-RU')}</td>
                    <td>{new Date(tour.end_date).toLocaleDateString('ru-RU')}</td>
                    <td>₽ {tour.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {toursByDate.length === 0 && searchDate && <p>Путевок не найдено</p>}
        </section>

        {/* Горящие путевки */}
        <section className="stats-section">
          <h2>🔥 Горящие путевки (≤5 дней)</h2>
          {hotTours.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Город</th>
                  <th>Дата начала</th>
                  <th>Дата конца</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                {hotTours.map((tour) => (
                  <tr key={tour.id}>
                    <td>{tour.name}</td>
                    <td>{tour.city}</td>
                    <td>{new Date(tour.start_date).toLocaleDateString('ru-RU')}</td>
                    <td>{new Date(tour.end_date).toLocaleDateString('ru-RU')}</td>
                    <td>₽ {tour.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Горящих путевок нет</p>
          )}
        </section>

        {/* Потери от скидок */}
        <section className="stats-section">
          <h2>Потери из-за скидок</h2>
          {losses ? (
            <div className="stat-card">
              <p>Общие потери: <strong>₽ {losses.total_losses?.toLocaleString() || 0}</strong></p>
              <p>Количество клиентов со скидкой: <strong>{losses.clients_with_discount || 0}</strong></p>
            </div>
          ) : (
            <p>Данные недоступны</p>
          )}
        </section>

        {/* Самая дорогая путевка */}
        <section className="stats-section">
          <h2>Самая дорогая путевка</h2>
          {mostExpensive && mostExpensive.id ? (
            <div className="stat-card">
              <p>Название: <strong>{mostExpensive.name}</strong></p>
              <p>Город: <strong>{mostExpensive.city}</strong></p>
              <p>Цена: <strong>₽ {mostExpensive.price.toLocaleString()}</strong></p>
            </div>
          ) : (
            <p>Данные недоступны</p>
          )}
        </section>

        {/* Путевки с наибольшим спросом */}
        <section className="stats-section">
          <h2>Путевки с наибольшим спросом (Топ-5)</h2>
          {topDemand.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Город</th>
                  <th>Цена</th>
                  <th>Продано</th>
                </tr>
              </thead>
              <tbody>
                {topDemand.map((tour, idx) => (
                  <tr key={idx}>
                    <td>{tour.name}</td>
                    <td>{tour.city}</td>
                    <td>₽ {tour.price.toLocaleString()}</td>
                    <td>{tour.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Данные недоступны</p>
          )}
        </section>

      </div>

      <style jsx>{`
        .statistics-page {
          padding: 2rem;
        }
        .stats-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .stats-section {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f9f9f9;
        }
        .stats-section h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 2px solid #007bff;
          padding-bottom: 0.5rem;
        }
        .search-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .search-form input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .search-form button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .search-form button:hover {
          background: #0056b3;
        }
        .search-form button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        .stats-table th,
        .stats-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .stats-table th {
          background: #007bff;
          color: white;
        }
        .stats-table tr:hover {
          background: #f0f0f0;
        }
        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          border-left: 4px solid #007bff;
        }
        .stat-card p {
          margin: 0.5rem 0;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

export default StatisticsPage;
