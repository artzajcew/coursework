import React, { useState, useEffect } from 'react';

function SalesJournalPage() {
  const [sales, setSales] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Загружаем заявки из localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const mockSales = [
      {
        id: 1,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tourName: 'Тур в Таиланд',
        clientName: 'Иван Петров',
        amount: 45000,
        status: 'Оплачено',
        paymentMethod: 'Карта',
      },
      {
        id: 2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tourName: 'Тур в Египет',
        clientName: 'Мария Сидорова',
        amount: 55000,
        status: 'В ожидании',
        paymentMethod: 'Перевод',
      },
      {
        id: 3,
        date: new Date().toISOString().split('T')[0],
        tourName: 'Отдых в Испании',
        clientName: 'Петр Иванов',
        amount: 50000,
        status: 'Оплачено',
        paymentMethod: 'Карта',
      },
    ];
    setSales(mockSales);
  }, []);

  const handleEdit = (sale) => {
    setEditingId(sale.id);
    setEditData({ ...sale });
  };

  const handleSave = (id) => {
    setSales(sales.map(sale => 
      sale.id === id ? editData : sale
    ));
    setEditingId(null);
    alert('Запись обновлена');
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  const handleAddNew = () => {
    const newSale = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      tourName: '',
      clientName: '',
      amount: 0,
      status: 'В ожидании',
      paymentMethod: 'Карта',
    };
    setSales([...sales, newSale]);
  };

  return (
    <div>
      <h1 className="page-title">Журнал продаж</h1>
      <button className="btn btn-success" onClick={handleAddNew} style={{ marginBottom: '1rem' }}>
        + Добавить запись
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Название тура</th>
              <th>Имя клиента</th>
              <th>Сумма (₽)</th>
              <th>Статус</th>
              <th>Метод оплаты</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.date
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="text"
                      value={editData.tourName}
                      onChange={(e) => handleChange('tourName', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.tourName
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="text"
                      value={editData.clientName}
                      onChange={(e) => handleChange('clientName', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.clientName
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => handleChange('amount', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.amount.toLocaleString()
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option>Оплачено</option>
                      <option>В ожидании</option>
                      <option>Отменено</option>
                    </select>
                  ) : (
                    <span style={{
                      color: sale.status === 'Оплачено' ? '#27ae60' : sale.status === 'Отменено' ? '#e74c3c' : '#f39c12',
                      fontWeight: 'bold',
                    }}>
                      {sale.status}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === sale.id ? (
                    <input
                      type="text"
                      value={editData.paymentMethod}
                      onChange={(e) => handleChange('paymentMethod', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    sale.paymentMethod
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    {editingId === sale.id ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(sale.id)}
                        >
                          Сохранить
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(sale)}
                        >
                          Редактировать
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(sale.id)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesJournalPage;
