import React, { useState, useEffect } from 'react';

function StatisticsPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTours: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      const [clientsRes, toursRes, salesRes] = await Promise.all([
        fetch('http://localhost:3000/api/clients'),
        fetch('http://localhost:3000/api/tours'),
        fetch('http://localhost:3000/api/sales'),
      ]);

      if (!clientsRes.ok || !toursRes.ok || !salesRes.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const clients = await clientsRes.json();
      const tours = await toursRes.json();
      const sales = await salesRes.json();

      const totalRevenue = sales.reduce((sum, sale) => {
        const tour = tours.find(t => t.id === sale.tour_id);
        return sum + (tour ? tour.price * sale.quantity : 0);
      }, 0);

      setStats({
        totalClients: clients.length,
        totalTours: tours.length,
        totalSales: sales.reduce((sum, s) => sum + s.quantity, 0),
        totalRevenue: totalRevenue,
      });

      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><h1>Загрузка...</h1></div>;
  if (error) return <div><h1>Ошибка: {error}</h1></div>;

  return (
    <div>
      <h1 className="page-title">Статистика и аналитика</h1>

      <h2 className="section-title">Ключевые показатели</h2>
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
          <div className="stat-title">Общий доход</div>
          <div className="stat-value">₽ {stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change">из БД</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#2ecc71' }}>
          <div className="stat-title">Всего клиентов</div>
          <div className="stat-value">{stats.totalClients}</div>
          <div className="stat-change">зарегистрировано</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
          <div className="stat-title">Доступно туров</div>
          <div className="stat-value">{stats.totalTours}</div>
          <div className="stat-change">в каталоге</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
          <div className="stat-title">Продано путевок</div>
          <div className="stat-value">{stats.totalSales}</div>
          <div className="stat-change">всего</div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
