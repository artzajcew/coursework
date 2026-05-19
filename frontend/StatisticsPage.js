import React, { useState } from 'react';

function StatisticsPage() {
  const [stats] = useState({
    totalRevenue: 1575000,
    totalClients: 4,
    totalToursSold: 6,
    totalApplications: 12,
    averageOrderValue: 262500,
    activeClients: 3,
    topTour: 'Тур в Таиланд',
    thisMonthRevenue: 450000,
    lastMonthRevenue: 385000,
    clientGrowth: 25,
    revenueGrowth: 17,
  });

  const chartData = [
    { month: 'Январь', revenue: 280000 },
    { month: 'Февраль', revenue: 320000 },
    { month: 'Март', revenue: 385000 },
    { month: 'Апрель', revenue: 450000 },
    { month: 'Май', revenue: 540000 },
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <div>
      <h1 className="page-title">Статистика и аналитика</h1>

      {/* Основные метрики */}
      <h2 className="section-title">Ключевые показатели</h2>
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#3498db' }}>
          <div className="stat-title">Общий доход</div>
          <div className="stat-value">₽ {stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change">↑ {stats.revenueGrowth}% от прошлого месяца</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#2ecc71' }}>
          <div className="stat-title">Всего клиентов</div>
          <div className="stat-value">{stats.totalClients}</div>
          <div className="stat-change">↑ {stats.clientGrowth}% новых клиентов</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f39c12' }}>
          <div className="stat-title">Продано туров</div>
          <div className="stat-value">{stats.totalToursSold}</div>
          <div className="stat-change">Среднее: ₽ {(stats.averageOrderValue).toLocaleString()}</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#e74c3c' }}>
          <div className="stat-title">Заявок получено</div>
          <div className="stat-value">{stats.totalApplications}</div>
          <div className="stat-change">Активных клиентов: {stats.activeClients}</div>
        </div>
      </div>

      {/* График доходов */}
      <h2 className="section-title">Тренд доходов</h2>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '300px', justifyContent: 'space-around' }}>
          {chartData.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: (item.revenue / maxRevenue) * 250,
                background: `linear-gradient(180deg, #3498db 0%, #2980b9 100%)`,
                borderRadius: '4px 4px 0 0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}>
                ₽ {(item.revenue / 1000).toFixed(0)}K
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Топ тур</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.topTour}
          </p>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Самый популярный тур среди клиентов
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Текущий месяц</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
            ₽ {stats.thisMonthRevenue.toLocaleString()}
          </p>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Доход за апрель 2024
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Средний чек</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
            ₽ {stats.averageOrderValue.toLocaleString()}
          </p>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Средняя стоимость заказа
          </p>
        </div>
      </div>

      {/* Таблица отчета */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>Сводный отчет</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Показатель</th>
              <th>Значение</th>
              <th>Тренд</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Общий доход</td>
              <td>₽ {stats.totalRevenue.toLocaleString()}</td>
              <td style={{ color: '#27ae60', fontWeight: 'bold' }}>↑ {stats.revenueGrowth}%</td>
            </tr>
            <tr>
              <td>Количество клиентов</td>
              <td>{stats.totalClients}</td>
              <td style={{ color: '#27ae60', fontWeight: 'bold' }}>↑ {stats.clientGrowth}%</td>
            </tr>
            <tr>
              <td>Продано туров</td>
              <td>{stats.totalToursSold}</td>
              <td style={{ color: '#f39c12', fontWeight: 'bold' }}>—</td>
            </tr>
            <tr>
              <td>Получено заявок</td>
              <td>{stats.totalApplications}</td>
              <td style={{ color: '#3498db', fontWeight: 'bold' }}>—</td>
            </tr>
            <tr>
              <td>Средний заказ</td>
              <td>₽ {stats.averageOrderValue.toLocaleString()}</td>
              <td style={{ color: '#27ae60', fontWeight: 'bold' }}>↑ 8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatisticsPage;
